"use client";

import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Loader2,
  Plus,
  Trash2,
  X,
  Save,
  Upload,
  Image as ImageIcon,
  Palette,
  Layers,
  DollarSign,
  Tag,
} from "lucide-react";
import { useRouter } from "next/navigation";

// Validators & Actions
import { productSchema, ProductSchema } from "@/lib/validators/product";
import {
  createProductAction,
  updateProductAction,
} from "@/app/(admin)/actions";
import { createClient } from "@/utils/supabase/client";

// UI Components
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

// Types
type Category = { id: string; name: string; parentId: string | null };
type Brand = { id: string; name: string };

interface ProductDrawerProps {
  children?: React.ReactNode;
  categories: Category[];
  brands: Brand[];
  productToEdit?: any;
  open?: boolean;
  setOpen?: (open: boolean) => void;
}

export function ProductDrawer({
  children,
  categories,
  brands,
  productToEdit,
  open: controlledOpen,
  setOpen: setControlledOpen,
}: ProductDrawerProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const isOpen = controlledOpen ?? internalOpen;
  const setIsOpen = setControlledOpen ?? setInternalOpen;
  const isEditMode = !!productToEdit;
  const [uploading, setUploading] = useState(false);

  // 1. Form Setup
  const form = useForm<ProductSchema>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: "",
      description: "",
      sellingPrice: 0,
      oldPrice: 0,
      stock: 0,
      categoryId: "",
      subCategoryId: null,
      brandId: null,
      thumbnailUrl: "",
      additionalImages: [],
      sizes: "",
      colors: [],
    },
  });

  // Watchers
  const watchedThumbnail = form.watch("thumbnailUrl");
  const watchedAdditionalImages = form.watch("additionalImages") || [];
  const selectedCategoryId = form.watch("categoryId");

  const mainCategories = categories.filter((c) => !c.parentId);
  const subCategories = categories.filter(
    (c) => c.parentId === selectedCategoryId,
  );

  // Dynamic Colors
  const {
    fields: colorFields,
    append: appendColor,
    remove: removeColor,
  } = useFieldArray({
    control: form.control,
    name: "colors",
  });

  // Reset Logic
  useEffect(() => {
    if (isOpen) {
      if (productToEdit) {
        form.reset({
          title: productToEdit.title,
          description: productToEdit.description,
          sellingPrice: Number(productToEdit.sellingPrice),
          oldPrice: productToEdit.oldPrice ? Number(productToEdit.oldPrice) : 0,
          stock: Number(productToEdit.stock),
          categoryId: productToEdit.categoryId,
          subCategoryId: productToEdit.subCategoryId || null,
          brandId: productToEdit.brandId || null,
          thumbnailUrl: productToEdit.thumbnailUrl,
          additionalImages: productToEdit.additionalImages || [],
          sizes: Array.isArray(productToEdit.sizes)
            ? productToEdit.sizes.join(", ")
            : "",
          colors: productToEdit.colors || [],
        });
      } else {
        form.reset({
          title: "",
          description: "",
          sellingPrice: 0,
          oldPrice: 0,
          stock: 0,
          categoryId: "",
          subCategoryId: null,
          brandId: null,
          thumbnailUrl: "",
          additionalImages: [],
          sizes: "",
          colors: [],
        });
      }
    }
  }, [isOpen, productToEdit, form]);

  // Image Upload Logic
  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "thumbnail" | "additional",
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === "additional" && watchedAdditionalImages.length >= 2) {
      toast.error("Max 2 additional images allowed.");
      return;
    }

    setUploading(true);
    try {
      const fileName = `prod-${Date.now()}-${file.name.replace(
        /[^a-zA-Z0-9.]/g,
        "",
      )}`;
      const { error } = await supabase.storage
        .from("products")
        .upload(fileName, file);

      if (error) throw error;

      const { data } = supabase.storage.from("products").getPublicUrl(fileName);

      if (type === "thumbnail") {
        form.setValue("thumbnailUrl", data.publicUrl);
      } else {
        form.setValue("additionalImages", [
          ...watchedAdditionalImages,
          data.publicUrl,
        ]);
      }
      toast.success("Image uploaded!");
    } catch (error) {
      console.error(error);
      toast.error("Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data: ProductSchema) => {
    try {
      const formattedSizes = data.sizes
        ? data.sizes
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [];

      const payload = {
        ...data,
        sellingPrice: Number(data.sellingPrice),
        oldPrice: data.oldPrice ? Number(data.oldPrice) : undefined,
        stock: Number(data.stock),
        sizes: formattedSizes,
        additionalImages: data.additionalImages || [],
      };

      let result;
      if (isEditMode) {
        result = await updateProductAction({
          id: productToEdit.id,
          ...payload,
        });
      } else {
        result = await createProductAction(payload);
      }

      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success(isEditMode ? "Product Updated!" : "Product Created!");
        setIsOpen(false);
        router.refresh();
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      {/* ✅ FIX APPLIED HERE:
         Logic: 
         1. Agar 'children' pass kiya hai (Custom Button) -> Render Children.
         2. Agar 'productToEdit' nahi hai (Matlab New Product Mode) -> Render Default Button.
         3. Agar 'productToEdit' hai (Edit Mode) -> Render NULL (No Trigger, controlled externally).
      */}
      {children ? (
        <SheetTrigger asChild>{children}</SheetTrigger>
      ) : !productToEdit ? (
        <SheetTrigger asChild>
          <Button className="shrink-0">
            <Plus className="mr-2 h-4 w-4" /> Add Product
          </Button>
        </SheetTrigger>
      ) : null}

      <SheetContent
        side="bottom"
        className="h-[96vh] rounded-t-[2rem] p-0 overflow-hidden max-w-6xl mx-auto border-t-2 border-primary/20 bg-background/95 backdrop-blur-md"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b bg-muted/30 flex items-center justify-between">
          <div>
            <SheetTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              {isEditMode ? "Edit Product" : "New Product Listing"}
            </SheetTitle>
            <SheetDescription className="text-xs">
              Fill in the details below. Max-width matches your website
              container.
            </SheetDescription>
          </div>
          <div className="flex gap-2">
            <SheetClose asChild>
              <Button variant="outline">Cancel</Button>
            </SheetClose>
            <Button
              onClick={form.handleSubmit(onSubmit)}
              disabled={form.formState.isSubmitting || uploading}
            >
              {form.formState.isSubmitting ? (
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Save Product
            </Button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 md:px-10 lg:px-20 h-full pb-24">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8 max-w-4xl mx-auto"
            >
              {/* --- SECTION 1: General Info --- */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-lg font-semibold text-primary">
                  <Tag className="h-5 w-5" /> <span>General Information</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Product Title{" "}
                            <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g. Premium Cotton Shirt"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="brandId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Brand</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value || ""}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Brand" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {brands.map((b) => (
                              <SelectItem key={b.id} value={b.id}>
                                {b.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />

                  <div className="md:col-span-2">
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea
                              rows={4}
                              placeholder="Product details..."
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* --- SECTION 2: Media --- */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-lg font-semibold text-primary">
                  <ImageIcon className="h-5 w-5" /> <span>Product Media</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Main Thumbnail */}
                  <div className="md:col-span-1 space-y-2">
                    <Label>Main Thumbnail</Label>
                    <div
                      className={cn(
                        "relative aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center bg-muted/10 overflow-hidden",
                        watchedThumbnail && "border-solid border-primary/20",
                      )}
                    >
                      <input
                        type="file"
                        accept="image/*"
                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                        onChange={(e) => handleImageUpload(e, "thumbnail")}
                        disabled={uploading}
                      />
                      {watchedThumbnail ? (
                        <img
                          src={watchedThumbnail}
                          alt="Thumbnail"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-center p-4">
                          <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                          <span className="text-xs text-muted-foreground">
                            Upload Thumbnail
                          </span>
                        </div>
                      )}
                      {uploading && (
                        <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
                          <Loader2 className="animate-spin" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Additional Images (Max 2) */}
                  <div className="md:col-span-2 space-y-2">
                    <Label>Additional Images (Max 2)</Label>
                    <div className="flex gap-4">
                      {/* Upload Trigger */}
                      <div className="relative h-32 w-32 rounded-xl border-2 border-dashed flex flex-col items-center justify-center bg-muted/10">
                        <input
                          type="file"
                          accept="image/*"
                          className="absolute inset-0 opacity-0 cursor-pointer z-10"
                          onChange={(e) => handleImageUpload(e, "additional")}
                          disabled={
                            uploading || watchedAdditionalImages.length >= 2
                          }
                        />
                        <Plus className="h-6 w-6 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground mt-1">
                          Add
                        </span>
                      </div>

                      {/* Previews */}
                      {watchedAdditionalImages.map((url, idx) => (
                        <div
                          key={idx}
                          className="relative h-32 w-32 rounded-xl border overflow-hidden group"
                        >
                          <img
                            src={url}
                            alt={`Img ${idx}`}
                            className="w-full h-full object-cover"
                          />
                          <Button
                            type="button"
                            size="icon"
                            variant="destructive"
                            className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => {
                              const newImgs = [...watchedAdditionalImages];
                              newImgs.splice(idx, 1);
                              form.setValue("additionalImages", newImgs);
                            }}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* --- SECTION 3: Category & Price --- */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-lg font-semibold text-primary">
                    <Layers className="h-5 w-5" /> <span>Category</span>
                  </div>
                  <div className="p-4 border rounded-xl bg-card space-y-4">
                    <FormField
                      control={form.control}
                      name="categoryId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Main Category</FormLabel>
                          <Select
                            onValueChange={(val) => {
                              field.onChange(val);
                              form.setValue("subCategoryId", null);
                            }}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {mainCategories.map((c) => (
                                <SelectItem key={c.id} value={c.id}>
                                  {c.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="subCategoryId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sub Category</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value || ""}
                            disabled={!selectedCategoryId}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Sub-Category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {subCategories.map((c) => (
                                <SelectItem key={c.id} value={c.id}>
                                  {c.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-lg font-semibold text-primary">
                    <DollarSign className="h-5 w-5" /> <span>Pricing</span>
                  </div>
                  <div className="p-4 border rounded-xl bg-card grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="sellingPrice"
                      render={({ field }) => (
                        <FormItem className="col-span-1">
                          <FormLabel>Price (₹)</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="stock"
                      render={({ field }) => (
                        <FormItem className="col-span-1">
                          <FormLabel>Stock</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="oldPrice"
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          <FormLabel>Old Price (Optional)</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* --- SECTION 4: Variants --- */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-lg font-semibold text-primary">
                  <Palette className="h-5 w-5" /> <span>Variants</span>
                </div>

                {/* SIZES */}
                <FormField
                  control={form.control}
                  name="sizes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Sizes (Comma separated, e.g. S, M, L)
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* COLORS */}
                <div className="space-y-3">
                  <FormLabel>Colors</FormLabel>
                  <div className="space-y-3">
                    {colorFields.map((field, index) => (
                      <div
                        key={field.id}
                        className="flex gap-4 items-end p-3 border rounded-lg bg-card/50"
                      >
                        <FormField
                          control={form.control}
                          name={`colors.${index}.name`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormLabel className="text-xs">
                                Color Name
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="e.g. Navy Blue"
                                  {...field}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        {/* Color Picker */}
                        <FormField
                          control={form.control}
                          name={`colors.${index}.hex`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs">Picker</FormLabel>
                              <FormControl>
                                <div className="flex items-center gap-2">
                                  <div className="relative w-10 h-10 overflow-hidden rounded-md border shadow-sm">
                                    <input
                                      type="color"
                                      className="absolute inset-0 w-full h-full p-0 border-0 cursor-pointer scale-150"
                                      {...field}
                                    />
                                  </div>
                                  <span className="text-xs font-mono text-muted-foreground uppercase">
                                    {field.value}
                                  </span>
                                </div>
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeColor(index)}
                          className="text-red-500 hover:text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => appendColor({ name: "", hex: "#000000" })}
                    className="mt-2"
                  >
                    <Plus className="h-4 w-4 mr-2" /> Add Color
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
