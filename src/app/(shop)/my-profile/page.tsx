import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getUserProfile } from "./actions";
import { ProfileForm } from "@/components/profile/profile-form";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "My Profile | The Dev Vastra",
  description: "Manage your account settings and address.",
};

export default async function MyProfilePage() {
  const profile = await getUserProfile();

  if (!profile) {
    redirect("/login");
  }

  return (
    <div className="bg-muted/5 min-h-[calc(100vh-4rem)]">
      <div className="container max-w-3xl mx-auto py-6 px-4 sm:px-6 lg:py-10">
        {/* Mobile Back Button & Title */}
        <div className="flex items-center gap-2 mb-6">
          <Link
            href="/"
            className="md:hidden p-2 -ml-2 hover:bg-muted rounded-full transition-colors"
          >
            <ChevronLeft className="h-5 w-5 text-foreground" />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              My Profile
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage your personal details and shipping address.
            </p>
          </div>
        </div>

        <ProfileForm user={profile} />
      </div>
    </div>
  );
}
