"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit } from "lucide-react";
import { ProductSheet } from "./product-sheet";
import { AlertModal } from "@/components/modals/alert-modal";
import { deleteProduct } from "@/app/(admin)/admin/products/actions";
import { toast } from "sonner";

interface ProductsClientProps {
  products: any[];
  brands: any[];
  categories: any[];
}

export function ProductsClient({
  products,
  brands,
  categories,
}: ProductsClientProps) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const confirmDelete = async () => {
    if (!deleteId) return;
    setIsLoading(true);
    await deleteProduct(deleteId);
    setIsLoading(false);
    setDeleteOpen(false);
    toast.success("Product deleted");
  };

  return (
    <>
      <AlertModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={confirmDelete}
        loading={isLoading}
        title="Delete Product?"
        description="This action cannot be undone."
      />

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">
            Products
          </h1>
          <p className="text-muted-foreground">Manage your store inventory.</p>
        </div>
        {/* Pass dropdown data to "Add New" Sheet */}
        <ProductSheet brands={brands} categories={categories} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.length === 0 ? (
          <div className="col-span-full text-center py-20 text-muted-foreground border-2 border-dashed rounded-xl">
            No products found. Start by adding one.
          </div>
        ) : (
          products.map((product) => (
            <Card
              key={product.id}
              className="overflow-hidden flex flex-col group hover:shadow-md transition-shadow"
            >
              <div className="relative h-48 bg-muted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={product.thumbnailUrl}
                  alt={product.title}
                  className="h-full w-full object-cover"
                />

                {/* Edit/Delete Overlay */}
                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {/* ✅ EDIT BUTTON: Opens Sheet with Initial Data */}
                  <ProductSheet
                    brands={brands}
                    categories={categories}
                    initialData={product}
                  >
                    <Button
                      size="icon"
                      variant="secondary"
                      className="h-8 w-8 shadow-sm"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </ProductSheet>

                  {/* ✅ DELETE BUTTON */}
                  <Button
                    size="icon"
                    variant="destructive"
                    className="h-8 w-8 shadow-sm"
                    onClick={() => {
                      setDeleteId(product.id);
                      setDeleteOpen(true);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold line-clamp-1">{product.title}</h3>
                  <Badge variant="outline">₹{product.sellingPrice}</Badge>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2 mb-4">
                  {product.description}
                </p>

                <div className="flex gap-2 text-xs text-muted-foreground mt-auto items-center">
                  <span
                    className={
                      product.stock < 5 ? "text-red-500 font-medium" : ""
                    }
                  >
                    Stock: {product.stock}
                  </span>
                  {product.colors && product.colors.length > 0 && (
                    <>
                      <span>•</span>
                      <div className="flex -space-x-1">
                        {product.colors.map((c: any, i: number) => (
                          <div
                            key={i}
                            className="w-3 h-3 rounded-full border border-white"
                            style={{ backgroundColor: c.hex }}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </>
  );
}
