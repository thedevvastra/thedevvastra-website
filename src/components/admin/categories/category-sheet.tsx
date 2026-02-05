"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  Plus,
  Loader2,
  Save,
  UploadCloud,
  X,
  Layers,
  Type,
  Link2,
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
  SheetFooter,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  createCategory,
  updateCategory,
} from "@/app/(admin)/admin/categories/actions";
import { createClient } from "@/utils/supabase/client";
import { slugify } from "@/lib/utils";

interface CategorySheetProps {
  existingCategories: any[];
  initialData?: any;
  children?: React.ReactNode;
}

export function CategorySheet({
  existingCategories,
  initialData,
  children,
}: CategorySheetProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const mainCategories = existingCategories.filter((c) => c.parentId === null);
  const supabase = createClient();

  const { register, handleSubmit, reset, setValue, watch } = useForm({
    defaultValues: {
      name: "",
      slug: "",
      imageUrl: "",
      parentId: "null",
    },
  });

  const imageUrl = watch("imageUrl");

  useEffect(() => {
    if (open) {
      if (initialData) {
        reset({
          name: initialData.name,
          slug: initialData.slug,
          imageUrl: initialData.imageUrl || "",
          parentId: initialData.parentId || "null",
        });
      } else {
        reset({ name: "", slug: "", imageUrl: "", parentId: "null" });
      }
    }
  }, [initialData, open, reset]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setValue("name", val);
    if (!initialData) setValue("slug", slugify(val));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      // Create a unique file name
      const fileExt = file.name.split(".").pop();
      const fileName = `cat-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      const { error } = await supabase.storage
        .from("categories")
        .upload(fileName, file);

      if (error) throw error;

      const { data } = supabase.storage
        .from("categories")
        .getPublicUrl(fileName);

      setValue("imageUrl", data.publicUrl);
      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Image upload failed. Try again.");
    } finally {
      setUploading(false);
      // Reset input value so same file can be selected again if needed
      e.target.value = "";
    }
  };

  const removeImage = () => setValue("imageUrl", "");

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    const payload = {
      ...data,
      parentId: data.parentId === "null" ? null : data.parentId,
    };

    let res;
    if (initialData) {
      res = await updateCategory(initialData.id, payload);
    } else {
      res = await createCategory(payload);
    }

    setIsLoading(false);

    if (res?.error) {
      toast.error(res.error);
    } else {
      toast.success(initialData ? "Category updated" : "Category created");
      setOpen(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {children || (
          <Button size="sm" className="gap-2 shadow-sm">
            <Plus className="h-4 w-4" /> Add Category
          </Button>
        )}
      </SheetTrigger>

      <SheetContent
        side="bottom"
        className="h-[85vh] sm:max-w-2xl mx-auto rounded-t-[24px] p-0 flex flex-col shadow-2xl overflow-hidden"
      >
        {/* HEADER */}
        <SheetHeader className="px-6 py-5 border-b bg-muted/10">
          <div className="mx-auto w-12 h-1.5 rounded-full bg-muted-foreground/20 mb-4" />
          <SheetTitle className="text-xl flex items-center gap-2">
            {initialData ? <EditIcon /> : <PlusIcon />}
            {initialData ? "Edit Category" : "New Category"}
          </SheetTitle>
          <SheetDescription>
            {initialData
              ? "Update the details below."
              : "Fill in the details to create a new category."}
          </SheetDescription>
        </SheetHeader>

        {/* SCROLLABLE FORM AREA */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <form
            id="category-form"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-8"
          >
            {/* Hierarchy Section */}
            <div className="space-y-3">
              <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <Layers className="h-3 w-3" /> Structure
              </Label>
              <div className="bg-card border rounded-xl p-1">
                <Select
                  onValueChange={(val) => setValue("parentId", val)}
                  defaultValue={initialData?.parentId || "null"}
                >
                  <SelectTrigger className="border-0 shadow-none focus:ring-0 h-12">
                    <SelectValue placeholder="Select Parent Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem
                      value="null"
                      className="font-semibold text-primary"
                    >
                      Main Category (No Parent)
                    </SelectItem>
                    {mainCategories.map(
                      (cat) =>
                        cat.id !== initialData?.id && (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </SelectItem>
                        ),
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Basic Info Section */}
            <div className="space-y-3">
              <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <Type className="h-3 w-3" /> Basic Info
              </Label>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>
                    Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    {...register("name", { required: true })}
                    onChange={handleNameChange}
                    placeholder="e.g. Men's Wear"
                    className="bg-muted/30"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-1.5">
                    <Link2 className="h-3 w-3" /> Slug
                  </Label>
                  <Input
                    {...register("slug")}
                    readOnly={!initialData}
                    className="bg-muted font-mono text-xs text-muted-foreground"
                  />
                </div>
              </div>
            </div>

            {/* Image Upload Section - FIXED */}
            <div className="space-y-3">
              <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <UploadCloud className="h-3 w-3" /> Thumbnail
              </Label>

              {!imageUrl ? (
                <div className="relative border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center gap-3 hover:bg-muted/30 transition group">
                  {/* ✅ FIX: Used native input with absolute inset-0 and z-50 */}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-50"
                  />
                  <div className="p-4 bg-primary/5 rounded-full text-primary group-hover:scale-110 transition-transform pointer-events-none">
                    {uploading ? (
                      <Loader2 className="h-6 w-6 animate-spin" />
                    ) : (
                      <UploadCloud className="h-6 w-6" />
                    )}
                  </div>
                  <div className="text-center space-y-1 pointer-events-none">
                    <p className="text-sm font-semibold text-foreground">
                      Click to upload image
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Recommended: 200x200px (JPG/PNG)
                    </p>
                  </div>
                </div>
              ) : (
                <div className="relative rounded-xl border overflow-hidden h-48 w-full group bg-muted/20 flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="h-full object-contain"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 z-50">
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={removeImage}
                      className="rounded-full"
                    >
                      <X className="h-4 w-4 mr-1" /> Remove
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </form>
        </div>

        {/* FOOTER */}
        <SheetFooter className="border-t p-6 bg-background flex-row gap-3 sm:justify-between">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="category-form"
            disabled={isLoading || uploading}
            className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isLoading ? (
              <Loader2 className="animate-spin mr-2 h-4 w-4" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            {initialData ? "Save Changes" : "Create Category"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

// Icons
function PlusIcon() {
  return (
    <div className="bg-primary/10 p-1 rounded text-primary">
      <Plus className="h-4 w-4" />
    </div>
  );
}
function EditIcon() {
  return (
    <div className="bg-orange-100 p-1 rounded text-orange-600">
      <Layers className="h-4 w-4" />
    </div>
  );
}
