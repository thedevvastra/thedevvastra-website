"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  LayoutDashboard,
  Package,
  Settings,
  LogOut,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Badge } from "@/components/ui/badge";

export function UserNav({ user }: { user: any }) {
  const router = useRouter();
  const supabase = createClient();

  // State
  const [profile, setProfile] = useState<{
    role: string;
    fullName: string | null;
    avatarUrl: string | null;
  } | null>(null);

  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // 1. Fetch User Profile
  useEffect(() => {
    async function getUserProfile() {
      if (!user) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("role, full_name, avatar_url")
        .eq("id", user.id)
        .single();

      if (data && !error) {
        setProfile({
          role: data.role,
          fullName: data.full_name,
          avatarUrl: data.avatar_url,
        });
      }
    }

    getUserProfile();
  }, [user, supabase]);

  // 2. Handle Logout
  const handleLogout = async () => {
    setIsLoggingOut(true);
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
    setIsLoggingOut(false);
    setShowLogoutDialog(false);
    router.refresh();
    router.push("/login"); // Optional: Redirect to login
  };

  // --- STATE: GUEST USER ---
  if (!user) {
    return (
      <Link href="/login">
        <Button variant="default" className="rounded-full px-6">
          Sign In
        </Button>
      </Link>
    );
  }

  // Derived Values
  const displayName = profile?.fullName || user.email?.split("@")[0] || "User";
  const userRole = profile?.role || "user";
  const isAdmin = userRole === "admin";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="relative h-10 w-10 rounded-full focus-visible:ring-0 focus-visible:ring-offset-0"
          >
            <Avatar className="h-10 w-10 border border-border/50">
              <AvatarImage src={profile?.avatarUrl || ""} alt={displayName} />
              <AvatarFallback className="bg-primary/10 text-primary font-bold">
                {initial}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-60 p-2" align="end" forceMount>
          {/* Header Section */}
          <DropdownMenuLabel className="font-normal p-2">
            <div className="flex flex-col space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold leading-none text-foreground truncate max-w-[120px]">
                  {displayName}
                </p>
                {isAdmin && (
                  <Badge
                    variant="secondary"
                    className="text-[10px] h-5 px-1.5 rounded-sm"
                  >
                    ADMIN
                  </Badge>
                )}
              </div>
              <p className="text-xs leading-none text-muted-foreground truncate">
                {user.email}
              </p>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator className="my-1" />

          {/* Admin Section */}
          {isAdmin && (
            <DropdownMenuGroup>
              <Link href="/admin/dashboard">
                <DropdownMenuItem className="cursor-pointer text-primary focus:text-primary focus:bg-primary/10 font-medium">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  <span>Dashboard</span>
                </DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator className="my-1" />
            </DropdownMenuGroup>
          )}

          {/* User Menu Items */}
          <DropdownMenuGroup>
            <Link href="/my-profile">
              <DropdownMenuItem className="cursor-pointer py-2">
                <User className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>My Profile</span>
              </DropdownMenuItem>
            </Link>
            <Link href="/my-orders">
              <DropdownMenuItem className="cursor-pointer py-2">
                <Package className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>My Orders</span>
              </DropdownMenuItem>
            </Link>
            <Link href="/settings">
              <DropdownMenuItem className="cursor-pointer py-2">
                <Settings className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>Settings</span>
              </DropdownMenuItem>
            </Link>
          </DropdownMenuGroup>

          <DropdownMenuSeparator className="my-1" />

          {/* Logout Trigger */}
          <DropdownMenuItem
            onClick={() => setShowLogoutDialog(true)}
            className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 py-2"
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Logout Confirmation Dialog */}
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
