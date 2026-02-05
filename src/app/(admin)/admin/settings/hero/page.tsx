import { db } from "@/db";
import { heroSlides } from "@/db/schema";
import { desc } from "drizzle-orm";
import { HeroClient } from "@/components/admin/hero/hero-client";

export default async function HeroSettingsPage() {
  // Database se slides le aao
  const slides = await db
    .select()
    .from(heroSlides)
    .orderBy(desc(heroSlides.createdAt));

  // Client Component ko data pass karo
  return <HeroClient slides={slides} />;
}
