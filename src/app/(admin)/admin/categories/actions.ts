"use server";

import { db } from "@/db";
import { categories } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { eq, isNull, desc, and } from "drizzle-orm";

// Helper function to check if slug exists
async function checkSlugExists(slug: string) {
  const existing = await db.query.categories.findFirst({
    where: eq(categories.slug, slug),
  });
  return !!existing;
}

// 1. Create Category (With Smart Slug Logic)
export async function createCategory(data: any) {
  try {
    let finalSlug = data.slug;
    let isSlugTaken = await checkSlugExists(finalSlug);

    // ✅ SMART SLUG LOGIC
    if (isSlugTaken) {
      // Agar Parent Category hai, toh Parent ka slug prefix karo (e.g. "kids-t-shirt")
      if (data.parentId && data.parentId !== "null") {
        const parentCategory = await db.query.categories.findFirst({
          where: eq(categories.id, data.parentId),
        });

        if (parentCategory) {
          finalSlug = `${parentCategory.slug}-${data.slug}`;
          // Check again if this new slug exists
          isSlugTaken = await checkSlugExists(finalSlug);
        }
      }

      // Agar abhi bhi taken hai (ya Parent nahi tha), toh number add karo (e.g. "t-shirt-1")
      if (isSlugTaken) {
        let counter = 1;
        while (await checkSlugExists(`${finalSlug}-${counter}`)) {
          counter++;
        }
        finalSlug = `${finalSlug}-${counter}`;
      }
    }

    // B. Calculate Sort Order
    const parentIdValue =
      data.parentId === "null" || !data.parentId ? null : data.parentId;

    const whereClause = parentIdValue
      ? eq(categories.parentId, parentIdValue)
      : isNull(categories.parentId);

    const lastItem = await db.query.categories.findFirst({
      where: whereClause,
      orderBy: [desc(categories.sortOrder)],
    });

    const newOrder = lastItem ? (lastItem.sortOrder || 0) + 1 : 0;

    // C. Insert into DB
    await db.insert(categories).values({
      name: data.name,
      slug: finalSlug, // ✅ Use the unique generated slug
      imageUrl: data.imageUrl,
      parentId: parentIdValue,
      isFeatured: false,
      sortOrder: newOrder,
    });

    revalidatePath("/admin/categories");
    revalidatePath("/");
    return { success: "Category created successfully" };
  } catch (error: any) {
    console.error("Create Category Error:", error);

    // Backup error handler
    if (
      error.message?.includes("duplicate key") ||
      error.message?.includes("unique constraint")
    ) {
      return {
        error:
          "Category with this slug already exists. Please change the name.",
      };
    }

    return { error: "Failed to create category. Please try again." };
  }
}

// 2. Fetch Categories
export async function getMainCategories() {
  try {
    const allCategories = await db
      .select()
      .from(categories)
      .orderBy(categories.sortOrder);

    const parents = allCategories.filter((c) => c.parentId === null);
    const children = allCategories.filter((c) => c.parentId !== null);

    const data = parents.map((parent) => ({
      ...parent,
      children: children
        .filter((child) => child.parentId === parent.id)
        .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)),
    }));

    return data;
  } catch (error) {
    console.error("Fetch Categories Error:", error);
    return [];
  }
}

// 3. Update Category
export async function updateCategory(id: string, data: any) {
  try {
    // Note: Update mein hum slug auto-change nahi karte taaki broken links na ho.
    // User ko error dikhana behtar hai agar woh update karte waqt duplicate slug daale.

    const parentIdValue =
      data.parentId === "null" || !data.parentId ? null : data.parentId;

    await db
      .update(categories)
      .set({
        name: data.name,
        slug: data.slug,
        imageUrl: data.imageUrl,
        parentId: parentIdValue,
      })
      .where(eq(categories.id, id));

    revalidatePath("/admin/categories");
    revalidatePath("/");
    return { success: "Category updated successfully" };
  } catch (error: any) {
    console.error("Update Error:", error);
    if (error.message?.includes("unique")) {
      return { error: "Slug already exists. Please choose a unique slug." };
    }
    return { error: "Failed to update category" };
  }
}

// 4. Update Order
export async function updateCategoryOrder(
  items: { id: string; sortOrder: number }[],
) {
  try {
    await db.transaction(async (tx) => {
      for (const item of items) {
        await tx
          .update(categories)
          .set({ sortOrder: item.sortOrder })
          .where(eq(categories.id, item.id));
      }
    });

    revalidatePath("/admin/categories");
    revalidatePath("/");
    return { success: "Order updated" };
  } catch (error) {
    return { error: "Failed to reorder" };
  }
}

// 5. Delete
export async function deleteCategory(id: string) {
  try {
    await db.delete(categories).where(eq(categories.id, id));
    revalidatePath("/admin/categories");
    revalidatePath("/");
    return { success: "Category deleted" };
  } catch (error) {
    return { error: "Failed to delete category" };
  }
}
