"use server";

import { createClient } from "@/utils/supabase/server";
import { db } from "@/db";
import { profiles } from "@/db/schema";
import { count } from "drizzle-orm";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

// 1. Helper: Check if First User (Admin Logic)
async function checkIsFirstUser() {
  const [result] = await db.select({ count: count() }).from(profiles);
  return result.count === 0;
}

// 2. Signup Action (Email, Password, Name, Phone)
export async function signupAction(formData: any) {
  const supabase = await createClient();
  const { fullName, email, password, phone } = formData;

  // A. Create User in Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        phone: phone, // Saving metadata in Auth too
      },
    },
  });

  if (authError) {
    return { error: authError.message };
  }

  if (!authData.user) {
    return { error: "Something went wrong. Please try again." };
  }

  // B. Create Profile in Database
  try {
    const isFirst = await checkIsFirstUser();
    const role = isFirst ? "admin" : "user";

    await db.insert(profiles).values({
      id: authData.user.id, // Link with Auth ID
      email: email,
      fullName: fullName,
      phone: phone,
      role: role,
    });

    return { success: true };
  } catch (dbError: any) {
    console.error("Profile Creation Error:", dbError);
    // Handle duplicate key error (if somehow auth passed but db failed)
    if (dbError.code === "23505") {
      return { error: "User already exists with this email." };
    }
    return { error: "Account created but profile setup failed." };
  }
}

// 3. Login Action (Email & Password)
export async function loginAction(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) return { error: error.message };
  return { success: true };
}

// 4. Google Login Action
export async function loginWithGoogle() {
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) return { error: error.message };
  if (data.url) redirect(data.url);
}
