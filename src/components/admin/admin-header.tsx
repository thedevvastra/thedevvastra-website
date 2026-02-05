"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Bell, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden"; // Accessibility fix
import { AdminSidebar } from "./admin-sidebar"; // Ensure filename matches (sidebar.tsx vs admin-sidebar.tsx)

export function AdminHeader({ user }: { user: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Route change hone pe sidebar close kar do
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <div className="flex items-center justify-between w-full">
      {/* LEFT SIDE: Hamburger (Mobile) + Welcome Text */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* ✅ Hamburger Menu for Mobile */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden shrink-0">
              <Menu className="h-5 w-5 text-muted-foreground" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-72 border-r-0">
            {/* Accessibility Title */}
            <VisuallyHidden.Root>
              <SheetTitle>Navigation Menu</SheetTitle>
            </VisuallyHidden.Root>

            {/* Sidebar Component Inside Sheet */}
            <AdminSidebar />
          </SheetContent>
        </Sheet>

        {/* Welcome Text (Adjusted for mobile) */}
        <h2 className="text-sm font-medium text-muted-foreground truncate max-w-[150px] md:max-w-none">
          <span className="hidden md:inline">Welcome back, </span>
          <span className="md:hidden">Hi, </span>
          <span className="text-foreground font-semibold">Admin</span>
        </h2>
      </div>

      {/* RIGHT SIDE: Icons & Profile */}
      <div className="flex items-center gap-2 md:gap-4">
        <Button variant="ghost" size="icon" className="rounded-full">
          <Bell className="h-5 w-5 text-muted-foreground" />
        </Button>
        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary border border-primary/20">
          {user?.email?.charAt(0).toUpperCase() || "A"}
        </div>
      </div>
    </div>
  );
}
