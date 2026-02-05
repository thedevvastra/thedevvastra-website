"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Loader2, PackageSearch, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ProductCard } from "@/components/shop/product-card";
import { searchProductsAction } from "@/app/(shop)/search/actions";
import { cn } from "@/lib/utils";

export function SearchClient() {
  const inputRef = useRef<HTMLInputElement>(null);
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Auto Focus
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Debounce Search
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.trim()) {
        setLoading(true);
        const data = await searchProductsAction(query);
        setResults(data);
        setLoading(false);
        setHasSearched(true);
      } else {
        setResults([]);
        setHasSearched(false);
      }
    }, 400); // Slightly faster debounce

    return () => clearTimeout(timer);
  }, [query]);

  // Clear Search Handler
  const clearSearch = () => {
    setQuery("");
    setResults([]);
    setHasSearched(false);
    inputRef.current?.focus();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* --- 1. STICKY SEARCH HEADER --- */}
      <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border/40 pb-2 pt-4 px-4 md:pt-6 md:pb-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative group">
            <Input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for items..."
              className="h-10 md:h-12 pl-10 pr-10 rounded-xl bg-muted/40 border-transparent focus:bg-background focus:border-primary/20 transition-all text-sm md:text-base shadow-sm group-hover:bg-muted/60"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

            {/* Right Side Icons (Loader or Clear) */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
              ) : query ? (
                <button
                  onClick={clearSearch}
                  className="bg-muted-foreground/20 hover:bg-muted-foreground/30 rounded-full p-0.5 transition-colors"
                >
                  <X className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {/* --- 2. RESULTS AREA --- */}
      <div className="container mx-auto px-2 md:px-4 py-4 md:py-8 max-w-6xl">
        {/* Status Text */}
        <div className="h-6 mb-4 md:mb-6 px-1">
          {loading ? (
            <p className="text-xs md:text-sm text-muted-foreground animate-pulse">
              Searching for "{query}"...
            </p>
          ) : hasSearched ? (
            <p className="text-xs md:text-sm text-muted-foreground font-medium">
              Found{" "}
              <span className="text-foreground font-bold">
                {results.length}
              </span>{" "}
              results
            </p>
          ) : (
            !query && (
              <p className="text-xs md:text-sm text-muted-foreground">
                Type above to search products
              </p>
            )
          )}
        </div>

        {/* Product Grid */}
        {results.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {results.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : hasSearched && !loading && query ? (
          // Empty State
          <div className="flex flex-col items-center justify-center py-12 md:py-20 text-center animate-in zoom-in-95 duration-300">
            <div className="bg-muted/30 p-4 rounded-full mb-3">
              <PackageSearch className="h-8 w-8 md:h-12 md:w-12 text-muted-foreground/40" />
            </div>
            <h3 className="text-sm md:text-lg font-semibold text-foreground">
              No results found
            </h3>
            <p className="text-xs md:text-sm text-muted-foreground mt-1 max-w-[200px] md:max-w-md">
              We couldn't find any products matching "{query}". Try different
              keywords.
            </p>
          </div>
        ) : !hasSearched && !query ? (
          // Initial Placeholder (Optional: Add Trending tags here later)
          <div className="hidden md:block text-center py-20 opacity-30">
            <Search className="h-16 w-16 mx-auto mb-4" />
            <p className="text-lg">Start typing to search...</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
