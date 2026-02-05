"use client";

import { useRef } from "react";
import Link from "next/link";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CategorySectionProps {
  categories: any[];
}

export function CategorySection({ categories }: CategorySectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Scroll Logic for Desktop Arrows
  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = 300; // Kitna pixel scroll karna hai
      if (direction === "left") {
        current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      } else {
        current.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    }
  };

  if (!categories || categories.length === 0) return null;

  return (
    <section className="container mx-auto px-4 py-8">
      {/* --- Header Section --- */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-foreground tracking-tight">
          Explore Popular Categories
        </h2>
        <Link
          href="/categories"
          className="flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
        >
          View All <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      {/* --- Slider Container --- */}
      <div className="relative group">
        {/* Left Arrow (Desktop Only) */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 h-10 w-10 bg-background/80 backdrop-blur-sm border shadow-lg rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0 md:flex hidden"
          aria-label="Scroll Left"
        >
          <ChevronLeft className="h-5 w-5 text-foreground" />
        </button>

        {/* Scrollable Area */}
        {/* 'scrollbar-hide' class ke liye CSS add karna padega ya plugin, 
            abhi ke liye standard overflow use kar rahe hain */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-4 scroll-smooth snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className="flex flex-col items-center gap-3 min-w-[100px] md:min-w-[140px] snap-start group/item cursor-pointer"
            >
              {/* Round Image Container */}
              <div className="relative h-24 w-24 md:h-32 md:w-32 rounded-full overflow-hidden border-2 border-transparent group-hover/item:border-primary transition-all shadow-sm bg-muted">
                {cat.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={cat.imageUrl}
                    alt={cat.name}
                    className="h-full w-full object-cover hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  // Fallback if no image
                  <div className="h-full w-full flex items-center justify-center bg-primary/10 text-primary font-bold text-2xl">
                    {cat.name.charAt(0)}
                  </div>
                )}
              </div>

              {/* Category Name */}
              <span className="text-sm md:text-base font-medium text-center text-foreground/90 group-hover/item:text-primary transition-colors line-clamp-1">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>

        {/* Right Arrow (Desktop Only) */}
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 h-10 w-10 bg-background/80 backdrop-blur-sm border shadow-lg rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity md:flex hidden"
          aria-label="Scroll Right"
        >
          <ChevronRight className="h-5 w-5 text-foreground" />
        </button>
      </div>
    </section>
  );
}
