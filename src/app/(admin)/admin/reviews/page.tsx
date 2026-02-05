import { getAllReviews } from "@/app/(admin)/actions";
import { ReviewCard } from "@/components/admin/reviews/review-card";
import { MessageSquare } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminReviewsPage() {
  const reviews = await getAllReviews();

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <MessageSquare className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Customer Reviews
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage and reply to customer feedback
            </p>
          </div>
        </div>
        <div className="bg-card border px-4 py-1.5 rounded-full text-sm font-medium shadow-sm">
          Total Reviews:{" "}
          <span className="text-primary font-bold">{reviews.length}</span>
        </div>
      </div>

      {/* Reviews Grid */}
      {reviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center border-2 border-dashed rounded-xl bg-muted/5">
          <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <MessageSquare className="h-8 w-8 text-muted-foreground/50" />
          </div>
          <h2 className="text-lg font-semibold text-muted-foreground">
            No Reviews Yet
          </h2>
          <p className="text-sm text-muted-foreground/70 mt-1">
            Wait for customers to share their experience.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      )}
    </div>
  );
}
