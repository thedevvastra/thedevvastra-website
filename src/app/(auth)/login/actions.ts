"use server";

import { createClient } from "@/utils/supabase/server";
import { authSchema, AuthSchema } from "@/lib/validators/auth";
import { db } from "@/db"; // Drizzle DB import
import { profiles } from "@/db/schema"; // Profiles Schema
import { count } from "drizzle-orm";

export async function login(data: AuthSchema) {
  const result = authSchema.safeParse(data);
  if (!result.success) return { error: "Invalid data" };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: result.data.email,
    password: result.data.password,
  });

  if (error) return { error: error.message };

  // Note: Redirect client-side par handle hoga ya middleware se
  return { success: "Logged in successfully" };
}

export async function signup(data: AuthSchema) {
  const result = authSchema.safeParse(data);
  if (!result.success) return { error: "Invalid data" };

  const supabase = await createClient();

  // 1. Supabase Auth mein user banao
  const { data: authData, error } = await supabase.auth.signUp({
    email: result.data.email,
    password: result.data.password,
  });

  if (error) return { error: error.message };
  if (!authData.user) return { error: "Something went wrong during signup" };

  // 2. "First User = Admin" Logic Check
  // Database mein kitne users hain count karo
  const existingUsers = await db.select({ count: count() }).from(profiles);
  const userCount = existingUsers[0].count;

  // Agar count 0 hai to 'admin', warnha 'user'
  const newRole = userCount === 0 ? "admin" : "user";

  // 3. User ko 'profiles' table mein save karo (Sync Auth & DB)
  try {
    await db.insert(profiles).values({
      id: authData.user.id, // Auth ID aur Profile ID same honi chahiye
      email: result.data.email,
      fullName: result.data.email.split("@")[0], // Default name from email
      role: newRole,
    });
  } catch (dbError) {
    console.error("Database Error:", dbError);
    return { error: "User created via Auth but failed to save in Database." };
  }

  return {
    success: `Account created as ${newRole}! Check email if confirmation is on.`,
  };
}
