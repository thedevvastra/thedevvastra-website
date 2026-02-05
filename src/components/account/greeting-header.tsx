"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function GreetingHeader({
  name,
  imageUrl,
}: {
  name: string;
  imageUrl?: string | null;
}) {
  const [greeting, setGreeting] = useState("Hello");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);

  return (
    <div className="flex items-center gap-3 mb-6">
      <Avatar className="h-12 w-12 border border-border shadow-sm">
        <AvatarImage src={imageUrl || ""} />
        <AvatarFallback className="bg-primary/5 text-primary text-sm font-bold">
          {name.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div>
        <p className="text-xs text-muted-foreground font-medium">{greeting},</p>
        <h1 className="text-lg font-bold text-foreground leading-none">
          {name}
        </h1>
      </div>
    </div>
  );
}
