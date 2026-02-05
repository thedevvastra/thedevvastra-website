"use server";

import { db } from "@/db";
import { marqueeItems, storeSettings } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";

// 1. Create
export async function createMarqueeItem(text: string) {
  try {
    await db.insert(marqueeItems).values({ text });
    revalidatePath("/admin/settings/marquee");
    revalidatePath("/");
    return { success: "Item added successfully" };
  } catch (error) {
    return { error: "Failed to add item" };
  }
}

// 2. Update
export async function updateMarqueeItem(id: string, text: string) {
  try {
    await db.update(marqueeItems).set({ text }).where(eq(marqueeItems.id, id));
    revalidatePath("/admin/settings/marquee");
    revalidatePath("/");
    return { success: "Item updated successfully" };
  } catch (error) {
    return { error: "Failed to update item" };
  }
}

// 3. Delete
export async function deleteMarqueeItem(id: string) {
  try {
    await db.delete(marqueeItems).where(eq(marqueeItems.id, id));
    revalidatePath("/admin/settings/marquee");
    revalidatePath("/");
    return { success: "Item deleted" };
  } catch (error) {
    return { error: "Failed to delete item" };
  }
}

export async function toggleMarquee(isEnabled: boolean) {
  try {
    // Check if settings row exists
    const existingSettings = await db
      .select()
      .from(storeSettings)
      .where(eq(storeSettings.id, 1));

    if (existingSettings.length === 0) {
      // Create first row if not exists
      await db
        .insert(storeSettings)
        .values({ id: 1, isMarqueeEnabled: isEnabled });
    } else {
      // Update existing row
      await db
        .update(storeSettings)
        .set({ isMarqueeEnabled: isEnabled })
        .where(eq(storeSettings.id, 1));
    }

    revalidatePath("/admin/settings/marquee");
    revalidatePath("/"); // Update Homepage immediately
    return { success: "Settings updated" };
  } catch (error) {
    return { error: "Failed to update settings" };
  }
}