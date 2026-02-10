"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Mail, Lock } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { loginAction, loginWithGoogle } from "@/app/(auth)/actions";

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false); // ✅ Google Loading
  const router = useRouter();

  const onEmailLogin = async (formData: FormData) => {
    setIsLoading(true);

    // ✅ Toast Loading State
    const loadingToast = toast.loading("Logging in...");

    const res = await loginAction(formData);

    if (res?.error) {
      setIsLoading(false);
      toast.dismiss(loadingToast);
      toast.error(res.error);
    } else {
      toast.dismiss(loadingToast);
      toast.success("Welcome back! Redirecting...");

      // ✅ FIX: Mobile Redirect Issue
      // Pehle refresh karein taaki cookies update ho, fir replace karein
      router.refresh();
      setTimeout(() => {
        router.replace("/"); // push ki jagah replace use karein history clean rakhne ke liye
      }, 500);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    // Google redirect server se hota hai, isliye toast ki zaroorat nahi
    await loginWithGoogle();
    // Note: Agar redirect fail hua to state wapas false ho jayegi
    // lekin mostly page change ho jayega.
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
      {/* Email Form */}
      <form action={onEmailLogin} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              name="email"
              id="email"
              type="email"
              placeholder="john@example.com"
              className="pl-9 h-10"
              required
              disabled={isLoading || isGoogleLoading} // Disable on load
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <button
              type="button"
              className="text-xs text-primary hover:underline font-medium"
            >
              Forgot password?
            </button>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              name="password"
              id="password"
              type="password"
              placeholder="******"
              className="pl-9 h-10"
              required
              disabled={isLoading || isGoogleLoading}
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full h-10 font-medium"
          disabled={isLoading || isGoogleLoading}
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            "Login"
          )}
        </Button>
      </form>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground font-medium">
            Or continue with
          </span>
        </div>
      </div>

      {/* Google Button */}
      <Button
        variant="outline"
        type="button"
        className="w-full h-10 font-medium"
        onClick={handleGoogleLogin}
        disabled={isLoading || isGoogleLoading}
      >
        {isGoogleLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <svg
            className="mr-2 h-4 w-4"
            aria-hidden="true"
            focusable="false"
            data-prefix="fab"
            data-icon="google"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 488 512"
          >
            <path
              fill="currentColor"
              d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
            ></path>
          </svg>
        )}
        Google
      </Button>
    </div>
  );
}
