"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  Heart,
  ShoppingBag,
  LayoutGrid,
  ChevronDown,
  Gift,
  Instagram,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { UserNav } from "./user-nav";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useShopStore } from "@/store/cart-store";
import { getUserCounts } from "@/app/(shop)/actions";
import { getContactSettings } from "@/app/(admin)/admin/settings/contact/actions";
import { useRouter } from "next/navigation";

/* eslint-disable  @typescript-eslint/no-explicit-any */
interface DesktopNavProps {
  user: any;
  categories: any[];
}

export function DesktopNav({ user, categories }: DesktopNavProps) {
  const router = useRouter();
  const { cartCount, wishlistCount, setCounts } = useShopStore();

  // ✅ State for Dynamic Link
  const [instagramUrl, setInstagramUrl] = useState("https://instagram.com");

  // 1. Fetch User Counts
  useEffect(() => {
    if (user) {
      getUserCounts().then((data) => {
        setCounts(data.cart, data.wishlist);
      });
    }
  }, [user, setCounts]);

  // ✅ 2. Fetch Contact Settings (Instagram URL)
  useEffect(() => {
    async function fetchSettings() {
      const settings = await getContactSettings();
      if (settings?.instagram) {
        setInstagramUrl(settings.instagram);
      }
    }
    fetchSettings();
  }, []);

  return (
    <header className="hidden md:block w-full border-b bg-card sticky top-0 z-50">
      {/* --- TOP ROW: Logo, Search, Icons --- */}
      <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-8">
        {/* Left: Logo Area */}
        <Link href="/" className="flex items-center gap-3 shrink-0">
          {/* Round Icon Logo */}
          <div className="relative h-12 w-12 overflow-hidden rounded-full border border-primary/20">
            <Image
              src="/logo.webp?v=2"
              alt="Logo"
              width={48}
              height={48}
              className="object-contain"
              priority
              unoptimized
            />
          </div>

          {/* ✅ FIX: Replaced Text with Brand Image */}
          {/* Make sure to upload 'brand-text.png' in public folder */}
          <div className="relative h-10 w-48">
            <Image
              src="/text-logo.webp" // Yahan apni text wali image ka naam likhein
              alt="The Dev Vastra"
              fill
              className="object-contain object-left" // object-left se logo ke paas chipak ke rahega
              priority
              unoptimized
            />
          </div>
        </Link>

        {/* Center: Search Bar */}
        <div className="flex-1 max-w-2xl relative">
          <Input
            placeholder="Search for any product or brand..."
            className="w-full h-11 pl-5 pr-12 rounded-full border-primary/20 bg-background/50 focus-visible:ring-primary/30 transition-all cursor-text"
            readOnly
            onClick={() => router.push("/search")}
            onFocus={() => router.push("/search")}
          />
          <div className="absolute right-1 top-1 h-9 w-9 bg-primary rounded-full flex items-center justify-center cursor-pointer hover:bg-primary/90 transition-colors">
            <Search className="h-4 w-4 text-white" />
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-4 shrink-0">
          {/* Wishlist Icon */}
          <Link href="/wishlist" className="relative group">
            <div className="p-2 rounded-full hover:bg-primary/10 transition-colors">
              <Heart className="h-6 w-6 text-foreground/80 group-hover:text-primary transition-colors" />
            </div>
            {wishlistCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center rounded-full bg-primary text-[10px] text-white p-0 border-2 border-card animate-in zoom-in">
                {wishlistCount}
              </Badge>
            )}
          </Link>

          {/* Cart Icon */}
          <Link href="/cart" className="relative group mr-2">
            <div className="p-2 rounded-full hover:bg-primary/10 transition-colors">
              <ShoppingBag className="h-6 w-6 text-foreground/80 group-hover:text-primary transition-colors" />
            </div>
            {cartCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center rounded-full bg-primary text-[10px] text-white p-0 border-2 border-card animate-in zoom-in">
                {cartCount}
              </Badge>
            )}
          </Link>

          <UserNav user={user} />
        </div>
      </div>

      <Separator className="bg-border/40" />

      {/* --- BOTTOM ROW: Categories & Links --- */}
      <div className="container mx-auto px-4 py-3 flex items-center justify-between text-sm">
        <div className="flex items-center gap-6">
          {/* All Categories Link */}
          <Link
            href="/categories"
            className="flex items-center gap-2 text-primary font-semibold cursor-pointer hover:text-primary/80 transition-colors"
          >
            <LayoutGrid className="h-4 w-4" />
            <span>All Categories</span>
          </Link>

          <div className="h-4 w-[1px] bg-border" />

          {/* Dynamic Categories Mapping */}
          <nav className="flex items-center gap-6">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="group relative flex items-center gap-1 cursor-pointer font-medium text-muted-foreground hover:text-primary transition-colors py-2"
              >
                <Link
                  href={`/category/${cat.slug}`}
                  className="flex items-center gap-1"
                >
                  {cat.name}
                  {cat.children && cat.children.length > 0 && (
                    <ChevronDown className="h-3 w-3 transition-transform group-hover:rotate-180" />
                  )}
                </Link>

                {/* Subcategories Dropdown */}
                {cat.children && cat.children.length > 0 && (
                  <div className="absolute top-full left-0 mt-0 pt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                    <div className="bg-card border shadow-lg rounded-xl p-2 overflow-hidden">
                      {cat.children.map((sub: any) => (
                        <Link
                          key={sub.id}
                          href={`/category/${cat.slug}/${sub.slug}`}
                          className="block px-3 py-2.5 hover:bg-muted/50 rounded-lg text-sm text-foreground transition-colors"
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* Right Side Links */}
        <div className="flex items-center gap-6">
          <Link
            href="/deals"
            className="flex items-center gap-2 text-red-600 font-medium hover:text-red-700 transition-colors"
          >
            <Gift className="h-4 w-4" />
            Best Deals
          </Link>

          <div className="h-4 w-[1px] bg-border" />

          {/* ✅ Dynamic Instagram Link */}
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-primary font-medium group"
          >
            <Instagram className="h-4 w-4 group-hover:text-pink-600 transition-colors" />
            <span className="group-hover:translate-x-1 transition-transform">
              Follow us
            </span>
          </a>
        </div>
      </div>
    </header>
  );
}
