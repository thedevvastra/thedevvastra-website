"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import {
  Truck,
  CheckCircle2,
  Clock,
  HelpCircle,
  AlertTriangle,
  XCircle,
  Package,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { CancelOrderDialog } from "./cancel-order-dialog";
import { cancelOrder } from "@/app/(shop)/my-orders/actions";

interface OrderCardProps {
  order: any;
}

// ✅ FIX: Added "Processing" to the steps
const ORDER_STEPS = [
  "Order Placed",
  "Confirmed",
  "Processing", // Ye missing tha
  "Shipped",
  "Out for Delivery",
  "Delivered",
];

export function OrderCard({ order }: OrderCardProps) {
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  // Status Logic
  const currentStatusIndex = ORDER_STEPS.indexOf(order.status);
  const isCancelled = order.status === "Cancelled";
  const isDelivered = order.status === "Delivered";

  // Logic: Can Customer Cancel? (Only before shipping)
  // "Processing" tak cancel kar sakta hai
  const canCancel =
    !isCancelled &&
    !isDelivered &&
    (order.status === "Order Placed" ||
      order.status === "Confirmed" ||
      order.status === "Processing");

  // Logic: Show Contact Us (Before Delivery OR If Delivered)
  const showContact = !isCancelled;

  return (
    <>
      <Card className="border shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
        {/* HEADER */}
        <CardHeader className="bg-muted/30 p-4 sm:px-6 border-b flex flex-row items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider">
              Order ID
            </span>
            <span className="text-sm font-mono font-medium">
              #{order.displayId}
            </span>
          </div>
          <div className="flex flex-col gap-1 text-right">
            <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider">
              Placed On
            </span>
            <span className="text-sm font-medium">
              {format(new Date(order.createdAt), "dd MMM yyyy")}
            </span>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* --- STATUS SECTION --- */}
          {isCancelled ? (
            <div className="bg-red-50 border border-red-100 p-4 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-red-700 font-bold">
                <XCircle className="h-5 w-5" />
                Order Cancelled
              </div>
              <p className="text-sm text-red-600/80">
                {order.cancelledBy === "admin" ? (
                  <span>
                    Cancelled by Admin.{" "}
                    <span className="font-semibold">Reason:</span>{" "}
                    {order.cancelReason}
                  </span>
                ) : (
                  <span>You cancelled this order.</span>
                )}
              </p>
            </div>
          ) : (
            // Professional Timeline Stepper
            <div className="relative">
              {/* Stepper Dots & Labels */}
              <div className="flex items-center justify-between mb-2 overflow-x-auto pb-2 sm:pb-0">
                {ORDER_STEPS.map((step, idx) => {
                  // Logic: If current index is greater or equal, step is completed
                  const isCompleted = currentStatusIndex >= idx;
                  const isCurrent = currentStatusIndex === idx;

                  return (
                    <div
                      key={step}
                      className="flex flex-col items-center z-10 min-w-[60px]"
                    >
                      <div
                        className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 bg-background",
                          isCompleted
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-muted text-muted-foreground",
                        )}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : (
                          <div className="h-2 w-2 rounded-full bg-muted-foreground/30" />
                        )}
                      </div>
                      <span
                        className={cn(
                          "text-[10px] mt-2 text-center font-medium hidden sm:block",
                          isCurrent
                            ? "text-primary font-bold"
                            : "text-muted-foreground",
                        )}
                      >
                        {step}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Progress Line */}
              <div className="absolute top-4 left-0 w-full h-[2px] bg-muted -z-0">
                <div
                  className="h-full bg-primary transition-all duration-500"
                  style={{
                    width: `${
                      (currentStatusIndex / (ORDER_STEPS.length - 1)) * 100
                    }%`,
                  }}
                />
              </div>

              {/* Mobile Status Text (Shown only on small screens) */}
              <div className="sm:hidden text-center mt-4">
                <Badge
                  variant="outline"
                  className="text-primary border-primary"
                >
                  Status: {order.status}
                </Badge>
              </div>
            </div>
          )}

          <Separator className={isCancelled ? "hidden" : "block"} />

          {/* --- ITEMS SECTION --- */}
          <div className="space-y-4">
            {order.orderItems.map((item: any) => (
              <div key={item.id} className="flex gap-4 items-start">
                <div className="relative h-20 w-20 rounded-md border bg-muted overflow-hidden shrink-0">
                  <Image
                    src={item.product?.thumbnailUrl}
                    alt={item.product?.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm line-clamp-2">
                    {item.product?.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {item.size && `Size: ${item.size}`}{" "}
                    {item.color && `| Color: ${item.color}`}
                  </p>
                  <p className="text-sm font-bold mt-1">
                    ₹{item.price.toLocaleString()}{" "}
                    <span className="text-muted-foreground font-normal text-xs">
                      x {item.quantity}
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>

        <Separator />

        {/* FOOTER ACTIONS */}
        <CardFooter className="p-4 bg-muted/5 flex flex-wrap gap-3 justify-end">
          {/* Contact Support */}
          {showContact && (
            <Link
              href={`/contact-us?subject=Issue with Order ${order.displayId}`}
            >
              <Button variant="outline" size="sm" className="h-9">
                <HelpCircle className="mr-2 h-4 w-4" />
                {isDelivered ? "Return / Exchange" : "Contact Support"}
              </Button>
            </Link>
          )}

          {/* Cancel Button */}
          {canCancel && (
            <Button
              variant="destructive"
              size="sm"
              className="h-9 bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
              onClick={() => setShowCancelDialog(true)}
            >
              Cancel Order
            </Button>
          )}

          {isDelivered && (
            <Link href={`/product/${order.orderItems[0]?.product?.id}`}>
              <Button size="sm" className="h-9">
                Buy Again
              </Button>
            </Link>
          )}
        </CardFooter>
      </Card>

      {/* Cancel Modal */}
      <CancelOrderDialog
        open={showCancelDialog}
        onOpenChange={setShowCancelDialog}
        orderId={order.id}
        onConfirmCancel={cancelOrder}
      />
    </>
  );
}
