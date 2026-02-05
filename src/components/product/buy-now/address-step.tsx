"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { saveUserAddress } from "@/app/(shop)/product/actions";
import { AddressData } from "./types";

interface AddressStepProps {
  initialData: AddressData;
  onSuccess: (data: AddressData) => void;
  onCancel: () => void;
}

export function AddressStep({
  initialData,
  onSuccess,
  onCancel,
}: AddressStepProps) {
  const [formData, setFormData] = useState<AddressData>(initialData);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (
      !formData.fullName ||
      !formData.phone ||
      !formData.addressLine1 ||
      !formData.zipCode
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    setIsSaving(true);
    const res = await saveUserAddress(formData);
    setIsSaving(false);

    if (res.success) {
      onSuccess(formData);
      toast.success("Address saved successfully");
    } else {
      toast.error("Failed to save address");
    }
  };

  return (
    <>
      <DialogHeader className="p-6 pb-2">
        <DialogTitle>Shipping Address</DialogTitle>
        <DialogDescription>
          Enter your delivery details to proceed.
        </DialogDescription>
      </DialogHeader>

      <div className="p-6 pt-2 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label>Full Name</Label>
            <Input
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
              placeholder="John Doe"
            />
          </div>
          <div className="space-y-1">
            <Label>Phone Number</Label>
            <Input
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              placeholder="9876543210"
            />
          </div>
        </div>

        <div className="space-y-1">
          <Label>Address (Area and Street)</Label>
          <Input
            value={formData.addressLine1}
            onChange={(e) =>
              setFormData({ ...formData, addressLine1: e.target.value })
            }
            placeholder="123, Main Street"
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-1">
            <Label>City</Label>
            <Input
              value={formData.city}
              onChange={(e) =>
                setFormData({ ...formData, city: e.target.value })
              }
              placeholder="City"
            />
          </div>
          <div className="space-y-1">
            <Label>State</Label>
            <Input
              value={formData.state}
              onChange={(e) =>
                setFormData({ ...formData, state: e.target.value })
              }
              placeholder="State"
            />
          </div>
          <div className="space-y-1">
            <Label>Pincode</Label>
            <Input
              value={formData.zipCode}
              onChange={(e) =>
                setFormData({ ...formData, zipCode: e.target.value })
              }
              placeholder="Zip"
            />
          </div>
        </div>
      </div>

      <DialogFooter className="p-6 pt-0 sm:justify-between gap-3">
        <Button variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="w-full sm:w-auto"
        >
          {isSaving ? (
            <Loader2 className="animate-spin h-4 w-4" />
          ) : (
            "Save & Continue"
          )}
        </Button>
      </DialogFooter>
    </>
  );
}
