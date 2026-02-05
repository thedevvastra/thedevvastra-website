"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  MapPin,
  Edit2,
  Loader2,
  User,
  Phone,
  Home,
  Building2,
  Map,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { saveUserAddress } from "@/app/(shop)/cart/actions";
import { cn } from "@/lib/utils";

interface AddressSectionProps {
  userProfile: any;
  onAddressUpdate: () => void;
}

export function AddressSection({
  userProfile,
  onAddressUpdate,
}: AddressSectionProps) {
  // Check if critical fields exist
  const hasAddress =
    userProfile?.addressLine1 && userProfile?.phone && userProfile?.fullName;
  const [isEditing, setIsEditing] = useState(!hasAddress);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm({
    defaultValues: {
      fullName: userProfile?.fullName || "",
      addressLine1: userProfile?.addressLine1 || "",
      city: userProfile?.city || "",
      state: userProfile?.state || "",
      zipCode: userProfile?.zipCode || "",
      phone: userProfile?.phone || "",
    },
  });

  const onSubmit = async (data: any) => {
    await saveUserAddress(data);
    toast.success("Delivery details saved!");
    setIsEditing(false);
    onAddressUpdate();
  };

  // --- VIEW MODE (Saved Address) ---
  if (!isEditing && hasAddress) {
    return (
      <Card className="relative overflow-hidden border-primary/20 shadow-sm hover:shadow-md transition-all duration-300 group bg-card/50">
        {/* Accent Bar */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary/60" />

        <CardContent className="p-5 pl-7 flex items-start gap-5">
          {/* Icon Box */}
          <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 text-primary mt-1 shadow-sm">
            <MapPin className="h-6 w-6" />
          </div>

          <div className="flex-1 space-y-1.5">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-base text-foreground tracking-tight">
                Delivering to
              </h4>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-3 text-xs text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all"
                onClick={() => setIsEditing(true)}
              >
                <Edit2 className="h-3.5 w-3.5 mr-1.5" /> Edit
              </Button>
            </div>

            <div className="text-sm text-foreground/90 font-medium">
              {userProfile.fullName}
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed max-w-[90%]">
              {userProfile.addressLine1}, <br />
              {userProfile.city}, {userProfile.state} -{" "}
              <span className="font-semibold text-foreground/80">
                {userProfile.zipCode}
              </span>
            </p>

            <div className="flex items-center gap-2 pt-2 text-sm font-medium text-foreground/80">
              <Phone className="h-3.5 w-3.5 text-primary" />
              {userProfile.phone}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // --- EDIT MODE (Form) ---
  return (
    <Card className="border-border shadow-md animate-in fade-in slide-in-from-top-2 duration-300">
      <CardHeader className="pb-4 border-b bg-muted/10">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <MapPin className="h-4 w-4 text-primary" />
          {hasAddress ? "Update Delivery Details" : "Add Delivery Address"}
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Row 1: Personal Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-muted-foreground uppercase">
                Full Name
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  {...register("fullName", { required: true })}
                  placeholder="John Doe"
                  className="pl-9 bg-muted/5 focus:bg-background"
                />
              </div>
              {errors.fullName && (
                <span className="text-[10px] text-red-500">
                  Name is required
                </span>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold text-muted-foreground uppercase">
                Phone Number
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  {...register("phone", { required: true })}
                  placeholder="9876543210"
                  className="pl-9 bg-muted/5 focus:bg-background"
                />
              </div>
              {errors.phone && (
                <span className="text-[10px] text-red-500">
                  Phone is required
                </span>
              )}
            </div>
          </div>

          {/* Row 2: Address */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-muted-foreground uppercase">
              Street Address
            </Label>
            <div className="relative">
              <Home className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                {...register("addressLine1", { required: true })}
                placeholder="Flat No, Building, Street"
                className="pl-9 bg-muted/5 focus:bg-background"
              />
            </div>
            {errors.addressLine1 && (
              <span className="text-[10px] text-red-500">
                Address is required
              </span>
            )}
          </div>

          {/* Row 3: Location Details */}
          <div className="grid grid-cols-6 gap-4">
            <div className="col-span-3 md:col-span-2 space-y-2">
              <Label className="text-xs font-semibold text-muted-foreground uppercase">
                City
              </Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  {...register("city", { required: true })}
                  placeholder="City"
                  className="pl-9 bg-muted/5 focus:bg-background"
                />
              </div>
            </div>

            <div className="col-span-3 md:col-span-2 space-y-2">
              <Label className="text-xs font-semibold text-muted-foreground uppercase">
                State
              </Label>
              <div className="relative">
                <Map className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  {...register("state", { required: true })}
                  placeholder="State"
                  className="pl-9 bg-muted/5 focus:bg-background"
                />
              </div>
            </div>

            <div className="col-span-6 md:col-span-2 space-y-2">
              <Label className="text-xs font-semibold text-muted-foreground uppercase">
                Zip Code
              </Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  {...register("zipCode", { required: true })}
                  placeholder="PIN Code"
                  className="pl-9 bg-muted/5 focus:bg-background"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-3">
            {hasAddress && (
              <Button
                type="button"
                variant="outline"
                className="flex-1 h-11"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              className="flex-1 h-11 shadow-md transition-transform active:scale-[0.98]"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Save & Deliver Here"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
