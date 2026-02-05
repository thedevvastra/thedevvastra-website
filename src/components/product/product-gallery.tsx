"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  images: string[];
}

export function ProductGallery({ images }: ProductGalleryProps) {
  const [mainImage, setMainImage] = useState(images[0]);

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image */}
      <div className="aspect-[3/4] w-full overflow-hidden rounded-2xl border bg-muted relative group">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={mainImage}
          alt="Product"
          className="h-full w-full object-cover transition-all duration-300"
        />
      </div>

      {/* Thumbnails */}
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {images.map((img, idx) => (
          <div
            key={idx}
            onClick={() => setMainImage(img)}
            className={cn(
              "relative h-20 w-20 shrink-0 cursor-pointer rounded-lg border-2 overflow-hidden",
              mainImage === img ? "border-primary" : "border-transparent",
            )}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img}
              alt={`Thumb ${idx}`}
              className="h-full w-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
