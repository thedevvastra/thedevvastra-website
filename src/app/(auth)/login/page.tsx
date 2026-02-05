"use client";

import { useState } from "react";
import Link from "next/link";
import { GalleryVerticalEnd } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoginForm } from "@/components/auth/login-form";
import { SignupForm } from "@/components/auth/signup-form";
import { Button } from "@/components/ui/button";

export default function AuthPage() {
  const [view, setView] = useState<"LOGIN" | "SIGNUP">("LOGIN");

  return (
    <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      {/* Left Side: Branding (Same as before) */}
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-zinc-900" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <GalleryVerticalEnd className="mr-2 h-6 w-6" />
          The Dev Vastra
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;Fashion is the armor to survive the reality of everyday
              life.&rdquo;
            </p>
            <footer className="text-sm">The Dev Vastra Team</footer>
          </blockquote>
        </div>
      </div>

      {/* Right Side: Clean Form Area */}
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              {view === "LOGIN" ? "Welcome back" : "Create an account"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {view === "LOGIN"
                ? "Enter your credentials to access your account"
                : "Enter your details to get started"}
            </p>
          </div>

          <Card className="border-none shadow-none sm:border sm:shadow-sm">
            <CardContent className="pt-6">
              {/* Animation wrapper for smooth switch */}
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                {view === "LOGIN" ? <LoginForm /> : <SignupForm />}
              </div>
            </CardContent>
          </Card>

          {/* Toggle Login/Signup Link */}
          <div className="text-center text-sm">
            {view === "LOGIN" ? (
              <p className="text-muted-foreground">
                Don&apos;t have an account?{" "}
                <button
                  onClick={() => setView("SIGNUP")}
                  className="font-medium text-primary underline-offset-4 hover:underline"
                >
                  Sign up
                </button>
              </p>
            ) : (
              <p className="text-muted-foreground">
                Already have an account?{" "}
                <button
                  onClick={() => setView("LOGIN")}
                  className="font-medium text-primary underline-offset-4 hover:underline"
                >
                  Log in
                </button>
              </p>
            )}
          </div>

          <p className="px-8 text-center text-sm text-muted-foreground">
            By clicking continue, you agree to our{" "}
            <Link
              href="/terms"
              className="underline underline-offset-4 hover:text-primary"
            >
              Terms
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="underline underline-offset-4 hover:text-primary"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
