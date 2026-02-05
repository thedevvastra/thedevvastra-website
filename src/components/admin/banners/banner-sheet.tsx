"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  Plus,
  Loader2,
  Save,
  Upload,
  Palette,
  Link as LinkIcon,
  Type,
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
      ctaText: "Shop Now",
      ctaLink: "/category/sale",
      btnColor: "#000000",
    },
  });

  // Reset form on open/edit
  useEffect(() => {
    if (initialData && open) {
      reset(initialData);
    } else if (!initialData && open) {
      reset({
        imageUrl: "",
        ctaText: "Shop Now",
        ctaLink: "/category/sale",
        btnColor: "#000000",
      });
    }
  }, [initialData, reset, open]);

  // Watchers for Real-time Preview
  const watchedImage = watch("imageUrl");
  const watchedColor = watch("btnColor");
  const watchedText = watch("ctaText");

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      // Unique filename
      const fileName = `bnr-${Date.now()}-${file.name.replace(/\s/g, "")}`;

      const { error } = await supabase.storage
        .from("banners")
        .upload(fileName, file);
      if (error) throw error;

      const { data } = supabase.storage.from("banners").getPublicUrl(fileName);
      setValue("imageUrl", data.publicUrl);
      toast.success("Image uploaded successfully!");
    } catch (error) {
      console.error(error);
      toast.error(
        "Upload failed. Make sure 'banners' bucket exists and is Public.",
      );
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    let res;
    if (initialData) {
      res = await updateSaleBanner(initialData.id, data);
    } else {
      res = await createSaleBanner(data);
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

      {/* ✅ UI FIX: Bottom Sheet with Rounded Corners */}
      <SheetContent
        side="bottom"
        className="h-[90vh] sm:max-w-2xl mx-auto rounded-t-[2rem] overflow-hidden flex flex-col p-0 bg-background/95 backdrop-blur-xl border-t shadow-2xl"
      >
        {/* Header */}
        <div className="px-8 py-6 border-b bg-muted/20">
          <SheetHeader>
            <SheetTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              {initialData ? "Edit Sale Banner" : "New Sale Banner"}
            </SheetTitle>
            <SheetDescription>
              Create a visually appealing portrait banner for your mobile users.
            </SheetDescription>
          </SheetHeader>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 pb-20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* --- Left Column: Image Upload --- */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2 text-primary font-semibold">
                  <ImagePlus className="h-4 w-4" /> Banner Image (Portrait)
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
                        Recommended ratio 3:4 (Vertical)
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

              {/* --- Right Column: Details & Preview --- */}
              <div className="space-y-6">
                {/* CTA Text */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Type className="h-4 w-4 text-muted-foreground" /> Button
                    Text
                  </Label>
                  <Input
                    {...register("ctaText")}
                    placeholder="Shop Now"
                    className="h-11"
                  />
                </div>

                {/* Link */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <LinkIcon className="h-4 w-4 text-muted-foreground" />{" "}
                    Redirect Link
                  </Label>
                  <Input
                    {...register("ctaLink")}
                    placeholder="/category/sale"
                    className="h-11 font-mono text-sm"
                  />
                </div>

                {/* Color Picker */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Palette className="h-4 w-4 text-muted-foreground" /> Button
                    Color
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full h-12 justify-between px-3 border-dashed hover:border-solid"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-6 h-6 rounded-full border shadow-sm ring-2 ring-white"
                            style={{ backgroundColor: watchedColor }}
                          />
                          <span className="font-mono text-xs text-muted-foreground">
                            {watchedColor}
                          </span>
                        </div>
                        <span className="text-xs text-primary font-medium">
                          Pick Color
                        </span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-64 p-3" align="start">
                      <Label className="mb-2 block text-xs font-medium text-muted-foreground">
                        Select Hex Color
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          type="color"
                          {...register("btnColor")}
                          className="h-10 w-10 p-0.5 rounded-md cursor-pointer border-0"
                        />
                        <Input
                          {...register("btnColor")}
                          placeholder="#000000"
                          className="flex-1 uppercase font-mono"
                          maxLength={7}
                        />
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Live Preview Box */}
                <div className="pt-4 mt-4 border-t">
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider mb-3 block">
                    Live Button Preview
                  </Label>
                  <div className="bg-muted/30 p-6 rounded-xl flex items-center justify-center border border-dashed">
                    <button
                      type="button"
                      className="px-8 py-3 rounded-full text-white font-bold text-sm tracking-wide shadow-lg transform transition-all hover:scale-105 active:scale-95"
                      style={{ backgroundColor: watchedColor }}
                    >
                      {watchedText || "Button Text"}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Sticky Footer Action */}
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
