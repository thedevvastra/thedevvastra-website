"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export function MarqueeSection({ items }: { items: any[] }) {
  if (!items || items.length === 0) return null;

  // Duplicate items to create seamless loop effect
  const repeatedItems = [...items, ...items, ...items, ...items];

  return (
    <div className="w-full border-b border-border/40 bg-background/50 backdrop-blur-sm relative z-10">
      {/* ✅ FIX: Replaced max-w-[1400px] with 'container' for consistent width */}
      <div className="container mx-auto px-4 overflow-hidden relative h-10 flex items-center">
        {/* Left Gradient (Fade In) */}
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent z-20 pointer-events-none" />

        {/* Scrolling Content */}
        <motion.div
          className="flex whitespace-nowrap items-center gap-8"
          animate={{ x: "-50%" }}
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: 20,
          }}
        >
          {repeatedItems.map((item, index) => (
            <div
              key={`${item.id}-${index}`}
              className="flex items-center gap-8 shrink-0"
            >
              <span className="text-sm font-medium tracking-wide text-foreground/80 uppercase">
                {item.text}
              </span>
              <Sparkles className="h-3 w-3 text-primary/50 animate-pulse" />
            </div>
          ))}
        </motion.div>

        {/* Right Gradient (Fade Out) */}
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-20 pointer-events-none" />
      </div>
    </div>
  );
}
