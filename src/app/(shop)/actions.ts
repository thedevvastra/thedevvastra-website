"use server";

import { db } from "@/db";
import { products, categories, carts, wishlists, reviews } from "@/db/schema";
import { desc, asc, eq, and, gte, lte, sql, isNull } from "drizzle-orm";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache"; // ✅ Added for instant updates

// =========================================
// 1. PRODUCT FETCHING
// =========================================

// Homepage: Latest Products (Limit 12)
export async function getLatestProducts() {
  return await db.query.products.findMany({
    orderBy: [desc(products.createdAt)],
    limit: 12,
    with: {
      brand: true,
    },
  });
}

// Simple Fetch All (Fallback)
export async function getAllProducts() {
  return await db.query.products.findMany({
    orderBy: [desc(products.createdAt)],
    with: {
      brand: true,
    },
  });
}

// Fetch Filtered Products (All Products Page)
export async function getFilteredProducts(searchParams: any) {
  const { category, subCategory, minPrice, maxPrice, color, sort } =
    searchParams;

  const conditions = [];

  // Filters
  if (category) conditions.push(eq(products.categoryId, category));
  if (subCategory) conditions.push(eq(products.subCategoryId, subCategory));
  if (minPrice) conditions.push(gte(products.sellingPrice, Number(minPrice)));
  if (maxPrice) conditions.push(lte(products.sellingPrice, Number(maxPrice)));

  if (color) {
    const colors = color.split(",");
    const colorConditions = colors.map(
      (c: string) =>
        sql`lower(${products.colors}::text) LIKE ${`%${c.toLowerCase()}%`}`,
    );
    if (colorConditions.length > 0) {
      conditions.push(sql`(${sql.join(colorConditions, sql` OR `)})`);
    }
  }

  // Sorting
  let orderBy = desc(products.createdAt);
  switch (sort) {
    case "oldest":
      orderBy = asc(products.createdAt);
      break;
    case "price_low":
      orderBy = asc(products.sellingPrice);
      break;
    case "price_high":
      orderBy = desc(products.sellingPrice);
      break;
    case "popular":
      orderBy = desc(products.stock);
      break;
    default:
      orderBy = desc(products.createdAt);
  }

  return await db.query.products.findMany({
    where: conditions.length > 0 ? and(...conditions) : undefined,
    orderBy: [orderBy],
    with: { brand: true, category: true, subCategory: true },
  });
}

// =========================================
// 2. METADATA & FILTERS
// =========================================

export async function getFilterMetadata() {
  // A. Fetch Main Categories
  const allCategories = await db.query.categories.findMany({
    where: isNull(categories.parentId),
    with: {
      children: true, // Sub Categories
    },
    orderBy: [asc(categories.name)],
  });

  // B. Fetch All Products for counts & colors
  const allProducts = await db
    .select({
      sellingPrice: products.sellingPrice,
      colors: products.colors,
      categoryId: products.categoryId,
      subCategoryId: products.subCategoryId,
    })
    .from(products);

  // Stats Calculation
  const maxPrice =
    allProducts.length > 0
      ? Math.max(...allProducts.map((p) => p.sellingPrice))
      : 5000;

  const uniqueColors = new Set<string>();
  allProducts.forEach((p) => {
    if (Array.isArray(p.colors)) {
      p.colors.forEach((c: any) => uniqueColors.add(c.name));
    }
  });

  const getCount = (catId: string, isSub = false) => {
    return allProducts.filter((p) =>
      isSub ? p.subCategoryId === catId : p.categoryId === catId,
    ).length;
  };

  return {
    categories: allCategories.map((c) => ({
      ...c,
      count: getCount(c.id, false),
      children: c.children.map((sub: any) => ({
        ...sub,
        count: getCount(sub.id, true),
      })),
    })),
    colors: Array.from(uniqueColors).sort(),
    maxPrice,
  };
}

// =========================================
// 3. CART & WISHLIST
// =========================================

