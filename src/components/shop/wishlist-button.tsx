"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { toggleWishlistAction } from "@/app/(shop)/actions";
import { useShopStore } from "@/store/cart-store";
import { toast } from "sonner";

interface WishlistButtonProps {
  productId: string;
  initialIsWishlisted: boolean;
  className?: string; // To add custom styles like absolute positioning
}

export function WishlistButton({
  productId,
  initialIsWishlisted,
  className,
}: WishlistButtonProps) {
  const router = useRouter();
  const { incrementWishlist, decrementWishlist } = useShopStore();
  const [isWishlisted, setIsWishlisted] = useState(initialIsWishlisted);
  const [loading, setLoading] = useState(false);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault(); // Parent Link click hone se roko
    e.stopPropagation();

    setLoading(true);

    // Optimistic UI Update (Turant UI change karo)
    const previousState = isWishlisted;
    setIsWishlisted(!previousState);

    const res = await toggleWishlistAction(productId);
    setLoading(false);

    if (res.error === "unauthorized") {
      setIsWishlisted(previousState); // Revert UI
      toast.error("Please login to use wishlist");
      router.push("/login");
      return;
    }

    if (res.error) {
      setIsWishlisted(previousState); // Revert UI
      toast.error("Something went wrong");
    } else {
      // Update Global Store Counter
      if (res.status === "added") {
        incrementWishlist();
        toast.success("Added to Wishlist");
      } else {
        decrementWishlist();
        toast.success("Removed from Wishlist");
      }
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={cn(
        "p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-sm hover:bg-white transition-all z-10 flex items-center justify-center",
        isWishlisted ? "text-red-500" : "text-gray-600 hover:text-red-500",
        className,
      )}
    >
      <Heart
        className={cn(
          "h-4 w-4 transition-all duration-300",
          isWishlisted && "fill-current text-red-500",
        )}
      />
    </button>
  );
}
