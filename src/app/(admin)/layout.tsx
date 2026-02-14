export const dynamic = "force-dynamic";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminHeader } from "@/components/admin/admin-header";
import { db } from "@/db";
import { profiles } from "@/db/schema";
import { eq } from "drizzle-orm";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 1. Security Check (Server Side)
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Check Role
  const dbUser = await db.query.profiles.findFirst({
    where: eq(profiles.id, user.id),
  });

  if (dbUser?.role !== "admin") redirect("/");

  return (
    // ✅ FIX: Outer div for Background only
    <div className="min-h-screen bg-muted/30 h-screen overflow-hidden">
      {/* ✅ FIX: Inner Container to limit max-width (matches user side) */}
      <div className="container mx-auto h-full p-4 flex gap-4">
        {/* 1. Floating Sidebar */}
        <aside className="hidden md:flex flex-col w-64 bg-background border border-border/50 shadow-sm rounded-2xl h-full overflow-hidden shrink-0">
          <AdminSidebar />
        </aside>

        <div className="flex-1 flex flex-col gap-4 h-full overflow-hidden min-w-0">
          {/* 2. Floating Navbar */}
          <header className="h-16 bg-background border border-border/50 shadow-sm rounded-2xl flex items-center px-6 shrink-0">
            <AdminHeader user={user} />
          </header>

          {/* 3. Main Content Area */}
          <main className="flex-1 bg-background border border-border/50 shadow-sm rounded-2xl p-6 overflow-y-auto relative">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
