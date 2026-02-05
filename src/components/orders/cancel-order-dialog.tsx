"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Loader2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface CancelOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderId: string;
  onConfirmCancel: (orderId: string, reason: string) => Promise<any>;
  triggerType?: "customer" | "admin";
}

export function CancelOrderDialog({
  open,
  onOpenChange,
  orderId,
  onConfirmCancel,
  triggerType = "customer",
}: CancelOrderDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    const res = await onConfirmCancel(orderId, data.reason);
    setIsSubmitting(false);

    if (res?.success) {
      toast.success("Order cancelled successfully");
      reset();
      onOpenChange(false);
    } else {
      toast.error(res?.error || "Failed to cancel order");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" /> Cancel Order
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to cancel this order? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="reason">
              Reason for Cancellation <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="reason"
              placeholder={
                triggerType === "admin"
                  ? "e.g. Out of stock, Customer request"
                  : "e.g. Changed my mind, Ordered by mistake"
              }
              {...register("reason", {
                required: "Reason is required",
                minLength: { value: 5, message: "Reason too short" },
              })}
              className="resize-none"
            />
            {errors.reason && (
              <p className="text-xs text-red-500">
                {String(errors.reason.message)}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Keep Order
            </Button>
            <Button type="submit" variant="destructive" disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Confirm Cancellation"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
