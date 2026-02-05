import { db } from "@/db";
import { products, categories, brands } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProductDrawer } from "@/components/admin/products/product-drawer";
import { AdminProductCard } from "@/components/admin/products/admin-product-card";

// ✅ Force dynamic rendering to ensure fresh data
export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  // 1. Fetch Data in Parallel (Faster)
  const [allProducts, allCategories, allBrands] = await Promise.all([
    db.query.products.findMany({
      orderBy: [desc(products.createdAt)],
      with: {
        category: true, // Card mein category name dikhane ke liye
        brand: true,
      },
    }),
    db.query.categories.findMany({
      orderBy: [desc(categories.createdAt)],
    }),
    db.query.brands.findMany({
      orderBy: [desc(brands.createdAt)],
    }),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">
            Manage your store's inventory ({allProducts.length} items)
          </p>
        </div>

        {/* ✅ Add Product Button wrapped in Drawer */}
        <ProductDrawer categories={allCategories} brands={allBrands}>
          <Button className="shrink-0">
            <Plus className="mr-2 h-4 w-4" /> Add Product
          </Button>
        </ProductDrawer>
      </div>

      {/* Filter/Search Bar (Optional Placeholder for now) */}
      <div className="flex gap-2">
        <Input placeholder="Search products..." className="max-w-sm" />
      </div>

      {/* Product Grid */}
      {allProducts.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed rounded-xl">
          <p className="text-muted-foreground">No products found.</p>
          <ProductDrawer categories={allCategories} brands={allBrands}>
            <Button variant="link" className="mt-2">
              Create your first product
            </Button>
          </ProductDrawer>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {allProducts.map((product) => (
            <AdminProductCard
              key={product.id}
              product={product}
              categories={allCategories} // Pass for Edit functionality
              brands={allBrands} // Pass for Edit functionality
            />
          ))}
        </div>
      )}
    </div>
  );
}
