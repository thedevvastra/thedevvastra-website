"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Copy, PackageSearch, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { Button } from "@/components/ui/button";
import { DialogTitle } from "@/components/ui/dialog";

export function SuccessStep({ orderId }: { orderId: string }) {
  const router = useRouter();

  useEffect(() => {
    // Trigger Confetti
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };
    const random = (min: number, max: number) =>
      Math.random() * (max - min) + min;

    const interval = window.setInterval(function () {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);
      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: random(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: random(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  const handleCopyId = () => {
    navigator.clipboard.writeText(orderId);
    toast.success("Order ID Copied!");
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center animate-in zoom-in-95">
      <VisuallyHidden.Root>
        <DialogTitle>Order Success</DialogTitle>
      </VisuallyHidden.Root>

      <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center mb-4 shadow-sm">
        <CheckCircle2 className="h-10 w-10 text-green-600" />
      </div>

      <h2 className="text-2xl font-bold text-foreground">
        Order Placed Successfully!
      </h2>
      <p className="text-muted-foreground mt-2 text-sm max-w-xs mx-auto">
        Thank you for shopping with us. Your order has been confirmed.
      </p>

      <div className="mt-6 flex items-center gap-2 bg-muted/40 border border-dashed border-primary/30 px-4 py-2 rounded-lg">
        <span className="text-xs font-semibold text-muted-foreground uppercase">
          Order ID:
        </span>
        <span className="font-mono font-bold text-foreground">{orderId}</span>
        <button
          onClick={handleCopyId}
          className="hover:text-primary transition-colors ml-1"
        >
          <Copy className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mt-8 w-full">
        <Button
          variant="outline"
          className="flex-1 gap-2"
          onClick={() => router.push("/my-orders")}
        >
          <PackageSearch className="h-4 w-4" /> Track Order
        </Button>
        <Button
          className="flex-1 gap-2 bg-primary hover:bg-primary/90"
          onClick={() => router.push("/")}
        >
          <ShoppingBag className="h-4 w-4" /> Continue Shopping
        </Button>
      </div>
    </div>
  );
}
