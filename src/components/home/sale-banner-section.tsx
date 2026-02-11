"use client";

import { useRef } from "react";
import Link from "next/link";
import { ChevronRight, ChevronLeft } from "lucide-react";

export function SaleBannerSection({ banners }: { banners: any[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = 300;
      current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (!banners || banners.length === 0) return null;

  return (
    <section className="container mx-auto px-4 py-8 relative group">
      {/* Navigation Arrows (Desktop) */}
      <button
        onClick={() => scroll("left")}
        className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 z-20 h-10 w-10 bg-white/90 shadow-lg rounded-full items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity border hover:scale-110"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={() => scroll("right")}
        className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 z-20 h-10 w-10 bg-white/90 shadow-lg rounded-full items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity border hover:scale-110"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* ✅ FIX: Scrollbar Hidden & Clickable Image */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-none"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }} // Standard hide scrollbar
      >
        {banners.map((banner) => (
          <Link
            key={banner.id}
            href={banner.ctaLink || "#"}
            className="relative shrink-0 w-[85vw] md:w-[320px] aspect-[3/4] rounded-2xl overflow-hidden snap-center shadow-sm border bg-muted cursor-pointer group/card"
          >
            {/* Background Image */}
            <img
              src={banner.imageUrl}
              alt="Sale Banner"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-105"
            />

            {/* Slight Overlay for depth on hover */}
            <div className="absolute inset-0 bg-black/0 group-hover/card:bg-black/5 transition-colors duration-300" />
          </Link>
        ))}
      </div>
    </section>
  );
}
