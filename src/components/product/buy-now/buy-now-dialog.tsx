"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { getBuyNowInitData } from "@/app/(shop)/product/actions"; // ✅ Updated Import
import { BuyNowModalProps, AddressData, CouponData } from "./types";

import { AddressStep } from "./address-step";
import { PaymentStep } from "./payment-step";

export function BuyNowDialog({
  isOpen,
  onClose,
  product,
  selection,
  onOrderSuccess,
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
  const [coupons, setCoupons] = useState<CouponData[]>([]); // ✅ Store Coupons

  const fetchData = async () => {
    const res = await getBuyNowInitData(); // ✅ Fetch Address + Coupons
    if (res.success) {
      if (res.address) {
        setAddressData(res.address as AddressData);
        setHasSavedAddress(res.hasAddress);
      }
      if (res.availableCoupons) {
        /* eslint-disable  @typescript-eslint/no-explicit-any */
        setCoupons(res.availableCoupons as any); // ✅ Set Coupons
      }
      setStep(res.hasAddress ? "PAYMENT" : "ADDRESS");
    } else {
      setStep("ADDRESS");
    }
  };

  useEffect(() => {
    if (isOpen) {
      setStep("LOADING");
      fetchData();
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
            availableCoupons={coupons} // ✅ Pass Coupons
            onChangeAddress={() => setStep("ADDRESS")}
            onSuccess={onOrderSuccess}
            onClose={onClose}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
