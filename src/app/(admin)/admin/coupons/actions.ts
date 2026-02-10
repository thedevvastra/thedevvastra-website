"use server";

import { db } from "@/db";
import { coupons, products } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// --- ADMIN ACTIONS ---

// 1. Get All Coupons
export async function getCoupons() {
  const data = await db.select().from(coupons).orderBy(desc(coupons.createdAt));
  return data;
}

// 2. Create Coupon
export async function createCoupon(data: any) {
  try {
    // Check if code exists
    const existing = await db.query.coupons.findFirst({
      where: eq(coupons.code, data.code.toUpperCase()),
    });

    if (existing) return { error: "Coupon code already exists!" };

    await db.insert(coupons).values({
      code: data.code.toUpperCase(),
      description: data.description,
      discountType: data.discountType, // 'FLAT' | 'PERCENTAGE'
      discountValue: Number(data.discountValue),
      minOrderValue: Number(data.minOrderValue) || 0,
      maxDiscountAmount: data.maxDiscountAmount
        ? Number(data.maxDiscountAmount)
        : null,
      targetType: data.targetType, // 'ALL' | 'SPECIFIC'
      specificProductIds: data.specificProductIds || [],
      expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
      isActive: true,
    });

    revalidatePath("/admin/coupons");
    return { success: "Coupon created successfully!" };
  } catch (error: any) {
    return { error: error.message };
  }
}

// ✅ NEW: Update Coupon
export async function updateCoupon(id: string, data: any) {
  try {
    await db
      .update(coupons)
      .set({
        code: data.code.toUpperCase(),
        description: data.description,
        discountType: data.discountType,
        discountValue: Number(data.discountValue),
        minOrderValue: Number(data.minOrderValue) || 0,
        maxDiscountAmount: data.maxDiscountAmount ? Number(data.maxDiscountAmount) : null,
        targetType: data.targetType,
        specificProductIds: data.specificProductIds || [],
      })
      .where(eq(coupons.id, id));

    revalidatePath("/admin/coupons");
    return { success: "Coupon updated successfully!" };
  } catch (error: any) {
    return { error: "Failed to update coupon" };
  }
}

// 3. Delete Coupon
export async function deleteCoupon(id: string) {
  try {
    await db.delete(coupons).where(eq(coupons.id, id));
    revalidatePath("/admin/coupons");
    return { success: "Coupon deleted" };
  } catch (error) {
    return { error: "Failed to delete coupon" };
  }
}

// 4. Toggle Status
export async function toggleCouponStatus(id: string, currentStatus: boolean) {
  await db
    .update(coupons)
    .set({ isActive: !currentStatus })
    .where(eq(coupons.id, id));
  revalidatePath("/admin/coupons");
  return { success: "Status updated" };
}

// --- USER/CART ACTIONS ---

// 5. Verify & Apply Coupon
export async function verifyCouponCode(
  code: string,
  cartTotal: number,
  cartItems: any[],
) {
  try {
    const coupon = await db.query.coupons.findFirst({
      where: eq(coupons.code, code.toUpperCase()),
    });

    // Validations
    if (!coupon) return { error: "Invalid Coupon Code" };
    if (!coupon.isActive) return { error: "This coupon is inactive" };
    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
      return { error: "Coupon has expired" };
    }
    if (cartTotal < (coupon.minOrderValue || 0)) {
      return { error: `Min order value should be ₹${coupon.minOrderValue}` };
    }

    // Calculate Discount
    let discount = 0;

    if (coupon.targetType === "ALL") {
      // Calculate on total cart
      if (coupon.discountType === "FLAT") {
        discount = coupon.discountValue;
      } else {
        // Percentage
        discount = (cartTotal * coupon.discountValue) / 100;
        if (coupon.maxDiscountAmount) {
          discount = Math.min(discount, coupon.maxDiscountAmount);
        }
      }
    } else {
      // Specific Products Logic
      const eligibleItems = cartItems.filter((item) =>
        (coupon.specificProductIds as string[])?.includes(item.product.id),
      );

      if (eligibleItems.length === 0) {
        return { error: "Coupon not applicable on items in your cart" };
      }

      // Calculate discount ONLY on eligible items
      let eligibleTotal = eligibleItems.reduce(
        (acc, item) => acc + item.product.sellingPrice * item.quantity,
        0,
      );

      if (coupon.discountType === "FLAT") {
        discount = coupon.discountValue; // Flat off if any eligible item exists (simple logic)
      } else {
        discount = (eligibleTotal * coupon.discountValue) / 100;
        if (coupon.maxDiscountAmount) {
          discount = Math.min(discount, coupon.maxDiscountAmount);
        }
      }
    }

    // Final Safety Check
    if (discount > cartTotal) discount = cartTotal;

    return {
      success: true,
      code: coupon.code,
      discountAmount: Math.floor(discount),
      message: `Coupon Applied! You saved ₹${Math.floor(discount)}`,
    };
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong" };
  }
}
