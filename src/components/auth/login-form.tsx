"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Mail, Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  loginAction,
  loginWithGoogle,
  forgotPasswordAction,
} from "@/app/(auth)/actions";

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // States
  const [showPassword, setShowPassword] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [lastLoginMethod, setLastLoginMethod] = useState<string | null>(null);

  const router = useRouter();

  // ✅ FIX: "setState synchronously" error solve karne ke liye setTimeout lagaya
  useEffect(() => {
    const method = localStorage.getItem("lastLoginMethod");
    if (method) {
      // setTimeout(..., 0) use karne se update agle event loop tick mein chala jata hai
      // Isse "Synchronous update" wala warning hat jayega
      setTimeout(() => {
        setLastLoginMethod(method);
      }, 0);
    }
  }, []);

  // --- HANDLERS ---

  const onEmailLogin = async (formData: FormData) => {
    setIsLoading(true);
    const loadingToast = toast.loading("Logging in...");

    const res = await loginAction(formData);

    if (res?.error) {
      setIsLoading(false);
      toast.dismiss(loadingToast);
      toast.error(res.error);
    } else {
      // ✅ Save Method to LocalStorage
      localStorage.setItem("lastLoginMethod", "email");

      toast.dismiss(loadingToast);
      toast.success("Welcome back! Redirecting...");
      router.refresh();
      setTimeout(() => {
        router.replace("/");
      }, 500);
    }
  };

  const handleGoogleLogin = async () => {
    localStorage.setItem("lastLoginMethod", "google");
    setIsGoogleLoading(true);
    await loginWithGoogle();
  };

  const onForgotPassword = async (formData: FormData) => {
    setIsLoading(true);
    const email = formData.get("email") as string;
    const loadingToast = toast.loading("Sending recovery email...");

    const res = await forgotPasswordAction(email);

    setIsLoading(false);
    toast.dismiss(loadingToast);

    if (res?.error) {
      toast.error(res.error);
    } else {
      toast.success("Check your email for the password reset link!");
      setIsForgotPassword(false);
    }
  };

  // --- RENDER: FORGOT PASSWORD VIEW ---
  if (isForgotPassword) {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-right-2">
        <div className="space-y-2 text-center">
          <h2 className="text-xl font-semibold">Reset Password</h2>
          <p className="text-sm text-muted-foreground">
            Enter your email to receive a recovery link.
          </p>
        </div>

        <form action={onForgotPassword} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reset-email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                name="email"
                id="reset-email"
                type="email"
                placeholder="john@example.com"
                className="pl-9 h-10"
                required
                disabled={isLoading}
              />
            </div>
          </div>
          <Button type="submit" className="w-full h-10" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Send Link"
            )}
          </Button>
        </form>

        <Button
          variant="link"
          className="w-full text-sm text-muted-foreground"
          onClick={() => setIsForgotPassword(false)}
          disabled={isLoading}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Login
        </Button>
      </div>
    );
  }

  // --- RENDER: LOGIN VIEW ---
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
      {/* Email Form */}
      <form action={onEmailLogin} className="space-y-4">
        {/* Email Input with Last Login Label */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="email">Email</Label>
            {/* ✅ Label for Last Login: Email */}
            {lastLoginMethod === "email" && (
              <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium animate-pulse">
                Last used
              </span>
            )}
          </div>
          <div className="relative">
            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              name="email"
              id="email"
              type="email"
              placeholder="john@example.com"
              className="pl-9 h-10"
              required
              disabled={isLoading || isGoogleLoading}
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <button
              type="button"
              onClick={() => setIsForgotPassword(true)}
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
              type={showPassword ? "text" : "password"}
              placeholder="******"
              className="pl-9 pr-10 h-10"
              required
              disabled={isLoading || isGoogleLoading}
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
      <div className="space-y-2">
        {lastLoginMethod === "google" && (
          <div className="flex justify-center">
            <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium animate-pulse">
              Last used method
            </span>
          </div>
        )}

        <Button
          variant="outline"
          type="button"
          className="w-full h-10 font-medium relative"
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
    </div>
  );
}
