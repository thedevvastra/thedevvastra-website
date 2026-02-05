import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { ProductCard } from "@/components/shop/product-card";

// ✅ Accept wishlistIds
export function LatestProducts({
  products,
  wishlistIds,
}: {
  products: any[];
  wishlistIds: string[];
}) {
  if (!products || products.length === 0) return null;

  return (
    <section className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">
          Our Latest Products
        </h2>
        <Link
          href="/all-products"
          className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          View All <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            isWishlisted={wishlistIds.includes(product.id)} // ✅ Check ID
          />
        ))}
      </div>
    </section>
  );
}
