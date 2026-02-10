"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  Home,
  LayoutGrid,
  User,
  ShoppingBag,
  Heart,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useShopStore } from "@/store/cart-store";
import { getUserCounts } from "@/app/(shop)/actions";
import { useRouter } from "next/navigation";

/* eslint-disable  @typescript-eslint/no-explicit-any */

export function MobileNav({ user }: { user: any }) {
  const router = useRouter();
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  const { cartCount, wishlistCount, setCounts } = useShopStore();

  useEffect(() => {
    if (user) {
      getUserCounts().then((data) => {
        setCounts(data.cart, data.wishlist);
      });
    }
  }, [user, setCounts]);

  return (
    <div className="md:hidden">
      {/* --- TOP BAR (Fixed) --- */}
      <div className="fixed top-0 left-0 right-0 bg-card/95 backdrop-blur-md z-50 px-4 py-3 shadow-sm border-b border-border/40">
        {/* ✅ FIX: Header Layout (Left-Center-Right) */}
        <div className="relative flex items-center justify-between mb-3">
          {/* 1. Left: Round Logo Only */}
          <Link href="/" className="shrink-0 z-10">
            <div className="relative h-12 w-12 overflow-hidden rounded-full border border-primary/20 flex items-center justify-center bg-white shadow-sm">
              <Image
                src="/logo.webp"
                alt="Logo"
                width={56}
                height={56}
                className="object-contain"
                priority
              />
            </div>
          </Link>

          {/* 2. Center: Brand Text Image (Absolute Positioned) */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0">
            <Link href="/">
              <div className="relative h-10 w-40">
                <Image
                  src="/text-logo.webp"
                  alt="The Dev Vastra"
                  fill
                  className="object-contain"
                  priority
                  unoptimized
                />
              </div>
            </Link>
          </div>

          {/* 3. Right: Wishlist Icon */}
          <Link href="/wishlist" className="relative p-1 z-10">
            <Heart className="h-7 w-7 text-foreground/80" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center rounded-full bg-primary text-[10px] text-white border-2 border-card font-bold">
                {wishlistCount}
              </span>
            )}
          </Link>
        </div>

        {/* Mobile Search */}
        <div className="relative w-full">
          <Input
            placeholder="Search for any product..."
            className="w-full h-10 pl-4 pr-10 rounded-full bg-background border-primary/10 text-xs"
            readOnly
            onClick={() => router.push("/search")}
            onFocus={() => router.push("/search")}
          />
          <Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
        </div>
      </div>

      {/* Spacer */}
      <div className="h-32" />

      {/* --- BOTTOM NAV (Floating Pill) --- */}
      <div className="fixed bottom-6 left-4 right-4 z-50">
        <div className="bg-primary text-primary-foreground backdrop-blur-lg shadow-2xl rounded-full h-16 flex items-center justify-around px-2 border border-primary/20">
          <Link
            href="/"
            className={cn(
              "flex flex-col items-center justify-center w-12 h-12 rounded-full transition-all",
              isActive("/") ? "bg-white/20" : "",
            )}
          >
            <Home className="h-5 w-5" />
          </Link>

          <Link
            href="/categories"
            className={cn(
              "flex flex-col items-center justify-center w-12 h-12 rounded-full transition-all",
              isActive("/categories") ? "bg-white/20" : "",
            )}
          >
            <LayoutGrid className="h-5 w-5" />
          </Link>

          {/* User Icon */}
          <Link
            href={user ? "/account" : "/login"}
            className={cn(
              "flex flex-col items-center justify-center w-12 h-12 rounded-full transition-all",
              isActive("/account") ? "bg-white/20" : "",
            )}
          >
            <User className="h-5 w-5" />
          </Link>

          {/* Cart Icon */}
          <Link
            href="/cart"
            className={cn(
              "relative flex flex-col items-center justify-center w-12 h-12 rounded-full transition-all",
              isActive("/cart") ? "bg-white/20" : "",
            )}
          >
            <ShoppingBag className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute top-2 right-2 h-4 w-4 flex items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white border-2 border-primary">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </div>
  );
}
