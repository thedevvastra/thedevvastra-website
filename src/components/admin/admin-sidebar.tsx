"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Settings,
  ShoppingBag,
  Users,
  LogOut,
  Layers,
  BadgeCheck,
  Timer,
  MessageSquare,
  Mails,
  TicketPercent, // ✅ Added Icon for Coupons
} from "lucide-react";

const sidebarLinks = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Categories", href: "/admin/categories", icon: Layers },
  { name: "Our Brands", href: "/admin/our-brands", icon: BadgeCheck },
  { name: "Coupons", href: "/admin/coupons", icon: TicketPercent },
  { name: "Products", href: "/admin/products", icon: ShoppingBag },
  { name: "Today's Deal", href: "/admin/todays-deal", icon: Timer },
  { name: "Orders", href: "/admin/orders", icon: Users },
  { name: "Reviews", href: "/admin/reviews", icon: MessageSquare },
  { name: "Messages", href: "/admin/messages", icon: Mails },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full bg-card border-r border-border/40">
      {/* Admin Logo */}
      <div className="h-16 flex items-center px-6 border-b border-border/40 shrink-0">
        <span className="text-xl font-bold text-primary tracking-tight">
          Dev Vastra{" "}
          <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded ml-2">
            ADMIN
          </span>
        </span>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
        {sidebarLinks.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                isActive
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          );
        })}
      </div>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-border/40 shrink-0">
        <form action="/auth/signout" method="post">
          <button className="flex items-center justify-center gap-3 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl w-full transition-colors">
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </form>
      </div>
    </div>
  );
}
