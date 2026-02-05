"use client";

import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  Loader2,
  Truck,
  Clock,
  IndianRupee,
  ShieldCheck,
  Info,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { updateShippingSettings } from "@/app/(admin)/settings/actions";

interface ShippingFormProps {
  initialData?: any;
}

export function ShippingForm({ initialData }: ShippingFormProps) {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      shippingCharge: initialData?.shippingCharge || 0,
      freeShippingThreshold: initialData?.freeShippingThreshold || 0,
      shippingBy: initialData?.shippingBy || "Standard Courier",
      shippingDuration: initialData?.shippingDuration || "5 - 7 Days",
    },
  });

  const onSubmit = async (data: any) => {
    try {
      const res = await updateShippingSettings(data);
      if (res.success) {
        toast.success("Settings Saved", {
          description: "Shipping rules have been updated.",
        });
      } else {
        toast.error("Error", {
          description: res.error || "Failed to save settings.",
        });
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {/* CARD 1: COST CONFIGURATION */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <IndianRupee className="h-5 w-5 text-primary" />
              Shipping Costs
            </CardTitle>
            <CardDescription>
              Define base charges and free shipping logic.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Standard Shipping Charge (₹)</Label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="number"
                  className="pl-9"
                  placeholder="e.g. 50"
                  {...register("shippingCharge")}
                />
              </div>
              <p className="text-[11px] text-muted-foreground">
                This amount applies to orders below the free threshold.
              </p>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>Free Shipping Threshold (₹)</Label>
              <div className="relative">
                <ShieldCheck className="absolute left-3 top-2.5 h-4 w-4 text-green-600" />
                <Input
                  type="number"
                  className="pl-9 border-green-200 focus-visible:ring-green-500"
                  placeholder="e.g. 999"
                  {...register("freeShippingThreshold")}
                />
              </div>
              <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                <Info className="h-3 w-3" /> Set to 0 to disable free shipping.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* CARD 2: LOGISTICS INFO */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Truck className="h-5 w-5 text-primary" />
              Logistics Details
            </CardTitle>
            <CardDescription>
              Information displayed to customers on checkout.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Shipping Partner / Method</Label>
              <div className="relative">
                <Truck className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  className="pl-9"
                  placeholder="e.g. BlueDart Express"
                  {...register("shippingBy")}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Estimated Delivery Time</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  className="pl-9"
                  placeholder="e.g. 3 - 5 Business Days"
                  {...register("shippingDuration")}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button size="lg" disabled={isSubmitting} className="min-w-[150px]">
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>
    </form>
  );
}
