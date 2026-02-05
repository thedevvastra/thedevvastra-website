"use client";

import { useState, useTransition, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Truck, CheckCircle2, Copy } from "lucide-react";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel, // Needed for Delete Dialog
  AlertDialogHeader, // ✅ Added
  AlertDialogTitle, // ✅ Added
  AlertDialogDescription, // ✅ Added
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

import { CartItem } from "./cart-item";
import { OrderSummary } from "./order-summary";
import {
  updateCartQuantity,
  removeCartItem,
  moveToWishlist,
} from "@/app/(shop)/cart/actions";

interface CartClientProps {
  cartItems: any[];
  userProfile: any;
  settings: any;
}

export function CartClient({
  cartItems,
  userProfile,
  settings,
}: CartClientProps) {
  const [isPending, startTransition] = useTransition();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [orderSuccessId, setOrderSuccessId] = useState<string | null>(null);

  // Load Razorpay Script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handleUpdateQty = (id: string, qty: number) => {
    startTransition(async () => await updateCartQuantity(id, qty));
  };

  const handleRemove = () => {
    if (!deleteId) return;
    startTransition(async () => {
      await removeCartItem(deleteId);
      setDeleteId(null);
      toast.success("Item removed");
    });
  };

  const handleMoveToWishlist = (id: string, productId: string) => {
    startTransition(async () => {
      await moveToWishlist(id, productId);
      toast.success("Moved to wishlist");
    });
  };

  const handleOrderSuccess = (orderId: string) => {
    // Confetti Animation
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };
    const randomInRange = (min: number, max: number) =>
      Math.random() * (max - min) + min;

    const interval: any = setInterval(function () {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);
      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);

    setOrderSuccessId(orderId);
  };

  const copyOrderId = () => {
    if (orderSuccessId) {
      navigator.clipboard.writeText(orderSuccessId);
      toast.success("Order ID copied!");
    }
  };

  // EMPTY STATE
  if (cartItems.length === 0 && !orderSuccessId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 animate-in fade-in duration-500">
        <div className="relative w-48 h-48 opacity-10">
          <Image
            src="/empty-cart-illustration.svg"
            alt="Empty"
            fill
            className="object-contain"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <Truck className="h-24 w-24" />
          </div>
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight text-foreground/80">
            Your cart is empty
          </h2>
          <p className="text-muted-foreground text-base max-w-sm mx-auto">
            Looks like you haven't added anything to your cart yet. Discover our
            collections!
          </p>
        </div>
        <Link href="/">
          <Button
            size="lg"
            className="px-10 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all"
          >
            Start Shopping
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-8 items-start pb-20">
        {/* Left: Items */}
        <div className="flex-1 w-full space-y-6">
          <div className="flex items-center justify-between pb-2 border-b">
            <h1 className="text-2xl font-bold tracking-tight">
              Shopping Cart{" "}
              <span className="text-muted-foreground text-lg font-normal">
                ({cartItems.length} Items)
              </span>
            </h1>
          </div>

          <div className="space-y-4">
            {cartItems.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                isPending={isPending}
                onUpdateQuantity={handleUpdateQty}
                onRemove={(id) => setDeleteId(id)}
                onMoveToWishlist={handleMoveToWishlist}
              />
            ))}
          </div>
        </div>

        {/* Right: Summary */}
        <div className="lg:w-[400px] w-full shrink-0 flex flex-col gap-6 lg:sticky lg:top-24">
          <OrderSummary
            cartItems={cartItems}
            userProfile={userProfile}
            settings={settings}
            onOrderSuccess={handleOrderSuccess}
          />
        </div>
      </div>

      {/* ✅ UPGRADED SUCCESS MODAL (FIXED ACCESSIBILITY ERROR) */}
      <AlertDialog open={!!orderSuccessId}>
        <AlertDialogContent className="max-w-md p-0 overflow-hidden border-0 rounded-2xl shadow-2xl">
          {/* Header Graphic */}
          <div className="bg-gradient-to-b from-green-50 to-white pt-10 pb-6 px-6 flex flex-col items-center text-center">
            <div className="h-24 w-24 bg-green-100 rounded-full flex items-center justify-center shadow-sm animate-in zoom-in duration-300 ring-8 ring-green-50 mb-4">
              <CheckCircle2 className="h-12 w-12 text-green-600" />
            </div>

            {/* ✅ FIX: Wrapped in AlertDialogHeader & used Title/Description */}
            <AlertDialogHeader className="space-y-2">
              <AlertDialogTitle className="text-2xl font-bold text-foreground text-center">
                Order Placed Successfully!
              </AlertDialogTitle>
              <AlertDialogDescription className="text-muted-foreground text-sm px-4 text-center">
                Thank you for shopping with us. We've sent a confirmation email
                with details.
              </AlertDialogDescription>
            </AlertDialogHeader>
          </div>

          {/* Order Details Body */}
          <div className="px-6 pb-8 space-y-6 bg-white">
            <div className="bg-muted/30 border border-dashed border-muted-foreground/30 p-4 rounded-xl flex flex-col items-center gap-2">
              <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                Order ID
              </span>
              <div
                className="flex items-center gap-2 cursor-pointer group"
                onClick={copyOrderId}
                title="Click to copy"
              >
                <span className="text-xl font-mono font-bold text-primary">
                  {orderSuccessId}
                </span>
                <Copy className="h-4 w-4 text-muted-foreground opacity-50 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Link href="/">
                <Button
                  className="w-full h-12 text-base font-semibold shadow-lg shadow-primary/20 rounded-xl"
                  size="lg"
                >
                  Continue Shopping
                </Button>
              </Link>
              <Link href="/my-orders">
                <Button
                  variant="outline"
                  className="w-full h-12 text-base font-medium rounded-xl border-2 hover:bg-muted/50"
                >
                  Track Order
                </Button>
              </Link>
            </div>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* DELETE DIALOG (FIXED STRUCTURE) */}
      <AlertDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove from cart?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this item? You can move it to
              wishlist instead.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemove}
              className="bg-red-600 hover:bg-red-700"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
