"use server";

import { db } from "@/db";
import { heroSlides } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";

// 1. Create
export async function createHeroSlide(data: any) {
  try {
    await db.insert(heroSlides).values({
      title: data.title,
      description: data.description,
      ctaText: data.ctaText,
      ctaLink: data.ctaLink,
      imageUrl: data.imageUrl,
      bgColor: data.bgColor,
      textColor: data.textColor,
      sortOrder: 0,
      isActive: true,
    });
    revalidatePath("/admin/settings/hero");
    revalidatePath("/");
    return { success: "Slide created successfully" };
  } catch (error) {
    return { error: "Failed to create slide" };
  }
}

// 2. Update (New)
export async function updateHeroSlide(id: string, data: any) {
  try {
    await db
      .update(heroSlides)
      .set({
        title: data.title,
        description: data.description,
        ctaText: data.ctaText,
        ctaLink: data.ctaLink,
        imageUrl: data.imageUrl,
        bgColor: data.bgColor,
        textColor: data.textColor,
      })
      .where(eq(heroSlides.id, id));

    revalidatePath("/admin/settings/hero");
    revalidatePath("/");
    return { success: "Slide updated successfully" };
  } catch (error) {
    return { error: "Failed to update slide" };
  }
}

// 3. Delete
export async function deleteHeroSlide(id: string) {
  try {
    await db.delete(heroSlides).where(eq(heroSlides.id, id));
    revalidatePath("/admin/settings/hero");
    revalidatePath("/");
    return { success: "Slide deleted" };
  } catch (error) {
    return { error: "Failed to delete" };
  }
}
