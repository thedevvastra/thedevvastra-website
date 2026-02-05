import { Metadata } from "next";
import { redirect } from "next/navigation";
import { ShoppingBag } from "lucide-react";

import { createClient } from "@/utils/supabase/server";
import { getCartData } from "./actions";
import { CartClient } from "@/components/cart/cart-client";

export const metadata: Metadata = {
  title: "Shopping Cart | The Dev Vastra",
  description: "Review your items and proceed to checkout.",
};

export const dynamic = "force-dynamic";

export default async function CartPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Redirect if not logged in
  if (!user) {
    redirect("/login?next=/cart");
  }

  // Fetch Data
  const data = await getCartData();

  if (!data) return null;

  return (
    <div className="container mx-auto px-4 py-8 min-h-[70vh]">
      {/* Page Header */}
      <div className="flex items-center gap-3 border-b pb-6 mb-8">
        <div className="p-2 bg-primary/10 rounded-lg">
          <ShoppingBag className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Shopping Cart</h1>
        <span className="text-muted-foreground ml-2 text-sm bg-muted px-2 py-1 rounded-full">
          {data.cartItems.length} items
        </span>
      </div>

      {/* Main Content */}
      {/* ✅ FIX: 'settings' prop pass kiya */}
      <CartClient
        cartItems={data.cartItems}
        userProfile={data.userProfile}
        settings={data.settings}
      />
    </div>
  );
}
