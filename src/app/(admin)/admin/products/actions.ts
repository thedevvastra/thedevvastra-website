"use server";

import { db } from "@/db";
import { products } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { eq, desc } from "drizzle-orm";

// 1. Create
export async function createProduct(data: any) {
  try {
    await db.insert(products).values({
      title: data.title,
      description: data.description,
      highlights: data.highlights,
      thumbnailUrl: data.thumbnailUrl,
      additionalImages: data.additionalImages,
      sellingPrice: parseFloat(data.sellingPrice),
      oldPrice: data.oldPrice ? parseFloat(data.oldPrice) : null,
      stock: parseInt(data.stock),
      colors: data.colors,
      sizes: data.sizes,
      brandId: data.brandId === "null" ? null : data.brandId,
      categoryId: data.categoryId,
      subCategoryId: data.subCategoryId === "null" ? null : data.subCategoryId,
    });

    revalidatePath("/admin/products");
    revalidatePath("/");
    return { success: "Product created successfully" };
  } catch (error) {
    return { error: "Failed to create product" };
  }
}

// 2. Fetch
export async function getProducts() {
  return await db.query.products.findMany({
    orderBy: [desc(products.createdAt)],
  });
}

// 3. Update Product
export async function updateProduct(id: string, data: any) {
  try {
    await db
      .update(products)
      .set({
        title: data.title,
        description: data.description,
        highlights: data.highlights,
        thumbnailUrl: data.thumbnailUrl,
        additionalImages: data.additionalImages,
        sellingPrice: parseFloat(data.sellingPrice),
        oldPrice: data.oldPrice ? parseFloat(data.oldPrice) : null,
        stock: parseInt(data.stock),
        colors: data.colors,
        sizes: data.sizes,
        brandId: data.brandId === "null" ? null : data.brandId,
        categoryId: data.categoryId,
        subCategoryId:
          data.subCategoryId === "null" ? null : data.subCategoryId,
        updatedAt: new Date(),
      })
      .where(eq(products.id, id));

    revalidatePath("/admin/products");
    revalidatePath("/");
    return { success: "Product updated successfully" };
  } catch (error) {
    console.error("Update Error:", error);
    return { error: "Failed to update product" };
  }
}

// 4. Delete
export async function deleteProduct(id: string) {
  try {
    await db.delete(products).where(eq(products.id, id));
    revalidatePath("/admin/products");
    return { success: "Product deleted" };
  } catch (error) {
    return { error: "Failed to delete product" };
  }
}
