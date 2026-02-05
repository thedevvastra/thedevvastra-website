"use client";

import { useState, useEffect } from "react";
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
  createBrand,
  updateBrand,
} from "@/app/(admin)/admin/our-brands/actions";
import { createClient } from "@/utils/supabase/client";

interface BrandSheetProps {
  initialData?: any;
  children?: React.ReactNode;
}

export function BrandSheet({ initialData, children }: BrandSheetProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const supabase = createClient();

  const { register, handleSubmit, reset, setValue, watch } = useForm({
    defaultValues: {
      name: "",
      imageUrl: "",
    },
  });

  useEffect(() => {
    if (initialData && open) {
      reset(initialData);
    } else if (!initialData && open) {
      reset({ name: "", imageUrl: "" });
    }
  }, [initialData, open, reset]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileName = `${Date.now()}-${file.name}`;
      const { error } = await supabase.storage
        .from("brands")
        .upload(fileName, file);
      if (error) throw error;
      const { data } = supabase.storage.from("brands").getPublicUrl(fileName);
      setValue("imageUrl", data.publicUrl);
      toast.success("Brand image uploaded");
    } catch (error) {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    let res;
    if (initialData) {
      res = await updateBrand(initialData.id, data);
    } else {
      res = await createBrand(data);
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
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> Add Brand
          </Button>
        )}
      </SheetTrigger>
      <SheetContent
        side="bottom"
        className="h-[60vh] sm:max-w-md mx-auto rounded-t-2xl"
      >
        <div className="max-w-sm mx-auto mt-4">
          <SheetHeader>
            <SheetTitle>{initialData ? "Edit Brand" : "Add Brand"}</SheetTitle>
            <SheetDescription>
              Upload brand logo (WebP recommended).
            </SheetDescription>
          </SheetHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-6">
            <div className="space-y-2">
              <Label>Brand Name</Label>
              <Input
                {...register("name", { required: true })}
                placeholder="e.g. Nike"
              />
            </div>

            <div className="space-y-2">
              <Label>Brand Logo</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
              />
              {watch("imageUrl") && (
                <div className="mt-2 h-20 w-20 border rounded-lg overflow-hidden flex items-center justify-center p-2 bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={watch("imageUrl")}
                    alt="Preview"
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              )}
            </div>

            <Button
              type="submit"
              disabled={isLoading || uploading}
              className="w-full"
            >
              {isLoading ? (
                <Loader2 className="animate-spin mr-2" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Save Brand
            </Button>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
