"use client";

import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { toast } from "sonner";
import { 
  Plus, 
  Loader2, 
  Save, 
  X, 
  Trash2, 
  Upload, 
  Image as ImageIcon,
  Tag,
  Layers,
  DollarSign,
  Palette
} from "lucide-react";

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
  SheetFooter,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import { createProduct, updateProduct } from "@/app/(admin)/admin/products/actions";
import { createClient } from "@/utils/supabase/client";
import { cn } from "@/lib/utils";

interface ProductSheetProps {
  brands: any[];
  categories: any[];
  children?: React.ReactNode;
  initialData?: any;
}

export function ProductSheet({ brands, categories, children, initialData }: ProductSheetProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  // Supabase Client
  const supabase = createClient();

  // Filter Subcategories based on selected Main Category
  const [selectedMainCat, setSelectedMainCat] = useState<string | null>(null);
  
  const mainCategories = categories.filter((c) => c.parentId === null);
  const subCategories = selectedMainCat 
    ? categories.filter((c) => c.parentId === selectedMainCat)
    : [];

  const { register, control, handleSubmit, reset, setValue, watch } = useForm({
    defaultValues: {
      title: "",
      description: "",
      highlights: [{ value: "" }],
      thumbnailUrl: "",
      additionalImages: [] as string[],
      sellingPrice: "",
      oldPrice: "",
      stock: "",
      colors: [] as { name: string; hex: string }[],
      sizes: [] as string[],
      brandId: "null",
      categoryId: "",
      subCategoryId: "null",
      tempColorName: "",
      tempColorHex: "#000000",
      tempSize: "",
    },
  });

  // Watchers for Real-time UI updates
  const watchedThumbnail = watch("thumbnailUrl");
  const watchedImages = watch("additionalImages");
  const watchedColors = watch("colors");
  const watchedSizes = watch("sizes");

  // Dynamic Fields for Highlights
  const { fields: highlightFields, append: appendHighlight, remove: removeHighlight } = useFieldArray({
    control,
    name: "highlights",
  });

  // --- 1. Pre-fill Data Logic (Edit Mode) ---
  useEffect(() => {
    if (initialData && open) {
      const formattedHighlights = initialData.highlights 
        ? initialData.highlights.map((h: string) => ({ value: h }))
        : [{ value: "" }];

      if (initialData.categoryId) setSelectedMainCat(initialData.categoryId);

      reset({
        title: initialData.title,
        description: initialData.description,
        highlights: formattedHighlights,
        thumbnailUrl: initialData.thumbnailUrl,
        additionalImages: initialData.additionalImages || [],
        sellingPrice: initialData.sellingPrice.toString(),
        oldPrice: initialData.oldPrice ? initialData.oldPrice.toString() : "",
        stock: initialData.stock.toString(),
        colors: initialData.colors || [],
        sizes: initialData.sizes || [],
        brandId: initialData.brandId || "null",
        categoryId: initialData.categoryId,
        subCategoryId: initialData.subCategoryId || "null",
        tempColorName: "",
        tempColorHex: "#000000",
        tempSize: "",
      });
    } else if (!initialData && open) {
      reset({
        title: "", description: "", highlights: [{ value: "" }], thumbnailUrl: "",
        additionalImages: [], sellingPrice: "", oldPrice: "", stock: "",
        colors: [], sizes: [], brandId: "null", categoryId: "", subCategoryId: "null"
      });
      setSelectedMainCat(null);
    }
  }, [initialData, open, reset]);

  // --- 2. Image Upload Logic ---
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: "thumbnail" | "additional") => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (field === "additional" && watchedImages.length >= 2) {
      toast.error("Max 2 additional images allowed.");
      return;
    }

    setUploading(true);
    try {
      const fileName = `prod-${Date.now()}-${file.name.replace(/\s/g, "")}`;
      const { error } = await supabase.storage.from("products").upload(fileName, file);
      if (error) throw error;
      
      const { data } = supabase.storage.from("products").getPublicUrl(fileName);

      if (field === "thumbnail") {
        setValue("thumbnailUrl", data.publicUrl);
      } else {
        setValue("additionalImages", [...watchedImages, data.publicUrl]);
      }
      toast.success("Image uploaded!");
    } catch (error) {
      console.error(error);
      toast.error("Upload failed. Check bucket permissions.");
    } finally {
      setUploading(false);
    }
  };

  // --- 3. Variants Logic ---
  const addColor = () => {
    const name = watch("tempColorName");
    const hex = watch("tempColorHex");
    if (name && hex) {
      setValue("colors", [...watchedColors, { name, hex }]);
      setValue("tempColorName", "");
    }
  };

  const addSize = () => {
    const size = watch("tempSize");
    if (size) {
      setValue("sizes", [...watchedSizes, size]);
      setValue("tempSize", "");
    }
  };

  const removeVariant = (type: "color" | "size", index: number) => {
    if (type === "color") {
      const newColors = [...watchedColors];
      newColors.splice(index, 1);
      setValue("colors", newColors);
    } else {
      const newSizes = [...watchedSizes];
      newSizes.splice(index, 1);
      setValue("sizes", newSizes);
    }
  };

  // --- 4. Submit Logic ---
  const onSubmit = async (data: any) => {
    setIsLoading(true);
    const cleanHighlights = data.highlights.map((h: any) => h.value).filter((h: string) => h);
    
    const payload = { ...data, highlights: cleanHighlights };

    let res;
    if (initialData) {
      res = await updateProduct(initialData.id, payload);
    } else {
      res = await createProduct(payload);
    }
    
    setIsLoading(false);

    if (res?.success) {
      toast.success(initialData ? "Product updated successfully!" : "Product created successfully!");
      setOpen(false);
      if (!initialData) reset();
    } else {
      toast.error(res?.error || "Something went wrong");
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {children || (
          <Button className="gap-2 shadow-md hover:scale-105 transition-all">
            <Plus className="h-4 w-4" /> Add Product
          </Button>
        )}
      </SheetTrigger>
      
      <SheetContent side="bottom" className="h-[96vh] rounded-t-[2rem] p-0 overflow-hidden bg-background/95 backdrop-blur-md border-t-2 border-primary/20">
        <div className="h-full flex flex-col">
          
          {/* --- Header --- */}
          <div className="px-6 py-4 border-b bg-muted/30 flex items-center justify-between">
            <div>
              <SheetTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                {initialData ? "Edit Product" : "New Product Listing"}
              </SheetTitle>
              <SheetDescription className="text-xs">
                Complete the form below to list your item on the marketplace.
              </SheetDescription>
            </div>
            {/* Save Button in Header for Quick Access */}
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={handleSubmit(onSubmit)} disabled={isLoading || uploading}>
                 {isLoading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Save className="mr-2 h-4 w-4" />}
                 Save Changes
              </Button>
            </div>
          </div>

          {/* --- Scrollable Body --- */}
          <div className="flex-1 overflow-y-auto p-6 md:px-20 lg:px-32">
            <form className="space-y-10 max-w-5xl mx-auto pb-20">

              {/* SECTION 1: General Info */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-lg font-semibold text-primary">
                   <Tag className="h-5 w-5" /> <span>General Information</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2 space-y-2">
                    <Label>Product Title <span className="text-red-500">*</span></Label>
                    <Input {...register("title", { required: true })} placeholder="e.g. Premium Cotton Oversized T-Shirt" className="h-11 text-lg" />
                  </div>
                  <div className="space-y-2">
                     <Label>Brand</Label>
                     <Select onValueChange={(val) => setValue("brandId", val)} defaultValue={initialData?.brandId || "null"}>
                      <SelectTrigger className="h-11"><SelectValue placeholder="Select Brand" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="null">No Brand</SelectItem>
                        {brands.map(b => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
                      </SelectContent>
                     </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea {...register("description")} placeholder="Describe your product in detail..." rows={5} className="resize-none" />
                </div>
              </div>

              <Separator />

              {/* SECTION 2: Media */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-lg font-semibold text-primary">
                   <ImageIcon className="h-5 w-5" /> <span>Product Media</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Main Image */}
                  <div className="md:col-span-1 space-y-3">
                    <Label>Main Thumbnail (Required)</Label>
                    <div className={cn(
                      "relative aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors bg-muted/10 overflow-hidden",
                      watchedThumbnail ? "border-solid border-primary/20" : ""
                    )}>
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                        onChange={(e) => handleImageUpload(e, "thumbnail")} 
                        disabled={uploading} 
                      />
                      {watchedThumbnail ? (
                        <img src={watchedThumbnail} alt="Thumbnail" className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-center p-4">
                          <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                          <p className="text-xs text-muted-foreground">Click to upload main image</p>
                        </div>
                      )}
                      {uploading && <div className="absolute inset-0 bg-background/50 flex items-center justify-center"><Loader2 className="animate-spin" /></div>}
                    </div>
                  </div>

                  {/* Gallery */}
                  <div className="md:col-span-2 space-y-3">
                    <Label>Gallery Images (Max 2)</Label>
                    <div className="flex gap-4">
                       {/* Upload Button */}
                       <div className="relative h-32 w-32 rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors bg-muted/10">
                          <input 
                            type="file" 
                            accept="image/*" 
                            className="absolute inset-0 opacity-0 cursor-pointer" 
                            onChange={(e) => handleImageUpload(e, "additional")} 
                            disabled={uploading || watchedImages.length >= 2} 
                          />
                          <Plus className="h-6 w-6 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground mt-1">Add Image</span>
                       </div>

                       {/* Previews */}
                       {watchedImages.map((url, idx) => (
                         <div key={idx} className="relative h-32 w-32 rounded-xl border overflow-hidden group">
                            <img src={url} alt="Gallery" className="w-full h-full object-cover" />
                            <button 
                              type="button" 
                              onClick={() => {
                                const newImgs = [...watchedImages];
                                newImgs.splice(idx, 1);
                                setValue("additionalImages", newImgs);
                              }} 
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="h-3 w-3" />
                            </button>
                         </div>
                       ))}
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* SECTION 3: Categorization & Pricing */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                 {/* Organization */}
                 <div className="space-y-4">
                    <div className="flex items-center gap-2 text-lg font-semibold text-primary">
                      <Layers className="h-5 w-5" /> <span>Organization</span>
                    </div>
                    <div className="space-y-4 p-4 border rounded-xl bg-card">
                       <div className="space-y-2">
                         <Label>Main Category</Label>
                         <Select onValueChange={(val) => {
                            setValue("categoryId", val);
                            setSelectedMainCat(val);
                            setValue("subCategoryId", "null");
                         }} defaultValue={initialData?.categoryId || ""}>
                          <SelectTrigger><SelectValue placeholder="Select Main Category" /></SelectTrigger>
                          <SelectContent>
                            {mainCategories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                          </SelectContent>
                         </Select>
                       </div>
                       
                       <div className="space-y-2">
                         <Label>Sub Category</Label>
                         <Select onValueChange={(val) => setValue("subCategoryId", val)} disabled={!selectedMainCat} defaultValue={initialData?.subCategoryId || "null"}>
                          <SelectTrigger><SelectValue placeholder="Select Sub Category" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="null">None</SelectItem>
                            {subCategories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                          </SelectContent>
                         </Select>
                       </div>
                    </div>
                 </div>

                 {/* Pricing & Inventory */}
                 <div className="space-y-4">
                    <div className="flex items-center gap-2 text-lg font-semibold text-primary">
                      <DollarSign className="h-5 w-5" /> <span>Pricing & Inventory</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 p-4 border rounded-xl bg-card">
                       <div className="col-span-2 md:col-span-1 space-y-2">
                         <Label>Selling Price (₹)</Label>
                         <Input type="number" {...register("sellingPrice", { required: true })} className="font-mono" />
                       </div>
                       <div className="col-span-2 md:col-span-1 space-y-2">
                         <Label>Old Price (₹)</Label>
                         <Input type="number" {...register("oldPrice")} className="font-mono text-muted-foreground" />
                       </div>
                       <div className="col-span-2 space-y-2">
                         <Label>Stock Quantity</Label>
                         <Input type="number" {...register("stock", { required: true })} className="font-mono" />
                       </div>
                    </div>
                 </div>
              </div>

              <Separator />

              {/* SECTION 4: Variants & Highlights */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Colors & Sizes */}
                <div className="space-y-4">
                   <div className="flex items-center gap-2 text-lg font-semibold text-primary">
                      <Palette className="h-5 w-5" /> <span>Product Variants</span>
                   </div>
                   
                   <div className="p-4 border rounded-xl bg-card space-y-6">
                      {/* Colors */}
                      <div className="space-y-3">
                         <Label>Colors</Label>
                         <div className="flex gap-2">
                           <Input {...register("tempColorName")} placeholder="Name (e.g. Navy Blue)" className="flex-1" />
                           <div className="relative">
                             <Input type="color" {...register("tempColorHex")} className="w-10 h-10 p-0.5 rounded-md cursor-pointer border-2" />
                           </div>
                           <Button type="button" onClick={addColor} size="icon" variant="secondary"><Plus className="h-4 w-4"/></Button>
                         </div>
                         <div className="flex flex-wrap gap-2">
                           {watchedColors.map((col, idx) => (
                             <Badge key={idx} variant="outline" className="pl-1 pr-2 py-1 gap-2 rounded-full">
                               <div className="w-4 h-4 rounded-full border shadow-sm" style={{ backgroundColor: col.hex }} />
                               {col.name}
                               <X className="h-3 w-3 cursor-pointer hover:text-red-500" onClick={() => removeVariant("color", idx)} />
                             </Badge>
                           ))}
                         </div>
                      </div>

                      <Separator className="border-dashed" />

                      {/* Sizes */}
                      <div className="space-y-3">
                         <Label>Sizes</Label>
                         <div className="flex gap-2">
                           <Input {...register("tempSize")} placeholder="e.g. XL, 42" className="flex-1" />
                           <Button type="button" onClick={addSize} size="icon" variant="secondary"><Plus className="h-4 w-4"/></Button>
                         </div>
                         <div className="flex flex-wrap gap-2">
                           {watchedSizes.map((size, idx) => (
                             <Badge key={idx} variant="secondary" className="px-3 py-1 gap-2 rounded-md">
                               {size}
                               <X className="h-3 w-3 cursor-pointer hover:text-red-500" onClick={() => removeVariant("size", idx)} />
                             </Badge>
                           ))}
                         </div>
                      </div>
                   </div>
                </div>

                {/* Highlights */}
                <div className="space-y-4">
                   <div className="flex items-center gap-2 text-lg font-semibold text-primary">
                      <Tag className="h-5 w-5" /> <span>Key Highlights</span>
                   </div>
                   <div className="p-4 border rounded-xl bg-card space-y-3">
                      {highlightFields.map((field, index) => (
                        <div key={field.id} className="flex gap-2 items-center group">
                          <span className="text-muted-foreground text-xs w-4">{index + 1}.</span>
                          <Input {...register(`highlights.${index}.value`)} placeholder="Feature description..." className="bg-transparent border-0 border-b rounded-none focus-visible:ring-0 focus-visible:border-primary px-0" />
                          <Button type="button" variant="ghost" size="icon" onClick={() => removeHighlight(index)} className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button type="button" variant="outline" size="sm" onClick={() => appendHighlight({ value: "" })} className="w-full border-dashed mt-2">
                        <Plus className="h-3 w-3 mr-2" /> Add Highlight Point
                      </Button>
                   </div>
                </div>
              </div>

            </form>
          </div>

        </div>
      </SheetContent>
    </Sheet>
  );
}