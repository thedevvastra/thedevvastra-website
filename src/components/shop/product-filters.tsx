"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductFiltersProps {
  metadata: any;
}

export function ProductFilters({ metadata }: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // States
  const [priceRange, setPriceRange] = useState([0, metadata.maxPrice]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);

  // Sync state with URL on load
  useEffect(() => {
    const min = searchParams.get("minPrice")
      ? Number(searchParams.get("minPrice"))
      : 0;
    const max = searchParams.get("maxPrice")
      ? Number(searchParams.get("maxPrice"))
      : metadata.maxPrice;
    setPriceRange([min, max]);

    const cols = searchParams.get("color")?.split(",") || [];
    setSelectedColors(cols);
  }, [searchParams, metadata.maxPrice]);

  // Update URL Helper
  const updateURL = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/all-products?${params.toString()}`, { scroll: false });
  };

  // Handlers
  const handlePriceChange = (val: number[]) => {
    setPriceRange(val);
  };

  const applyPriceFilter = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("minPrice", priceRange[0].toString());
    params.set("maxPrice", priceRange[1].toString());
    router.push(`/all-products?${params.toString()}`, { scroll: false });
  };

  const toggleColor = (color: string) => {
    const newColors = selectedColors.includes(color)
      ? selectedColors.filter((c) => c !== color)
      : [...selectedColors, color];

    setSelectedColors(newColors);
    updateURL("color", newColors.length > 0 ? newColors.join(",") : null);
  };

  const handleCategoryClick = (catId: string, isSub = false) => {
    const params = new URLSearchParams(searchParams.toString());
    // Reset other category level to avoid conflict if needed, or keep both
    if (isSub) {
      // params.delete("category"); // Optional: logic depends on if you want both
      params.set("subCategory", catId);
    } else {
      params.delete("subCategory"); // Reset sub when main changes
      params.set("category", catId);
    }
    router.push(`/all-products?${params.toString()}`, { scroll: false });
  };

  const clearFilters = () => {
    router.push("/all-products");
  };

  // Check if any filter is active
  const hasFilters = searchParams.toString().length > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-lg">Filters</h3>
        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-red-500 text-xs h-auto p-0 hover:bg-transparent hover:underline"
          >
            Clear All
          </Button>
        )}
      </div>
      <Separator />

      {/* 1. Categories Accordion */}
      <Accordion
        type="single"
        collapsible
        defaultValue="categories"
        className="w-full"
      >
        <AccordionItem value="categories" className="border-none">
          <AccordionTrigger className="py-2 hover:no-underline font-semibold">
            Categories
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-1 ml-1">
              {metadata.categories.map((cat: any) => {
                const isActive = searchParams.get("category") === cat.id;
                return (
                  <div key={cat.id} className="space-y-1">
                    {/* Main Category */}
                    <div
                      onClick={() => handleCategoryClick(cat.id)}
                      className={cn(
                        "flex items-center justify-between cursor-pointer py-1.5 px-2 rounded-md text-sm transition-colors",
                        isActive
                          ? "bg-primary/10 text-primary font-medium"
                          : "hover:bg-muted text-muted-foreground",
                      )}
                    >
                      <span>{cat.name}</span>
                      <span className="text-xs opacity-70">({cat.count})</span>
                    </div>

                    {/* Sub Categories (Indented) */}
                    {cat.children && cat.children.length > 0 && (
                      <div className="ml-4 border-l pl-2 space-y-1 mt-1 mb-2">
                        {cat.children.map((sub: any) => {
                          const isSubActive =
                            searchParams.get("subCategory") === sub.id;
                          return (
                            <div
                              key={sub.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCategoryClick(sub.id, true);
                              }}
                              className={cn(
                                "flex items-center justify-between cursor-pointer py-1 px-2 rounded-md text-xs transition-colors",
                                isSubActive
                                  ? "text-primary font-semibold"
                                  : "text-muted-foreground hover:text-foreground",
                              )}
                            >
                              <span>{sub.name}</span>
                              <span>({sub.count})</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Separator />

      {/* 2. Price Range */}
      <div className="space-y-4">
        <h4 className="font-semibold text-sm">Price Range</h4>
        <Slider
          value={priceRange}
          max={metadata.maxPrice}
          step={100}
          minStepsBetweenThumbs={1}
          onValueChange={handlePriceChange}
          onValueCommit={applyPriceFilter} // Apply on release
          className="my-4"
        />
        <div className="flex items-center gap-2">
          <div className="space-y-1">
            <Label className="text-[10px] text-muted-foreground">Min</Label>
            <Input
              type="number"
              value={priceRange[0]}
              onChange={(e) =>
                setPriceRange([Number(e.target.value), priceRange[1]])
              }
              className="h-8 text-xs"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-[10px] text-muted-foreground">Max</Label>
            <Input
              type="number"
              value={priceRange[1]}
              onChange={(e) =>
                setPriceRange([priceRange[0], Number(e.target.value)])
              }
              className="h-8 text-xs"
            />
          </div>
          <Button
            size="icon"
            variant="secondary"
            className="h-8 w-8 mt-auto shrink-0"
            onClick={applyPriceFilter}
          >
            <span className="text-xs">Go</span>
          </Button>
        </div>
      </div>

      <Separator />

      {/* 3. Colors */}
      <div className="space-y-3">
        <h4 className="font-semibold text-sm">Colors</h4>
        <div className="space-y-2 max-h-48 overflow-y-auto pr-2 scrollbar-thin">
          {metadata.colors.map((color: string) => (
            <div key={color} className="flex items-center space-x-2">
              <Checkbox
                id={`color-${color}`}
                checked={selectedColors.includes(color)}
                onCheckedChange={() => toggleColor(color)}
              />
              <label
                htmlFor={`color-${color}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 capitalize cursor-pointer"
              >
                {color}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
