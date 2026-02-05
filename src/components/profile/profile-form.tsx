"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Building,
  Map as MapIcon,
  Home,
  Loader2,
  Save,
  Camera,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { updateUserProfile } from "@/app/(shop)/my-profile/actions";

interface ProfileFormProps {
  user: any;
}

export function ProfileForm({ user }: ProfileFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit } = useForm({
    defaultValues: {
      fullName: user?.fullName || "",
      email: user?.email || "",
      phone: user?.phone || "",
      addressLine1: user?.addressLine1 || "",
      city: user?.city || "",
      state: user?.state || "",
      zipCode: user?.zipCode || "",
    },
  });

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    const res = await updateUserProfile(data);
    setIsSubmitting(false);

    if (res.success) {
      toast.success("Profile updated successfully!");
    } else {
      toast.error(res.error || "Something went wrong");
    }
  };

  const initial =
    user?.fullName?.charAt(0).toUpperCase() ||
    user?.email?.charAt(0).toUpperCase();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pb-20 md:pb-0">
      {/* 1. IDENTITY SECTION */}
      <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
        {/* Banner */}
        <div className="h-24 sm:h-32 bg-gradient-to-r from-primary/10 via-primary/5 to-background border-b" />

        <div className="px-6 pb-6 relative">
          {/* Avatar - Negative Margin to overlap banner */}
          <div className="relative -mt-12 mb-4 flex justify-between items-end">
            <div className="relative group">
              <Avatar className="h-24 w-24 sm:h-28 sm:w-28 border-[4px] border-card shadow-md cursor-pointer">
                <AvatarImage src={user?.avatarUrl} className="object-cover" />
                <AvatarFallback className="text-3xl font-bold bg-primary/10 text-primary">
                  {initial}
                </AvatarFallback>
              </Avatar>
              <div className="absolute bottom-0 right-0 bg-primary text-white p-1.5 rounded-full border-[3px] border-card shadow-sm">
                <Camera className="h-3.5 w-3.5" />
              </div>
            </div>

            <div className="hidden sm:block">
              <Button
                type="submit"
                disabled={isSubmitting}
                size="sm"
                className="gap-2"
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Save Changes
              </Button>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase text-muted-foreground ml-1">
                Full Name
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  {...register("fullName")}
                  className="pl-9 bg-muted/30 focus:bg-background transition-colors h-10"
                  placeholder="Your Name"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase text-muted-foreground ml-1">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  {...register("email")}
                  className="pl-9 bg-muted/50 h-10"
                  disabled
                />
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label className="text-xs font-semibold uppercase text-muted-foreground ml-1">
                Phone Number
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  {...register("phone")}
                  className="pl-9 bg-muted/30 focus:bg-background transition-colors h-10"
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. ADDRESS SECTION */}
      <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 sm:p-6 border-b bg-muted/5">
          <h2 className="font-semibold text-lg flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" /> Delivery Address
          </h2>
          <p className="text-sm text-muted-foreground">
            This address will be used for your orders.
          </p>
        </div>

        <div className="p-4 sm:p-6 space-y-5">
          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase text-muted-foreground ml-1">
              Street Address
            </Label>
            <div className="relative">
              <Home className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                {...register("addressLine1")}
                className="pl-9 bg-muted/30 focus:bg-background transition-colors h-10"
                placeholder="Flat, House no., Building, Apartment"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase text-muted-foreground ml-1">
                City
              </Label>
              <div className="relative">
                <Building className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  {...register("city")}
                  className="pl-9 bg-muted/30 focus:bg-background transition-colors h-10"
                  placeholder="City"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase text-muted-foreground ml-1">
                State
              </Label>
              <div className="relative">
                <MapIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  {...register("state")}
                  className="pl-9 bg-muted/30 focus:bg-background transition-colors h-10"
                  placeholder="State"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase text-muted-foreground ml-1">
              Pincode
            </Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                {...register("zipCode")}
                className="pl-9 bg-muted/30 focus:bg-background transition-colors h-10 max-w-[200px]"
                placeholder="000000"
              />
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE STICKY BUTTON */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t sm:hidden z-10">
        <Button
          type="submit"
          disabled={isSubmitting}
          size="lg"
          className="w-full shadow-lg"
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>
    </form>
  );
}
