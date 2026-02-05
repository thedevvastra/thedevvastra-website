"use server";

import { db } from "@/db";
import { contactSettings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// 1. Get Settings
export async function getContactSettings() {
  try {
    const settings = await db.query.contactSettings.findFirst({
      where: eq(contactSettings.id, 1),
    });
    return settings || null;
  } catch (error) {
    return null;
  }
}

// 2. Update Settings (Upsert)
export async function updateContactSettings(data: any) {
  try {
    await db
      .insert(contactSettings)
      .values({
        id: 1, // Enforce ID 1
        ...data,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: contactSettings.id,
        set: {
          ...data,
          updatedAt: new Date(),
        },
      });

    revalidatePath("/contact-us");
    revalidatePath("/admin/settings/contact");
    return { success: true };
  } catch (error) {
    console.error("Settings Update Error:", error);
    return { success: false, error: "Failed to update settings" };
  }
}
