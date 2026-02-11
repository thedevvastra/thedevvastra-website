"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";

/* eslint-disable  @typescript-eslint/no-explicit-any */

export function HeroSection({ slides }: { slides: any[] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  // ✅ FIX: useEffect ko 'if' condition se upar move kiya
  useEffect(() => {
    // Guard clause: Agar slides nahi hai to kuch mat karo
    if (!slides || slides.length === 0) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [activeIndex, slides]); // dependency array update kiya

  // ✅ FIX: Ab check karo aur return null karo (Hooks ke baad)
  if (!slides || slides.length === 0) return null;

  return (
    <section className="w-full py-4 md:py-6 overflow-hidden bg-background">
      <div className="container mx-auto px-4 h-[180px] md:h-[400px] flex gap-4">
        {slides.map((slide, index) => {
          const isActive = index === activeIndex;
          const isNext = index === (activeIndex + 1) % slides.length;

          return (
            <motion.div
              key={slide.id}
              layout
              onClick={() => setActiveIndex(index)}
              initial={{ borderRadius: "1rem" }}
              animate={{
                flex: isActive ? 2 : 0.5,
                opacity: isActive || isNext ? 1 : 0.5,
              }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
              className={cn(
                "relative h-full rounded-2xl overflow-hidden shadow-sm border border-border/50",
                !isActive && "hidden md:block cursor-pointer",
                isActive && "cursor-default",
              )}
            >
              {slide.imageUrl && (
                <>
                  {isActive ? (
                    <Link
                      href={slide.ctaLink || "/"}
                      className="block w-full h-full relative cursor-pointer"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={slide.imageUrl}
                        alt="Banner"
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                      />
                    </Link>
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={slide.imageUrl}
                      alt="Banner"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  )}
                </>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Dots Navigation */}
      <div className="flex justify-center mt-4 gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              activeIndex === index
                ? "w-6 bg-primary"
                : "w-1.5 bg-primary/20 hover:bg-primary/40",
            )}
          />
        ))}
      </div>
    </section>
  );
}
