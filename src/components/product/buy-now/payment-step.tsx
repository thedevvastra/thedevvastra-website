"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Loader2,
  CreditCard,
  Banknote,
  MapPin,
  TicketPercent,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  createDirectOrder,
  verifyDirectPayment,
} from "@/app/(shop)/product/actions";
import { verifyCouponCode } from "@/app/(admin)/admin/coupons/actions";
import {
  BuyNowProduct,
  BuyNowSelection,
  AddressData,
  CouponData,
} from "./types";

interface PaymentStepProps {
  product: BuyNowProduct;
  selection: BuyNowSelection;
  address: AddressData;
  availableCoupons: CouponData[];
  onChangeAddress: () => void;
  onSuccess: (orderId: string) => void;
  onClose: () => void;
}

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export function PaymentStep({
  product,
  selection,
  address,
  availableCoupons,
  onChangeAddress,
  onSuccess,
  onClose,
}: PaymentStepProps) {
  const [paymentMethod, setPaymentMethod] = useState("Online");
  const [isProcessing, setIsProcessing] = useState(false);

  // --- COUPON STATE ---
  const [couponCode, setCouponCode] = useState("");
  const [verifyingCoupon, setVerifyingCoupon] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discountAmount: number;
  } | null>(null);

  // ✅ FIX 1: NaN Issue - Robust Price Calculation
  // Agar sellingPrice undefined hai to price use karo, warna 0
  const effectivePrice = product.sellingPrice ?? product.price ?? 0;
  const baseAmount = effectivePrice * selection.quantity;

  // Final Amount (After Discount)
  const totalAmount = Math.max(
    0,
    baseAmount - (appliedCoupon?.discountAmount || 0),
  );

  // --- HANDLERS ---
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setVerifyingCoupon(true);

    // Mock cart format for verification
    const mockCart = [
      {
        product: { id: product.id, sellingPrice: effectivePrice }, // Use effectivePrice
        quantity: selection.quantity,
      },
    ];

    const res = await verifyCouponCode(couponCode, baseAmount, mockCart);
    setVerifyingCoupon(false);

    if (res.error) {
      toast.error(res.error);
      setAppliedCoupon(null);
    } else {
      toast.success(res.message);
      setAppliedCoupon({
        // ✅ FIX 2: TS Error - Fallback to empty string
        code: res.code || "",
        discountAmount: res.discountAmount || 0,
      });
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    toast.info("Coupon removed");
  };

  const handleProceed = async () => {
    setIsProcessing(true);

    const res = await createDirectOrder({
      productId: product.id,
      quantity: selection.quantity,
      color: selection.color || undefined,
      size: selection.size || undefined,
      paymentMethod,
      couponCode: appliedCoupon?.code,
    });

    if (!res.success || !res.orderId) {
      setIsProcessing(false);
      toast.error(res.error || "Order creation failed");
      return;
    }

    // COD FLOW
    if (paymentMethod === "COD") {
      onClose();
      onSuccess(res.displayId!);
      return;
    }

    // RAZORPAY FLOW
    const isScriptLoaded = await loadRazorpayScript();
    if (!isScriptLoaded) {
      setIsProcessing(false);
      toast.error("Razorpay SDK failed to load");
      return;
    }

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: res.amount! * 100,
      currency: "INR",
      name: "The Dev Vastra",
      description: "Order Payment",
      order_id: res.razorpayOrderId,
      /* eslint-disable  @typescript-eslint/no-explicit-any */
      handler: async function (response: any) {
        const verifyRes = await verifyDirectPayment({
          orderId: res.orderId!,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpayOrderId: response.razorpay_order_id,
          razorpaySignature: response.razorpay_signature,
        });

        if (verifyRes.success) {
          onSuccess(res.displayId!);
        } else {
          toast.error("Payment Verification Failed");
        }
      },
      prefill: { contact: res.userPhone, email: res.userEmail },
      theme: { color: "#ea580c" },
      modal: {
        ondismiss: function () {
          setIsProcessing(false);
          toast.info("Payment Cancelled");
        },
      },
    };

    /* eslint-disable  @typescript-eslint/no-explicit-any */
    const rzp1 = new (window as any).Razorpay(options);
    onClose();
    rzp1.open();
  };

  if (isProcessing) {
    return (
      <div className="flex flex-col items-center justify-center h-64 p-6 text-center animate-in fade-in">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <h3 className="text-lg font-semibold">Processing...</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Please wait while we initiate your order.
        </p>
      </div>
    );
  }

  return (
    <>
      <DialogHeader className="p-6 pb-2">
        <DialogTitle>Review & Pay</DialogTitle>
        <DialogDescription>Confirm details and pay.</DialogDescription>
      </DialogHeader>

      <div className="p-6 pt-2 space-y-6 overflow-y-auto max-h-[60vh]">
        {/* Address Preview */}
        <div className="rounded-lg border bg-muted/30 p-3 flex items-start gap-3">
          <div className="bg-white p-2 rounded-full border shadow-sm">
            <MapPin className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-sm">
                Deliver to: {address.fullName}
              </p>
              <Button
                variant="link"
                className="h-auto p-0 text-xs text-primary"
                onClick={onChangeAddress}
              >
                Change
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
              {address.addressLine1}, {address.city}, {address.zipCode}
            </p>
          </div>
        </div>

        {/* Product Summary */}
        <div className="flex items-center gap-4 bg-muted/30 p-3 rounded-lg border">
          <div className="relative h-14 w-14 rounded-md overflow-hidden bg-muted shrink-0 border">
            {product.image ? (
              <Image
                src={product.image}
                alt={product.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs font-bold text-muted-foreground">
                IMG
              </div>
            )}
          </div>
          <div className="flex-1">
            <p className="font-medium text-sm line-clamp-1">{product.title}</p>
            <p className="text-xs text-muted-foreground">
              Qty: {selection.quantity}
            </p>
          </div>
          <div className="text-right">
            {/* ✅ Display Calculated Base Amount */}
            <span className="text-sm font-bold">
              ₹{baseAmount.toLocaleString()}
            </span>
          </div>
        </div>

        {/* ✅ COUPON SECTION */}
        <div className="space-y-3">
          <Label className="text-xs uppercase text-muted-foreground font-bold tracking-wider">
            Coupon Code
          </Label>

          {appliedCoupon ? (
            // Applied State
            <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg text-green-700">
              <div className="flex items-center gap-2">
                <TicketPercent className="h-5 w-5" />
                <div>
                  <p className="text-sm font-bold">{appliedCoupon.code}</p>
                  <p className="text-[10px]">Discount Applied</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bold">
                  -₹{appliedCoupon.discountAmount}
                </span>
                <button
                  onClick={handleRemoveCoupon}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          ) : (
            // Input State
            <div className="space-y-3">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter Code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  className="uppercase h-10"
                />
                <Button
                  variant="outline"
                  onClick={handleApplyCoupon}
                  disabled={verifyingCoupon || !couponCode}
                  className="h-10"
                >
                  {verifyingCoupon ? (
                    <Loader2 className="animate-spin h-4 w-4" />
                  ) : (
                    "Apply"
                  )}
                </Button>
              </div>

              {/* Available Coupons Chips */}
              {availableCoupons && availableCoupons.length > 0 && (
                <div className="space-y-2 pt-1">
                  <p className="text-[10px] text-muted-foreground font-semibold">
                    Available Offers:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {availableCoupons.map((c) => (
                      <div
                        key={c.id}
                        onClick={() => setCouponCode(c.code)}
                        className="cursor-pointer group flex items-center gap-2 px-2 py-1.5 rounded-md border border-dashed border-primary/40 bg-primary/5 hover:bg-primary/10 transition-colors"
                      >
                        <TicketPercent className="h-3 w-3 text-primary" />
                        <span className="font-bold text-xs text-primary uppercase">
                          {c.code}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <Separator />

        {/* Total Summary */}
        <div className="flex justify-between items-center">
          <span className="font-bold text-lg">Total Amount</span>
          <div className="text-right">
            {appliedCoupon && (
              <p className="text-xs text-muted-foreground line-through decoration-red-500">
                ₹{baseAmount.toLocaleString()}
              </p>
            )}
            <span className="font-bold text-2xl text-primary">
              ₹{totalAmount.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Payment Methods */}
        <RadioGroup
          value={paymentMethod}
          onValueChange={setPaymentMethod}
          className="gap-3"
        >
          <Label
            className={`flex items-center justify-between border p-3 rounded-xl cursor-pointer transition-all ${paymentMethod === "Online" ? "border-primary bg-primary/5 ring-1 ring-primary" : "hover:bg-muted/10"}`}
          >
            <div className="flex items-center gap-3">
              <RadioGroupItem
                value="Online"
                id="online"
                className="text-primary"
              />
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-blue-600" />
                <div>
                  <span className="font-medium block text-sm">Pay Online</span>
                  <span className="text-[10px] text-muted-foreground">
                    UPI, Cards, Netbanking
                  </span>
                </div>
              </div>
            </div>
          </Label>
          <Label
            className={`flex items-center justify-between border p-3 rounded-xl cursor-pointer transition-all ${paymentMethod === "COD" ? "border-primary bg-primary/5 ring-1 ring-primary" : "hover:bg-muted/10"}`}
          >
            <div className="flex items-center gap-3">
              <RadioGroupItem value="COD" id="cod" className="text-primary" />
              <div className="flex items-center gap-2">
                <Banknote className="h-4 w-4 text-green-600" />
                <div>
                  <span className="font-medium block text-sm">
                    Cash on Delivery
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    Pay when you receive
                  </span>
                </div>
              </div>
            </div>
          </Label>
        </RadioGroup>
      </div>

      <DialogFooter className="p-6 pt-0 sm:justify-between gap-3">
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button
          onClick={handleProceed}
          disabled={isProcessing}
          className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700 text-white font-bold"
        >
          {isProcessing ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : paymentMethod === "Online" ? (
            `Pay ₹${totalAmount.toLocaleString()}`
          ) : (
            `Place Order • ₹${totalAmount.toLocaleString()}`
          )}
        </Button>
      </DialogFooter>
    </>
  );
}
