"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Trash2,
  Edit,
  MoreVertical,
  ExternalLink,
  ImageIcon,
  Power,
} from "lucide-react";
import { HeroSlideSheet } from "@/components/admin/hero/slide-sheet";
import { AlertModal } from "@/components/modals/alert-modal";
import { deleteHeroSlide } from "@/app/(admin)/admin/settings/hero/actions";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";

/* eslint-disable  @typescript-eslint/no-explicit-any */

export function HeroClient({ slides }: { slides: any[] }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const onDeleteClick = (id: string) => {
    setDeleteId(id);
    setOpen(true);
  };

  const onConfirm = async () => {
    if (!deleteId) return;
    setLoading(true);
    try {
      await deleteHeroSlide(deleteId);
      toast.success("Slide deleted successfully");
      setOpen(false);
      setDeleteId(null);
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={loading}
      />

      {/* --- HEADER --- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Hero Banners</h1>
          <p className="text-muted-foreground mt-1">
            Manage your homepage banner images and links.
          </p>
        </div>
        <HeroSlideSheet />
      </div>

      {/* --- CONTENT --- */}
      {slides.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 border-2 border-dashed border-border/50 rounded-xl bg-muted/10 text-center animate-in fade-in zoom-in duration-500">
          <div className="bg-background p-4 rounded-full shadow-sm mb-4">
            <ImageIcon className="h-8 w-8 text-muted-foreground/50" />
          </div>
          <h3 className="text-lg font-semibold">No Banners Added</h3>
          <p className="text-muted-foreground text-sm max-w-sm mt-2 mb-6">
            Upload high-quality images to showcase your latest offers and
            collections.
          </p>
          <HeroSlideSheet />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {slides.map((slide) => (
            <div
              key={slide.id}
              className="group relative bg-card rounded-xl border border-border/50 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
            >
              {/* IMAGE AREA */}
              <div className="relative aspect-[2/1] w-full bg-muted overflow-hidden">
                {slide.imageUrl ? (
                  <Image
                    src={slide.imageUrl}
                    alt={slide.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                    <ImageIcon className="h-10 w-10 opacity-20" />
                  </div>
                )}

                {/* Status Badge */}
                <div className="absolute top-3 left-3">
                  <Badge
                    variant={slide.isActive ? "default" : "secondary"}
                    className="bg-white/90 text-black hover:bg-white backdrop-blur-sm shadow-sm"
                  >
                    {slide.isActive ? (
                      <span className="flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                        Active
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-muted-foreground">
                        <Power className="h-3 w-3" />
                        Inactive
                      </span>
                    )}
                  </Badge>
                </div>

                {/* Quick Actions (Top Right) */}
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="secondary"
                        size="icon"
                        className="h-8 w-8 rounded-full bg-white/90 hover:bg-white shadow-sm"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <HeroSlideSheet initialData={slide}>
                        {/* preventDefault is vital for dropdown inside another trigger */}
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                          <Edit className="mr-2 h-4 w-4" /> Edit Details
                        </DropdownMenuItem>
                      </HeroSlideSheet>
                      <DropdownMenuItem
                        className="text-red-600 focus:text-red-600 focus:bg-red-50"
                        onClick={() => onDeleteClick(slide.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* DETAILS AREA */}
              <div className="p-4 space-y-3">
                <div className="space-y-1">
                  <h3
                    className="font-semibold text-base truncate"
                    title={slide.title}
                  >
                    {slide.title || "Untitled Banner"}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 p-1.5 rounded-md w-fit max-w-full">
                    <ExternalLink className="h-3 w-3 shrink-0" />
                    <span className="truncate">{slide.ctaLink || "/"}</span>
                  </div>
                </div>

                <Separator />

                {/* Footer Actions */}
                <div className="flex items-center gap-2 pt-1">
                  <HeroSlideSheet initialData={slide}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 h-8 text-xs"
                    >
                      <Edit className="mr-2 h-3.5 w-3.5" /> Edit
                    </Button>
                  </HeroSlideSheet>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-red-600 hover:bg-red-50 border-dashed"
                    onClick={() => onDeleteClick(slide.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
