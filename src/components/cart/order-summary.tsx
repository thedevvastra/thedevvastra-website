"use client";

import { useState } from "react";
import {
  Loader2,
  Info,
  ArrowRight,
  CreditCard,
  Banknote,
  ShieldCheck,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { createRazorpayOrder, placeOrder } from "@/app/(shop)/cart/actions";
import { AddressSection } from "./address-section";

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface OrderSummaryProps {
  cartItems: any[];
  userProfile: any;
  settings: any;
  onOrderSuccess: (orderId: string) => void;
}

export function OrderSummary({
  cartItems,
  userProfile,
  settings,
  onOrderSuccess,
}: OrderSummaryProps) {
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"ONLINE" | "COD">(
    "ONLINE",
  );
  const [hasValidAddress, setHasValidAddress] = useState(
    !!(userProfile?.addressLine1 && userProfile?.phone),
  );

  // Calculations
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.product.sellingPrice * item.quantity,
    0,
  );
  const shippingCharge = settings?.shippingCharge || 0;
  const freeThreshold = settings?.freeShippingThreshold || 0;
  const isFreeShipping = freeThreshold > 0 && subtotal >= freeThreshold;
  const finalShipping = isFreeShipping ? 0 : shippingCharge;
  const total = subtotal + finalShipping;

  // Free Shipping Progress
  const freeShippingProgress =
    freeThreshold > 0 ? Math.min((subtotal / freeThreshold) * 100, 100) : 100;
  const amountNeededForFreeShip = freeThreshold - subtotal;

  const handleCheckout = async () => {
    if (!hasValidAddress) {
      toast.error("Please save your delivery address first");
      return;
    }

    setLoading(true);

    try {
      if (paymentMethod === "COD") {
        const res = await placeOrder({ method: "COD" });
        if (res.success && res.orderId) {
          onOrderSuccess(res.orderId);
        } else {
          toast.error(res.error || "Order failed");
        }
      } else {
        // Razorpay
        const orderData = await createRazorpayOrder(total);

        if (!orderData.success || !orderData.orderId) {
          toast.error("Failed to initiate payment");
          setLoading(false);
          return;
        }

        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: orderData.amount,
          currency: "INR",
          name: "The Dev Vastra",
          description: "Order Payment",
          order_id: orderData.orderId,
          handler: async function (response: any) {
            const res = await placeOrder({
              method: "ONLINE",
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });

            if (res.success && res.orderId) {
              onOrderSuccess(res.orderId);
            } else {
              toast.error(res.error || "Payment verification failed");
            }
          },
          prefill: {
            name: userProfile?.fullName,
            email: userProfile?.email,
            contact: userProfile?.phone,
          },
          theme: { color: "#000000" },
        };

        const rzp1 = new window.Razorpay(options);
        rzp1.open();
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      if (paymentMethod === "COD") setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. ADDRESS SECTION */}
      <AddressSection
        userProfile={userProfile}
        onAddressUpdate={() => setHasValidAddress(true)}
      />

      {/* 2. ORDER SUMMARY CARD */}
      <Card className="shadow-lg border-border border-t-4 border-t-primary">
        <CardHeader className="pb-4 border-b bg-muted/5">
          <CardTitle className="text-lg font-bold">Order Summary</CardTitle>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Free Shipping Progress */}
          {freeThreshold > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium">
                <span>
                  {isFreeShipping
                    ? "Free Shipping Unlocked! 🎉"
                    : `Add ₹${amountNeededForFreeShip} for Free Shipping`}
                </span>
                <span>{Math.round(freeShippingProgress)}%</span>
              </div>
              <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${isFreeShipping ? "bg-green-500" : "bg-primary"}`}
                  style={{ width: `${freeShippingProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Pricing */}
          <div className="space-y-3">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Subtotal</span>
              <span className="font-medium text-foreground">₹{subtotal}</span>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Shipping</span>
              <span
                className={
                  finalShipping === 0
                    ? "text-green-600 font-medium"
                    : "text-foreground"
                }
              >
                {finalShipping === 0 ? "Free" : `₹${finalShipping}`}
              </span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="font-bold text-lg">Total Payable</span>
              <span className="font-bold text-2xl text-primary">₹{total}</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground bg-muted/30 p-2 rounded-md">
              <Info className="h-3 w-3" />
              <span>
                Inclusive of all taxes. Est. delivery:{" "}
                {settings?.shippingDuration || "5-7 Days"}
              </span>
            </div>
          </div>

          {/* Payment Method */}
          <div className="space-y-3 pt-2">
            <Label className="text-xs uppercase text-muted-foreground font-bold tracking-wider">
              Payment Method
            </Label>
            <RadioGroup
              defaultValue="ONLINE"
              onValueChange={(v: any) => setPaymentMethod(v)}
              className="grid grid-cols-1 gap-3"
            >
              <Label
                htmlFor="online"
                className={`group flex items-center justify-between px-4 py-3 border rounded-xl cursor-pointer transition-all ${paymentMethod === "ONLINE" ? "border-primary bg-primary/5 ring-1 ring-primary" : "hover:bg-muted/50 border-border"}`}
              >
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="ONLINE" id="online" />
                  <div className="grid gap-0.5">
                    <span className="font-semibold text-sm group-hover:text-primary transition-colors">
                      Pay Online
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      Secure: UPI, Cards, NetBanking
                    </span>
                  </div>
                </div>
                <CreditCard
                  className={`h-5 w-5 ${paymentMethod === "ONLINE" ? "text-primary" : "text-muted-foreground"}`}
                />
              </Label>

              <Label
                htmlFor="cod"
                className={`group flex items-center justify-between px-4 py-3 border rounded-xl cursor-pointer transition-all ${paymentMethod === "COD" ? "border-primary bg-primary/5 ring-1 ring-primary" : "hover:bg-muted/50 border-border"}`}
              >
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="COD" id="cod" />
                  <div className="grid gap-0.5">
                    <span className="font-semibold text-sm group-hover:text-primary transition-colors">
                      Cash on Delivery
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      Pay cash upon receiving order
                    </span>
                  </div>
                </div>
                <Banknote
                  className={`h-5 w-5 ${paymentMethod === "COD" ? "text-green-600" : "text-muted-foreground"}`}
                />
              </Label>
            </RadioGroup>
          </div>
        </CardContent>
        <CardFooter className="p-6 pt-0">
          <Button
            className="w-full py-6 text-base font-bold shadow-lg shadow-primary/20 transition-all hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0"
            size="lg"
            disabled={!hasValidAddress || loading}
            onClick={handleCheckout}
          >
            {loading ? <Loader2 className="animate-spin mr-2" /> : null}
            {loading ? (
              "Processing..."
            ) : paymentMethod === "ONLINE" ? (
              <span className="flex items-center gap-2">
                Proceed to Buy <ArrowRight className="h-5 w-5" />
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Place Order <ShieldCheck className="h-5 w-5" />
              </span>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
