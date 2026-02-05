import { Metadata } from "next";
import { redirect } from "next/navigation";
import { PackageOpen, Search } from "lucide-react";
import Link from "next/link";

import { getUserOrders } from "./actions";
import { OrderCard } from "@/components/orders/order-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/utils/supabase/server";

export const metadata: Metadata = {
  title: "My Orders | The Dev Vastra",
  description: "View and track your order history.",
};

export default async function MyOrdersPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const orders = await getUserOrders();

  return (
    <div className="bg-muted/10 min-h-[calc(100vh-4rem)]">
      <div className="container max-w-5xl mx-auto py-8 px-4 sm:px-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Your Orders
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {orders.length > 0
                ? `You have placed ${orders.length} orders so far.`
                : "Check the status of recent orders, manage returns, and discover similar products."}
            </p>
          </div>

          {orders.length > 0 && (
            <div className="relative w-full sm:w-[300px]">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search within orders..."
                className="pl-9 bg-background"
              />
            </div>
          )}
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center bg-card border border-dashed rounded-xl shadow-sm">
            <div className="bg-primary/5 p-5 rounded-full mb-5">
              <PackageOpen className="h-12 w-12 text-primary/60" />
            </div>
            <h3 className="text-xl font-bold text-foreground">
              No orders placed yet
            </h3>
            <p className="text-muted-foreground mt-2 max-w-sm mx-auto">
              Looks like you haven&apos;t shopped with us yet. Browse our
              collections and find something you love!
            </p>
            <Link href="/" className="mt-8">
              <Button
                size="lg"
                className="rounded-full px-10 shadow-lg hover:shadow-xl transition-all font-semibold"
              >
                Start Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
