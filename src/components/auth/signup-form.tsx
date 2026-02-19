"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Phone, User, Mail, Lock, Eye, EyeOff } from "lucide-react"; // ✅ Added Icons
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signupAction } from "@/app/(auth)/actions";

// Validation Schema
const signupSchema = z.object({
  fullName: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export function SignupForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // ✅ Show/Hide State
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: z.infer<typeof signupSchema>) => {
    setIsLoading(true);
    const loadingToast = toast.loading("Creating account...");

    // ✅ On Signup, we can assume they used Email method
    localStorage.setItem("lastLoginMethod", "email");

    const res = await signupAction(data);

    if (res.error) {
      setIsLoading(false);
      toast.dismiss(loadingToast);
      toast.error(res.error);
    } else {
      toast.dismiss(loadingToast);
      toast.success("Welcome! Account created successfully.");

      router.refresh();
      setTimeout(() => {
        router.replace("/");
      }, 500);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 animate-in fade-in slide-in-from-bottom-2"
    >
      {/* Full Name (Same as before) */}
      <div className="space-y-2">
        <Label htmlFor="fullName">Full Name</Label>
        <div className="relative">
          <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            {...register("fullName")}
            id="fullName"
            placeholder="John Doe"
            className="pl-9 h-10"
            disabled={isLoading}
          />
        </div>
        {errors.fullName && (
          <p className="text-xs text-red-500">{errors.fullName.message}</p>
        )}
      </div>

      {/* Email (Same as before) */}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            {...register("email")}
            id="email"
            type="email"
            placeholder="john@example.com"
            className="pl-9 h-10"
            disabled={isLoading}
          />
        </div>
        {errors.email && (
          <p className="text-xs text-red-500">{errors.email.message}</p>
        )}
      </div>

      {/* Mobile (Same as before) */}
      <div className="space-y-2">
        <Label htmlFor="phone">Mobile Number</Label>
        <div className="relative">
          <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            {...register("phone")}
            id="phone"
            type="tel"
            placeholder="9876543210"
            className="pl-9 h-10"
            disabled={isLoading}
          />
        </div>
        {errors.phone && (
          <p className="text-xs text-red-500">{errors.phone.message}</p>
        )}
      </div>

      {/* Password with Eye Icon */}
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            {...register("password")}
            id="password"
            type={showPassword ? "text" : "password"} // ✅ Toggle
            placeholder="******"
            className="pl-9 pr-10 h-10" // Added PR-10 for space
            disabled={isLoading}
          />
          {/* ✅ Eye Icon */}
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
        {errors.password && (
          <p className="text-xs text-red-500">{errors.password.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full h-10" disabled={isLoading}>
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          "Create Account"
        )}
      </Button>
    </form>
  );
}
