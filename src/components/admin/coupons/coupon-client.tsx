"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Trash2,
  Percent,
  IndianRupee,
  MoreHorizontal,
  Edit,
  AlertCircle,
} from "lucide-react";
import { CouponSheet } from "./coupon-sheet";
import {
  toggleCouponStatus,
  deleteCoupon,
} from "@/app/(admin)/admin/coupons/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// ✅ Import UI Components
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

interface CouponClientProps {
  coupons: any[];
  products: any[];
}

export function CouponClient({ coupons, products }: CouponClientProps) {
  const router = useRouter();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleToggle = async (id: string, currentStatus: boolean) => {
    await toggleCouponStatus(id, currentStatus);
    toast.success("Status updated");
    router.refresh();
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    await deleteCoupon(deleteId);
    toast.success("Coupon deleted");
    setDeleteId(null);
    router.refresh();
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Coupons</h1>
          <p className="text-muted-foreground">
            Manage discount codes and offers.
          </p>
        </div>
        <CouponSheet products={products} />
      </div>

      {/* TABLE */}
      <div className="border rounded-lg bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Code</TableHead>
              <TableHead>Discount</TableHead>
              <TableHead>Logic</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {coupons.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No coupons found. Create one!
                </TableCell>
              </TableRow>
            ) : (
              coupons.map((coupon) => (
                <TableRow key={coupon.id}>
                  <TableCell className="font-bold text-primary">
                    {coupon.code}
                    <div className="text-xs text-muted-foreground font-normal">
                      {coupon.description}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 font-medium">
                      {coupon.discountType === "FLAT" ? (
                        <IndianRupee className="h-3 w-3" />
                      ) : (
                        <Percent className="h-3 w-3" />
                      )}
                      {coupon.discountValue}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-xs">
                      Min Order: ₹{coupon.minOrderValue}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {coupon.targetType === "ALL"
                        ? "All Products"
                        : "Specific"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={coupon.isActive}
                      onCheckedChange={() =>
                        handleToggle(coupon.id, coupon.isActive)
                      }
                    />
                  </TableCell>

                  {/* ✅ ACTIONS COLUMN (Dropdown) */}
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>

                        {/* 1. EDIT ACTION (Wrapped in CouponSheet) */}
                        {/* preventDefault zaroori hai taaki dropdown close hone se sheet band na ho jaye */}
                        <CouponSheet products={products} initialData={coupon}>
                          <DropdownMenuItem
                            onSelect={(e) => e.preventDefault()}
                          >
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                        </CouponSheet>

                        <DropdownMenuSeparator />

                        {/* 2. DELETE ACTION */}
                        <DropdownMenuItem
                          className="text-red-600 focus:text-red-600 focus:bg-red-50"
                          onClick={() => setDeleteId(coupon.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* ✅ DELETE ALERT DIALOG */}
      <AlertDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              Are you sure?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              coupon.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Yes, Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
