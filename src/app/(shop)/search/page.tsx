import { SearchClient } from "@/components/shop/search-client";
import { Metadata } from "next";
import { Suspense } from "react"; // ✅ Import Suspense

export const metadata: Metadata = {
  title: "Search | The Dev Vastra",
  description: "Search for the best products.",
};

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full h-[50vh] flex items-center justify-center text-muted-foreground">
          Loading search...
        </div>
      }
    >
      <SearchClient />
    </Suspense>
  );
}
