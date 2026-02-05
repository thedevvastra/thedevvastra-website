"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Heart, MessageCircle, ExternalLink, Save } from "lucide-react";
import { StarRating } from "@/components/ui/star-rating";
import { updateReviewAction } from "@/app/(admin)/actions";
import { toast } from "sonner";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface ReviewCardProps {
  review: any;
}

export function ReviewCard({ review }: ReviewCardProps) {
  const [isLoved, setIsLoved] = useState(review.isLoved);
  const [reply, setReply] = useState(review.adminReply || "");
  const [isReplying, setIsReplying] = useState(false);
  const [loading, setLoading] = useState(false);

  // Toggle Love
  const handleLove = async () => {
    const newState = !isLoved;
    setIsLoved(newState); // Optimistic UI

    const res = await updateReviewAction(review.id, reply, newState);
    if (res.error) {
      setIsLoved(!newState); // Revert
      toast.error("Failed to update");
    } else {
      toast.success(newState ? "Loved review ❤️" : "Unloved review");
    }
  };

  // Save Reply
  const handleSaveReply = async () => {
    setLoading(true);
    const res = await updateReviewAction(review.id, reply, isLoved);
    setLoading(false);

    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("Reply saved successfully");
      setIsReplying(false);
    }
  };

  return (
    <div className="bg-card border rounded-xl p-5 shadow-sm space-y-4">
      {/* Header: User & Product Info */}
      <div className="flex justify-between items-start">
        <div className="flex gap-3">
          <Avatar>
            <AvatarImage src={review.user?.avatarUrl} />
            <AvatarFallback>
              {review.user?.email?.[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h4 className="font-semibold text-sm">
              {review.user?.fullName || "Guest User"}
            </h4>
            <div className="text-xs text-muted-foreground">
              {review.user?.email}
            </div>
          </div>
        </div>

        {/* ✅ FIX: Added specific locale formatting to prevent Hydration Error */}
        <div className="text-right text-xs text-muted-foreground">
          {new Date(review.createdAt).toLocaleString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          })}
        </div>
      </div>

      {/* Product Link */}
      <div className="flex items-center gap-2 bg-muted/30 p-2 rounded-lg text-sm">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={review.product?.thumbnailUrl}
          alt="Product"
          className="h-8 w-8 rounded object-cover"
        />
        <Link
          href={`/product/${review.product?.id}`}
          target="_blank"
          className="hover:underline flex-1 truncate font-medium"
        >
          {review.product?.title}
        </Link>
        <ExternalLink className="h-3 w-3 text-muted-foreground" />
      </div>

      {/* Review Content */}
      <div>
        <StarRating rating={review.rating} size="sm" className="mb-2" />
        <p className="text-sm text-foreground/90 leading-relaxed bg-muted/10 p-3 rounded-md">
          {review.comment || "No comment provided."}
        </p>
      </div>

      {/* Actions: Love & Reply */}
      <div className="flex items-center gap-3 pt-2 border-t">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLove}
          className={cn(
            "gap-2",
            isLoved
              ? "text-red-500 hover:text-red-600 hover:bg-red-50"
              : "text-muted-foreground",
          )}
        >
          <Heart className={cn("h-4 w-4", isLoved && "fill-current")} />
          {isLoved ? "Loved" : "Love"}
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsReplying(!isReplying)}
          className={cn(
            "gap-2",
            isReplying || reply ? "text-primary" : "text-muted-foreground",
          )}
        >
          <MessageCircle className="h-4 w-4" />
          {reply ? "Edit Reply" : "Reply"}
        </Button>
      </div>

      {/* Admin Reply Box */}
      {(isReplying || reply) && (
        <div className="bg-primary/5 p-3 rounded-lg border border-primary/10 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-primary uppercase tracking-wide">
              Admin Reply
            </span>
            {!isReplying && (
              <button
                onClick={() => setIsReplying(true)}
                className="text-xs text-muted-foreground hover:underline"
              >
                Edit
              </button>
            )}
          </div>

          {isReplying ? (
            <div className="space-y-2">
              <Textarea
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder="Write your reply to the customer..."
                className="bg-background min-h-[80px]"
              />
              <div className="flex justify-end gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsReplying(false)}
                >
                  Cancel
                </Button>
                <Button size="sm" onClick={handleSaveReply} disabled={loading}>
                  <Save className="h-3 w-3 mr-2" /> Save Reply
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground italic">
              &quot;{reply}&quot;
            </p>
          )}
        </div>
      )}
    </div>
  );
}
