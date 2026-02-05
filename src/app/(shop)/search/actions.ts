"use server";

import { db } from "@/db";
import { products, brands, categories, wishlists } from "@/db/schema";
import { ilike, or, eq, desc, sql } from "drizzle-orm";
import { createClient } from "@/utils/supabase/server";

export async function searchProductsAction(query: string) {
  if (!query || query.trim().length === 0) return [];

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const searchStr = `%${query}%`;

  // 1. Perform Search (Join Brand & Category for "Smart" search)
  const results = await db
    .select({
      id: products.id,
      title: products.title,
      sellingPrice: products.sellingPrice,
      oldPrice: products.oldPrice,
      thumbnailUrl: products.thumbnailUrl,
      category: { name: categories.name },
      brand: { name: brands.name },
    })
    .from(products)
    .leftJoin(brands, eq(products.brandId, brands.id))
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(
      or(
        ilike(products.title, searchStr),
        ilike(products.description, searchStr),
        ilike(brands.name, searchStr), // Search by Brand Name (e.g. Nike)
        ilike(categories.name, searchStr), // Search by Category (e.g. Shoes)
      ),
    )
    .orderBy(desc(products.createdAt))
    .limit(50); // Limit results for performance

  // 2. Check Wishlist Status if User is Logged In
  let wishlistIds: Set<string> = new Set();
  if (user) {
    const wishlistItems = await db
      .select({ productId: wishlists.productId })
      .from(wishlists)
      .where(eq(wishlists.userId, user.id));

    wishlistItems.forEach((item) => wishlistIds.add(item.productId));
  }

  // 3. Merge Data
  return results.map((product) => ({
    ...product,
    isWishlisted: wishlistIds.has(product.id),
  }));
}
