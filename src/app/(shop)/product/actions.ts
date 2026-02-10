"use server";

import { db } from "@/db";
import { orders, orderItems, profiles, products, coupons } from "@/db/schema";
import { eq, desc, sql } from "drizzle-orm";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import Razorpay from "razorpay";
import crypto from "crypto";

// ✅ Import Telegram Utility
import { sendTelegramNotification } from "@/lib/telegram";
// ✅ Import Coupon Verification Logic
import { verifyCouponCode } from "@/app/(admin)/admin/coupons/actions";

// --- HELPER: Initialize Razorpay ---
function getRazorpay() {
  const key_id =
    process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;

  if (!key_id || !key_secret) {
    throw new Error("Razorpay Keys Missing");
  }
  return new Razorpay({ key_id, key_secret });
}

// --- 1. GET INITIAL DATA (Address + Coupons) ---
export async function getBuyNowInitData() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let address = null;
  let hasAddress = false;

  if (user) {
    const profile = await db.query.profiles.findFirst({
      where: eq(profiles.id, user.id),
    });

    if (profile?.addressLine1 && profile?.phone) {
      address = {
        fullName: profile.fullName || "",
        phone: profile.phone || "",
        addressLine1: profile.addressLine1 || "",
        city: profile.city || "",
        state: profile.state || "",
        zipCode: profile.zipCode || "",
      };
      hasAddress = true;
    }
  }

  // ✅ Fetch Active Coupons
  const availableCoupons = await db.query.coupons.findMany({
    where: eq(coupons.isActive, true),
    limit: 5,
    orderBy: desc(coupons.createdAt),
  });

  return { success: true, address, hasAddress, availableCoupons };
}

// --- HELPER: Get User Address (Legacy support) ---
export async function getUserAddress() {
  return await getBuyNowInitData(); // Reusing the new function
}

// --- HELPER: Save User Address ---
export async function saveUserAddress(data: {
  fullName: string;
  phone: string;
  addressLine1: string;
  city: string;
  state: string;
  zipCode: string;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not logged in" };

  try {
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

    return { success: true };
  } catch (error) {
    console.error("Save Address Error:", error);
    return { error: "Failed to save address" };
  }
}

// --- 2. CREATE ORDER (With Coupon Logic) ---
export async function createDirectOrder(data: {
  productId: string;
  quantity: number;
  color?: string;
  size?: string;
  paymentMethod: string;
  couponCode?: string; // ✅ New Parameter
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user)
    return { success: false, error: "Please login to place an order." };

  try {
    // A. Fetch Product & User Profile
    const product = await db.query.products.findFirst({
      where: eq(products.id, data.productId),
    });
    if (!product) return { success: false, error: "Product not found" };

    const profile = await db.query.profiles.findFirst({
      where: eq(profiles.id, user.id),
    });
    if (!profile || !profile.addressLine1) {
      return { success: false, error: "Please add your address first." };
    }

    // B. Calculate Amount Server-Side (Security)
    let totalAmount = product.sellingPrice * data.quantity;
    let discountAmount = 0;
    let finalCouponCode = null;

    // C. ✅ Verify & Apply Coupon
    if (data.couponCode) {
      // Mock cart structure for verify function
      const mockCart = [{ product: product, quantity: data.quantity }];
      const verifyRes = await verifyCouponCode(
        data.couponCode,
        totalAmount,
        mockCart,
      );

      if (verifyRes.success) {
        discountAmount = verifyRes.discountAmount || 0;
        totalAmount = Math.max(0, totalAmount - discountAmount);
        finalCouponCode = verifyRes.code;
      }
    }

    // D. Razorpay Order Creation (if Online)
    let razorpayOrderId = undefined;
    const orderDisplayId = `ORD-${Date.now().toString().slice(-6)}`;

    if (data.paymentMethod === "Online") {
      const razorpay = getRazorpay();
      const rzOrder = await razorpay.orders.create({
        amount: Math.round(totalAmount * 100), // Convert to paise
        currency: "INR",
        receipt: orderDisplayId,
      });
      razorpayOrderId = rzOrder.id;
    }

    // E. Create DB Order
    const [newOrder] = await db
      .insert(orders)
      .values({
        displayId: orderDisplayId,
        userId: user.id,
        status: data.paymentMethod === "Online" ? "Pending" : "Order Placed",
        totalAmount: totalAmount,
        couponCode: finalCouponCode, // ✅ Save Coupon
        discountAmount: discountAmount, // ✅ Save Discount
        shippingAddress: {
          name: profile.fullName,
          phone: profile.phone,
          line1: profile.addressLine1,
          city: profile.city,
          state: profile.state,
          zip: profile.zipCode,
        },
        paymentMethod: data.paymentMethod === "Online" ? "ONLINE" : "COD",
        paymentStatus: "Pending",
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    // F. Create Order Item
    await db.insert(orderItems).values({
      orderId: newOrder.id,
      productId: data.productId,
      quantity: data.quantity,
      price: product.sellingPrice, // Original unit price
      size: data.size || null,
      color: data.color || null,
    });

    // G. Update Stock
    await db
      .update(products)
      .set({ stock: sql`${products.stock} - ${data.quantity}` })
      .where(eq(products.id, product.id));

    // H. Update Coupon Usage
    if (finalCouponCode) {
      await db.execute(
        sql`UPDATE coupons SET usage_count = usage_count + 1 WHERE code = ${finalCouponCode}`,
      );
    }

    // ✅ TELEGRAM NOTIFICATION (Only for COD)
    if (data.paymentMethod !== "Online") {
      sendTelegramNotification(newOrder.id);
    }

    return {
      success: true,
      orderId: newOrder.id,
      displayId: newOrder.displayId,
      razorpayOrderId: razorpayOrderId,
      amount: totalAmount,
      userPhone: profile.phone,
      userEmail: profile.email,
    };
    /* eslint-disable  @typescript-eslint/no-explicit-any */
  } catch (error: any) {
    console.error("Direct Order Error:", error);
    return { success: false, error: "Failed to initiate order." };
  }
}

// --- 3. VERIFY PAYMENT ---
export async function verifyDirectPayment(data: {
  orderId: string;
  razorpayPaymentId: string;
  razorpayOrderId: string;
  razorpaySignature: string;
}) {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) return { success: false, error: "Server configuration error" };

  const body = data.razorpayOrderId + "|" + data.razorpayPaymentId;
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(body.toString())
    .digest("hex");

  if (expectedSignature === data.razorpaySignature) {
    // Update Status to "Order Placed" so Admin sees "New Order"
    await db
      .update(orders)
      .set({
        status: "Order Placed",
        paymentStatus: "Paid",
        updatedAt: new Date(),
      })
      .where(eq(orders.id, data.orderId));

    // ✅ TELEGRAM NOTIFICATION (For Online Orders)
    // Ab payment confirm ho gayi hai, message bhej do
    sendTelegramNotification(data.orderId);

    revalidatePath("/my-orders");
    return { success: true };
  } else {
    return { success: false, error: "Invalid Signature" };
  }
}
