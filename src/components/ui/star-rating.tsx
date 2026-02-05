"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number; // Current rating (0-5)
  maxRating?: number;
  onRatingChange?: (rating: number) => void; // If provided, it becomes interactive
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function StarRating({
  rating,
  maxRating = 5,
  onRatingChange,
  size = "md",
  className,
}: StarRatingProps) {
  const sizeClasses = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-6 w-6",
  };

  return (
    <div className={cn("flex items-center", className)}>
      {Array.from({ length: maxRating }).map((_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= rating;

        return (
          <button
            key={index}
            type="button"
            disabled={!onRatingChange}
            onClick={() => onRatingChange?.(starValue)}
            className={cn(
              "transition-colors",
              onRatingChange
                ? "cursor-pointer hover:scale-110"
                : "cursor-default",
            )}
          >
            <Star
              className={cn(
                sizeClasses[size],
                isFilled
                  ? "fill-yellow-400 text-yellow-400"
                  : "fill-muted text-muted-foreground/40",
                "mr-0.5",
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
