"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Lock, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updatePasswordAction } from "@/app/(auth)/actions";

export function UpdatePasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get("code"); // ✅ URL se Code uthaya

  const onSubmit = async (formData: FormData) => {
    if (!code) {
      toast.error("Invalid or expired link.");
      return;
    }

    setIsLoading(true);
    const loadingToast = toast.loading("Updating password...");

    // Code ko formData mein append kiya taaki server action isse verify kar sake
    formData.append("code", code);

    const res = await updatePasswordAction(formData);

    setIsLoading(false);
    toast.dismiss(loadingToast);

    if (res?.error) {
      toast.error(res.error);
    } else {
      toast.success("Password updated successfully! Please login.");
      router.replace("/login");
    }
  };

  return (
    <form action={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="password">New Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            name="password"
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="******"
            className="pl-9 pr-10 h-10"
            required
            minLength={6}
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      <Button type="submit" className="w-full h-10" disabled={isLoading}>
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          "Update Password"
        )}
      </Button>
    </form>
  );
}
