"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Loader2, Save, Tag, Plus, CheckCircle2 } from "lucide-react";
import Image from "next/image";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// ✅ Import Update Action
import {
  createCoupon,
  updateCoupon,
} from "@/app/(admin)/admin/coupons/actions";
import { cn } from "@/lib/utils";

interface CouponSheetProps {
  products: any[];
  initialData?: any; // ✅ Prop for Edit Mode
  children?: React.ReactNode;
}

export function CouponSheet({
  products,
  initialData,
  children,
}: CouponSheetProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, reset, watch, setValue } = useForm({
    defaultValues: {
      code: "",
      description: "",
      discountType: "FLAT",
      discountValue: "",
      minOrderValue: 0,
      targetType: "ALL",
      specificProductIds: [] as string[],
    },
  });

  // ✅ Effect: Load data when editing
  useEffect(() => {
    if (initialData) {
      reset({
        code: initialData.code,
        description: initialData.description,
        discountType: initialData.discountType,
        discountValue: initialData.discountValue,
        minOrderValue: initialData.minOrderValue,
        targetType: initialData.targetType,
        specificProductIds: initialData.specificProductIds || [],
      });
    }
  }, [initialData, reset, open]);

  const watchedTarget = watch("targetType");
  const watchedProductIds = watch("specificProductIds");

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    let res;

    // ✅ Switch Logic: Create vs Update
    if (initialData) {
      res = await updateCoupon(initialData.id, {
        ...data,
        discountValue: Number(data.discountValue),
      });
    } else {
      res = await createCoupon({
        ...data,
        discountValue: Number(data.discountValue),
      });
    }

    setIsLoading(false);

    if (res?.error) {
      toast.error(res.error);
    } else {
      toast.success(initialData ? "Coupon Updated!" : "Coupon Created!");
      setOpen(false);
      if (!initialData) reset(); // Reset only on create
    }
  };

  const toggleProduct = (productId: string) => {
    const current = watchedProductIds || [];
    if (current.includes(productId)) {
      setValue(
        "specificProductIds",
        current.filter((id) => id !== productId),
      );
    } else {
      setValue("specificProductIds", [...current, productId]);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {children || (
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> Add Coupon
          </Button>
        )}
      </SheetTrigger>

      <SheetContent
        side="bottom"
        className="h-[90vh] max-w-[1400px] mx-auto rounded-t-2xl overflow-y-auto px-4 md:px-8"
      >
        <div className="max-w-5xl mx-auto pb-10">
          <SheetHeader className="mt-4 mb-6 border-b pb-4">
            <SheetTitle className="flex items-center gap-2 text-2xl">
              <Tag className="h-6 w-6 text-primary" />
              {initialData ? "Edit Coupon" : "Create New Coupon"}
            </SheetTitle>
            <SheetDescription>
              {initialData
                ? "Update existing discount rules."
                : "Configure discount rules and applicability."}
            </SheetDescription>
          </SheetHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* ROW 1: Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Coupon Code (Uppercase)</Label>
                <Input
                  {...register("code", { required: true })}
                  placeholder="e.g. SUMMER50"
                  className="uppercase font-bold tracking-wider text-lg"
                  onChange={(e) =>
                    setValue("code", e.target.value.toUpperCase())
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Input
                  {...register("description")}
                  placeholder="e.g. Flat 50 off on Shoes"
                />
              </div>
            </div>

            {/* ROW 2: Discount Logic */}
            <div className="p-6 bg-secondary/20 rounded-2xl border border-border space-y-4">
              <Label className="text-primary text-base font-semibold flex items-center gap-2">
                <TicketPercentIcon className="h-4 w-4" /> Discount Details
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select
                    onValueChange={(val) => setValue("discountType", val)}
                    defaultValue={initialData?.discountType || "FLAT"} // Set default
                  >
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Select Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FLAT">Flat Amount (₹)</SelectItem>
                      <SelectItem value="PERCENTAGE">Percentage (%)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Value</Label>
                  <Input
                    type="number"
                    className="bg-background"
                    {...register("discountValue", { required: true })}
                    placeholder="e.g. 100"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Min Order Value (₹)</Label>
                  <Input
                    type="number"
                    className="bg-background"
                    {...register("minOrderValue")}
                    placeholder="e.g. 500"
                  />
                </div>
              </div>
            </div>

            {/* ROW 3: Applicability */}
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <Label className="text-base">Applicable On</Label>
                <div className="w-full md:w-64">
                  <Select
                    onValueChange={(val) => setValue("targetType", val)}
                    defaultValue={initialData?.targetType || "ALL"}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Target" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All Products</SelectItem>
                      <SelectItem value="SPECIFIC">
                        Specific Products
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {watchedTarget === "SPECIFIC" && (
                <div className="border rounded-2xl p-4 bg-muted/10">
                  <p className="text-sm text-muted-foreground mb-4 font-medium">
                    Select products to apply this coupon on:
                  </p>

                  <div className="h-[400px] overflow-y-auto pr-2">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {products.map((prod) => {
                        const isSelected = watchedProductIds?.includes(prod.id);
                        return (
                          <div
                            key={prod.id}
                            onClick={() => toggleProduct(prod.id)}
                            className={cn(
                              "group relative cursor-pointer border rounded-xl overflow-hidden transition-all hover:shadow-md",
                              isSelected
                                ? "border-primary ring-1 ring-primary bg-primary/5"
                                : "border-border bg-card",
                            )}
                          >
                            <div className="aspect-square relative bg-white">
                              <Image
                                src={prod.thumbnailUrl}
                                alt={prod.title}
                                fill
                                className="object-contain p-2"
                                unoptimized
                              />
                              {isSelected && (
                                <div className="absolute top-2 right-2 bg-primary text-white rounded-full p-1 shadow-sm">
                                  <CheckCircle2 className="h-4 w-4" />
                                </div>
                              )}
                            </div>
                            <div className="p-3">
                              <p className="font-medium text-xs md:text-sm line-clamp-2 leading-tight mb-1 group-hover:text-primary transition-colors">
                                {prod.title}
                              </p>
                              <p className="text-sm font-bold text-muted-foreground">
                                ₹{prod.sellingPrice}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-md shadow-lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="animate-spin mr-2" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              {initialData ? "Update Coupon" : "Save Coupon"}
            </Button>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function TicketPercentIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
      <path d="M13 5v2" />
      <path d="M13 17v2" />
      <path d="M13 11v2" />
    </svg>
  );
}
