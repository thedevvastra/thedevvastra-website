import { db } from "@/db";
import { products, productDeals } from "@/db/schema";
import { eq, and, gt } from "drizzle-orm";
import { notFound } from "next/navigation";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductInfo } from "@/components/product/product-info";
import { ReviewsSection } from "@/components/product/reviews-section";
import { CheckCircle2 } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import {
  getUserWishlistIds,
  getProductReviews,
  getProductStats,
} from "@/app/(shop)/actions";

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Parallel Fetching
  const [product, activeDeal, wishlistIds, reviews, stats] = await Promise.all([
    db.query.products.findFirst({
      where: eq(products.id, id),
      with: { brand: true, category: true, subCategory: true },
    }),
    db.query.productDeals.findFirst({
      where: and(
        eq(productDeals.productId, id),
        eq(productDeals.isActive, true),
        gt(productDeals.expiresAt, new Date()),
      ),
    }),
    getUserWishlistIds(),
    getProductReviews(id),
    getProductStats(id),
  ]);

  if (!product) return notFound();

  const isWishlisted = wishlistIds.includes(product.id);
  const allImages = [product.thumbnailUrl, ...(product.additionalImages || [])];

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="border-b bg-muted/10">
        <div className="container mx-auto px-4 py-2 text-xs md:text-sm text-muted-foreground truncate">
          Home / {product.category?.name} /{" "}
          <span className="text-foreground">{product.title}</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 md:py-8 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start">
          <div className="md:sticky md:top-24">
            <ProductGallery images={allImages} />
          </div>

          <div>
            {/* ✅ FIX: Pass 'stats' prop here */}
            <ProductInfo
              product={product}
              activeDeal={activeDeal}
              user={user}
              isWishlisted={isWishlisted}
              stats={stats}
            />

            <div className="mt-8 space-y-4 pt-4 border-t">
              {product.highlights && product.highlights.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" /> Key
                    Highlights
                  </h3>
                  <ul className="grid grid-cols-1 gap-1 pl-1">
                    {product.highlights.map((h: string, i: number) => (
                      <li
                        key={i}
                        className="text-sm text-muted-foreground flex items-start gap-2"
                      >
                        <span className="w-1 h-1 bg-muted-foreground rounded-full mt-2 shrink-0" />
                        <span className="flex-1">{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="space-y-2">
                <h3 className="text-sm font-semibold">Description</h3>
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {product.description}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-16 border-t pt-10">
          <ReviewsSection
            productId={product.id}
            reviews={reviews}
            stats={stats}
            user={user}
          />
        </div>
      </div>
    </div>
  );
}
