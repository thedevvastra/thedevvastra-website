"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { getUserAddress } from "@/app/(shop)/product/actions";
import { BuyNowModalProps, AddressData } from "./types";

// Import Steps
import { AddressStep } from "./address-step";
import { PaymentStep } from "./payment-step";
// SuccessStep import ki zaroorat nahi yahan

export function BuyNowDialog({
  isOpen,
  onClose,
  product,
  selection,
  onOrderSuccess, // Received from Parent
}: BuyNowModalProps) {
  const [step, setStep] = useState<"LOADING" | "ADDRESS" | "PAYMENT">(
    "LOADING",
  );
  const [addressData, setAddressData] = useState<AddressData>({
    fullName: "",
    phone: "",
    addressLine1: "",
    city: "",
    state: "",
    zipCode: "",
  });
  const [hasSavedAddress, setHasSavedAddress] = useState(false);

  const fetchAddress = async () => {
    const res = await getUserAddress();
    if (res.success && res.address) {
      setAddressData(res.address as AddressData);
      setHasSavedAddress(res.hasAddress);
      setStep(res.hasAddress ? "PAYMENT" : "ADDRESS");
    } else {
      setHasSavedAddress(false);
      setStep("ADDRESS");
    }
  };

  useEffect(() => {
    if (isOpen) {
      setStep("LOADING");
      fetchAddress();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleAddressCancel = () => {
    if (hasSavedAddress) {
      setStep("PAYMENT");
    } else {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden gap-0">
        {step === "LOADING" && (
          <div className="flex flex-col items-center justify-center h-64">
            <VisuallyHidden.Root>
              <DialogTitle>Loading</DialogTitle>
            </VisuallyHidden.Root>
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground mt-2">
              Checking details...
            </p>
          </div>
        )}

        {step === "ADDRESS" && (
          <AddressStep
            initialData={addressData}
            onSuccess={(data) => {
              setAddressData(data);
              setHasSavedAddress(true);
              setStep("PAYMENT");
            }}
            onCancel={handleAddressCancel}
          />
        )}

        {step === "PAYMENT" && (
          <PaymentStep
            product={product}
            selection={selection}
            address={addressData}
            onChangeAddress={() => setStep("ADDRESS")}
            onSuccess={onOrderSuccess} // ✅ Pass Handler
            onClose={onClose}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
