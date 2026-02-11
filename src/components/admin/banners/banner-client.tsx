"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Trash2,
  Edit,
  ImagePlus,
  Link as LinkIcon,
  ExternalLink,
} from "lucide-react";
import { BannerSheet } from "./banner-sheet";
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
    try {
      await deleteSaleBanner(deleteId);
      toast.success("Banner deleted successfully");
      setDeleteOpen(false);
      setDeleteId(null);
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={confirmDelete}
        loading={isLoading}
        title="Delete Banner?"
        description="This action cannot be undone."
      />

      {/* --- HEADER --- */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sale Banners</h1>
          <p className="text-muted-foreground mt-1">
            Manage your homepage portrait banners.
          </p>
        </div>
        <BannerSheet />
      </div>

      {/* --- GRID LAYOUT --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {banners.length === 0 ? (
          <div className="col-span-full py-16 flex flex-col items-center justify-center border-2 border-dashed rounded-xl bg-muted/10 text-muted-foreground">
            <div className="bg-background p-4 rounded-full shadow-sm mb-4">
              <ImagePlus className="h-8 w-8 opacity-50" />
            </div>
            <p>No banners active. Add one to get started.</p>
          </div>
        ) : (
          banners.map((banner) => (
            <div
              key={banner.id}
              className="group bg-card border rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-300"
            >
              {/* 1. IMAGE AREA (Rounded inside the padded box) */}
              <div className="relative aspect-[3/4] w-full bg-muted rounded-xl overflow-hidden mb-4 border shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={banner.imageUrl}
                  alt="Banner"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              {/* 2. LINK INFO */}
              <div className="flex items-center gap-2 mb-4 bg-muted/50 p-2 rounded-lg text-xs text-muted-foreground">
                <LinkIcon className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate font-mono">
                  {banner.ctaLink || "/"}
                </span>
                <ExternalLink className="h-3 w-3 ml-auto opacity-50" />
              </div>

              {/* 3. ACTION BUTTONS (Edit & Delete Side-by-Side) */}
              <div className="grid grid-cols-2 gap-3">
                {/* Edit Button */}
                <BannerSheet initialData={banner}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full flex items-center gap-2 hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    <Edit className="h-3.5 w-3.5" /> Edit
                  </Button>
                </BannerSheet>

                {/* Delete Button */}
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full flex items-center gap-2 text-red-500 hover:text-red-600 hover:bg-red-50 hover:border-red-200"
                  onClick={() => {
                    setDeleteId(banner.id);
                    setDeleteOpen(true);
                  }}
                >
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
