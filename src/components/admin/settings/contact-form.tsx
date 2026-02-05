"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  Save,
  Loader2,
  MapPin,
  Phone,
  Mail,
  Globe,
  Share2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { updateContactSettings } from "@/app/(admin)/admin/settings/contact/actions";

export function ContactSettingsForm({ initialData }: { initialData: any }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit } = useForm({
    defaultValues: {
      email1: initialData?.email1 || "",
      email2: initialData?.email2 || "",
      phone1: initialData?.phone1 || "",
      phone2: initialData?.phone2 || "",
      address: initialData?.address || "",
      googleMapUrl: initialData?.googleMapUrl || "",
      instagram: initialData?.instagram || "",
      facebook: initialData?.facebook || "",
      youtube: initialData?.youtube || "",
      whatsapp: initialData?.whatsapp || "",
    },
  });

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    const res = await updateContactSettings(data);
    setIsSubmitting(false);

    if (res.success) {
      toast.success("Settings updated successfully");
    } else {
      toast.error("Failed to update settings");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* 1. Contact Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" /> Contact Details
          </CardTitle>
          <CardDescription>
            These details will appear on the Contact Us page.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Support Email (Primary)</Label>
            <Input {...register("email1")} placeholder="support@example.com" />
          </div>
          <div className="space-y-2">
            <Label>Inquiry Email (Secondary)</Label>
            <Input {...register("email2")} placeholder="queries@example.com" />
          </div>
          <div className="space-y-2">
            <Label>Phone Number 1</Label>
            <Input {...register("phone1")} placeholder="+91 98765 43210" />
          </div>
          <div className="space-y-2">
            <Label>Phone Number 2</Label>
            <Input {...register("phone2")} placeholder="+91 12345 67890" />
          </div>
          <div className="col-span-2 space-y-2">
            <Label>Office Address</Label>
            <Textarea
              {...register("address")}
              placeholder="123, Street Name, City, State - Zip"
              className="min-h-[100px]"
            />
          </div>
        </CardContent>
      </Card>

      {/* 2. Map Integration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" /> Google Maps
          </CardTitle>
          <CardDescription>
            Paste the "Embed a map" SRC URL from Google Maps (inside the iframe
            src="...").
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label>Map Embed URL</Label>
            <Input
              {...register("googleMapUrl")}
              placeholder="https://www.google.com/maps/embed?pb=..."
            />
            <p className="text-xs text-muted-foreground">
              Go to Google Maps {">"} Share {">"} Embed a map {">"} Copy only
              the URL inside src=""
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 3. Social Media */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" /> Social Media Links
          </CardTitle>
          <CardDescription>Links to your social profiles.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Instagram URL</Label>
            <Input
              {...register("instagram")}
              placeholder="https://instagram.com/yourhandle"
            />
          </div>
          <div className="space-y-2">
            <Label>Facebook URL</Label>
            <Input
              {...register("facebook")}
              placeholder="https://facebook.com/yourpage"
            />
          </div>
          <div className="space-y-2">
            <Label>YouTube URL</Label>
            <Input
              {...register("youtube")}
              placeholder="https://youtube.com/@channel"
            />
          </div>
          <div className="space-y-2">
            <Label>WhatsApp Number/Link</Label>
            <Input
              {...register("whatsapp")}
              placeholder="https://wa.me/919876543210"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" size="lg" disabled={isSubmitting}>
          {isSubmitting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Save Changes
        </Button>
      </div>
    </form>
  );
}
