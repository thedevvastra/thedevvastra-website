"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { getUserAddress } from "@/app/(shop)/product/actions";

// ✅ Importing sub-components from the 'buy-now' folder
import { AddressStep } from "./buy-now/address-step";
import { PaymentStep } from "./buy-now/payment-step";
import { BuyNowModalProps, AddressData } from "./buy-now/types";

export function BuyNowModal({
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

  // Track if user originally had an address (to decide Cancel behavior)
  const [hasSavedAddress, setHasSavedAddress] = useState(false);

  // 1. Fetch Address Logic
  const fetchAddress = async () => {
    const res = await getUserAddress();

    if (res.success && res.address) {
      setAddressData(res.address as AddressData);
      setHasSavedAddress(res.hasAddress);
      // Agar address hai to sidha Payment, nahi to Address form
      setStep(res.hasAddress ? "PAYMENT" : "ADDRESS");
    } else {
      setHasSavedAddress(false);
      setStep("ADDRESS");
    }
  };

  // 2. Effect to load address when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep("LOADING");
      fetchAddress();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // 3. Handle Cancel on Address Step
  const handleAddressCancel = () => {
    if (hasSavedAddress) {
      setStep("PAYMENT"); // Go back to Payment if address exists
    } else {
      onClose(); // Close modal if no address ever existed
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden gap-0">
        {/* --- STEP 1: LOADING --- */}
        {step === "LOADING" && (
          <div className="flex flex-col items-center justify-center h-64">
            <VisuallyHidden.Root>
              <DialogTitle>Loading Details</DialogTitle>
            </VisuallyHidden.Root>
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground mt-2">
              Checking your details...
            </p>
          </div>
        )}

        {/* --- STEP 2: ADDRESS FORM --- */}
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

        {/* --- STEP 3: PAYMENT & REVIEW --- */}
        {step === "PAYMENT" && (
          <PaymentStep
            product={product}
            selection={selection}
            address={addressData}
            onChangeAddress={() => setStep("ADDRESS")}
            onOrderSuccess={onOrderSuccess} // Triggers Success Modal in Parent
            onModalClose={onClose} // Closes THIS modal (e.g. for Razorpay overlay)
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
