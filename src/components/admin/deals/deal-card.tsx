"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Timer } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface DealCardProps {
  deal: any;
}

export function DealCard({ deal }: DealCardProps) {
  const { product } = deal;

  // Calculate Discount Percentage
  const discount =
    product.oldPrice && product.sellingPrice
      ? Math.round(
          ((product.oldPrice - product.sellingPrice) / product.oldPrice) * 100,
        )
      : 0;

  return (
    <div className="group relative w-full border rounded-xl bg-card p-3 shadow-sm hover:shadow-md transition-all duration-300">
      {/* 1. Image Section (Rounded & Prominent) */}
      <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-muted border border-border/50">
        <Image
          src={product.thumbnailUrl}
          alt={product.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Live Indicator overlay (Optional but nice) */}
        <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1.5">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span>
          </span>
          LIVE
        </div>
      </div>

      {/* 2. Content Section */}
      <div className="mt-3 flex flex-col items-start text-left">
        {/* Brand Label */}
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider line-clamp-1">
          {product.brand?.name || "Generic"}
        </span>

        {/* Product Name */}
        <h3
          className="font-semibold text-sm text-foreground line-clamp-1 mt-0.5 w-full"
          title={product.title}
        >
          {product.title}
        </h3>

        {/* Pricing */}
        <div className="flex items-baseline gap-2 mt-1.5">
          <span className="font-bold text-sm">
            ₹{product.sellingPrice.toLocaleString()}
          </span>
          {product.oldPrice && (
            <span className="text-[10px] text-muted-foreground line-through decoration-muted-foreground/60">
              ₹{product.oldPrice.toLocaleString()}
            </span>
          )}
        </div>
      </div>

      {/* 3. Separator */}
      <Separator className="my-3 bg-border/60" />

      {/* 4. Footer: Countdown & Discount */}
      <div className="flex items-center justify-between">
        {/* Left: Countdown Timer */}
        <div className="flex items-center gap-1.5 text-xs font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded-md">
          <Timer className="h-3.5 w-3.5" />
          <DealTimer expiresAt={deal.expiresAt} />
        </div>

        {/* Right: Discount Label */}
        {discount > 0 && (
          <Badge
            variant="secondary"
            className="bg-green-100 text-green-700 hover:bg-green-100 text-[10px] font-bold px-1.5 rounded-md border-green-200"
          >
            {discount}% OFF
          </Badge>
        )}
      </div>
    </div>
  );
}

// Helper Component for Ticking Timer
function DealTimer({ expiresAt }: { expiresAt: string | Date }) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const target = new Date(expiresAt).getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const distance = target - now;

      if (distance < 0) {
        setTimeLeft("Expired");
        return;
      }

      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft(
        `${hours.toString().padStart(2, "0")}h ${minutes.toString().padStart(2, "0")}m ${seconds.toString().padStart(2, "0")}s`,
      );
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  return <span>{timeLeft}</span>;
}
