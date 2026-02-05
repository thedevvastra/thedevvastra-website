import { getActiveDeals, getProductsForDealSelector } from "./actions";
import { DealSheet } from "@/components/admin/deals/deal-sheet";
import { AlertCircle, Package2 } from "lucide-react";
import { DealCard } from "@/components/admin/deals/deal-card"; // ✅ Import new component

export default async function TodaysDealPage() {
  const [activeDeals, allProducts] = await Promise.all([
    getActiveDeals(),
    getProductsForDealSelector(),
  ]);

  const activeIds = activeDeals.map((d) => d.productId);

  return (
    <div className="space-y-6">
      {/* --- Header Section --- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Today's Deals
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage flash sales and exclusive 24-hour offers.
          </p>
        </div>
        <DealSheet allProducts={allProducts} activeDealIds={activeIds} />
      </div>

      {/* --- Info Banner --- */}
      <div className="flex items-start gap-3 p-3 bg-blue-50/50 border border-blue-100 rounded-lg text-sm text-blue-700">
        <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
        <div>
          <p className="font-medium">How it works</p>
          <p className="opacity-90 text-xs mt-0.5">
            Products added here will appear in the "Flash Sale" section on the
            homepage. They automatically expire after 24 hours.
          </p>
        </div>
      </div>

      {/* --- Active Deals Grid --- */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {activeDeals.length === 0 ? (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-center border-2 border-dashed rounded-xl bg-muted/10">
            <div className="h-12 w-12 bg-muted rounded-full flex items-center justify-center mb-3">
              <Package2 className="h-6 w-6 text-muted-foreground/60" />
            </div>
            <h3 className="text-base font-semibold text-foreground">
              No Active Deals
            </h3>
            <p className="text-sm text-muted-foreground max-w-xs mt-1">
              Your flash sale section is empty. Click "Manage Deals" to add
              products.
            </p>
          </div>
        ) : (
          activeDeals.map((deal) => (
            // ✅ Use the new DealCard Component
            <DealCard key={deal.id} deal={deal} />
          ))
        )}
      </div>
    </div>
  );
}
