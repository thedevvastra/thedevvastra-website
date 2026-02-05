import { Metadata } from "next";
import { redirect } from "next/navigation";
import { Heart } from "lucide-react";

import { createClient } from "@/utils/supabase/server";
import { getWishlistItems } from "./actions";
import { WishlistClient } from "@/components/wishlist/wishlist-client";

export const metadata: Metadata = {
  title: "My Wishlist | The Dev Vastra",
  description: "View and manage your saved products.",
};

export const dynamic = "force-dynamic"; // Ensure fresh data

export default async function WishlistPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Redirect to login if not authenticated
  if (!user) {
    redirect("/login?next=/wishlist");
  }

  // Fetch Data
  const wishlistItems = await getWishlistItems();

  return (
    <div className="container mx-auto px-4 py-8 space-y-8 min-h-[60vh]">
      {/* Page Header */}
      <div className="flex flex-col gap-2 border-b pb-6">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Heart className="h-6 w-6 text-primary fill-primary/20" />
          </div>
          My Wishlist
        </h1>
        <p className="text-muted-foreground ml-1">
          {wishlistItems.length} {wishlistItems.length === 1 ? "item" : "items"}{" "}
          saved for later
        </p>
      </div>

      {/* Client Component for Grid & Logic */}
      <WishlistClient initialItems={wishlistItems} />
    </div>
  );
}
