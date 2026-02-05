"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { SuccessStep } from "./success-step";

export function OrderSuccessDialog({
  isOpen,
  onClose,
  orderId,
}: {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
}) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden gap-0">
        <SuccessStep orderId={orderId} />
      </DialogContent>
    </Dialog>
  );
}
