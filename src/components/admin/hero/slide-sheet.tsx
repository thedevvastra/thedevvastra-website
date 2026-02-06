"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Plus, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
// ✅ Import the new component
import { ImageUpload } from "@/components/ui/image-upload";

interface HeroSlideSheetProps {
  initialData?: any;
  children?: React.ReactNode;
}

export function HeroSlideSheet({ initialData, children }: HeroSlideSheetProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // ✅ Added `setValue` to destructuring
  const { register, handleSubmit, reset, watch, setValue } = useForm({
    defaultValues: initialData || {
      title: "",
      description: "",
      ctaText: "Explore",
      ctaLink: "/",
      imageUrl: "",
      bgColor: "bg-[#FAF8F3]",
      textColor: "text-[#2D1B15]",
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

    if (initialData) {
      res = await updateHeroSlide(initialData.id, data);
    } else {
      res = await createHeroSlide(data);
    }

    setIsLoading(false);

    if (res?.error) {
      toast.error(res.error);
    } else {
      toast.success(initialData ? "Slide updated!" : "Slide created!");
      setOpen(false);
      if (!initialData) reset();
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {children || (
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> Add New Slide
          </Button>
        )}
      </SheetTrigger>

      <SheetContent
        side="bottom"
        className="h-[90vh] sm:max-w-4xl mx-auto rounded-t-2xl overflow-y-auto px-4 md:px-10"
      >
        <div className="max-w-4xl mx-auto">
          <SheetHeader className="mt-4">
            <SheetTitle>
              {initialData ? "Edit Slide" : "Add New Slide"}
            </SheetTitle>
            <SheetDescription>
              {initialData
                ? "Update your banner details."
                : "Create a new hero slider. Changes reflect in real-time."}
            </SheetDescription>
          </SheetHeader>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mt-8 pb-10">
            {/* --- LEFT SIDE: FORM --- */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-5 order-2 lg:order-1"
            >
              <div className="space-y-2">
                <Label>Title (H1)</Label>
                <Input
                  {...register("title", { required: true })}
                  placeholder="e.g. Summer Sale"
                />
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  {...register("description")}
                  placeholder="Short description..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>CTA Text</Label>
                  <Input {...register("ctaText")} />
                </div>
                <div className="space-y-2">
                  <Label>CTA Link</Label>
                  <Input {...register("ctaLink")} />
                </div>
              </div>

              {/* ✅ CHANGED: Replaced Text Input with ImageUpload */}
              <div className="space-y-2">
                <Label>Hero Image</Label>
                <ImageUpload
                  value={watchedValues.imageUrl}
                  onChange={(url) => setValue("imageUrl", url)}
                  onRemove={() => setValue("imageUrl", "")}
                  bucketName="hero-slides" // Make sure bucket exists in Supabase
                />
                {/* Hidden input to ensure validation if needed */}
                <input type="hidden" {...register("imageUrl")} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Background Color</Label>
                  <Input
                    {...register("bgColor")}
                    placeholder="bg-blue-100 or #Hex"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Text Color</Label>
                  <Input
                    {...register("textColor")}
                    placeholder="text-black or #Hex"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 text-md mt-2"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin mr-2" />
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" /> Save Slide
                  </>
                )}
              </Button>
            </form>

            {/* --- RIGHT SIDE: LIVE PREVIEW (Sticky) --- */}
            <div className="order-1 lg:order-2">
              <div className="sticky top-0 space-y-3">
                <Label className="text-xs uppercase text-muted-foreground font-bold tracking-wider">
                  Live Preview
                </Label>

                <div
                  className={cn(
                    "relative w-full aspect-video rounded-3xl overflow-hidden border-2 shadow-sm flex flex-col justify-center p-8 transition-all",
                    watchedValues.bgColor,
                  )}
                  // Support for HEX colors in inline styles if Tailwind class fails
                  style={
                    watchedValues.bgColor.startsWith("#")
                      ? { backgroundColor: watchedValues.bgColor }
                      : {}
                  }
                >
                  {/* Overlay Image */}
                  {watchedValues.imageUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={watchedValues.imageUrl}
                      alt="Preview"
                      className="absolute right-0 top-0 h-full w-2/3 object-cover opacity-20 mask-image-gradient-horizontal"
                      style={{
                        maskImage:
                          "linear-gradient(to right, transparent, black)",
                        WebkitMaskImage:
                          "linear-gradient(to right, transparent, black)",
                      }}
                    />
                  )}

                  <div className="relative z-10 max-w-[80%]">
                    <h1
                      className={cn(
                        "text-3xl md:text-4xl font-bold leading-tight mb-3 transition-colors",
                        watchedValues.textColor,
                      )}
                      style={
                        watchedValues.textColor.startsWith("#")
                          ? { color: watchedValues.textColor }
                          : {}
                      }
                    >
                      {watchedValues.title || "Your Title Here"}
                    </h1>
                    <p
                      className={cn(
                        "text-sm md:text-base opacity-90 mb-6 line-clamp-2 transition-colors",
                        watchedValues.textColor,
                      )}
                      style={
                        watchedValues.textColor.startsWith("#")
                          ? { color: watchedValues.textColor }
                          : {}
                      }
                    >
                      {watchedValues.description ||
                        "Your description will appear here..."}
                    </p>
                    <div className="px-6 py-3 rounded-full bg-primary text-primary-foreground text-sm font-semibold inline-flex items-center w-fit shadow-lg">
                      {watchedValues.ctaText || "Button"}
                    </div>
                  </div>
                </div>

                <p className="text-xs text-center text-muted-foreground mt-2">
                  This is how it will appear on the website.
                </p>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
