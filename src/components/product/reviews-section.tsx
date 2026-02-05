"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, MoreVertical, Pencil, Trash2 } from "lucide-react"; // ✅ New Icons
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { StarRating } from "@/components/ui/star-rating";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"; // ✅ Dropdown for actions
import { toast } from "sonner";
import { submitReviewAction, deleteReviewAction } from "@/app/(shop)/actions"; // ✅ Import Delete
import { cn } from "@/lib/utils";

interface ReviewsSectionProps {
  productId: string;
  reviews: any[];
  stats: any;
  user: any;
}

export function ReviewsSection({
  productId,
  reviews,
  stats,
  user,
}: ReviewsSectionProps) {
  const router = useRouter();

  // Form States
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Helper to pre-fill form for editing
  const handleEditClick = (review: any) => {
    setRating(review.rating);
    setComment(review.comment || "");
    // Scroll to form (Mobile UX)
    document
      .getElementById("review-form")
      ?.scrollIntoView({ behavior: "smooth" });
    toast.info("You can update your review now.");
  };

  // Helper for Deleting
  const handleDelete = async (reviewId: string) => {
    if (!confirm("Are you sure you want to delete your review?")) return;

    setIsDeleting(true);
    const res = await deleteReviewAction(reviewId);
    setIsDeleting(false);

    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("Review deleted successfully");
      // Reset form if the deleted review was being edited
      setRating(0);
      setComment("");
      router.refresh();
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      toast.error("Please login to write a review");
      router.push("/login");
      return;
    }

    if (rating === 0) {
      toast.error("Please select a star rating");
      return;
    }

    setIsSubmitting(true);
    const res = await submitReviewAction(productId, rating, comment);
    setIsSubmitting(false);

    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("Review saved successfully!");
      setRating(0);
      setComment("");
      router.refresh();
    }
  };

  return (
    <div className="py-10">
      <h2 className="text-2xl font-bold mb-8">Customer Reviews</h2>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* --- LEFT: Reviews List & Stats --- */}
        <div className="flex-1 space-y-8">
          {/* Stats Box (Same as before) */}
          <div className="bg-muted/30 p-6 rounded-2xl border">
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-5xl font-bold text-foreground">
                  {stats.average || 0}
                </div>
                <StarRating
                  rating={Math.round(Number(stats.average))}
                  size="sm"
                  className="justify-center mt-2"
                />
                <div className="text-xs text-muted-foreground mt-1">
                  {stats.total} Reviews
                </div>
              </div>

              <div className="flex-1 space-y-2">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = stats.distribution[star - 1];
                  const percent =
                    stats.total > 0 ? (count / stats.total) * 100 : 0;
                  return (
                    <div key={star} className="flex items-center gap-3 text-xs">
                      <div className="w-8 font-medium text-muted-foreground">
                        {star} Star
                      </div>
                      <Progress value={percent} className="h-2" />
                      <div className="w-8 text-right text-muted-foreground">
                        {count}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Individual Reviews */}
          <div className="space-y-6">
            {reviews.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                No reviews yet. Be the first to review!
              </div>
            ) : (
              reviews.map((review) => {
                // ✅ Check if Review is Edited (Created time differs from Updated time by > 1min)
                const isEdited =
                  new Date(review.updatedAt).getTime() >
                  new Date(review.createdAt).getTime() + 60000;
                const isOwnReview = user && user.id === review.userId;

                return (
                  <div
                    key={review.id}
                    className={cn(
                      "border-b pb-6 last:border-0 relative group",
                      isOwnReview && "bg-primary/5 p-4 rounded-xl -mx-4",
                    )}
                  >
                    {/* ✅ Edit/Delete Dropdown (Only for Owner) */}
                    {isOwnReview && (
                      <div className="absolute top-4 right-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleEditClick(review)}
                            >
                              <Pencil className="h-3.5 w-3.5 mr-2" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDelete(review.id)}
                              className="text-red-600 focus:text-red-600"
                            >
                              <Trash2 className="h-3.5 w-3.5 mr-2" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    )}

                    <div className="flex items-start gap-4">
                      <Avatar>
                        <AvatarImage src={review.user?.avatarUrl} />
                        <AvatarFallback>
                          {review.user?.email?.[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-sm">
                            {review.user?.fullName || "User"}
                          </h4>
                          {isOwnReview && (
                            <Badge
                              variant="secondary"
                              className="text-[10px] h-5 px-1.5"
                            >
                              You
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center gap-2 mt-1">
                          <StarRating rating={review.rating} size="sm" />
                          <span className="text-xs text-muted-foreground">
                            {new Date(review.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              },
                            )}
                          </span>
                          {/* ✅ Show Edited Label */}
                          {isEdited && (
                            <span className="text-[10px] text-muted-foreground italic">
                              (edited)
                            </span>
                          )}
                        </div>

                        <p className="text-sm text-foreground/80 mt-3 leading-relaxed">
                          {review.comment}
                        </p>

                        {/* Admin Reply Logic (Same as before) */}
                        {(review.adminReply || review.isLoved) && (
                          <div className="mt-4 bg-background p-4 rounded-xl border border-border/50 shadow-sm">
                            {review.isLoved && (
                              <div className="flex items-center gap-2 text-xs font-bold text-red-500 mb-2">
                                <Heart className="h-3 w-3 fill-current" /> Admin
                                loved this
                              </div>
                            )}
                            {review.adminReply && (
                              <div className="text-sm">
                                <span className="font-bold text-primary text-xs uppercase tracking-wide block mb-1">
                                  Response from Store
                                </span>
                                <p className="text-muted-foreground">
                                  {review.adminReply}
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* --- RIGHT: Submission Form --- */}
        <div id="review-form" className="lg:w-[400px] shrink-0">
          <div className="bg-card border rounded-2xl p-6 shadow-sm sticky top-24">
            <h3 className="font-bold text-lg mb-4">
              {/* Dynamic Title */}
              {reviews.some((r) => r.userId === user?.id)
                ? "Update Your Review"
                : "Write a Review"}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium block mb-2">Rating</label>
                <StarRating
                  rating={rating}
                  onRatingChange={setRating}
                  size="lg"
                />
              </div>

              <div>
                <label className="text-sm font-medium block mb-2">Review</label>
                <Textarea
                  placeholder="How was the product? What did you like or dislike?"
                  className="min-h-[120px] resize-none"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </div>

              <Button
                className="w-full"
                onClick={handleSubmit}
                disabled={isSubmitting || isDeleting}
              >
                {isSubmitting ? "Saving..." : "Submit Review"}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                By submitting, you agree to our Terms & Conditions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Simple Badge Component for "You" tag (if not already imported)
function Badge({ children, className, variant = "default" }: any) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        variant === "secondary"
          ? "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80"
          : "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        className,
      )}
    >
      {children}
    </span>
  );
}
