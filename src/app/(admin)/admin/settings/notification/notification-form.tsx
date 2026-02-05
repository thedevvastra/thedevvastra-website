"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Save, Send } from "lucide-react";
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
import { updateNotificationSettings } from "./actions";

interface NotificationFormProps {
  initialData: {
    telegramBotToken: string | null;
    telegramChatId: string | null;
  } | null;
}

export function NotificationForm({ initialData }: NotificationFormProps) {
  const [formData, setFormData] = useState({
    telegramBotToken: initialData?.telegramBotToken || "",
    telegramChatId: initialData?.telegramChatId || "",
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    const res = await updateNotificationSettings(formData);
    setIsSaving(false);

    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success(res.success);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Telegram Notifications</CardTitle>
        <CardDescription>
          Receive instant alerts on Telegram whenever a new order is placed.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Bot Token</Label>
          <Input
            placeholder="e.g. 123456789:ABCdefGHIjklMNOpqrsTUVwxyz"
            value={formData.telegramBotToken}
            onChange={(e) =>
              setFormData({ ...formData, telegramBotToken: e.target.value })
            }
            type="password" // Security ke liye password type
          />
          <p className="text-xs text-muted-foreground">
            Get this from <strong>@BotFather</strong> on Telegram.
          </p>
        </div>

        <div className="space-y-2">
          <Label>Chat ID</Label>
          <Input
            placeholder="e.g. 12345678 or -1002345678"
            value={formData.telegramChatId}
            onChange={(e) =>
              setFormData({ ...formData, telegramChatId: e.target.value })
            }
          />
          <p className="text-xs text-muted-foreground">
            This is your personal ID or Group/Channel ID where the bot will send
            messages.
          </p>
        </div>

        <div className="flex items-center gap-4 pt-4">
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Save Settings
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
