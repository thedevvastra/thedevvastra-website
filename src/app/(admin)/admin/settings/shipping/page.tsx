import { getStoreSettings } from "@/app/(admin)/settings/actions";
// Import path ab sahi kaam karega
import { ShippingForm } from "@/components/admin/settings/shipping-form";

export const dynamic = "force-dynamic";

export default async function ShippingSettingsPage() {
  const settings = await getStoreSettings();

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-6">
      <div className="flex flex-col gap-1 border-b pb-4">
        <h1 className="text-3xl font-bold tracking-tight">
          Shipping Configuration
        </h1>
        <p className="text-muted-foreground">
          Manage your store's delivery charges, thresholds, and estimated
          timelines.
        </p>
      </div>

      {/* Form Component */}
      <ShippingForm initialData={settings} />
    </div>
  );
}
