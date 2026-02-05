import { createClient } from "@/utils/supabase/server";
import { DesktopNav } from "./desktop-nav";
import { MobileNav } from "./mobile-nav";
import { getMainCategories } from "@/app/(admin)/admin/categories/actions"; // ✅ Action Import

export async function SiteHeader() {
  const supabase = await createClient();

  // Parallel fetching for performance
  // 1. User Session
  // 2. Main Categories (for Navbar)
  const [userResult, categories] = await Promise.all([
    supabase.auth.getUser(),
    getMainCategories(),
  ]);

  const user = userResult.data.user;

  return (
    <>
      {/* ✅ Pass Categories to DesktopNav */}
      <DesktopNav user={user} categories={categories} />

      {/* Mobile Nav ko bhi future mein categories pass kar sakte hain agar slide menu chahiye */}
      <MobileNav user={user} />
    </>
  );
}
