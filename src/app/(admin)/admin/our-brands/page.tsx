import { db } from "@/db";
import { brands } from "@/db/schema";
import { desc } from "drizzle-orm";
import { BrandClient } from "@/components/admin/brands/brand-client";

export default async function OurBrandsPage() {
  const brandList = await db
    .select()
    .from(brands)
    .orderBy(desc(brands.createdAt));
  return <BrandClient brands={brandList} />;
}
