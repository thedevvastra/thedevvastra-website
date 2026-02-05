import {
  ImageIcon,
  CreditCard,
  Truck,
  Mail,
  ShieldCheck,
  Megaphone,
  ImagePlus,
  MapPin,
  Bell, // ✅ Imported Bell for Notifications
} from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const settingsMenu = [
  {
    title: "Hero Sliders",
    description: "Manage homepage banners and promotional slides.",
    href: "/admin/settings/hero",
    icon: ImageIcon,
  },
  {
    title: "Marquee Announcements",
    description: "Manage scrolling text/announcements above the navbar.",
    href: "/admin/settings/marquee",
    icon: Megaphone,
  },
  {
    title: "Sale Banners",
    description: "Manage portrait banners below Today's Deal.",
    href: "/admin/settings/sale-banner",
    icon: ImagePlus,
  },
  {
    title: "Contact & Social Info",
    description: "Manage contact details, social links, and map location.",
    href: "/admin/settings/contact",
    icon: MapPin,
  },
  {
    title: "Telegram Notifications",
    description: "Configure Telegram bot alerts for new orders.",
    href: "/admin/settings/notification",
    icon: Bell, // ✅ Added Telegram Icon
  },
  // {
  //   title: "Payment Integration",
  //   description: "Configure Razorpay keys and currency settings.",
  //   href: "/admin/settings/payments", // Future Page
  //   icon: CreditCard,
  // },
  // {
  //   title: "Shipping & Logistics",
  //   description: "Manage Shiprocket API and delivery partners.",
  //   href: "/admin/settings/shipping", // Future Page
  //   icon: Truck,
  // },
  // {
  //   title: "Email Notifications",
  //   description: "Setup Resend templates for order emails.",
  //   href: "/admin/settings/email", // Future Page
  //   icon: Mail,
  // },
  // {
  //   title: "Admin Roles",
  //   description: "Manage admin access and security.",
  //   href: "/admin/settings/roles", // Future Page
  //   icon: ShieldCheck,
  // },
];

export default function SettingsPage() {
  return (
    <div className="space-y-6 p-8 max-w-[1600px] mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary">
          Settings
        </h1>
        <p className="text-muted-foreground">
          Manage your store configurations and integrations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {settingsMenu.map((item) => (
          <Link key={item.title} href={item.href}>
            <Card className="hover:border-primary/50 transition-all cursor-pointer h-full hover:shadow-md group">
              <CardHeader>
                <item.icon className="h-8 w-8 text-primary mb-2 group-hover:scale-110 transition-transform" />
                <CardTitle>{item.title}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
