"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trash2, Edit, BadgeCheck } from "lucide-react";
import { BrandSheet } from "./brand-sheet";
import { AlertModal } from "@/components/modals/alert-modal";
import { deleteBrand } from "@/app/(admin)/admin/our-brands/actions";
import { toast } from "sonner";

export function BrandClient({ brands }: { brands: any[] }) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const confirmDelete = async () => {
    if (!deleteId) return;
    setIsLoading(true);
    await deleteBrand(deleteId);
    setIsLoading(false);
    setDeleteOpen(false);
    toast.success("Brand deleted");
  };

  return (
    <>
      <AlertModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={confirmDelete}
        loading={isLoading}
      />

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Our Brands</h1>
          <p className="text-muted-foreground">
            Manage trusted brand partners.
          </p>
        </div>
        <BrandSheet />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {brands.length === 0 ? (
          <div className="col-span-full p-10 border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-muted-foreground bg-muted/20">
            <BadgeCheck className="h-10 w-10 mb-2 opacity-50" />
            <p>No brands added yet.</p>
          </div>
        ) : (
          brands.map((brand) => (
            <Card
              key={brand.id}
              className="group relative flex flex-col items-center p-4 gap-3 hover:shadow-md transition-all"
            >
              {/* Image Container */}
              <div className="h-24 w-full flex items-center justify-center bg-muted/30 rounded-lg p-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={brand.imageUrl}
                  alt={brand.name}
                  className="max-h-full max-w-full object-contain mix-blend-multiply"
                />
              </div>

              <h3 className="font-semibold text-sm text-center">
                {brand.name}
              </h3>

              {/* Action Buttons (Hover pe dikhenge) */}
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 backdrop-blur-sm rounded-lg p-1 shadow-sm">
                <BrandSheet initialData={brand}>
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <Edit className="h-3 w-3" />
                  </Button>
                </BrandSheet>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-red-500 hover:bg-red-50"
                  onClick={() => {
                    setDeleteId(brand.id);
                    setDeleteOpen(true);
                  }}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>
    </>
  );
}
