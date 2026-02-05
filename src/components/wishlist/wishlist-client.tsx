"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  Trash2,
  HeartOff,
  ArrowRight,
  Loader2,
  Zap,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

import {
  removeFromWishlist,
  moveFromWishlistToCart,
} from "@/app/(shop)/wishlist/actions";

interface WishlistClientProps {
  initialItems: any[];
}

export function WishlistClient({ initialItems }: WishlistClientProps) {
  const [items, setItems] = useState(initialItems);
  const [isPending, startTransition] = useTransition();
  const [movingId, setMovingId] = useState<string | null>(null);

  // Delete State
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // ✅ Variant Selection State
  const [selectionItem, setSelectionItem] = useState<any | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  // --- Handle Remove ---
  const handleRemove = () => {
    if (!deleteId) return;
    setIsDeleting(true);

    startTransition(async () => {
      const res = await removeFromWishlist(deleteId);
      if (res?.error) {
        toast.error(res.error);
      } else {
        setItems((prev) => prev.filter((item) => item.id !== deleteId));
        toast.success("Removed from wishlist");
      }
      setIsDeleting(false);
      setDeleteId(null);
    });
  };

  // --- Initial Click Handler ---
  const handleAddToCartClick = (item: any) => {
    const hasSizes = item.product.sizes && item.product.sizes.length > 0;
    const hasColors = item.product.colors && item.product.colors.length > 0;

    // Check logic: Agar variants exist karte hain, to Popup kholo
    if (hasSizes || hasColors) {
      setSelectionItem(item);
      setSelectedSize(null);
      setSelectedColor(null);
    } else {
      // Agar variants nahi hain (Simple product), to direct add karo
      executeMoveToCart(item.id, item.product.id, null, null);
    }
  };

  // --- Final Execution ---
  const executeMoveToCart = (
    wishlistId: string,
    productId: string,
    size: string | null,
    color: string | null,
  ) => {
    setMovingId(wishlistId);
    setSelectionItem(null); // Close popup if open

    startTransition(async () => {
      const res = await moveFromWishlistToCart(
        wishlistId,
        productId,
        size,
        color,
      );

      if (res?.success) {
        setItems((prev) => prev.filter((item) => item.id !== wishlistId));
        toast.success("Product moved to cart!");
      } else {
        toast.error(res?.error || "Failed to add to cart");
      }
      setMovingId(null);
    });
  };

  // --- EMPTY STATE ---
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
        <div className="bg-muted/30 p-8 rounded-full">
          <HeartOff className="h-16 w-16 text-muted-foreground/50" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">
            Your wishlist is empty
          </h2>
          <p className="text-muted-foreground max-w-sm mx-auto">
            Looks like you haven't added anything to your wishlist yet.
          </p>
        </div>
        <Link href="/">
          <Button size="lg" className="group">
            Start Shopping
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        <AnimatePresence>
          {items.map((item) => {
            const { id, product, deal } = item;
            return (
              <motion.div
                key={id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
                className="group relative bg-card border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col"
              >
                {/* Image */}
                <div className="relative aspect-[3/4] w-full bg-muted overflow-hidden">
                  <Image
                    src={product.thumbnailUrl}
                    alt={product.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Badges */}
                  <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
                    {deal && (
                      <Badge className="bg-red-600 hover:bg-red-700 text-[10px] px-1.5 py-0 h-5 gap-1 shadow-sm animate-pulse">
                        <Zap className="w-3 h-3 fill-white" /> DEAL
                      </Badge>
                    )}
                    {product.stock <= 0 ? (
                      <Badge
                        variant="destructive"
                        className="text-[10px] px-1.5 py-0 h-5"
                      >
                        Out of Stock
                      </Badge>
                    ) : product.oldPrice ? (
                      <Badge className="bg-green-600 hover:bg-green-700 text-[10px] px-1.5 py-0 h-5">
                        Sale
                      </Badge>
                    ) : null}
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setDeleteId(id);
                    }}
                    className="absolute top-2 right-2 h-7 w-7 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-sm text-muted-foreground hover:text-red-600 hover:bg-white transition-all shadow-sm z-20"
                    title="Remove"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-3 flex flex-col gap-1.5 flex-1">
                  <div>
                    <h3
                      className="font-medium text-sm line-clamp-1"
                      title={product.title}
                    >
                      {product.title}
                    </h3>
                    <p className="text-[10px] text-muted-foreground line-clamp-1">
                      {product.brand?.name || "Generic"}
                    </p>
                  </div>

                  <div className="flex items-baseline gap-1.5">
                    <span className="font-bold text-sm">
                      ₹{product.sellingPrice}
                    </span>
                    {product.oldPrice && (
                      <span className="text-[10px] text-muted-foreground line-through decoration-muted-foreground/60">
                        ₹{product.oldPrice}
                      </span>
                    )}
                  </div>

                  {/* Add to Cart Button */}
                  <div className="mt-auto pt-2">
                    <Button
                      onClick={() => handleAddToCartClick(item)} // ✅ Calls Logic
                      className="w-full h-8 text-xs gap-1.5"
                      size="sm"
                      disabled={product.stock <= 0 || isPending}
                    >
                      {movingId === id ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <ShoppingCart className="h-3 w-3" />
                      )}
                      {product.stock <= 0 ? "No Stock" : "Add to Cart"}
                    </Button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* ✅ VARIANT SELECTION POPUP (DIALOG) */}
      <Dialog
        open={!!selectionItem}
        onOpenChange={(open) => !open && setSelectionItem(null)}
      >
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Select Options</DialogTitle>
            <DialogDescription>
              Please choose your preferred size and color for{" "}
              <b>{selectionItem?.product.title}</b>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* SIZES */}
            {selectionItem?.product.sizes?.length > 0 && (
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase text-muted-foreground">
                  Select Size
                </Label>
                <div className="flex flex-wrap gap-2">
                  {selectionItem.product.sizes.map((size: string) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={cn(
                        "px-3 py-1.5 border text-sm rounded-md transition-all",
                        selectedSize === size
                          ? "border-primary bg-primary text-primary-foreground ring-1 ring-primary"
                          : "border-input hover:bg-accent hover:text-accent-foreground",
                      )}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* COLORS */}
            {selectionItem?.product.colors?.length > 0 && (
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase text-muted-foreground">
                  Select Color
                </Label>
                <div className="flex flex-wrap gap-2">
                  {selectionItem.product.colors.map((c: any) => (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColor(c.name)}
                      className={cn(
                        "group relative h-8 w-8 rounded-full border shadow-sm flex items-center justify-center transition-all",
                        selectedColor === c.name
                          ? "ring-2 ring-offset-2 ring-primary scale-110"
                          : "hover:scale-105",
                      )}
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                    >
                      {/* Only show name if color is white/transparent for visibility, or tooltip */}
                      <span className="sr-only">{c.name}</span>
                    </button>
                  ))}
                </div>
                {selectedColor && (
                  <p className="text-xs text-muted-foreground">
                    Selected: {selectedColor}
                  </p>
                )}
              </div>
            )}
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="ghost" onClick={() => setSelectionItem(null)}>
              Cancel
            </Button>
            <Button
              onClick={() =>
                executeMoveToCart(
                  selectionItem.id,
                  selectionItem.product.id,
                  selectedSize,
                  selectedColor,
                )
              }
              disabled={
                (selectionItem?.product.sizes?.length > 0 && !selectedSize) ||
                (selectionItem?.product.colors?.length > 0 && !selectedColor)
              }
            >
              Confirm & Move
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DELETE CONFIRMATION */}
      <AlertDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove from Wishlist?</AlertDialogTitle>
            <AlertDialogDescription>Are you sure?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleRemove();
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Removing..." : "Remove"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
