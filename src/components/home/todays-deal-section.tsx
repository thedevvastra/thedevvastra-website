"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { DealCard } from "./deal-card";
import { DealCountdown } from "./deal-countdown";
import { Button } from "@/components/ui/button";

interface TodaysDealSectionProps {
  deals: any[];
  user: any;
  wishlistIds: string[]; // ✅ New Prop
}

export function TodaysDealSection({
  deals,
  user,
  wishlistIds,
}: TodaysDealSectionProps) {
  if (!deals || deals.length === 0) return null;

  const expiryTime = new Date(deals[0].expiresAt);

  return (
    <section className="py-8 border-b bg-secondary/5">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">
              Today's Best Deals
            </h2>
            <DealCountdown expiresAt={expiryTime} />
          </div>

          <Link
            href="/todays-deals"
            className="hidden md:flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            View All <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 md:flex md:gap-6 md:overflow-x-auto md:pb-4 md:snap-x scrollbar-hide">
          {deals.slice(0, 8).map((deal) => (
            <DealCard
              key={deal.id}
              deal={deal}
              user={user}
              isWishlisted={wishlistIds.includes(deal.product.id)} // ✅ Check ID
            />
          ))}
        </div>

        <div className="mt-6 md:hidden">
          <Link href="/todays-deals" className="block">
            <Button variant="outline" className="w-full">
              View All Deals
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
