import Link from "next/link";
import { ArrowLeft, Construction, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  return (
    <div className="container max-w-md mx-auto px-4 py-12 min-h-fit flex flex-col items-center justify-center text-center animate-in fade-in zoom-in-95 duration-500">
      {/* Icon Circle */}
      <div className="relative mb-8">
        <div className="h-24 w-24 bg-primary/10 rounded-full flex items-center justify-center">
          <Settings2 className="h-10 w-10 text-primary animate-spin-slow" />
        </div>
        <div className="absolute -bottom-2 -right-2 bg-background p-1.5 rounded-full border shadow-sm">
          <Construction className="h-5 w-5 text-orange-500" />
        </div>
      </div>

      {/* Text Content */}
      <h1 className="text-2xl font-bold text-foreground mb-2">
        Settings & Preferences
      </h1>
      <p className="text-muted-foreground mb-8 max-w-[280px] mx-auto leading-relaxed">
        We are crafting a powerful settings panel for you. This feature will be
        available in the next update.
      </p>

      {/* Status Box */}
      <div className="bg-muted/40 border border-dashed border-border rounded-xl p-4 w-full mb-8 flex flex-col gap-1">
        <span className="text-xs font-bold text-primary uppercase tracking-wider">
          Status
        </span>
        <span className="text-sm font-medium text-foreground">
          🚧 Under Development
        </span>
      </div>

      {/* Action Button */}
      <Link href="/account" className="w-full">
        <Button variant="outline" className="w-full gap-2 h-11 rounded-xl">
          <ArrowLeft className="h-4 w-4" />
          Back to Account
        </Button>
      </Link>
    </div>
  );
}
