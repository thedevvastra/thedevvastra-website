import { Metadata } from "next";
import { getContactSettings } from "./actions";
import { ContactSettingsForm } from "@/components/admin/settings/contact-form";
import { Settings2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Settings | Admin",
};

export const dynamic = "force-dynamic";

export default async function ContactSettingsPage() {
  const settings = await getContactSettings();

  return (
    <div className="space-y-6 p-8 max-w-[1200px] mx-auto">
      <div className="flex items-center justify-between border-b pb-5">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Settings2 className="h-8 w-8 text-primary" />
            Contact & Social Info
          </h1>
          <p className="text-muted-foreground text-sm">
            Manage your contact details, map location, and social media links.
          </p>
        </div>
      </div>

      <ContactSettingsForm initialData={settings || {}} />
    </div>
  );
}
