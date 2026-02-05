"use client";

import { useEffect, useState, useRef } from "react";
import { format } from "date-fns";
import {
  Loader2,
  Printer,
  Download,
  MapPin,
  User,
  Phone,
  Mail,
  Package,
} from "lucide-react";
import { useReactToPrint } from "react-to-print"; // Optional, standard print is simpler without lib, but let's use standard JS

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { getOrderDetails } from "@/app/(admin)/admin/orders/actions";

interface OrderDetailsDialogProps {
  orderId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function OrderDetailsDialog({
  orderId,
  open,
  onOpenChange,
}: OrderDetailsDialogProps) {
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<any>(null);
  const printRef = useRef<HTMLDivElement>(null);

  // Fetch Data on Open
  useEffect(() => {
    if (open && orderId) {
      setLoading(true);
      getOrderDetails(orderId)
        .then((res) => {
          if (res.success) setOrder(res.data);
        })
        .finally(() => setLoading(false));
    }
  }, [open, orderId]);

  // Handle Print/Download
  const handlePrint = () => {
    if (!printRef.current) return;
    const printContent = printRef.current.innerHTML;
    const originalContent = document.body.innerHTML;

    // Temporary replace body content for clean print
    document.body.innerHTML = `
      <div style="padding: 20px; font-family: sans-serif;">
        ${printContent}
      </div>
    `;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload(); // Reload to restore event listeners (standard simple print hack)
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Order Details</span>
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              disabled={!order || loading}
            >
              <Download className="mr-2 h-4 w-4" /> Download Slip
            </Button>
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-10 space-y-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">
              Fetching order details...
            </p>
          </div>
        ) : !order ? (
          <div className="py-10 text-center text-muted-foreground">
            Failed to load details
          </div>
        ) : (
          <div ref={printRef} className="space-y-6 pt-2 print-container">
            {/* 1. SLIP HEADER */}
            <div className="flex justify-between items-start border-b pb-4">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-primary">
                  The Dev Vastra
                </h2>
                <p className="text-sm text-muted-foreground">
                  Invoice / Order Slip
                </p>
              </div>
              <div className="text-right">
                <h3 className="font-mono font-bold text-lg">
                  {order.displayId}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Date:{" "}
                  {format(new Date(order.createdAt), "dd MMM yyyy, hh:mm a")}
                </p>
                <div className="mt-1">
                  <Badge variant="outline" className="uppercase text-[10px]">
                    {order.status}
                  </Badge>
                </div>
              </div>
            </div>

            {/* 2. CUSTOMER & SHIPPING INFO */}
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider flex items-center gap-2">
                  <User className="h-4 w-4" /> Customer Details
                </h4>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p className="font-medium text-foreground">
                    {order.user?.fullName || "Guest"}
                  </p>
                  <p className="flex items-center gap-2">
                    <Mail className="h-3 w-3" /> {order.user?.email}
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone className="h-3 w-3" />{" "}
                    {order.user?.phone || order.shippingAddress?.phone}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider flex items-center gap-2">
                  <MapPin className="h-4 w-4" /> Shipping Address
                </h4>
                <div className="text-sm text-muted-foreground space-y-1 border-l-2 border-muted pl-3">
                  <p className="font-medium text-foreground">
                    {order.shippingAddress?.name}
                  </p>
                  <p>{order.shippingAddress?.line1}</p>
                  <p>
                    {order.shippingAddress?.city},{" "}
                    {order.shippingAddress?.state}
                  </p>
                  <p className="font-bold">{order.shippingAddress?.zip}</p>
                  <p className="text-xs mt-1">
                    Contact: {order.shippingAddress?.phone}
                  </p>
                </div>
              </div>
            </div>

            {/* 3. ORDER ITEMS TABLE */}
            <div>
              <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider flex items-center gap-2 mb-3">
                <Package className="h-4 w-4" /> Order Items
              </h4>
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader className="bg-muted/30">
                    <TableRow>
                      <TableHead className="w-[50%]">Product</TableHead>
                      <TableHead className="text-center">Qty</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {order.orderItems?.map((item: any) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {item.product?.title}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {item.size && `Size: ${item.size}`}{" "}
                              {item.color && `| Color: ${item.color}`}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          {item.quantity}
                        </TableCell>
                        <TableCell className="text-right">
                          ₹{item.price}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          ₹{item.price * item.quantity}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* 4. TOTALS SUMMARY */}
            <div className="flex justify-end">
              <div className="w-1/2 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Payment Method</span>
                  <span className="font-medium">{order.paymentMethod}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Payment Status</span>
                  <Badge
                    variant={
                      order.paymentStatus === "Paid" ? "default" : "secondary"
                    }
                    className="text-[10px] h-5"
                  >
                    {order.paymentStatus}
                  </Badge>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total Amount</span>
                  <span>₹{order.totalAmount}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
