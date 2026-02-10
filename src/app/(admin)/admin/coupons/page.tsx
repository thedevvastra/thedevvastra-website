import { db } from "@/db";
import { coupons, products } from "@/db/schema";
import { desc } from "drizzle-orm";
import { CouponClient } from "@/components/admin/coupons/coupon-client";

export default async function CouponsPage() {
  // 1. Fetch Coupons
  const allCoupons = await db
    .select()
    .from(coupons)
    .orderBy(desc(coupons.createdAt));

  // 2. Fetch Products with Thumbnail (Updated)
  const productList = await db
    .select({
      id: products.id,
      title: products.title,
      sellingPrice: products.sellingPrice,
      thumbnailUrl: products.thumbnailUrl, // ✅ Added for card UI
    })
    .from(products);

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <CouponClient coupons={allCoupons} products={productList} />
    </div>
  );
}