export async function addToCartAction(
  productId: string,
  quantity: number,
  color?: string,
  size?: string,
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "unauthorized" };

  try {
    const existingItem = await db.query.carts.findFirst({
      where: and(
        eq(carts.userId, user.id),
        eq(carts.productId, productId),
        color ? eq(carts.color, color) : undefined,
        size ? eq(carts.size, size) : undefined,
      ),
    });

    if (existingItem) {
      await db
        .update(carts)
        .set({ quantity: existingItem.quantity + quantity })
        .where(eq(carts.id, existingItem.id));
    } else {
      await db.insert(carts).values({
        userId: user.id,
        productId,
        quantity,
        color: color || null,
        size: size || null,
      });
    }

    return { success: true };
  } catch (error) {
    return { error: "Failed to add to cart" };
  }
}

export async function toggleWishlistAction(productId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "unauthorized" };

  try {
    const existing = await db.query.wishlists.findFirst({
      where: and(
        eq(wishlists.userId, user.id),
        eq(wishlists.productId, productId),
      ),
    });

    if (existing) {
      await db.delete(wishlists).where(eq(wishlists.id, existing.id));
      return { status: "removed" };
    } else {
      await db.insert(wishlists).values({ userId: user.id, productId });
      return { status: "added" };
    }
  } catch (error) {
    return { error: "Failed" };
  }
}

export async function getUserCounts() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { cart: 0, wishlist: 0 };

  const cartItems = await db
    .select()
    .from(carts)
    .where(eq(carts.userId, user.id));
  const wishlistItems = await db
    .select()
    .from(wishlists)
    .where(eq(wishlists.userId, user.id));

  return {
    cart: cartItems.length,
    wishlist: wishlistItems.length,
  };
}

export async function getUserWishlistIds() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const items = await db
    .select({ productId: wishlists.productId })
    .from(wishlists)
    .where(eq(wishlists.userId, user.id));

  return items.map((item) => item.productId);
}

// =========================================
// 4. CATEGORY PAGES (Main & Sub)
// =========================================

export async function getCategoryPageData(slug: string, searchParams: any) {
  const { minPrice, maxPrice, color, sort } = searchParams;

  const category = await db.query.categories.findFirst({
    where: eq(categories.slug, slug),
    with: { children: true },
  });

  if (!category) return null;

  const conditions = [eq(products.categoryId, category.id)];

  if (minPrice) conditions.push(gte(products.sellingPrice, Number(minPrice)));
  if (maxPrice) conditions.push(lte(products.sellingPrice, Number(maxPrice)));

  if (color) {
    const colors = color.split(",");
    const colorConditions = colors.map(
      (c: string) =>
        sql`lower(${products.colors}::text) LIKE ${`%${c.toLowerCase()}%`}`,
    );
    if (colorConditions.length > 0) {
      conditions.push(sql`(${sql.join(colorConditions, sql` OR `)})`);
    }
  }

  let orderBy = desc(products.createdAt);
  switch (sort) {
    case "oldest":
      orderBy = asc(products.createdAt);
      break;
    case "price_low":
      orderBy = asc(products.sellingPrice);
      break;
    case "price_high":
      orderBy = desc(products.sellingPrice);
      break;
    case "popular":
      orderBy = desc(products.stock);
      break;
  }

  const categoryProducts = await db.query.products.findMany({
    where: and(...conditions),
    orderBy: [orderBy],
    with: { brand: true },
  });

  return { category, products: categoryProducts };
}

