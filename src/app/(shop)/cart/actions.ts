"use server";

import { createClient } from "@/utils/supabase/server";
import { db } from "@/db";
import {
  carts,
  products,
  profiles,
  wishlists,
  storeSettings,
  orders,
  orderItems,
  coupons, // ✅ Import Coupons
} from "@/db/schema";
import { eq, desc, and, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import Razorpay from "razorpay";
import crypto from "crypto";
import { sendTelegramNotification } from "@/lib/telegram";
// ✅ Import Verify Logic from Admin Actions
import { verifyCouponCode } from "@/app/(admin)/admin/coupons/actions";

// ✅ HELPER: Initialize Razorpay safely
function getRazorpay() {
  const key_id =
    process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;

  if (!key_id || !key_secret) {
    throw new Error(
      "Razorpay API Keys are missing. Please check your .env.local file.",
    );
  }

  return new Razorpay({
    key_id: key_id,
    key_secret: key_secret,
  });
}

// 1. Get Cart Data (Updated to fetch Available Coupons)
export async function getCartData() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const cartItems = await db
    .select({
      id: carts.id,
      quantity: carts.quantity,
      size: carts.size,
      color: carts.color,
      product: products,
    })
    .from(carts)
    .innerJoin(products, eq(carts.productId, products.id))
    .where(eq(carts.userId, user.id))
    .orderBy(desc(carts.createdAt));

  const userProfile = await db.query.profiles.findFirst({
    where: eq(profiles.id, user.id),
  });

  const dbSettings = await db.query.storeSettings.findFirst({
    where: eq(storeSettings.id, 1),
  });

  const settings = dbSettings || {
    shippingCharge: 0,
    freeShippingThreshold: 0,
    shippingBy: "Standard Delivery",
    shippingDuration: "5-7 Days",
  };

  // ✅ Fetch Active Coupons (Public) for Suggestions
  const availableCoupons = await db.query.coupons.findMany({
    where: eq(coupons.isActive, true), // Removed targetType filter
    limit: 10,
    orderBy: desc(coupons.createdAt),
  });

  return { cartItems, userProfile, settings, availableCoupons };
}

// 2. Update Quantity
export async function updateCartQuantity(cartId: string, quantity: number) {
  if (quantity < 1) return;
  await db.update(carts).set({ quantity }).where(eq(carts.id, cartId));
  revalidatePath("/cart");
}

// 3. Remove Item
export async function removeCartItem(cartId: string) {
  await db.delete(carts).where(eq(carts.id, cartId));
  revalidatePath("/cart");
}

// 4. Move to Wishlist
export async function moveToWishlist(cartId: string, productId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await db.transaction(async (tx) => {
    await tx
      .insert(wishlists)
      .values({ userId: user.id, productId })
      .onConflictDoNothing();
    await tx.delete(carts).where(eq(carts.id, cartId));
  });

  revalidatePath("/cart");
  revalidatePath("/wishlist");
}

// 5. Save Address
export async function saveUserAddress(data: any) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await db
    .update(profiles)
    .set({
      fullName: data.fullName,
      phone: data.phone,
      addressLine1: data.addressLine1,
      city: data.city,
      state: data.state,
      zipCode: data.zipCode,
      updatedAt: new Date(),
    })
    .where(eq(profiles.id, user.id));

  revalidatePath("/cart");
}

// ✅ HELPER: Calculate Final Amount Server-Side (Security)
async function calculateCartTotal(userId: string, couponCode?: string) {
  // Fetch Cart
  const cartItems = await db
    .select({
      quantity: carts.quantity,
      product: products,
    })
    .from(carts)
    .innerJoin(products, eq(carts.productId, products.id))
    .where(eq(carts.userId, userId));

  if (cartItems.length === 0) return { error: "Cart is empty" };

  // Fetch Settings
  const settings = await db.query.storeSettings.findFirst({
    where: eq(storeSettings.id, 1),
  });

  // Basic Totals
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.product.sellingPrice * item.quantity,
    0,
  );

  const shippingCharge = settings?.shippingCharge || 0;
  const freeThreshold = settings?.freeShippingThreshold || 0;
  const isFreeShipping = freeThreshold > 0 && subtotal >= freeThreshold;
  const finalShipping = isFreeShipping ? 0 : shippingCharge;

  let discountAmount = 0;
  let finalCouponCode = null;

  // Coupon Logic
  if (couponCode) {
    // Re-construct cart items format for verify function
    const formattedCart = cartItems.map((item) => ({
      product: item.product,
      quantity: item.quantity,
    }));

    const verifyRes = await verifyCouponCode(
      couponCode,
      subtotal,
      formattedCart,
    );
    if (verifyRes.success) {
      discountAmount = verifyRes.discountAmount || 0;
      finalCouponCode = verifyRes.code;
    }
  }

  const totalAmount = subtotal + finalShipping - discountAmount;

  return {
    totalAmount,
    discountAmount,
    couponCode: finalCouponCode,
    subtotal,
    cartItems,
  };
}

