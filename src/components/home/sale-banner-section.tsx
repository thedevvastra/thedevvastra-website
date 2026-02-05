"use client";

import { useRef } from "react";
import Link from "next/link";
import { ChevronRight, ChevronLeft } from "lucide-react";

export function SaleBannerSection({ banners }: { banners: any[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = 350;
      current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (!banners || banners.length === 0) return null;

  return (
    <section className="container mx-auto px-4 py-8 relative group">
      {/* Navigation Arrows (Desktop Only) */}
      <button
        onClick={() => scroll("left")}
        className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 h-10 w-10 bg-white shadow-lg rounded-full items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity border"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={() => scroll("right")}
        className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 h-10 w-10 bg-white shadow-lg rounded-full items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity border"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Mobile Logic: 
         - w-[90vw]: Screen ka 90% width lega.
         - flex-nowrap: Wrap nahi hoga.
         - overflow-x-auto: Scrollable hoga.
         - gap-4: Beech mein gap.
         - snap-x: Smooth sticking effect.
      */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
      >
        {banners.map((banner) => (
          <div
            key={banner.id}
            className="relative shrink-0 w-[85vw] md:w-[350px] aspect-[3/4] rounded-2xl overflow-hidden snap-center shadow-md border"
          >
            {/* Background Image */}
            <img
              src={banner.imageUrl}
              alt="Sale"
              className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-700"
            />

            {/* Gradient Overlay for Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

            {/* CTA Button Positioned at Bottom */}
            <div className="absolute bottom-6 left-0 right-0 px-6 flex justify-center">
              <Link href={banner.ctaLink} className="w-full">
                <button
                  className="w-full py-3.5 rounded-full text-white font-bold text-sm tracking-wide shadow-lg transform active:scale-95 transition-all hover:brightness-110"
                  style={{ backgroundColor: banner.btnColor }}
                >
                  {banner.ctaText}
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
