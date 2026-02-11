"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Plus, Loader2, Save } from "lucide-react";
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
  createHeroSlide,
  updateHeroSlide,
} from "@/app/(admin)/admin/settings/hero/actions";
import { cn } from "@/lib/utils";
import { ImageUpload } from "@/components/ui/image-upload";

/* eslint-disable  @typescript-eslint/no-explicit-any */

interface HeroSlideSheetProps {
  initialData?: any;
  children?: React.ReactNode;
}

export function HeroSlideSheet({ initialData, children }: HeroSlideSheetProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, reset, watch, setValue } = useForm({
    defaultValues: initialData || {
      title: "", // Internal use only
      ctaLink: "/",
      imageUrl: "",
      // Defaults for hidden fields to satisfy DB constraints
      description: "",
      ctaText: "",
      bgColor: "bg-background",
      textColor: "text-foreground",
    },
  });

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset, open]);

  const watchedValues = watch();

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    let res;

    const payload = {
      ...data,
      // Ensure hidden fields have fallback values if empty
      description: data.description || "",
      ctaText: data.ctaText || "Shop Now",
    };

    if (initialData) {
      res = await updateHeroSlide(initialData.id, payload);
    } else {
      res = await createHeroSlide(payload);
    }

    setIsLoading(false);

    if (res?.error) {
      toast.error(res.error);
    } else {
      toast.success(initialData ? "Banner updated!" : "Banner created!");
      setOpen(false);
      if (!initialData) reset();
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {children || (
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> Add New Banner
          </Button>
        )}
      </SheetTrigger>

      <SheetContent
        side="bottom"
        className="h-[85vh] sm:max-w-4xl mx-auto rounded-t-2xl overflow-y-auto px-4 md:px-10"
      >
        <div className="max-w-4xl mx-auto">
          <SheetHeader className="mt-4 border-b pb-4">
            <SheetTitle>
              {initialData ? "Edit Banner" : "Add New Banner"}
            </SheetTitle>
            <SheetDescription>
              Upload a banner image and set the redirection link.
            </SheetDescription>
          </SheetHeader>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mt-8 pb-10">
            {/* --- LEFT SIDE: FORM --- */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-6 order-2 lg:order-1"
            >
              {/* Internal Name */}
              <div className="space-y-2">
                <Label>Banner Name (Internal)</Label>
                <Input
                  {...register("title", { required: true })}
                  placeholder="e.g. Summer Sale Banner"
                />
                <p className="text-xs text-muted-foreground">
                  Only visible to admin.
                </p>
              </div>

              {/* Link */}
              <div className="space-y-2">
                <Label>Redirect Link</Label>
                <Input
                  {...register("ctaLink")}
                  placeholder="/categories/men or https://..."
                />
                <p className="text-xs text-muted-foreground">
                  Where should the user go when clicking the image?
                </p>
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <Label>Banner Image</Label>
                <ImageUpload
                  value={watchedValues.imageUrl}
                  onChange={(url) => setValue("imageUrl", url)}
                  onRemove={() => setValue("imageUrl", "")}
                  bucketName="hero-slides"
                />
                <input
                  type="hidden"
                  {...register("imageUrl", { required: true })}
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 text-md mt-4"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin mr-2" />
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" /> Save Banner
                  </>
                )}
              </Button>
            </form>

            {/* --- RIGHT SIDE: PREVIEW --- */}
            <div className="order-1 lg:order-2">
              <div className="sticky top-0 space-y-3">
                <Label className="text-xs uppercase text-muted-foreground font-bold tracking-wider">
                  Preview
                </Label>

                <div className="relative w-full aspect-video rounded-xl overflow-hidden border shadow-sm bg-muted/20 flex items-center justify-center">
                  {watchedValues.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={watchedValues.imageUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-muted-foreground text-sm">
                      No Image Selected
                    </span>
                  )}
                </div>
                <p className="text-xs text-center text-muted-foreground mt-2">
                  This banner will be clickable on the homepage.
                </p>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
