"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag, Loader2, Zap, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ShareButton } from "./share-button";
import { WishlistButton } from "@/components/shop/wishlist-button";
import { DealCountdown } from "@/components/home/deal-countdown";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { addToCartAction } from "@/app/(shop)/actions";
import { useShopStore } from "@/store/cart-store";
import { cn } from "@/lib/utils";
import { StarRating } from "@/components/ui/star-rating";

// Import Dialogs
import { BuyNowDialog } from "@/components/product/buy-now/buy-now-dialog";
import { OrderSuccessDialog } from "@/components/product/buy-now/order-success-dialog";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

function formatCompactNumber(number: number) {
  if (number >= 100000)
    return (number / 100000).toFixed(1).replace(/\.0$/, "") + "L";
  if (number >= 1000)
    return (number / 1000).toFixed(1).replace(/\.0$/, "") + "k";
  return number.toString();
}

export function ProductInfo({
  product,
  activeDeal,
  user,
  isWishlisted,
  stats,
}: {
  product: any;
  activeDeal: any;
  user: any;
  isWishlisted: boolean;
  stats?: { average: string | number; total: number; distribution: number[] };
}) {
  const router = useRouter();
  const { incrementCart } = useShopStore();

  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // --- MODAL STATES ---
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successOrderId, setSuccessOrderId] = useState("");
  const [showValidationAlert, setShowValidationAlert] = useState(false);

  const averageRating = Number(stats?.average || 0);
  const totalRatings = stats?.total || 0;

  const hasColors = product.colors && product.colors.length > 0;
  const hasSizes = product.sizes && product.sizes.length > 0;
  const isSelectionComplete =
    (!hasColors || selectedColor) && (!hasSizes || selectedSize);

  // --- HANDLERS ---
  const handleAddToCart = async () => {
    if (!user) {
      toast.error("Please login to shop");
      return router.push("/login");
    }
    if (!isSelectionComplete) {
      toast.error("Please select both Color and Size");
      return;
    }
    setLoading(true);
    const res = await addToCartAction(
      product.id,
      1,
      selectedColor || undefined,
      selectedSize || undefined,
    );
    setLoading(false);
    if (res.error) toast.error(res.error);
    else {
      incrementCart();
      toast.success("Added to Cart");
    }
  };

  const handleBuyNow = () => {
    if (!user) {
      router.push(`/login?redirect=/product/${product.id}`);
      return;
    }
    if (!isSelectionComplete) {
      setShowValidationAlert(true);
      return;
    }
    setShowBuyModal(true);
  };

  // ✅ New Handler: Called when Order is Successful
  const handleOrderSuccess = (orderId: string) => {
    setShowBuyModal(false); // Close Buy Now
    setSuccessOrderId(orderId);
    // Thoda delay taaki transition smooth lage
    setTimeout(() => {
      setShowSuccessModal(true); // Open Success
    }, 300);
  };

  return (
    <div className="flex flex-col gap-5">
      <div>
        {product.brand && (
          <div className="text-xs font-bold text-primary tracking-wider uppercase mb-1">
            {product.brand.name}
          </div>
        )}
        <h1 className="text-2xl md:text-3xl font-bold text-foreground leading-tight">
          {product.title}
        </h1>
        <div className="flex items-center gap-2 mt-2">
          <div className="flex items-center gap-1 bg-green-50 px-2 py-0.5 rounded-md border border-green-100">
            <span className="text-sm font-bold text-green-700">
              {averageRating > 0 ? averageRating.toFixed(1) : "0.0"}
            </span>
            <StarRating rating={averageRating} size="sm" className="gap-0.5" />
          </div>
          <div className="h-4 w-[1px] bg-border mx-1" />
          <span className="text-sm text-muted-foreground">
            {formatCompactNumber(totalRatings)} Ratings
          </span>
        </div>
      </div>

      {activeDeal && (
        <div className="flex items-center gap-3 bg-red-50/50 border border-red-100 px-3 py-2 rounded-lg w-fit">
          <Badge
            variant="destructive"
            className="h-5 text-[10px] px-1.5 animate-pulse"
          >
            FLASH SALE
          </Badge>
          <div className="flex items-center gap-1.5 text-red-700 text-xs font-bold">
            Ends in: <DealCountdown expiresAt={activeDeal.expiresAt} />
          </div>
        </div>
      )}

      <div>
        <div className="flex items-end gap-2">
          <span className="text-3xl font-bold text-foreground">
            ₹{product.sellingPrice}
          </span>
          {product.oldPrice && (
            <span className="text-lg text-muted-foreground line-through mb-1">
              ₹{product.oldPrice}
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Inclusive of all taxes
        </p>
      </div>

      <Separator />

      {/* Colors & Sizes Logic (Same as before) */}
      <div className="space-y-4">
        {hasColors && (
          <div className="space-y-2">
            <span className="text-sm font-medium">
              Color:{" "}
              <span className="text-muted-foreground font-normal">
                {selectedColor || "Select One"}
              </span>
            </span>
            <div className="flex flex-wrap gap-2">
              {product.colors.map((col: any, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setSelectedColor(col.name)}
                  className={cn(
                    "h-8 w-8 rounded-full border-2 shadow-sm transition-all",
                    selectedColor === col.name
                      ? "ring-2 ring-primary ring-offset-2 border-primary"
                      : "border-transparent ring-1 ring-black/5",
                  )}
                  style={{ backgroundColor: col.hex }}
                  title={col.name}
                />
              ))}
            </div>
          </div>
        )}

        {hasSizes && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">
                Size:{" "}
                <span className="text-muted-foreground font-normal">
                  {selectedSize || "Select One"}
                </span>
              </span>
              <button className="text-xs text-primary underline underline-offset-2">
                Size Chart
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setSelectedSize(size)}
                  className={cn(
                    "min-w-[3rem] h-9 px-3 border rounded-md text-sm transition-colors",
                    selectedSize === size
                      ? "bg-primary text-primary-foreground border-primary"
                      : "hover:border-primary hover:bg-primary/5",
                  )}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3 mt-2">
        <Button
          size="lg"
          className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold text-base shadow-md transition-all active:scale-[0.99]"
          onClick={handleBuyNow}
        >
          <Zap className="mr-2 h-5 w-5 fill-current" /> Buy Now
        </Button>
        <div className="flex gap-3">
          <Button
            size="lg"
            onClick={handleAddToCart}
            disabled={loading}
            className="flex-1 h-11 text-sm font-semibold uppercase tracking-wide"
          >
            {loading ? (
              <Loader2 className="animate-spin h-4 w-4" />
            ) : (
              <ShoppingBag className="h-4 w-4 mr-2" />
            )}{" "}
            Add to Cart
          </Button>
          <WishlistButton
            productId={product.id}
            initialIsWishlisted={isWishlisted}
            className="h-11 w-11 rounded-lg border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground p-0"
          />
          <ShareButton
            title={product.title}
            url={typeof window !== "undefined" ? window.location.href : ""}
          />
        </div>
      </div>

      {/* --- MODALS --- */}

      {/* 1. Buy Now (Address & Payment) */}
      <BuyNowDialog
        isOpen={showBuyModal}
        onClose={() => setShowBuyModal(false)}
        product={{
          id: product.id,
          title: product.title,
          price: product.sellingPrice,
          image: product.thumbnailUrl,
        }}
        selection={{ color: selectedColor, size: selectedSize, quantity: 1 }}
        onOrderSuccess={handleOrderSuccess} // ✅ Pass handler
      />

      {/* 2. Success (Confetti) */}
      <OrderSuccessDialog
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        orderId={successOrderId}
      />

      <AlertDialog
        open={showValidationAlert}
        onOpenChange={setShowValidationAlert}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-orange-600">
              <AlertCircle className="h-5 w-5" /> Selection Required
            </AlertDialogTitle>
            <AlertDialogDescription>
              Please select your preferred{" "}
              <strong>{hasColors && "Color"}</strong>{" "}
              {hasColors && hasSizes && "and"}{" "}
              <strong>{hasSizes && "Size"}</strong> to proceed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowValidationAlert(false)}>
              Okay, I'll select
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
