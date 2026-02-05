import { Metadata } from "next";
import { Suspense } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Instagram,
  Facebook,
  Youtube,
  MessageCircle,
} from "lucide-react";
import { ContactForm } from "@/components/contact/contact-form";
import { getContactSettings } from "@/app/(admin)/admin/settings/contact/actions"; // Reuse fetcher
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact Us | The Dev Vastra",
};

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const settings = await getContactSettings();

  return (
    <div className="bg-muted/5 min-h-[calc(100vh-4rem)]">
      <div className="container max-w-6xl mx-auto py-12 px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Get in Touch
          </h1>
          <p className="text-lg text-muted-foreground">
            Have a question about your order? Reach out to us via email, phone,
            or visit our store.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-12">
          {/* LEFT SIDE: Dynamic Info */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-primary/5 p-8 rounded-2xl border border-primary/10 space-y-8">
              <h3 className="font-semibold text-xl border-b pb-4">
                Contact Information
              </h3>

              {/* Emails */}
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-full bg-background flex items-center justify-center shadow-sm text-primary shrink-0">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">Email Us</p>
                  <p className="text-sm text-muted-foreground">
                    {settings?.email1 || "support@thedevvastra.com"}
                  </p>
                  {settings?.email2 && (
                    <p className="text-sm text-muted-foreground">
                      {settings.email2}
                    </p>
                  )}
                </div>
              </div>

              {/* Phones */}
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-full bg-background flex items-center justify-center shadow-sm text-primary shrink-0">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">Call Us</p>
                  <p className="text-sm text-muted-foreground">
                    {settings?.phone1 || "+91 98765 43210"}
                  </p>
                  {settings?.phone2 && (
                    <p className="text-sm text-muted-foreground">
                      {settings.phone2}
                    </p>
                  )}
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-full bg-background flex items-center justify-center shadow-sm text-primary shrink-0">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">Office Address</p>
                  <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                    {settings?.address ||
                      "123, Fashion Street, Tech Park, Salt Lake, Kolkata - 700091"}
                  </p>
                </div>
              </div>

              {/* Social Links */}
              <div className="pt-4 border-t flex gap-3">
                {settings?.instagram && (
                  <Link href={settings.instagram} target="_blank">
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full hover:bg-pink-50 hover:text-pink-600"
                    >
                      <Instagram className="h-5 w-5" />
                    </Button>
                  </Link>
                )}
                {settings?.facebook && (
                  <Link href={settings.facebook} target="_blank">
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full hover:bg-blue-50 hover:text-blue-600"
                    >
                      <Facebook className="h-5 w-5" />
                    </Button>
                  </Link>
                )}
                {settings?.youtube && (
                  <Link href={settings.youtube} target="_blank">
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full hover:bg-red-50 hover:text-red-600"
                    >
                      <Youtube className="h-5 w-5" />
                    </Button>
                  </Link>
                )}
                {settings?.whatsapp && (
                  <Link href={settings.whatsapp} target="_blank">
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full hover:bg-green-50 hover:text-green-600"
                    >
                      <MessageCircle className="h-5 w-5" />
                    </Button>
                  </Link>
                )}
              </div>
            </div>

            {/* Embedded Map */}
            {settings?.googleMapUrl && (
              <div className="rounded-xl overflow-hidden border shadow-sm h-64 bg-muted">
                <iframe
                  src={settings.googleMapUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            )}
          </div>

          {/* RIGHT SIDE: Contact Form (Existing) */}
          <div className="lg:col-span-7">
            <div className="bg-card rounded-2xl border shadow-sm p-1 sm:p-2 sticky top-24">
              <Suspense
                fallback={
                  <div className="p-10 text-center">Loading form...</div>
                }
              >
                <ContactForm />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
