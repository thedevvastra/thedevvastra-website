"use server";

import { db } from "@/db";
import { brands } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { eq, desc } from "drizzle-orm";

// 1. Create
export async function createBrand(data: any) {
  try {
    await db.insert(brands).values({
      name: data.name,
      imageUrl: data.imageUrl,
    });
    revalidatePath("/admin/our-brands");
    return { success: "Brand added successfully" };
  } catch (error) {
    return { error: "Failed to add brand" };
  }
}

// 2. Update
export async function updateBrand(id: string, data: any) {
  try {
    await db
      .update(brands)
      .set({
        name: data.name,
        imageUrl: data.imageUrl,
        updatedAt: new Date(),
      })
      .where(eq(brands.id, id));

    revalidatePath("/admin/our-brands");
    return { success: "Brand updated successfully" };
  } catch (error) {
    return { error: "Failed to update brand" };
  }
}

// 3. Delete
export async function deleteBrand(id: string) {
  try {
    await db.delete(brands).where(eq(brands.id, id));
    revalidatePath("/admin/our-brands");
    return { success: "Brand deleted" };
  } catch (error) {
    return { error: "Failed to delete brand" };
  }
}
