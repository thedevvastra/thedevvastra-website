"use server";

import { db } from "@/db";
import { orders, orderItems, profiles } from "@/db/schema";
import { eq } from "drizzle-orm";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import Razorpay from "razorpay";
import crypto from "crypto";

// ✅ Import Telegram Utility
import { sendTelegramNotification } from "@/lib/telegram";

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

// --- HELPER: Get User Address ---
export async function getUserAddress() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not logged in" };

  const profile = await db.query.profiles.findFirst({
    where: eq(profiles.id, user.id),
  });

  if (!profile) return { error: "Profile not found" };

  const hasAddress = !!(
    profile.addressLine1 &&
    profile.city &&
    profile.state &&
    profile.zipCode &&
    profile.phone
  );

  return {
    success: true,
    hasAddress,
    address: {
      fullName: profile.fullName || "",
      phone: profile.phone || "",
      addressLine1: profile.addressLine1 || "",
      city: profile.city || "",
      state: profile.state || "",
      zipCode: profile.zipCode || "",
    },
  };
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
      })
      .where(eq(profiles.id, user.id));

    return { success: true };
  } catch (error) {
    console.error("Save Address Error:", error);
    return { error: "Failed to save address" };
  }
}

// --- 1. CREATE ORDER ---
export async function createDirectOrder(data: {
  productId: string;
  quantity: number;
  color?: string;
  size?: string;
  paymentMethod: string;
  totalAmount: number;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Please login to place an order." };

  try {
    const profile = await db.query.profiles.findFirst({
      where: eq(profiles.id, user.id),
    });

    if (!profile || !profile.addressLine1) {
      return { error: "Please add your address first." };
    }

    const orderDisplayId = `ORD-${Date.now().toString().slice(-6)}`;

    // Create Razorpay Order if Online
    let razorpayOrderId = null;
    if (data.paymentMethod === "Online") {
      const rzOrder = await razorpay.orders.create({
        amount: data.totalAmount * 100,
        currency: "INR",
        receipt: orderDisplayId,
      });
      razorpayOrderId = rzOrder.id;
    }

    // Status Setting
    // COD -> "Order Placed" (Shows as New Order in Admin)
    // Online -> "Pending" (Wait for payment verification)
    const initialStatus =
      data.paymentMethod === "Online" ? "Pending" : "Order Placed";

    const [newOrder] = await db
      .insert(orders)
      .values({
        displayId: orderDisplayId,
        userId: user.id,
        status: initialStatus,
        totalAmount: data.totalAmount,
        shippingAddress: {
          name: profile.fullName,
          phone: profile.phone,
          line1: profile.addressLine1,
          city: profile.city,
          state: profile.state,
          zip: profile.zipCode,
        },
        paymentMethod: data.paymentMethod,
        paymentStatus: "Pending", // Updated to 'Paid' in verify step
      })
      .returning();

    await db.insert(orderItems).values({
      orderId: newOrder.id,
      productId: data.productId,
      quantity: data.quantity,
      price: Math.round(data.totalAmount / data.quantity),
      size: data.size || null,
      color: data.color || null,
    });

    // ✅ TELEGRAM NOTIFICATION (Only for COD)
    // Online orders ke liye payment verify hone ke baad bhejenge
    if (data.paymentMethod === "COD") {
      // No await needed, let it run in background to keep UI fast
      sendTelegramNotification(newOrder.id);
    }

    return {
      success: true,
      orderId: newOrder.id,
      displayId: newOrder.displayId,
      razorpayOrderId: razorpayOrderId,
      amount: data.totalAmount,
      userPhone: profile.phone,
      userEmail: profile.email,
    };
  } catch (error) {
    console.error("Direct Order Error:", error);
    return { error: "Failed to initiate order." };
  }
}

// --- 2. VERIFY PAYMENT ---
export async function verifyDirectPayment(data: {
  orderId: string;
  razorpayPaymentId: string;
  razorpayOrderId: string;
  razorpaySignature: string;
}) {
  const body = data.razorpayOrderId + "|" + data.razorpayPaymentId;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
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
