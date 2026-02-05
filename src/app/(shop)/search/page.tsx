import { SearchClient } from "@/components/shop/search-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search | The Dev Vastra",
  description: "Search for the best products.",
};

export default function SearchPage() {
  return <SearchClient />;
}
