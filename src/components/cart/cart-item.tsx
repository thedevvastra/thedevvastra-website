"use client";

import Image from "next/image";
import { Minus, Plus, Trash2, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface CartItemProps {
  item: any;
  isPending: boolean;
  onUpdateQuantity: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
  onMoveToWishlist: (id: string, productId: string) => void;
}

export function CartItem({
  item,
  isPending,
  onUpdateQuantity,
  onRemove,
  onMoveToWishlist,
}: CartItemProps) {
  const { id, quantity, product, size, color } = item;

  return (
    <div className="group relative flex gap-3 sm:gap-4 p-3 sm:p-4 border rounded-2xl bg-card hover:shadow-md transition-all duration-300">
      {/* Product Image */}
      <div className="relative h-20 w-20 sm:h-28 sm:w-28 rounded-xl overflow-hidden bg-muted border shrink-0">
        <Image
          src={product.thumbnailUrl}
          alt={product.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Product Details */}
      <div className="flex-1 flex flex-col justify-between py-0.5 sm:py-1 min-w-0">
        <div className="space-y-1">
          <div className="flex justify-between items-start gap-2">
            <h3 className="font-semibold text-sm sm:text-base text-foreground line-clamp-1 break-all pr-0 sm:pr-4">
              {product.title}
            </h3>

            {/* Desktop Price */}
            <div className="text-right hidden sm:block shrink-0">
              <span className="block font-bold text-lg">
                ₹{product.sellingPrice * quantity}
              </span>
              {product.oldPrice && (
                <span className="text-xs text-muted-foreground line-through">
                  ₹{product.oldPrice * quantity}
                </span>
              )}
            </div>
          </div>

          <p className="text-[10px] sm:text-xs text-muted-foreground font-medium uppercase tracking-wide truncate">
            {product.brand?.name || "Generic"}
          </p>

          <div className="flex flex-wrap gap-1.5 sm:gap-2 pt-0.5">
            {size && (
              <Badge
                variant="secondary"
                className="text-[10px] font-medium px-1.5 py-0 rounded-md bg-muted/50 border-0 h-5"
              >
                Size: {size}
              </Badge>
            )}
            {color && (
              <Badge
                variant="secondary"
                className="text-[10px] font-medium px-1.5 py-0 rounded-md bg-muted/50 border-0 h-5"
              >
                Color: {color}
              </Badge>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-between items-end pt-2 sm:pt-3 mt-auto">
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="flex items-center border rounded-lg bg-background h-7 sm:h-9 shadow-sm">
              <button
                disabled={quantity <= 1 || isPending}
                onClick={() => onUpdateQuantity(id, quantity - 1)}
                className="w-7 sm:w-9 flex items-center justify-center hover:bg-muted h-full disabled:opacity-30 text-muted-foreground transition-colors"
              >
                <Minus className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              </button>
              <span className="w-6 sm:w-8 text-center text-xs sm:text-sm font-semibold">
                {quantity}
              </span>
              <button
                disabled={isPending}
                onClick={() => onUpdateQuantity(id, quantity + 1)}
                className="w-7 sm:w-9 flex items-center justify-center hover:bg-muted h-full disabled:opacity-30 text-muted-foreground transition-colors"
              >
                <Plus className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              </button>
            </div>

            <Separator
              orientation="vertical"
              className="h-4 sm:h-5 hidden xs:block"
            />

            {/* Action Buttons (Icons only on mobile) */}
            <div className="flex items-center gap-1 sm:gap-4">
              <button
                onClick={() => onRemove(id)}
                className="p-1.5 sm:p-0 text-xs font-medium text-muted-foreground hover:text-red-600 flex items-center gap-1.5 transition-colors rounded-md hover:bg-red-50 sm:hover:bg-transparent"
              >
                <Trash2 className="h-4 w-4" />{" "}
                <span className="hidden sm:inline">Remove</span>
              </button>

              <button
                onClick={() => onMoveToWishlist(id, product.id)}
                className="p-1.5 sm:p-0 text-xs font-medium text-muted-foreground hover:text-primary flex items-center gap-1.5 transition-colors rounded-md hover:bg-primary/10 sm:hover:bg-transparent"
              >
                <Heart className="h-4 w-4" />{" "}
                <span className="hidden sm:inline">Save</span>
              </button>
            </div>
          </div>

          {/* Mobile Price (Fixed Alignment) */}
          <div className="text-right sm:hidden shrink-0 ml-2">
            <span className="block font-bold text-sm">
              ₹{product.sellingPrice * quantity}
            </span>
            {product.oldPrice && (
              <span className="block text-[10px] text-muted-foreground line-through">
                ₹{product.oldPrice * quantity}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
