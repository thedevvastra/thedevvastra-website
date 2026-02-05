"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trash2, Edit } from "lucide-react";
import { HeroSlideSheet } from "@/components/admin/hero/slide-sheet";
import { AlertModal } from "@/components/modals/alert-modal";
import { deleteHeroSlide } from "@/app/(admin)/admin/settings/hero/actions";
import { toast } from "sonner";

export function HeroClient({ slides }: { slides: any[] }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Trigger Delete Modal
  const onDeleteClick = (id: string) => {
    setDeleteId(id);
    setOpen(true);
  };

  // Confirm Delete Action
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
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={loading}
      />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Hero Section Settings
          </h1>
          <p className="text-muted-foreground">
            Manage your homepage sliders here.
          </p>
        </div>
        <HeroSlideSheet />
      </div>

      {slides.length === 0 ? (
        <div className="p-10 border-2 border-dashed rounded-xl flex items-center justify-center text-muted-foreground bg-muted/20">
          No sliders created yet. Click "Add New Slide" to start.
        </div>
      ) : (
        <div className="grid gap-4 mt-6">
          {slides.map((slide) => (
            <Card
              key={slide.id}
              className="overflow-hidden flex items-center p-4 gap-4 hover:shadow-md transition-shadow"
            >
              {/* Preview Box */}
              <div
                className={`h-16 w-24 rounded-lg border ${slide.bgColor} flex items-center justify-center relative overflow-hidden`}
              >
                {slide.imageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={slide.imageUrl}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover opacity-50"
                  />
                )}
              </div>

              <div className="flex-1">
                <h3 className="font-bold text-lg">{slide.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-1">
                  {slide.description}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {/* Edit Button -> Opens Sheet with Data */}
                <HeroSlideSheet initialData={slide}>
                  <Button variant="outline" size="icon">
                    <Edit className="h-4 w-4" />
                  </Button>
                </HeroSlideSheet>

                {/* Delete Button -> Opens Modal */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-500 hover:bg-red-50 hover:text-red-600"
                  onClick={() => onDeleteClick(slide.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
