"use server";

import { db } from "@/db";
import { storeSettings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// 1. Get Notification Settings
export async function getNotificationSettings() {
  try {
    const settings = await db.query.storeSettings.findFirst({
      where: eq(storeSettings.id, 1),
      columns: {
        telegramBotToken: true,
        telegramChatId: true,
      },
    });
    return settings;
  } catch (error) {
    console.error("Error fetching notification settings:", error);
    return null;
  }
}

// 2. Update Notification Settings
export async function updateNotificationSettings(data: {
  telegramBotToken: string;
  telegramChatId: string;
}) {
  try {
    // Upsert Logic: ID=1 hamesha maintain rahega
    await db
      .insert(storeSettings)
      .values({
        id: 1,
        telegramBotToken: data.telegramBotToken || null,
        telegramChatId: data.telegramChatId || null,
      })
      .onConflictDoUpdate({
        target: storeSettings.id,
        set: {
          telegramBotToken: data.telegramBotToken || null,
          telegramChatId: data.telegramChatId || null,
        },
      });

    revalidatePath("/admin/settings/notification");
    return { success: "Notification settings updated successfully" };
  } catch (error) {
    console.error("Update Error:", error);
    return { error: "Failed to update settings" };
  }
}
