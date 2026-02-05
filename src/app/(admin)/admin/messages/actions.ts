"use server";

import { db } from "@/db";
import { contactMessages } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getMessages() {
  try {
    const messages = await db
      .select()
      .from(contactMessages)
      .orderBy(desc(contactMessages.createdAt));

    return { success: true, data: messages };
  } catch (error) {
    return { success: false, error: "Failed to fetch messages" };
  }
}

export async function toggleMessageReadStatus(
  id: string,
  currentStatus: boolean,
) {
  try {
    await db
      .update(contactMessages)
      .set({ isRead: !currentStatus })
      .where(eq(contactMessages.id, id));

    revalidatePath("/admin/messages");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Update failed" };
  }
}

export async function deleteMessage(id: string) {
  try {
    await db.delete(contactMessages).where(eq(contactMessages.id, id));
    revalidatePath("/admin/messages");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Delete failed" };
  }
}
