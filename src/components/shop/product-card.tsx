"use client";

import Link from "next/link";
import { WishlistButton } from "@/components/shop/wishlist-button"; // ✅ Import

interface ProductCardProps {
  product: any;
  isWishlisted: boolean; // ✅ New Prop
}

export function ProductCard({ product, isWishlisted }: ProductCardProps) {
  const discount = product.oldPrice
    ? Math.round(
        ((product.oldPrice - product.sellingPrice) / product.oldPrice) * 100,
      )
    : 0;

  return (
    <Link
      href={`/product/${product.id}`}
      className="group relative flex flex-col gap-3 w-full min-w-[160px] max-w-[180px] md:min-w-[220px] md:max-w-[240px] cursor-pointer mx-auto"
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-muted border">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.thumbnailUrl}
          alt={product.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* ✅ Reusable Wishlist Button */}
        <WishlistButton
          productId={product.id}
          initialIsWishlisted={isWishlisted}
          className="absolute top-2 right-2"
        />

        {discount > 0 && (
          <div className="absolute bottom-2 left-2 bg-black/70 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm backdrop-blur-md">
            -{discount}% OFF
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1">
        {product.brand && (
          <span className="text-[10px] md:text-xs font-bold text-muted-foreground uppercase tracking-wide">
            {product.brand.name}
          </span>
        )}

        <h3 className="font-medium text-sm md:text-base text-foreground line-clamp-1 group-hover:text-primary transition-colors">
          {product.title}
        </h3>

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
      </div>
    </Link>
  );
}
