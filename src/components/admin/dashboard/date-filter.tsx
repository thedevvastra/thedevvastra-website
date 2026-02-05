"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

export function DateFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentRange = searchParams.get("range") || "7d";

  const setRange = (range: string) => {
    router.push(`/admin/dashboard?range=${range}`);
  };

  return (
    <div className="flex items-center bg-muted/50 p-1 rounded-lg border">
      <Button
        variant={currentRange === "7d" ? "default" : "ghost"}
        size="sm"
        onClick={() => setRange("7d")}
        className="h-7 text-xs px-3"
      >
        Last 7 Days
      </Button>
      <Button
        variant={currentRange === "30d" ? "default" : "ghost"}
        size="sm"
        onClick={() => setRange("30d")}
        className="h-7 text-xs px-3"
      >
        30 Days
      </Button>
      <Button
        variant={currentRange === "all" ? "default" : "ghost"}
        size="sm"
        onClick={() => setRange("all")}
        className="h-7 text-xs px-3"
      >
        All Time
      </Button>
    </div>
  );
}
