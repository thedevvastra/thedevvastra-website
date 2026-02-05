"use server";

import { db } from "@/db";
import { saleBanners } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { eq, desc } from "drizzle-orm";

// 1. Create
export async function createSaleBanner(data: any) {
  try {
    await db.insert(saleBanners).values({
      imageUrl: data.imageUrl,
      ctaText: data.ctaText,
      ctaLink: data.ctaLink,
      btnColor: data.btnColor,
    });
    revalidatePath("/admin/settings/sale-banner");
    revalidatePath("/");
    return { success: "Banner created successfully" };
  } catch (error) {
    return { error: "Failed to create banner" };
  }
}

// 2. Fetch
export async function getSaleBanners() {
  return await db
    .select()
    .from(saleBanners)
    .orderBy(desc(saleBanners.createdAt));
}

// 3. Update
export async function updateSaleBanner(id: string, data: any) {
  try {
    await db
      .update(saleBanners)
      .set({
        imageUrl: data.imageUrl,
        ctaText: data.ctaText,
        ctaLink: data.ctaLink,
        btnColor: data.btnColor,
      })
      .where(eq(saleBanners.id, id));

    revalidatePath("/admin/settings/sale-banner");
    revalidatePath("/");
    return { success: "Banner updated" };
  } catch (error) {
    return { error: "Failed to update" };
  }
}

// 4. Delete
export async function deleteSaleBanner(id: string) {
  try {
    await db.delete(saleBanners).where(eq(saleBanners.id, id));
    revalidatePath("/admin/settings/sale-banner");
    revalidatePath("/");
    return { success: "Banner deleted" };
  } catch (error) {
    return { error: "Failed to delete" };
  }
}
