"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/utils/supabase/client";

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

export function LogoutButton() {
  const router = useRouter();
  const supabase = createClient();

  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);

    // Supabase Logout
    const { error } = await supabase.auth.signOut();

    if (error) {
      toast.error("Error signing out");
      setIsLoggingOut(false);
      return;
    }

    toast.success("Logged out successfully");

    // UI Cleanup
    setIsLoggingOut(false);
    setShowLogoutDialog(false);

    // Refresh & Redirect
    router.refresh();
    router.replace("/login");
  };

  return (
    <>
      {/* Logout Button (Styled exactly like your Account Page button) */}
      <button
        onClick={() => setShowLogoutDialog(true)}
        className="w-full flex items-center justify-center gap-2 p-3 text-red-600 bg-red-50/50 hover:bg-red-50 border border-red-100 rounded-xl transition-all text-sm font-medium"
      >
        <LogOut className="h-4 w-4" />
        Sign Out
      </button>

      {/* Alert Dialog */}
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              You will be logged out of your account. You need to sign in again
              to access your data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoggingOut}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleLogout();
              }}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
              disabled={isLoggingOut}
            >
              {isLoggingOut ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Logging
                  out...
                </>
              ) : (
                "Yes, Log out"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
