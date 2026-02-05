import {
  getCategoryPageData,
  getFilterMetadata,
  getUserWishlistIds,
} from "@/app/(shop)/actions";
import { ProductCard } from "@/components/shop/product-card";
import { ProductFilters } from "@/components/shop/product-filters";
import { ProductSort } from "@/components/shop/product-sort";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

export const dynamic = "force-dynamic";

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<any>;
}) {
  const { slug } = await params;
  const urlParams = await searchParams;

  // Parallel Fetching
  const [data, metadata, wishlistIds] = await Promise.all([
    getCategoryPageData(slug, urlParams),
    getFilterMetadata(),
    getUserWishlistIds(),
  ]);

  if (!data) return notFound();
  const { category, products } = data;

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* --- Header Section (Breadcrumb + Title) --- */}
      <div className="bg-muted/10 border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground font-medium capitalize">
              {category.name}
            </span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {category.name} Collection
          </h1>
          {category.description && (
            <p className="text-muted-foreground mt-2 max-w-2xl text-sm">
              {category.description}
            </p>
          )}

          {/* Subcategories Pills */}
          {category.children && category.children.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-6">
              {category.children.map((sub: any) => (
                <Link key={sub.id} href={`/category/${slug}/${sub.slug}`}>
                  <span className="px-4 py-1.5 rounded-full border bg-background hover:border-primary hover:text-primary transition-colors text-xs font-medium uppercase tracking-wide">
                    {sub.name}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* --- Main Content --- */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8 relative">
          {/* Left Sidebar (Desktop) */}
          <aside className="hidden lg:block w-64 shrink-0 space-y-8">
            <div className="sticky top-24">
              <ProductFilters metadata={metadata} />
            </div>
          </aside>

          {/* Right Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sticky top-[60px] sm:static bg-background z-20 py-2 sm:py-0">
              {/* Mobile Filter */}
              <div className="lg:hidden w-full sm:w-auto">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="w-full gap-2">
                      <Filter className="h-4 w-4" /> Filters
                    </Button>
                  </SheetTrigger>
                  {/* ✅ FIX: Added Padding (p-6), Header, and Responsive Width */}
                  <SheetContent
                    side="left"
                    className="w-[85vw] sm:w-[350px] overflow-y-auto p-6"
                  >
                    <SheetHeader className="mb-4 text-left">
                      <SheetTitle className="text-xl font-bold">
                        Category Filters
                      </SheetTitle>
                      <SheetDescription>
                        Select options to filter {category.name} products.
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
                results
              </div>

              <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
                <span className="text-sm font-bold text-foreground sm:hidden">
                  {products.length} items
                </span>
                <ProductSort />
              </div>
            </div>

            <Separator className="lg:hidden mb-6" />

            {products.length === 0 ? (
              <div className="py-20 text-center flex flex-col items-center justify-center border-2 border-dashed rounded-xl bg-muted/5">
                <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4">
                  <Filter className="h-6 w-6 text-muted-foreground" />
                </div>
                <h2 className="text-lg font-semibold text-foreground">
                  No Products Found
                </h2>
                <p className="text-sm text-muted-foreground mt-1 max-w-xs mx-auto">
                  Try adjusting filters.
                </p>
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