export async function getSubCategoryPageData(
  mainSlug: string,
  subSlug: string,
  searchParams: any,
) {
  const { minPrice, maxPrice, color, sort } = searchParams;

  const mainCategory = await db.query.categories.findFirst({
    where: eq(categories.slug, mainSlug),
  });
  if (!mainCategory) return null;

  const subCategory = await db.query.categories.findFirst({
    where: and(
      eq(categories.slug, subSlug),
      eq(categories.parentId, mainCategory.id),
    ),
  });
  if (!subCategory) return null;

  const conditions = [eq(products.subCategoryId, subCategory.id)];

  if (minPrice) conditions.push(gte(products.sellingPrice, Number(minPrice)));
  if (maxPrice) conditions.push(lte(products.sellingPrice, Number(maxPrice)));

  if (color) {
    const colors = color.split(",");
    const colorConditions = colors.map(
      (c: string) =>
        sql`lower(${products.colors}::text) LIKE ${`%${c.toLowerCase()}%`}`,
    );
    if (colorConditions.length > 0) {
      conditions.push(sql`(${sql.join(colorConditions, sql` OR `)})`);
    }
  }

  let orderBy = desc(products.createdAt);
  switch (sort) {
    case "oldest":
      orderBy = asc(products.createdAt);
      break;
    case "price_low":
      orderBy = asc(products.sellingPrice);
      break;
    case "price_high":
      orderBy = desc(products.sellingPrice);
      break;
    case "popular":
      orderBy = desc(products.stock);
      break;
  }

  const subCategoryProducts = await db.query.products.findMany({
    where: and(...conditions),
    orderBy: [orderBy],
    with: { brand: true },
  });

  return {
    category: subCategory,
    parentCategory: mainCategory,
    products: subCategoryProducts,
  };
}

// =========================================
// 5. REVIEWS & STATS (Updated with Revalidation)
// =========================================

export async function getProductReviews(productId: string) {
  return await db.query.reviews.findMany({
    where: eq(reviews.productId, productId),
    orderBy: [desc(reviews.createdAt)],
    with: {
      user: true,
    },
  });
}

// ✅ Updated with revalidatePath
export async function submitReviewAction(
  productId: string,
  rating: number,
  comment: string,
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "unauthorized" };

  try {
    const existing = await db.query.reviews.findFirst({
      where: and(eq(reviews.userId, user.id), eq(reviews.productId, productId)),
    });

    if (existing) {
      await db
        .update(reviews)
        .set({ rating, comment, updatedAt: new Date() })
        .where(eq(reviews.id, existing.id));
    } else {
      await db.insert(reviews).values({
        userId: user.id,
        productId,
        rating,
        comment,
      });
    }

    // ✅ FIX: Revalidate cache to show updated stats/reviews instantly
    revalidatePath(`/product/${productId}`);
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Failed to submit review" };
  }
}

// ✅ Improved Safe Stats Calculation
export async function getProductStats(productId: string) {
  try {
    const allReviews = await db
      .select({ rating: reviews.rating })
      .from(reviews)
      .where(eq(reviews.productId, productId));

    if (!allReviews || allReviews.length === 0)
      return { average: 0, total: 0, distribution: [0, 0, 0, 0, 0] };

    const total = allReviews.length;
    const sum = allReviews.reduce((acc, curr) => acc + curr.rating, 0);
    const average = (sum / total).toFixed(1);

    const distribution = [0, 0, 0, 0, 0];
    allReviews.forEach((r) => {
      if (r.rating >= 1 && r.rating <= 5) {
        distribution[r.rating - 1]++;
      }
    });

    return { average, total, distribution };
  } catch (error) {
    console.error("Stats Error:", error);
    return { average: 0, total: 0, distribution: [0, 0, 0, 0, 0] };
  }
}

// ✅ Updated with revalidatePath
export async function deleteReviewAction(reviewId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "unauthorized" };

  try {
    // Fetch review first to get productId for revalidation
    const review = await db.query.reviews.findFirst({
      where: eq(reviews.id, reviewId),
      columns: { productId: true },
    });

    await db
      .delete(reviews)
      .where(and(eq(reviews.id, reviewId), eq(reviews.userId, user.id)));

    // ✅ FIX: Revalidate cache
    if (review) {
      revalidatePath(`/product/${review.productId}`);
    }

    return { success: true };
  } catch (error) {
    return { error: "Failed to delete review" };
  }
}

// ✅ NEW: Fetch Most Selling Products
// limit: Homepage ke liye (e.g. 18 products for 3 rows)
// Agar limit nahi di, toh saare fetch karega (View All page ke liye)
export async function getMostSellingProducts(limit?: number) {
  const query = db.query.products.findMany({
    where: eq(products.isMostSelling, true),
    orderBy: [desc(products.createdAt)],
    with: {
      brand: true,
    },
    limit: limit, 
  });

  return await query;
}