// 6. Create Razorpay Order (Updated for Coupons)
export async function createRazorpayOrder(couponCode?: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  try {
    // ✅ Calculate Total securely on server
    const calc = await calculateCartTotal(user.id, couponCode);
    if ("error" in calc) return { error: calc.error };

    const razorpay = getRazorpay();

    const options = {
      amount: Math.round(calc.totalAmount * 100), // Amount in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };
    const order = await razorpay.orders.create(options);
    return { success: true, orderId: order.id, amount: order.amount };
  } catch (error: any) {
    console.error("Razorpay Error:", error.message);
    return { error: error.message || "Failed to initiate payment" };
  }
}

// 7. Place Order (Updated for Coupons)
export async function placeOrder(paymentData: {
  method: "COD" | "ONLINE";
  razorpayPaymentId?: string;
  razorpayOrderId?: string;
  razorpaySignature?: string;
  couponCode?: string; // ✅ New Param
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Please login to place order" };

  try {
    // ✅ 1. Re-Calculate Everything Securely
    const calc = await calculateCartTotal(user.id, paymentData.couponCode);
    if ("error" in calc) return { error: calc.error };

    const {
      totalAmount,
      discountAmount,
      couponCode,
      cartItems: cartData,
    } = calc;

    // Verify Payment if ONLINE
    if (paymentData.method === "ONLINE") {
      const { razorpayOrderId, razorpayPaymentId, razorpaySignature } =
        paymentData;

      if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
        return { error: "Invalid payment details" };
      }

      const secret = process.env.RAZORPAY_KEY_SECRET;
      if (!secret) return { error: "Server Error: Missing Secret Key" };

      const body = razorpayOrderId + "|" + razorpayPaymentId;
      const expectedSignature = crypto
        .createHmac("sha256", secret)
        .update(body.toString())
        .digest("hex");

      if (expectedSignature !== razorpaySignature) {
        return { error: "Payment verification failed" };
      }
    }

    const userProfile = await db.query.profiles.findFirst({
      where: eq(profiles.id, user.id),
    });

    if (!userProfile?.addressLine1 || !userProfile?.phone) {
      return { error: "Please add delivery address first" };
    }

    const displayId = `#ORD-${Math.floor(100000 + Math.random() * 900000)}`;
    let createdOrderId: string | null = null;

    await db.transaction(async (tx) => {
      const [newOrder] = await tx
        .insert(orders)
        .values({
          userId: user.id,
          displayId: displayId,
          totalAmount: totalAmount,

          // ✅ Save Coupon Info
          couponCode: couponCode,
          discountAmount: discountAmount,
          finalAmount: totalAmount, // Redundant but good for history

          status: "Order Placed",
          shippingAddress: {
            name: userProfile.fullName,
            phone: userProfile.phone,
            line1: userProfile.addressLine1,
            city: userProfile.city,
            state: userProfile.state,
            zip: userProfile.zipCode,
          },
          paymentMethod: paymentData.method,
          paymentStatus: paymentData.method === "ONLINE" ? "Paid" : "Pending",
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning({ id: orders.id });

      createdOrderId = newOrder.id;

      for (const item of cartData) {
        await tx.insert(orderItems).values({
          orderId: newOrder.id,
          productId: item.product.id,
          quantity: item.quantity,
          price: item.product.sellingPrice,
          size: (item as any).size, // Type casting safe here based on query
          color: (item as any).color,
        });

        await tx
          .update(products)
          .set({ stock: sql`${products.stock} - ${item.quantity}` })
          .where(eq(products.id, item.product.id));
      }

      // ✅ Update Coupon Usage Count
      if (couponCode) {
        await tx.execute(
          sql`UPDATE coupons SET usage_count = usage_count + 1 WHERE code = ${couponCode}`,
        );
      }

      await tx.delete(carts).where(eq(carts.userId, user.id));
    });

    if (createdOrderId) {
      sendTelegramNotification(createdOrderId);
    }

    revalidatePath("/cart");
    revalidatePath("/admin/orders");

    return { success: true, orderId: displayId };
  } catch (error: any) {
    console.error("Order Error:", error);
    return { error: error.message || "Failed to place order." };
  }
}
