import Link from "next/link";
import Image from "next/image";
import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  MapPin,
  Phone,
  Mail,
  Heart,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { getContactSettings } from "@/app/(admin)/admin/settings/contact/actions";
import { db } from "@/db";
import { categories } from "@/db/schema";
import { isNull, desc } from "drizzle-orm";

export async function Footer() {
  const settings = await getContactSettings();

  const footerCategories = await db.query.categories.findMany({
    where: isNull(categories.parentId),
    limit: 6,
    orderBy: [desc(categories.createdAt)],
  });

  const currentYear = new Date().getFullYear();

  return (
    // ✅ ADDED: pb-28 for mobile nav clearance, md:pb-8 for desktop
    <footer className="bg-card border-t border-border/50 mt-24 pt-16 pb-28 md:pb-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* --- COLUMN 1: BRAND & SOCIALS --- */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative h-12 w-12 overflow-hidden rounded-full border border-primary/20">
                <Image
                  src="/logo.webp"
                  alt="The Dev Vastra"
                  width={48}
                  height={48}
                  className="object-contain"
              priority
                />
              </div>
              <span className="text-xl font-bold tracking-tight text-primary">
                The Dev Vastra
              </span>
            </Link>

            {/* ✅ UPDATED TEXT for Clothing Brand */}
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              Elevate your style with The Dev Vastra. Discover the latest trends
              in fashion with our premium collection, designed for comfort and
              elegance.
            </p>

            <div className="flex items-center gap-3">
              {settings?.facebook && (
                <a
                  href={settings.facebook}
                  target="_blank"
                  className="h-9 w-9 rounded-full bg-primary/5 border border-primary/10 flex items-center justify-center text-muted-foreground hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all"
                >
                  <Facebook className="h-4 w-4" />
                </a>
              )}
              {settings?.instagram && (
                <a
                  href={settings.instagram}
                  target="_blank"
                  className="h-9 w-9 rounded-full bg-primary/5 border border-primary/10 flex items-center justify-center text-muted-foreground hover:bg-pink-600 hover:text-white hover:border-pink-600 transition-all"
                >
                  <Instagram className="h-4 w-4" />
                </a>
              )}
              {settings?.twitter && (
                <a
                  href={settings.twitter}
                  target="_blank"
                  className="h-9 w-9 rounded-full bg-primary/5 border border-primary/10 flex items-center justify-center text-muted-foreground hover:bg-sky-500 hover:text-white hover:border-sky-500 transition-all"
                >
                  <Twitter className="h-4 w-4" />
                </a>
              )}
              {settings?.youtube && (
                <a
                  href={settings.youtube}
                  target="_blank"
                  className="h-9 w-9 rounded-full bg-primary/5 border border-primary/10 flex items-center justify-center text-muted-foreground hover:bg-red-600 hover:text-white hover:border-red-600 transition-all"
                >
                  <Youtube className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>

          {/* --- COLUMN 2: SHOP --- */}
          <div>
            <h4 className="font-bold text-foreground text-lg mb-6">Shop</h4>
            <ul className="space-y-3">
              {footerCategories.map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/category/${cat.slug}`}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group"
                  >
                    <ArrowRight className="h-3 w-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {cat.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/categories"
                  className="text-sm font-medium text-primary hover:underline mt-2 inline-block"
                >
                  View All Categories →
                </Link>
              </li>
            </ul>
          </div>

          {/* --- COLUMN 3: POLICY & HELP --- */}
          <div>
            <h4 className="font-bold text-foreground text-lg mb-6">
              Policy & Help
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms-conditions"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link
                  href="/return-refund"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Return & Refund Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping-delivery"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Shipping & Delivery
                </Link>
              </li>
              <li>
                <Link
                  href="/contact-us"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Contact Support
                </Link>
              </li>
              <li>
                <Link
                  href="/about-us"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* --- COLUMN 4: REACH US --- */}
          <div>
            <h4 className="font-bold text-foreground text-lg mb-6">Reach Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <MapPin className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground leading-relaxed">
                  {settings?.address || "123, Fashion Street, India"}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Phone className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground">
                  {settings?.phone1 || "+91 98765 43210"}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Mail className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground">
                  {settings?.email1 || "support@devvastra.com"}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="bg-border/60 mb-8" />

        {/* --- BOTTOM BAR --- */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
          <div className="text-muted-foreground text-center md:text-left">
            © {currentYear} <strong>The Dev Vastra</strong>. All rights
            reserved.
          </div>

          <div className="flex items-center gap-2 grayscale hover:grayscale-0 transition-all opacity-70 hover:opacity-100">
            <div className="h-6 px-2 bg-white border rounded flex items-center justify-center">
              <span className="text-[10px] font-extrabold text-blue-800">
                VISA
              </span>
            </div>
            <div className="h-6 px-2 bg-white border rounded flex items-center justify-center">
              <span className="text-[10px] font-extrabold text-red-600">
                MasterCard
              </span>
            </div>
            <div className="h-6 px-2 bg-white border rounded flex items-center justify-center">
              <span className="text-[10px] font-extrabold text-blue-500">
                UPI
              </span>
            </div>
            <div className="flex items-center gap-1 text-green-600 ml-1">
              <ShieldCheck className="h-3.5 w-3.5" />
            </div>
          </div>

          <a
            href="https://dgisight.oxzeen.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors bg-muted/30 px-3 py-1.5 rounded-full border border-transparent hover:border-border"
          >
            <span>Built with</span>
            <Heart className="h-3.5 w-3.5 text-red-500 fill-current group-hover:scale-110 transition-transform" />
            <span>by</span>
            <span className="font-bold text-primary group-hover:underline decoration-wavy underline-offset-2">
              dgisight
            </span>
          </a>
        </div>
      </div>
    </footer>
  );
}
