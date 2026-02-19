import { Suspense } from "react";
import { GalleryVerticalEnd } from "lucide-react";
import { UpdatePasswordForm } from "@/components/auth/update-password-form";

export default function UpdatePasswordPage() {
  return (
    <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      {/* Branding Side (Left) */}
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-zinc-900" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <GalleryVerticalEnd className="mr-2 h-6 w-6" />
          The Dev Vastra
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;Secure your account with a strong password to keep your
              fashion journey safe.&rdquo;
            </p>
          </blockquote>
        </div>
      </div>

      {/* Form Side (Right) */}
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Set new password
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your new password below to update your account.
            </p>
          </div>

          {/* Suspense zaroori hai kyunki hum URL searchParams use karenge */}
          <Suspense fallback={<div>Loading...</div>}>
            <UpdatePasswordForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
