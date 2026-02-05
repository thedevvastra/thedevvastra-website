import {
  getMostSellingProducts,
  getUserWishlistIds,
} from "@/app/(shop)/actions";
import { ProductCard } from "@/components/shop/product-card";
import { TrendingUp, ChevronRight } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function MostSellingPage() {
  // Parallel Fetching
  const [products, wishlistIds] = await Promise.all([
    getMostSellingProducts(), // Fetch ALL (no limit)
    getUserWishlistIds(),
  ]);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Breadcrumb Header */}
      <div className="bg-amber-50/50 border-b border-amber-100">
        <div className="container mx-auto px-4 py-10">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground font-medium">Most Selling</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground flex items-center gap-3">
            Most Selling Products{" "}
            <TrendingUp className="h-8 w-8 text-amber-500 animate-pulse" />
          </h1>
          <p className="text-muted-foreground mt-3 max-w-2xl text-lg">
            Check out the most popular and trending items loved by our
            customers.
          </p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="container mx-auto px-4 py-12">
        {products.length === 0 ? (
          <div className="text-center py-20 bg-muted/20 rounded-2xl border border-dashed">
            <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold">No Trending Products Yet</h2>
            <p className="text-muted-foreground mt-1">
              Check back later for updates.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-8">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isWishlisted={wishlistIds.includes(product.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
