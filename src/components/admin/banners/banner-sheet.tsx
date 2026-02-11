"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  Plus,
  Loader2,
  Save,
  Upload,
  Link as LinkIcon,
  ImagePlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  createSaleBanner,
  updateSaleBanner,
} from "@/app/(admin)/admin/settings/sale-banner/actions";
import { createClient } from "@/utils/supabase/client";
import { cn } from "@/lib/utils";

interface BannerSheetProps {
  initialData?: any;
  children?: React.ReactNode;
}

export function BannerSheet({ initialData, children }: BannerSheetProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const supabase = createClient();

  const { register, handleSubmit, reset, setValue, watch } = useForm({
    defaultValues: initialData || {
      imageUrl: "",
      ctaLink: "/",
      // Hidden defaults for DB compatibility
      ctaText: "",
      btnColor: "#000000",
    },
  });

  useEffect(() => {
    if (initialData && open) {
      reset(initialData);
    } else if (!initialData && open) {
      reset({
        imageUrl: "",
        ctaLink: "/",
      });
    }
  }, [initialData, reset, open]);

  const watchedImage = watch("imageUrl");

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileName = `bnr-${Date.now()}-${file.name.replace(/\s/g, "")}`;
      const { error } = await supabase.storage
        .from("banners")
        .upload(fileName, file);
      if (error) throw error;

      const { data } = supabase.storage.from("banners").getPublicUrl(fileName);
      setValue("imageUrl", data.publicUrl);
      toast.success("Image uploaded!");
    } catch (error) {
      console.error(error);
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    let res;

    // Ensure hidden fields have fallback values
    const payload = { ...data, ctaText: "Shop", btnColor: "#000" };

    if (initialData) {
      res = await updateSaleBanner(initialData.id, payload);
    } else {
      res = await createSaleBanner(payload);
    }
    setIsLoading(false);

    if (res?.success) {
      toast.success(res.success);
      setOpen(false);
      if (!initialData) reset();
    } else {
      toast.error(res?.error);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {children || (
          <Button className="gap-2 shadow-sm hover:scale-105 transition-transform">
            <Plus className="h-4 w-4" /> Add Banner
          </Button>
        )}
      </SheetTrigger>

      <SheetContent
        side="bottom"
        className="h-[85vh] sm:max-w-2xl mx-auto rounded-t-[2rem] overflow-hidden flex flex-col p-0 bg-background/95 backdrop-blur-xl border-t shadow-2xl"
      >
        <div className="px-8 py-6 border-b bg-muted/20">
          <SheetHeader>
            <SheetTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              {initialData ? "Edit Sale Banner" : "New Sale Banner"}
            </SheetTitle>
            <SheetDescription>
              Upload an image (Portrait 3:4) and set the link.
            </SheetDescription>
          </SheetHeader>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 pb-20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* --- Image Upload --- */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2 text-primary font-semibold">
                  <ImagePlus className="h-4 w-4" /> Banner Image
                </Label>

                <div
                  className={cn(
                    "relative aspect-[3/4] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center bg-muted/10 overflow-hidden transition-all group",
                    watchedImage
                      ? "border-solid border-primary/20"
                      : "hover:border-primary/50 hover:bg-muted/20",
                  )}
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer z-20"
                    disabled={uploading}
                  />

                  {watchedImage ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={watchedImage}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        <p className="text-white font-medium flex items-center gap-2">
                          <Upload className="h-4 w-4" /> Change Image
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className="text-center p-6 space-y-2">
                      <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary mb-2">
                        <Upload className="h-6 w-6" />
                      </div>
                      <p className="text-sm font-medium text-foreground">
                        Click to upload image
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Ratio 3:4 (Portrait)
                      </p>
                    </div>
                  )}

                  {uploading && (
                    <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-30">
                      <Loader2 className="animate-spin text-primary h-8 w-8" />
                    </div>
                  )}
                </div>
              </div>

              {/* --- Link Input --- */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <LinkIcon className="h-4 w-4 text-muted-foreground" />
                    Destination Link
                  </Label>
                  <Input
                    {...register("ctaLink")}
                    placeholder="/category/sale"
                    className="h-11 font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground">
                    Where should the user go when clicking this banner?
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button
                type="submit"
                disabled={isLoading || uploading}
                className="w-full md:w-auto min-w-[200px] h-12 text-base"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin mr-2" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                {initialData ? "Update Banner" : "Save Banner"}
              </Button>
            </div>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
