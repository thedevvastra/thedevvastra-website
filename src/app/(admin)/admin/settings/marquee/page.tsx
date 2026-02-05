import { db } from "@/db";
import { marqueeItems, storeSettings } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { MarqueeClient } from "@/components/admin/marquee/marquee-client";

export default async function MarqueeSettingsPage() {
  const items = await db
    .select()
    .from(marqueeItems)
    .orderBy(desc(marqueeItems.createdAt));

  // ✅ Fetch Settings
  const settings = await db
    .select()
    .from(storeSettings)
    .where(eq(storeSettings.id, 1));

  // Agar settings row nahi hai, to default true maano
  const isEnabled = settings.length > 0 ? settings[0].isMarqueeEnabled : true;

  return <MarqueeClient items={items} isEnabled={isEnabled} />;
}
