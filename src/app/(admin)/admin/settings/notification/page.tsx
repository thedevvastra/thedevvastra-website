import { getNotificationSettings } from "./actions";
import { NotificationForm } from "./notification-form";

export default async function NotificationSettingsPage() {
  const settings = await getNotificationSettings();

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          Notification Settings
        </h2>
        <p className="text-muted-foreground">
          Configure where you want to receive order alerts.
        </p>
      </div>

      <NotificationForm initialData={settings} />
    </div>
  );
}
