"use client";

import { useState } from "react";
import {
  Share2,
  Link as LinkIcon,
  Check,
  Facebook,
  Twitter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

export function ShareButton({ title, url }: { title: string; url: string }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success("Link copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const shareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch (err) {
        console.log("Share cancelled");
      }
    } else {
      copyToClipboard();
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="h-11 w-11 rounded-lg">
          <Share2 className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Share this product</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={copyToClipboard}
          className="cursor-pointer gap-2"
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-600" />
          ) : (
            <LinkIcon className="h-4 w-4" />
          )}
          Copy Link
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={shareNative}
          className="cursor-pointer gap-2 md:hidden"
        >
          <Share2 className="h-4 w-4" /> Share via Apps
        </DropdownMenuItem>

        {/* Desktop Social Links (Simulated) */}
        <DropdownMenuItem
          onClick={() =>
            window.open(
              `https://wa.me/?text=${encodeURIComponent(title + " " + url)}`,
              "_blank",
            )
          }
          className="cursor-pointer gap-2"
        >
          <span className="text-green-600 font-bold text-xs">WA</span> WhatsApp
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() =>
            window.open(
              `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
              "_blank",
            )
          }
          className="cursor-pointer gap-2"
        >
          <Facebook className="h-4 w-4 text-blue-600" /> Facebook
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
