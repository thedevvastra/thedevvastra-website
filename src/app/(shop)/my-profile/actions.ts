"use server";

import { db } from "@/db";
import { profiles } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

export async function getUserProfile() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const profile = await db.query.profiles.findFirst({
    where: eq(profiles.id, user.id),
  });

  return profile;
}

export async function updateUserProfile(data: any) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "You must be logged in." };

  try {
    await db
      .update(profiles)
      .set({
        fullName: data.fullName,
        phone: data.phone,
        addressLine1: data.addressLine1,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        updatedAt: new Date(),
      })
      .where(eq(profiles.id, user.id));

    // ✅ Revalidate both pages so data is fresh everywhere
    revalidatePath("/my-profile");
    revalidatePath("/cart");

    return { success: true };
  } catch (error) {
    console.error("Profile Update Error:", error);
    return { error: "Failed to update profile." };
  }
}
