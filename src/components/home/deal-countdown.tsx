"use client";

import { useState, useEffect } from "react";
import { Timer } from "lucide-react";

export function DealCountdown({ expiresAt }: { expiresAt: Date }) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const target = new Date(expiresAt).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        clearInterval(interval);
        setTimeLeft("Expired");
      } else {
        const hours = Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
        );
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60),
        );
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt]);

  if (!timeLeft) return null;

  return (
    <div className="flex items-center gap-1.5 bg-red-100 text-red-600 px-2 py-1 rounded text-xs font-bold animate-pulse">
      <Timer className="h-3 w-3" />
      <span>{timeLeft}</span>
    </div>
  );
}
