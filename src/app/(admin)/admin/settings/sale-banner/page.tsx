import { db } from "@/db";
import { saleBanners } from "@/db/schema";
import { desc } from "drizzle-orm";
import { BannerClient } from "@/components/admin/banners/banner-client";

export default async function SaleBannerPage() {
  const banners = await db
    .select()
    .from(saleBanners)
    .orderBy(desc(saleBanners.createdAt));
  return <BannerClient banners={banners} />;
}
