import { HeroSection } from "@/components/home/hero-section";
import { MarqueeSection } from "@/components/home/marquee-section";
import { CategorySection } from "@/components/home/category-section";
import { TodaysDealSection } from "@/components/home/todays-deal-section";
import { SaleBannerSection } from "@/components/home/sale-banner-section";
import { LatestProducts } from "@/components/home/latest-products";

import { db } from "@/db";
import { heroSlides, marqueeItems, storeSettings } from "@/db/schema";
import { getMainCategories } from "@/app/(admin)/admin/categories/actions";
import { getTodaysDealsForUser } from "@/app/(admin)/admin/todays-deal/actions";
import { getSaleBanners } from "@/app/(admin)/admin/settings/sale-banner/actions";
import {
  getLatestProducts,
  getUserWishlistIds,
  getMostSellingProducts,
} from "@/app/(shop)/actions";
import { MostSellingSection } from "@/components/home/most-selling-section";

import { desc, eq } from "drizzle-orm";
import { createClient } from "@/utils/supabase/server";

export const dynamic = "force-dynamic";

export default async function Home() {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();

  // Parallel Fetching
  const [
    slides,
    announcements,
    settings,
    categories,
    deals,
    banners,
    latestProducts,
    wishlistIds,
    mostSellingProducts,
  ] = await Promise.all([
    db.select().from(heroSlides).orderBy(desc(heroSlides.createdAt)),
    db.select().from(marqueeItems).orderBy(desc(marqueeItems.createdAt)),
    db.select().from(storeSettings).where(eq(storeSettings.id, 1)),
    getMainCategories(),
    getTodaysDealsForUser(),
    getSaleBanners(),
    getLatestProducts(),
    getUserWishlistIds(),
    getMostSellingProducts(18),
  ]);

  const showMarquee = settings.length > 0 ? settings[0].isMarqueeEnabled : true;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="flex flex-col">
        {showMarquee && <MarqueeSection items={announcements} />}

        <div className={showMarquee ? "mt-4 md:mt-6" : ""}>
          <HeroSection slides={slides} />
        </div>

        <div className="mt-8">
          <CategorySection categories={categories} />
        </div>

        {/* Deals Section with Wishlist IDs */}
        <div className="mt-8">
          <TodaysDealSection
            deals={deals}
            user={userData.user}
            wishlistIds={wishlistIds}
          />
        </div>

        <div className="mt-8">
          <SaleBannerSection banners={banners} />
        </div>

        <div className="mt-8">
          <LatestProducts products={latestProducts} wishlistIds={wishlistIds} />
        </div>

        <div className="mt-8 bg-secondary/5 border-t">
          <MostSellingSection
            products={mostSellingProducts}
            wishlistIds={wishlistIds}
          />
        </div>

        {/* <section className="container mx-auto px-4 py-12 text-center">
          <h2 className="text-2xl font-bold text-primary">
            More Collections Coming Soon...
          </h2>
        </section> */}
      </main>
    </div>
  );
}
