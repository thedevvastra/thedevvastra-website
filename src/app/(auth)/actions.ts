"use server";

import { createClient } from "@/utils/supabase/server";
import { db } from "@/db";
import { profiles } from "@/db/schema";
import { count } from "drizzle-orm";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

/* eslint-disable @typescript-eslint/no-explicit-any */

// 1. Helper: Check if First User
async function checkIsFirstUser() {
  const [result] = await db.select({ count: count() }).from(profiles);
  return result.count === 0;
}

// 2. Signup Action
export async function signupAction(formData: any) {
  const supabase = await createClient();
  const { fullName, email, password, phone } = formData;

  try {
    // A. Create User
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, phone: phone },
      },
    });

    if (authError) return { error: authError.message };
    if (!authData.user) return { error: "Signup failed. Try again." };

    // B. Create Profile
    const isFirst = await checkIsFirstUser();
    const role = isFirst ? "admin" : "user";

    await db.insert(profiles).values({
      id: authData.user.id,
      email,
      fullName,
      phone,
      role,
    });

    return { success: true };
  } catch (error: any) {
    console.error("Signup Error:", error);
    return { error: "Network error. Please try again later." };
  }
}

// 3. Login Action (Fixed Timeout Error)
export async function loginAction(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) return { error: error.message };

    // ✅ Success (Redirect client side handle karega for toast)
    return { success: true };
  } catch (error: any) {
    console.error("Login Error:", error);
    // ✅ Fix for "fetch failed" / Timeout
    return { error: "Connection failed. Check your internet." };
  }
}

// 4. Google Login Action
export async function loginWithGoogle() {
  const supabase = await createClient();
  // ✅ FIX: Reliable Origin
  const origin = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback`,
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });

  if (error) return { error: error.message };
  if (data.url) redirect(data.url);
}

// ✅ 5. Forgot Password Action (New)
export async function forgotPasswordAction(email: string) {
  const supabase = await createClient();
  const origin = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${origin}/auth/update-password`, // You will need to create this page later to handle the new password input
    });

    if (error) return { error: error.message };

    return { success: true };
  } catch (error: any) {
    return { error: "Failed to send reset email." };
  }
}

// ✅ 6. Update Password Action (New)
export async function updatePasswordAction(formData: FormData) {
  const supabase = await createClient();
  const password = formData.get("password") as string;
  const code = formData.get("code") as string;

  if (!password || !code) {
    return { error: "Missing required fields." };
  }

  try {
    // 1. Code ko Session mein exchange karo
    const { error: sessionError } = await supabase.auth.exchangeCodeForSession(code);
    
    if (sessionError) {
      return { error: "Link expired or invalid. Try resetting again." };
    }

    // 2. User ka password update karo
    const { error: updateError } = await supabase.auth.updateUser({
      password: password,
    });

    if (updateError) {
      return { error: updateError.message };
    }

    return { success: true };
  } catch (error: any) {
    return { error: "Something went wrong. Please try again." };
  }
}