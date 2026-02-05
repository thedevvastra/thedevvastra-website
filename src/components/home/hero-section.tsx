"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function HeroSection({ slides }: { slides: any[] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!slides || slides.length === 0) return null;

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [activeIndex, slides.length]);

  return (
    <section className="w-full py-6 overflow-hidden bg-background">
      <div className="container mx-auto px-4 h-[350px] md:h-[480px] flex gap-4">
        {slides.map((slide, index) => {
          const isActive = index === activeIndex;
          const isNext = index === (activeIndex + 1) % slides.length;

          return (
            <motion.div
              key={slide.id}
              layout
              onClick={() => setActiveIndex(index)}
              initial={{ borderRadius: "1.5rem" }}
              animate={{
                flex: isActive ? 2.5 : 0.6,
                opacity: isActive || isNext ? 1 : 0.5,
              }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
              // ✅ Added 'group' class for hover effect on image
              className={cn(
                "relative h-full rounded-3xl overflow-hidden cursor-pointer shadow-sm border border-border/50 group",
                slide.bgColor,
                !isActive && "hidden md:block",
              )}
            >
              {/* ✅ FIX: Image Visibility Improved */}
              {slide.imageUrl && (
                <>
                  {/* 1. Actual Image (Removed low opacity and blend mode) */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={slide.imageUrl}
                    alt={slide.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* 2. Gradient Overlay so text is readable on bright images */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                </>
              )}

              <div className="relative h-full w-full p-6 md:p-10 flex flex-col justify-center z-10">
                {isActive && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                    className="max-w-lg"
                  >
                    <h1
                      className={cn(
                        "text-2xl md:text-4xl font-bold tracking-tight mb-3 leading-tight drop-shadow-sm",
                        slide.textColor,
                      )}
                    >
                      {slide.title}
                    </h1>
                    <p
                      className={cn(
                        "text-sm md:text-base font-medium opacity-95 mb-6 line-clamp-2 max-w-md drop-shadow-sm",
                        slide.textColor,
                      )}
                    >
                      {slide.description}
                    </p>

                    <Link href={slide.ctaLink || "/"}>
                      <Button
                        size="default"
                        className="rounded-full px-6 py-5 text-sm font-semibold shadow-lg hover:translate-x-1 transition-transform bg-primary text-primary-foreground"
                      >
                        {slide.ctaText} <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  </motion.div>
                )}

                {!isActive && (
                  <div className="absolute inset-0 flex items-center justify-center opacity-40">
                    <h2
                      className={cn(
                        "text-3xl font-bold rotate-90 whitespace-nowrap",
                        slide.textColor,
                      )}
                    >
                      {slide.title}
                    </h2>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="flex justify-center mt-6 gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={cn(
              "h-2 rounded-full transition-all duration-300",
              activeIndex === index
                ? "w-8 bg-primary"
                : "w-2 bg-primary/20 hover:bg-primary/40",
            )}
          />
        ))}
      </div>
    </section>
  );
}
