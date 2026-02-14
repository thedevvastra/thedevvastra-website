import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  // ✅ FIX: metadataBase add kiya. Ye WhatsApp ko image dhoondhne mein madad karta hai.
  metadataBase: new URL("https://thedevvastra.com"),

  title: {
    default: "The Dev Vastra | Premium Men & Women Clothing",
    template: "%s | The Dev Vastra",
  },
  description:
    "Discover The Dev Vastra, a premium clothing brand offering high-quality, in-house manufactured fashion for men and women. Elevate your everyday style with our exclusive and comfortable collections.",
  keywords: [
    "The Dev Vastra",
    "clothing brand",
    "men's fashion",
    "women's apparel",
    "manufactured clothes",
    "premium fashion",
    "buy clothes online",
    "style studio",
  ],
  authors: [{ name: "The Dev Vastra Team" }],
  creator: "The Dev Vastra",
  publisher: "The Dev Vastra",

  // ✅ FIX: OpenGraph setup for WhatsApp, Facebook, LinkedIn
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://thedevvastra.com",
    title: "The Dev Vastra | Premium Men & Women Clothing",
    description:
      "Shop the latest trends in men's and women's fashion. Premium, in-house manufactured clothing designed for comfort and style.",
    siteName: "The Dev Vastra",
    images: [
      {
        url: "/logo-v2.webp", // Public folder wali image (metadataBase isko absolute link bana dega)
        width: 1200, // WhatsApp bade banner ke liye 1200x630 best maanta hai
        height: 630,
        alt: "The Dev Vastra Logo",
      },
    ],
  },

  // ✅ FIX: Twitter (X) sharing ke liye
  twitter: {
    card: "summary_large_image",
    title: "The Dev Vastra | Premium Clothing",
    description:
      "Premium, in-house manufactured clothing designed for comfort and style.",
    images: ["/logo-v2.webp"],
  },

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased text-foreground",
          inter.variable,
        )}
      >
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
