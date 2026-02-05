"use server";

import { createClient } from "@/utils/supabase/server";
import { db } from "@/db";
import { wishlists, products, carts, productDeals } from "@/db/schema";
import { eq, desc, and, gt } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// 1. Get Wishlist Items
export async function getWishlistItems() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const items = await db
    .select({
      id: wishlists.id,
      product: products,
      addedAt: wishlists.createdAt,
      deal: productDeals,
    })
    .from(wishlists)
    .innerJoin(products, eq(wishlists.productId, products.id))
    .leftJoin(
      productDeals,
      and(
        eq(productDeals.productId, products.id),
        eq(productDeals.isActive, true),
        gt(productDeals.expiresAt, new Date()),
      ),
    )
    .where(eq(wishlists.userId, user.id))
    .orderBy(desc(wishlists.createdAt));

  return items;
}

// 2. Remove Item
export async function removeFromWishlist(wishlistId: string) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { error: "Unauthorized" };

    await db.delete(wishlists).where(eq(wishlists.id, wishlistId));

    revalidatePath("/wishlist");
    return { success: "Removed from wishlist" };
  } catch (error) {
    return { error: "Failed to remove item" };
  }
}

// 3. Move to Cart
export async function moveFromWishlistToCart(
  wishlistId: string,
  productId: string,
  size?: string | null,
  color?: string | null,
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Please login first" };

  try {
    await db.transaction(async (tx) => {
      // Check if exact item (same product + same variants) exists
      const existingCartItem = await tx.query.carts.findFirst({
        where: and(
          eq(carts.userId, user.id),
          eq(carts.productId, productId),
          // Handle nulls for size/color explicitly if needed, but usually equality check works
          size ? eq(carts.size, size) : undefined,
          color ? eq(carts.color, color) : undefined,
        ),
      });

      if (existingCartItem) {
        await tx
          .update(carts)
          .set({ quantity: (existingCartItem.quantity || 1) + 1 })
          .where(eq(carts.id, existingCartItem.id));
      } else {
        await tx.insert(carts).values({
          userId: user.id,
          productId: productId,
          quantity: 1,
          size: size || null, // ✅ Save Size
          color: color || null, // ✅ Save Color
        });
      }

      await tx.delete(wishlists).where(eq(wishlists.id, wishlistId));
    });

    revalidatePath("/wishlist");
    revalidatePath("/cart");
    return { success: "Moved to Cart" };
  } catch (error) {
    console.error(error);
    return { error: "Failed to move item" };
  }
}