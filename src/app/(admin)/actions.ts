"use server";

import { db } from "@/db";
import { reviews, products, profiles } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// ==========================================
// TYPE DEFINITIONS
// ==========================================

// ✅ Updated Payload Type (additionalImages added)
type ProductPayload = {
  title: string;
  description: string;
  sellingPrice: number;
  oldPrice?: number;
  stock: number;
  categoryId: string;
  subCategoryId?: string | null;
  brandId?: string | null;
  thumbnailUrl: string;
  additionalImages?: string[]; // ✅ New Field
  sizes?: string[]; // Array of strings
  colors?: { name: string; hex: string }[]; // JSON Array
  isFeatured?: boolean;
};

// ==========================================
// 1. REVIEWS MANAGEMENT
// ==========================================

export async function getAllReviews() {
  return await db.query.reviews.findMany({
    orderBy: [desc(reviews.createdAt)],
    with: {
      product: true, // To show which product
      user: true, // To show who commented
    },
  });
}

export async function updateReviewAction(
  reviewId: string,
  reply: string | null,
  isLoved: boolean,
) {
  try {
    await db
      .update(reviews)
      .set({ adminReply: reply, isLoved })
      .where(eq(reviews.id, reviewId));

    revalidatePath("/admin/reviews");
    return { success: true };
  } catch (error) {
    return { error: "Failed to update review" };
  }
}

// ==========================================
// 2. PRODUCT MANAGEMENT
// ==========================================

// --- TOGGLE MOST SELLING ---
export async function toggleMostSellingAction(
  productId: string,
  status: boolean,
) {
  try {
    await db
      .update(products)
      .set({ isMostSelling: status })
      .where(eq(products.id, productId));

    // UI Updates
    revalidatePath("/admin/products");
    revalidatePath("/"); // Update homepage
    return { success: true };
  } catch (error) {
    return { error: "Failed to update status" };
  }
}

// --- CREATE PRODUCT ---
export async function createProductAction(data: ProductPayload) {
  try {
    await db.insert(products).values({
      title: data.title,
      description: data.description,
      sellingPrice: data.sellingPrice,
      oldPrice: data.oldPrice,
      stock: data.stock,
      categoryId: data.categoryId,
      subCategoryId: data.subCategoryId, // Can be null
      brandId: data.brandId, // Can be null
      thumbnailUrl: data.thumbnailUrl,
      additionalImages: data.additionalImages, // ✅ Save to DB
      sizes: data.sizes, // Drizzle JSON handle karega
      colors: data.colors, // Drizzle JSON handle karega
      isFeatured: data.isFeatured ?? false,
      isMostSelling: false, // Default
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    revalidatePath("/admin/products");
    revalidatePath("/"); // Homepage update agar featured hai
    return { success: true };
  } catch (error: any) {
    console.error("Create Product Error:", error);
    return { error: error.message || "Failed to create product" };
  }
}

// --- UPDATE PRODUCT ---
export async function updateProductAction(
  data: ProductPayload & { id: string },
) {
  try {
    const { id, ...updates } = data;

    await db
      .update(products)
      .set({
        ...updates,
        // ✅ Ensure additionalImages update ho raha hai
        additionalImages: updates.additionalImages,
        updatedAt: new Date(),
      })
      .where(eq(products.id, id));

    revalidatePath("/admin/products");
    revalidatePath("/");
    // Agar single product page cached hai to wo bhi update ho
    revalidatePath(`/product/${id}`);

    return { success: true };
  } catch (error: any) {
    console.error("Update Product Error:", error);
    return { error: error.message || "Failed to update product" };
  }
}

// --- DELETE PRODUCT ---
export async function deleteProductAction(productId: string) {
  try {
    // 1. Delete from Database
    await db.delete(products).where(eq(products.id, productId));

    // Note: Future mein Supabase Storage se image delete ka logic yahan aayega

    // 2. Refresh UI
    revalidatePath("/admin/products");
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Delete Error:", error);
    return { error: "Failed to delete product" };
  }
}
