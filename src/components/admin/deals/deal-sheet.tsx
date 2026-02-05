"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Plus,
  Search,
  Loader2,
  Save,
  CheckCircle2,
  PackageSearch,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { updateTodaysDeal } from "@/app/(admin)/admin/todays-deal/actions";
import { cn } from "@/lib/utils";

interface DealSheetProps {
  allProducts: any[];
  activeDealIds: string[];
}

export function DealSheet({ allProducts, activeDealIds }: DealSheetProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>(activeDealIds);

  useEffect(() => {
    setSelectedIds(activeDealIds);
  }, [activeDealIds, open]);

  const filteredProducts = allProducts.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category?.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const toggleProduct = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const onSave = async () => {
    setIsLoading(true);
    const res = await updateTodaysDeal(selectedIds);
    setIsLoading(false);

    if (res?.success) {
      toast.success(res.success);
      setOpen(false);
    } else {
      toast.error(res?.error);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button className="gap-2 shadow-md">
          <Plus className="h-4 w-4" /> Manage Deals
        </Button>
      </SheetTrigger>

      {/* ✅ FIX: Added max-w and container constraints */}
      <SheetContent
        side="bottom"
        className="h-[85vh] rounded-t-[2rem] flex flex-col p-0 bg-background/95 backdrop-blur-lg mx-auto w-full max-w-[1400px] shadow-2xl border-x"
      >
        {/* Header Section */}
        <div className="px-6 py-5 border-b bg-muted/30">
          <div className="max-w-4xl mx-auto w-full">
            <SheetHeader>
              <SheetTitle className="text-2xl font-bold text-primary">
                Select Today's Deals
              </SheetTitle>
              <SheetDescription>
                Choose products to feature in the 24-hour flash sale section.
              </SheetDescription>
            </SheetHeader>

            {/* Sticky Search Bar */}
            <div className="relative mt-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products by title, category..."
                className="pl-10 h-11 bg-background border-muted-foreground/20 focus-visible:ring-primary/30"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Scrollable Product Grid */}
        <div className="flex-1 overflow-y-auto p-6 bg-muted/10">
          <div className="max-w-4xl mx-auto w-full">
            {filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                <PackageSearch className="h-12 w-12 mb-3 opacity-20" />
                <p>No products found matching "{searchQuery}"</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {filteredProducts.map((product) => {
                  const isSelected = selectedIds.includes(product.id);
                  return (
                    <div
                      key={product.id}
                      onClick={() => toggleProduct(product.id)}
                      className={cn(
                        "relative flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all duration-200 group hover:shadow-md bg-card",
                        isSelected
                          ? "border-primary bg-primary/5 shadow-sm"
                          : "border-transparent hover:border-primary/20",
                      )}
                    >
                      {/* Checkbox Badge */}
                      <div
                        className={cn(
                          "absolute top-3 right-3 h-5 w-5 rounded-full border flex items-center justify-center transition-colors",
                          isSelected
                            ? "bg-primary border-primary text-white"
                            : "border-muted-foreground/30 bg-background",
                        )}
                      >
                        {isSelected && <CheckCircle2 className="h-3.5 w-3.5" />}
                      </div>

                      {/* Image */}
                      <div className="h-16 w-16 rounded-lg bg-muted overflow-hidden shrink-0 border">
                        <img
                          src={product.thumbnailUrl}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      </div>

                      {/* Text */}
                      <div className="flex-1 pr-6">
                        <p className="text-sm font-semibold line-clamp-1 text-foreground">
                          {product.title}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          <Badge
                            variant="secondary"
                            className="text-[10px] px-1.5 h-5 font-normal"
                          >
                            {product.category?.name || "Uncategorized"}
                          </Badge>
                          <span className="text-xs font-bold text-primary px-1.5 py-0.5 rounded bg-primary/10">
                            ₹{product.sellingPrice}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t p-4 bg-background">
          <div className="max-w-4xl mx-auto w-full flex items-center justify-between gap-4">
            <div className="text-sm font-medium text-muted-foreground">
              <span className="text-primary font-bold text-lg">
                {selectedIds.length}
              </span>{" "}
              products selected
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={onSave}
                disabled={isLoading}
                className="min-w-[140px]"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin mr-2 h-4 w-4" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Publish Deals
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
