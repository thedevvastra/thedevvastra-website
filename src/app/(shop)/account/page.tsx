import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { db } from "@/db";
import { profiles } from "@/db/schema";
import { eq } from "drizzle-orm";
import {
  User,
  Heart,
  Package,
  MapPin,
  ShieldCheck,
  ChevronRight,
  Settings,
} from "lucide-react";
import { GreetingHeader } from "@/components/account/greeting-header";
// ✅ Import the new Client Component
import { LogoutButton } from "@/components/account/logout-button";

export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Fetch Profile
  const profile = await db.query.profiles.findFirst({
    where: eq(profiles.id, user.id),
  });

  const menuItems = [
    {
      label: "Profile",
      href: "/my-profile",
      icon: User,
    },
    {
      label: "Orders",
      href: "/my-orders",
      icon: Package,
    },
    {
      label: "Wishlist",
      href: "/wishlist",
      icon: Heart,
    },
    {
      label: "Address",
      href: "/my-profile?tab=address",
      icon: MapPin,
    },
  ];

  return (
    <div className="container max-w-md mx-auto px-4 py-6 min-h-screen flex flex-col">
      {/* 1. Compact Header */}
      <GreetingHeader
        name={profile?.fullName || user.email?.split("@")[0] || "User"}
        imageUrl={profile?.avatarUrl}
      />

      {/* 2. Main Grid Menu (Compact 2x2) */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {menuItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="flex flex-col items-center justify-center gap-2 p-4 bg-card hover:bg-muted/50 border rounded-xl transition-all hover:border-primary/30 group shadow-sm"
          >
            <div className="h-8 w-8 rounded-full bg-primary/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
              <item.icon className="h-4 w-4" />
            </div>
            <span className="text-sm font-medium text-foreground">
              {item.label}
            </span>
          </Link>
        ))}
      </div>

      {/* 3. Settings & Admin Section */}
      <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
        {/* Admin Link (Only visible to Admin) */}
        {profile?.role === "admin" && (
          <Link
            href="/admin/dashboard"
            className="flex items-center justify-between p-3.5 border-b hover:bg-muted/40 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="h-7 w-7 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                <ShieldCheck className="h-3.5 w-3.5" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-purple-700">
                  Admin Dashboard
                </h3>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </Link>
        )}

        {/* General Settings */}
        <Link
          href="/settings"
          className="flex items-center justify-between p-3.5 hover:bg-muted/40 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
              <Settings className="h-3.5 w-3.5" />
            </div>
            <h3 className="text-sm font-medium text-foreground">Settings</h3>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </Link>
      </div>

      {/* 4. Logout Button (New Client Component) */}
      <div className="mt-4">
        <LogoutButton />
      </div>

      <div className="h-20 md:hidden" />
    </div>
  );
}
