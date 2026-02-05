"use client";

import Link from "next/link";
import { ChevronRight, TrendingUp } from "lucide-react";
import { ProductCard } from "@/components/shop/product-card";

interface MostSellingSectionProps {
  products: any[];
  wishlistIds: string[];
}

export function MostSellingSection({
  products,
  wishlistIds,
}: MostSellingSectionProps) {
  if (!products || products.length === 0) return null;

  return (
    <section className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <div className="h-8 w-1 bg-primary rounded-full" />
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            Our Most Selling Products{" "}
            <TrendingUp className="h-5 w-5 text-amber-500" />
          </h2>
        </div>

        <Link
          href="/most-selling-products"
          className="group flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
        >
          View All
          <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {/* Product Grid (3 Rows Logic) 
         - Mobile: 2 cols
         - Tablet: 3 cols
         - Desktop: 4 cols
         - Large: 6 cols
      */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-8">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            isWishlisted={wishlistIds.includes(product.id)}
          />
        ))}
      </div>
    </section>
  );
}
