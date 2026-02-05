"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { MoreVertical, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

import { ProductDrawer } from "./product-drawer";
import {
  deleteProductAction,
  toggleMostSellingAction,
} from "@/app/(admin)/actions";

interface AdminProductCardProps {
  product: any;
  brands: any[];
  categories: any[];
}

export function AdminProductCard({
  product,
  brands,
  categories,
}: AdminProductCardProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isSelling, setIsSelling] = useState(product.isMostSelling); // Local state for instant UI update
  const router = useRouter();

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteProductAction(product.id);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Product deleted successfully");
        setIsDeleteDialogOpen(false);
      }
    });
  };

  const handleToggleSelling = async (checked: boolean) => {
    setIsSelling(checked); // Optimistic UI Update
    const result = await toggleMostSellingAction(product.id, checked);

    if (result?.error) {
      toast.error("Failed to update status");
      setIsSelling(!checked); // Revert on fail
    } else {
      toast.success(
        checked ? "Added to Most Selling" : "Removed from Most Selling",
      );
    }
  };

  return (
    <>
      <div className="group relative flex flex-col gap-3 p-4 bg-card border rounded-xl shadow-sm hover:shadow-md transition-all">
        {/* Requirement 2: Toggle Switch on Card */}
        <div className="flex items-center justify-between mb-2">
          <Badge variant={product.stock > 0 ? "outline" : "destructive"}>
            {product.stock > 0 ? `${product.stock} in Stock` : "Out of Stock"}
          </Badge>

          <div className="flex items-center gap-2">
            <Label
              htmlFor={`selling-${product.id}`}
              className="text-xs text-muted-foreground cursor-pointer"
            >
              Most Selling
            </Label>
            <Switch
              id={`selling-${product.id}`}
              checked={isSelling}
              onCheckedChange={handleToggleSelling}
              className="scale-75 origin-right"
            />
          </div>
        </div>

        {/* Image Area */}
        <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-muted/20">
          <Image
            src={product.thumbnailUrl}
            alt={product.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
        </div>

        {/* Content */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-start gap-2">
            <h3 className="font-semibold truncate w-full" title={product.title}>
              {product.title}
            </h3>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 -mr-2 shrink-0"
                >
                  <MoreVertical className="h-4 w-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setIsEditOpen(true)}>
                  <Edit className="mr-2 h-4 w-4" /> Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setIsDeleteDialogOpen(true)}
                  className="text-red-600 focus:text-red-600 focus:bg-red-50"
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="font-medium text-primary">
              ₹{product.sellingPrice}
            </span>
            {product.oldPrice && (
              <span className="line-through text-xs">₹{product.oldPrice}</span>
            )}
          </div>
        </div>
      </div>

      {/* Edit Drawer */}
      <ProductDrawer
        categories={categories}
        brands={brands}
        productToEdit={product}
        open={isEditOpen}
        setOpen={setIsEditOpen}
      />

      {/* Delete Alert */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove "{product.title}" from your store.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={isPending}
            >
              {isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
