import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { db } from "@/db";
import { profiles } from "@/db/schema";
import { eq, count } from "drizzle-orm";

export async function GET(request: Request) {
  // 1. URL se code aur origin nikalo
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // Agar koi "next" param hai to wahan bhejo, warna home ("/")
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();

    // 2. Code ko Session mein exchange karo
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // 3. User ki details fetch karo
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        // 4. Check karo ki Profile DB mein exist karti hai ya nahi
        const existingProfile = await db.query.profiles.findFirst({
          where: eq(profiles.id, user.id),
        });

        if (!existingProfile) {
          // --- NEW GOOGLE USER SETUP ---

          // Check: Kya ye pehla user hai? (Admin banne ke liye)
          const [result] = await db.select({ count: count() }).from(profiles);
          const isFirstUser = result.count === 0;
          const role = isFirstUser ? "admin" : "user";

          // Full Name aur Email nikalo
          const fullName =
            user.user_metadata.full_name || user.email?.split("@")[0] || "User";
          const email = user.email || "";

          try {
            // 5. Profiles table mein insert karo
            await db.insert(profiles).values({
              id: user.id,
              email: email,
              fullName: fullName,
              phone: null, // Google phone nahi deta, isliye null ya placeholder
              role: role,
            });
          } catch (dbError) {
            console.error("Profile creation failed:", dbError);
            // Agar profile create fail hui, toh user ko error page pe bhej sakte hain
            // Par abhi ke liye ignore karke redirect karte hain
          }
        }
      }

      // 6. Sab sahi hai, User ko redirect karo
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Agar koi error aaye
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
