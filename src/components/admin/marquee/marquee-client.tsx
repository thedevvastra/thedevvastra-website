"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Plus, Trash2, Edit, Save, Loader2, Megaphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch"; // ✅ Import Switch
import { Label } from "@/components/ui/label"; // ✅ Import Label
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertModal } from "@/components/modals/alert-modal";
// ✅ Import toggle action
import {
  createMarqueeItem,
  updateMarqueeItem,
  deleteMarqueeItem,
  toggleMarquee,
} from "@/app/(admin)/admin/settings/marquee/actions";

// Props mein 'isEnabled' add kiya
export function MarqueeClient({
  items,
  isEnabled,
}: {
  items: any[];
  isEnabled: boolean;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // ✅ Local state for toggle for instant UI feedback
  const [marqueeActive, setMarqueeActive] = useState(isEnabled);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { register, handleSubmit, reset, setValue } = useForm();

  // ... (Open Modal Functions Same Rahenge) ...
  const openAddModal = () => {
    /*...*/ setEditingItem(null);
    reset({ text: "" });
    setIsModalOpen(true);
  };
  const openEditModal = (item: any) => {
    /*...*/ setEditingItem(item);
    setValue("text", item.text);
    setIsModalOpen(true);
  };

  // ✅ Handle Toggle Switch
  const handleToggle = async (checked: boolean) => {
    setMarqueeActive(checked); // Optimistic UI Update
    const res = await toggleMarquee(checked);
    if (res.success) {
      toast.success(checked ? "Marquee Enabled" : "Marquee Disabled");
    } else {
      setMarqueeActive(!checked); // Revert on error
      toast.error("Failed to update setting");
    }
  };

  // ... (onSubmit aur delete logic same rahega) ...
  const onSubmit = async (data: any) => {
    /* Puraana logic same rahega */
    setIsLoading(true);
    let res;
    if (editingItem) {
      res = await updateMarqueeItem(editingItem.id, data.text);
    } else {
      res = await createMarqueeItem(data.text);
    }
    setIsLoading(false);
    if (res?.success) {
      toast.success(res.success);
      setIsModalOpen(false);
      reset();
    } else {
      toast.error(res?.error);
    }
  };

  const confirmDelete = async () => {
    /* Puraana logic same rahega */
    if (!deleteId) return;
    setIsLoading(true);
    await deleteMarqueeItem(deleteId);
    setIsLoading(false);
    setDeleteOpen(false);
    toast.success("Item deleted");
  };

  return (
    <>
      <AlertModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={confirmDelete}
        loading={isLoading}
      />

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Marquee Announcements
          </h1>
          <p className="text-muted-foreground">
            Manage scrolling text above the hero section.
          </p>
        </div>
        <Button onClick={openAddModal} className="gap-2">
          <Plus className="h-4 w-4" /> Add Announcement
        </Button>
      </div>

      {/* ✅ NEW: Global Toggle Card */}
      <Card className="p-6 mb-6 flex items-center justify-between border-primary/20 bg-primary/5">
        <div className="space-y-1">
          <Label htmlFor="marquee-mode" className="text-base font-semibold">
            Show Marquee on Website
          </Label>
          <p className="text-sm text-muted-foreground">
            Toggle this off to hide the entire announcement bar from the
            homepage.
          </p>
        </div>
        <Switch
          id="marquee-mode"
          checked={marqueeActive}
          onCheckedChange={handleToggle}
        />
      </Card>

      <div className="grid gap-3">
        {/* Same List Logic */}
        {items.length === 0 ? (
          <div className="p-8 border-2 border-dashed rounded-xl flex items-center justify-center text-muted-foreground bg-muted/20">
            No announcements yet.
          </div>
        ) : (
          items.map((item) => (
            <Card
              key={item.id}
              className={`p-4 flex items-center justify-between hover:bg-muted/10 transition-colors ${!marqueeActive ? "opacity-50" : ""}`}
            >
              <div className="flex items-center gap-3">
                <Megaphone className="h-5 w-5 text-primary/60" />
                <span className="font-medium">{item.text}</span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => openEditModal(item)}
                >
                  <Edit className="h-4 w-4 text-muted-foreground" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setDeleteId(item.id);
                    setDeleteOpen(true);
                  }}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Add/Edit Dialog (Same Code) */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          {/* Same Form Content */}
          <DialogHeader>
            <DialogTitle>
              {editingItem ? "Edit Announcement" : "Add Announcement"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
            <Input
              {...register("text", { required: true })}
              placeholder="e.g. 50% Off!"
              autoFocus
            />
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <Loader2 className="animate-spin mr-2" />
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" /> Save
                </>
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
