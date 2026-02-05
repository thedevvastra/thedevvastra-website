"use server";

import { db } from "@/db";
import { storeSettings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// 1. Get Settings
export async function getStoreSettings() {
  try {
    const settings = await db.query.storeSettings.findFirst({
      where: eq(storeSettings.id, 1),
    });
    return settings;
  } catch (error) {
    console.error("Error fetching settings:", error);
    return null;
  }
}

// 2. Update Settings
export async function updateShippingSettings(data: any) {
  try {
    // Upsert Logic: Agar ID=1 hai to update karo, nahi to insert karo
    await db
      .insert(storeSettings)
      .values({
        id: 1,
        shippingCharge: Number(data.shippingCharge),
        shippingBy: data.shippingBy,
        shippingDuration: data.shippingDuration,
        freeShippingThreshold: Number(data.freeShippingThreshold),
      })
      .onConflictDoUpdate({
        target: storeSettings.id,
        set: {
          shippingCharge: Number(data.shippingCharge),
          shippingBy: data.shippingBy,
          shippingDuration: data.shippingDuration,
          freeShippingThreshold: Number(data.freeShippingThreshold),
        },
      });

    revalidatePath("/cart");
    revalidatePath("/admin/settings/shipping");
    return { success: "Shipping configuration updated successfully" };
  } catch (error) {
    console.error("Update Error:", error);
    return { error: "Failed to update settings" };
  }
}
