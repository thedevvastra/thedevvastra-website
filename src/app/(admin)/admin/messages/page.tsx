import { Metadata } from "next";
import { getMessages } from "./actions";
import { MessagesTable } from "@/components/admin/messages/messages-table";
import { Mails } from "lucide-react";

export const metadata: Metadata = {
  title: "Messages | Admin Panel",
};

export const dynamic = "force-dynamic";

export default async function MessagesPage() {
  const { success, data } = await getMessages();
  const messages = success && data ? data : [];

  return (
    <div className="space-y-6 p-8 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between border-b pb-5">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Mails className="h-8 w-8 text-primary" />
            Contact Messages
          </h1>
          <p className="text-muted-foreground text-sm">
            View customer inquiries and respond via WhatsApp or Email.
          </p>
        </div>
        <div className="bg-primary/10 text-primary font-bold px-4 py-2 rounded-lg">
          {messages.filter((m) => !m.isRead).length} Unread
        </div>
      </div>

      <MessagesTable initialMessages={messages} />
    </div>
  );
}
