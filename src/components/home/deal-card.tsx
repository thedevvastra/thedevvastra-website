"use client";

import Link from "next/link";
import { WishlistButton } from "@/components/shop/wishlist-button";

interface DealCardProps {
  deal: any;
  user: any;
  isWishlisted: boolean;
}

export function DealCard({ deal, isWishlisted }: DealCardProps) {
  const product = deal.product;

  return (
    // ✅ FIX: Removed 'mx-auto' so cards sit next to each other in the slider
    <div className="group relative flex flex-col gap-3 min-w-[160px] max-w-[180px] md:min-w-[220px] md:max-w-[240px] snap-start">
      {/* --- Image Section --- */}
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-muted border">
        {/* Clickable Image */}
        <Link href={`/product/${product.id}`} className="block h-full w-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.thumbnailUrl}
            alt={product.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>

        {/* Wishlist Button */}
        <WishlistButton
          productId={product.id}
          initialIsWishlisted={isWishlisted}
          className="absolute top-2 right-2 z-10"
        />

        {/* Sale Badge */}
        <div className="absolute bottom-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm pointer-events-none">
          DEAL
        </div>
      </div>

      {/* --- Details Section --- */}
      <div className="flex flex-col gap-1">
        {product.brand && (
          <span className="text-[10px] md:text-xs font-bold text-muted-foreground uppercase tracking-wide">
            {product.brand.name}
          </span>
        )}

        {/* Clickable Title */}
        <Link href={`/product/${product.id}`}>
          <h3 className="font-medium text-sm md:text-base text-foreground line-clamp-1 group-hover:text-primary transition-colors cursor-pointer">
            {product.title}
          </h3>
        </Link>

        {/* Pricing */}
        <div className="flex items-baseline gap-2">
          <span className="font-bold text-base md:text-lg text-foreground">
            ₹{product.sellingPrice}
          </span>
          {product.oldPrice && (
            <span className="text-xs text-muted-foreground line-through decoration-red-500/50">
              ₹{product.oldPrice}
            </span>
          )}
        </div>

        {/* Colors */}
        {product.colors && product.colors.length > 0 && (
          <div className="flex items-center -space-x-1.5 mt-1">
            {product.colors.slice(0, 4).map((color: any, idx: number) => (
              <div
                key={idx}
                className="h-3 w-3 md:h-4 md:w-4 rounded-full border border-white shadow-sm ring-1 ring-border/20"
                style={{ backgroundColor: color.hex }}
              />
            ))}
            {product.colors.length > 4 && (
              <div className="h-3 w-3 md:h-4 md:w-4 rounded-full bg-muted flex items-center justify-center text-[8px] font-medium border border-white z-10">
                +{product.colors.length - 4}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
