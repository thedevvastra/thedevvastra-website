"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
  Search,
  Mail,
  Phone,
  Trash2,
  Circle,
  MessageCircle,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import {
  toggleMessageReadStatus,
  deleteMessage,
} from "@/app/(admin)/admin/messages/actions";

export function MessagesTable({ initialMessages }: { initialMessages: any[] }) {
  const [messages, setMessages] = useState(initialMessages);
  const [searchTerm, setSearchTerm] = useState("");

  // ✅ State for Delete Modal
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredMessages = messages.filter(
    (msg) =>
      msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.subject.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleToggleRead = async (id: string, currentStatus: boolean) => {
    // Optimistic Update
    setMessages((msgs) =>
      msgs.map((m) => (m.id === id ? { ...m, isRead: !currentStatus } : m)),
    );

    const res = await toggleMessageReadStatus(id, currentStatus);
    if (!res.success) {
      toast.error("Failed to update status");
      setMessages(initialMessages); // Revert if failed
    }
  };

  // ✅ New Delete Handler (Executes on Modal Confirm)
  const onConfirmDelete = async () => {
    if (!deleteId) return;

    setIsDeleting(true);

    // Optimistic Remove from UI
    const previousMessages = [...messages];
    setMessages((msgs) => msgs.filter((m) => m.id !== deleteId));

    const res = await deleteMessage(deleteId);

    setIsDeleting(false);
    setDeleteId(null); // Close Modal

    if (res.success) {
      toast.success("Message deleted successfully");
    } else {
      toast.error("Failed to delete message");
      setMessages(previousMessages); // Revert if failed
    }
  };

  const openWhatsApp = (phone: string) => {
    const cleanNumber = phone.replace(/\D/g, "");
    const finalNumber =
      cleanNumber.length === 10 ? `91${cleanNumber}` : cleanNumber;
    window.open(`https://wa.me/${finalNumber}`, "_blank");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative w-full sm:w-[300px]">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email or subject..."
            className="pl-9 bg-background"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Card className="border-border/60 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow>
                <TableHead className="w-[50px]"></TableHead>
                <TableHead className="w-[200px]">Sender</TableHead>
                <TableHead>Subject & Message</TableHead>
                <TableHead className="w-[150px]">Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMessages.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-32 text-center text-muted-foreground"
                  >
                    No messages found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredMessages.map((msg) => (
                  <TableRow
                    key={msg.id}
                    className={
                      msg.isRead ? "opacity-70 bg-muted/10" : "bg-background"
                    }
                  >
                    {/* Read/Unread Indicator */}
                    <TableCell>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              onClick={() =>
                                handleToggleRead(msg.id, msg.isRead)
                              }
                            >
                              {msg.isRead ? (
                                <Circle className="h-3 w-3 text-muted-foreground" />
                              ) : (
                                <Circle className="h-3 w-3 text-blue-600 fill-blue-600" />
                              )}
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              {msg.isRead ? "Mark as Unread" : "Mark as Read"}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>

                    {/* Sender Info */}
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <span
                          className={`font-medium ${!msg.isRead && "text-foreground font-bold"}`}
                        >
                          {msg.name}
                        </span>
                        <div className="flex flex-col text-xs text-muted-foreground gap-0.5">
                          <span className="flex items-center gap-1">
                            <Mail className="h-3 w-3" /> {msg.email}
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone className="h-3 w-3" /> {msg.phone}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    {/* Content */}
                    <TableCell>
                      <div className="max-w-[500px]">
                        <p
                          className={`text-sm mb-1 ${!msg.isRead ? "font-bold text-foreground" : "font-medium"}`}
                        >
                          {msg.subject}
                        </p>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {msg.message}
                        </p>
                      </div>
                    </TableCell>

                    {/* Date */}
                    <TableCell className="text-xs text-muted-foreground">
                      {format(new Date(msg.createdAt), "dd MMM yyyy")}
                      <br />
                      {format(new Date(msg.createdAt), "hh:mm a")}
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 text-green-600 border-green-200 hover:bg-green-50"
                                onClick={() => openWhatsApp(msg.phone)}
                              >
                                <MessageCircle className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Chat on WhatsApp</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        {/* ✅ Delete Button triggers Modal State */}
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-red-600 hover:bg-red-50"
                                onClick={() => setDeleteId(msg.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Delete Message</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* ✅ Delete Confirmation Modal */}
      <AlertDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" /> Delete Message
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this message? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                onConfirmDelete();
              }}
              className="bg-red-600 hover:bg-red-700"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
