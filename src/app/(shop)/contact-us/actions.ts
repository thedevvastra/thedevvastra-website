"use server";

import { db } from "@/db";
import { contactMessages } from "@/db/schema";
import { z } from "zod";
// ✅ Import the new notification function
import { sendContactFormNotification } from "@/lib/telegram";

const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  subject: z.string().min(5, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export async function submitContactForm(data: any) {
  const result = contactSchema.safeParse(data);

  if (!result.success) {
    return { success: false, error: "Invalid form data" };
  }

  try {
    // 1. Save to Database
    await db.insert(contactMessages).values({
      name: result.data.name,
      email: result.data.email,
      phone: result.data.phone,
      subject: result.data.subject,
      message: result.data.message,
    });

    // 2. ✅ Send Telegram Notification (Async call, won't block UI if it fails)
    await sendContactFormNotification({
      name: result.data.name,
      email: result.data.email,
      phone: result.data.phone,
      subject: result.data.subject,
      message: result.data.message,
    });

    return { success: true };
  } catch (error) {
    console.error("Contact DB Error:", error);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}
