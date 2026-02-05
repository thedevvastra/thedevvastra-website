"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trash2, Edit, ImagePlus } from "lucide-react";
import { BannerSheet } from "./banner-sheet"; // Ensure this path matches where you created the sheet
import { AlertModal } from "@/components/modals/alert-modal";
import { deleteSaleBanner } from "@/app/(admin)/admin/settings/sale-banner/actions";
import { toast } from "sonner";

export function BannerClient({ banners }: { banners: any[] }) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const confirmDelete = async () => {
    if (!deleteId) return;
    setIsLoading(true);
    await deleteSaleBanner(deleteId);
    setIsLoading(false);
    setDeleteOpen(false);
    toast.success("Banner deleted successfully");
  };

  return (
    <>
      <AlertModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={confirmDelete}
        loading={isLoading}
        title="Delete Banner?"
        description="This will remove the banner from the homepage."
      />

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Sale Banners</h1>
          <p className="text-muted-foreground">
            Manage portrait banners displayed on the homepage.
          </p>
        </div>
        <BannerSheet />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {banners.length === 0 ? (
          <div className="col-span-full p-10 border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-muted-foreground bg-muted/20">
            <ImagePlus className="h-10 w-10 mb-2 opacity-50" />
            <p>No banners added yet.</p>
          </div>
        ) : (
          banners.map((banner) => (
            <Card
              key={banner.id}
              className="group relative overflow-hidden flex flex-col hover:shadow-lg transition-all border-0 ring-1 ring-border"
            >
              {/* Image Preview (Portrait Aspect) */}
              <div className="relative aspect-[3/4] bg-muted w-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={banner.imageUrl}
                  alt="Banner"
                  className="h-full w-full object-cover"
                />

                {/* Overlay Actions */}
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 backdrop-blur-sm rounded-lg p-1">
                  <BannerSheet initialData={banner}>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-white hover:text-white hover:bg-white/20"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </BannerSheet>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-white/20"
                    onClick={() => {
                      setDeleteId(banner.id);
                      setDeleteOpen(true);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Info Section */}
              <div className="p-4 bg-card">
                <div className="mb-3">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">
                    Button Preview
                  </p>
                  <div
                    className="inline-block px-4 py-1.5 rounded-full text-white text-xs font-medium shadow-sm"
                    style={{ backgroundColor: banner.btnColor }}
                  >
                    {banner.ctaText}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground truncate">
                  Link: {banner.ctaLink}
                </p>
              </div>
            </Card>
          ))
        )}
      </div>
    </>
  );
}
