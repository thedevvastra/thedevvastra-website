import {
  getFilteredProducts,
  getFilterMetadata,
  getUserWishlistIds,
} from "@/app/(shop)/actions";
import { ProductCard } from "@/components/shop/product-card";
import { ProductFilters } from "@/components/shop/product-filters";
import { ProductSort } from "@/components/shop/product-sort";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Filter } from "lucide-react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export const dynamic = "force-dynamic";

export default async function AllProductsPage({
  searchParams,
}: {
  searchParams: Promise<any>;
}) {
  const params = await searchParams;

  // ✅ Parallel Fetching: Products, Metadata & Wishlist Status
  const [products, metadata, wishlistIds] = await Promise.all([
    getFilteredProducts(params),
    getFilterMetadata(),
    getUserWishlistIds(), // Added for heart icon logic
  ]);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* --- Breadcrumb --- */}
      <div className="bg-muted/10 border-b">
        <div className="container mx-auto px-4 py-3 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="font-medium text-foreground">All Products</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8 relative">
          {/* --- LEFT: Sidebar (Desktop) --- */}
          <aside className="hidden lg:block w-64 shrink-0 space-y-8">
            <div className="sticky top-24">
              <ProductFilters metadata={metadata} />
            </div>
          </aside>

          {/* --- RIGHT: Content Area --- */}
          <div className="flex-1">
            {/* Toolbar: Count + Sort + Mobile Filter */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sticky top-[60px] sm:static bg-background z-20 py-2 sm:py-0">
              {/* Mobile Filter Button */}
              <div className="lg:hidden w-full sm:w-auto">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="w-full gap-2">
                      <Filter className="h-4 w-4" /> Filters & Categories
                    </Button>
                  </SheetTrigger>
                  {/* ✅ FIX: Added Padding (p-6), Header, and Responsive Width */}
                  <SheetContent
                    side="left"
                    className="w-[85vw] sm:w-[350px] overflow-y-auto p-6"
                  >
                    <SheetHeader className="mb-4 text-left">
                      <SheetTitle className="text-xl font-bold">
                        Filter Products
                      </SheetTitle>
                      <SheetDescription>
                        Refine your search results.
                      </SheetDescription>
                    </SheetHeader>
                    <ProductFilters metadata={metadata} />
                  </SheetContent>
                </Sheet>
              </div>

              <div className="text-sm text-muted-foreground hidden sm:block">
                Showing{" "}
                <span className="font-bold text-foreground">
                  {products.length}
                </span>{" "}
                products
              </div>

              <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
                <span className="text-sm font-bold text-foreground sm:hidden">
                  {products.length} items
                </span>
                <ProductSort />
              </div>
            </div>

            <Separator className="lg:hidden mb-6" />

            {/* Product Grid */}
            {products.length === 0 ? (
              <div className="py-20 text-center flex flex-col items-center justify-center border-2 border-dashed rounded-xl">
                <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4">
                  <Filter className="h-6 w-6 text-muted-foreground" />
                </div>
                <h2 className="text-lg font-semibold text-foreground">
                  No Products Found
                </h2>
                <p className="text-sm text-muted-foreground mt-1 max-w-xs mx-auto">
                  Try adjusting your filters or search criteria.
                </p>
                <Link
                  href="/all-products"
                  className="mt-4 text-primary text-sm font-medium hover:underline"
                >
                  Clear All Filters
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
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
      </div>
    </div>
  );
}
