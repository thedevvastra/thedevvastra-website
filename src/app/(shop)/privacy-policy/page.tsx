import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Shield, ArrowLeft, Lock, Eye, Server, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Privacy Policy | The Dev Vastra",
  description: "Learn how we protect your personal data at The Dev Vastra.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-background min-h-screen py-12">
      {/* ✅ Website Standard Max Width Container */}
      <div className="container mx-auto px-4">
        {/* --- Header Section --- */}
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <Badge variant="secondary" className="mb-4">
            Data Protection
          </Badge>
          <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4 flex items-center justify-center gap-3">
            <Shield className="h-8 w-8 text-primary" />
            Privacy Policy
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Your privacy matters to us. Here is how we keep your data safe.{" "}
            <br />
            <span className="opacity-70">Last Updated: February 2026</span>
          </p>
        </div>

        {/* --- Content Section --- */}
        <div className="bg-card border border-border/60 rounded-2xl p-6 md:p-10 shadow-sm space-y-8 text-muted-foreground leading-relaxed text-sm md:text-base">
          <section>
            <h2 className="text-lg md:text-xl font-bold text-foreground mb-3 flex items-center gap-2">
              {/* <UserCheck className="h-5 w-5 text-primary" /> */}
              1. Introduction
            </h2>
            <p>
              At <strong>The Dev Vastra</strong> (thedevvastra.in), we value the
              trust you place in us. That's why we insist upon the highest
              standards for secure transactions and customer information
              privacy. This policy describes how we collect, use, and share
              information when you visit our website or purchase our clothing
              products.
            </p>
          </section>

          <Separator className="bg-border/60" />

          <section>
            <h2 className="text-lg md:text-xl font-bold text-foreground mb-3 flex items-center gap-2">
              {/* <Eye className="h-5 w-5 text-primary" /> */}
              2. Information We Collect
            </h2>
            <p>
              When you use our website, we collect personal information that you
              provide to us voluntarily. This includes:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>
                <strong>Contact Details:</strong> Your name, phone number, and
                email address (so we can update you on your order).
              </li>
              <li>
                <strong>Shipping Address:</strong> We need your full address to
                deliver your clothes via our courier partners (like Shiprocket
                or Delhivery).
              </li>
              <li>
                <strong>Account Data:</strong> Username and password when you
                create an account to use features like Wishlist or Cart.
              </li>
              <li>
                <strong>Payment Info:</strong> We <strong>do not</strong> store
                your credit/debit card numbers or UPI PINs. All payments are
                processed securely through <strong>Razorpay</strong>.
              </li>
            </ul>
          </section>

          <Separator className="bg-border/60" />

          <section>
            <h2 className="text-lg md:text-xl font-bold text-foreground mb-3 flex items-center gap-2">
              {/* <Server className="h-5 w-5 text-primary" /> */}
              3. How We Use Your Information
            </h2>
            <p>We use the information we collect for the following purposes:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>
                To process and fulfill your orders (packing, shipping, and
                delivery).
              </li>
              <li>
                To communicate with you regarding your order status (via Email
                or WhatsApp).
              </li>
              <li>
                To improve our website, product offerings, and customer service.
              </li>
              <li>To detect and prevent fraud or abuse of our services.</li>
            </ul>
          </section>

          <Separator className="bg-border/60" />

          <section>
            <h2 className="text-lg md:text-xl font-bold text-foreground mb-3 flex items-center gap-2">
              {/* <Lock className="h-5 w-5 text-primary" /> */}
              4. Sharing of Information
            </h2>
            <p>
              We value your privacy and do not sell your personal information to
              anyone. However, we do share necessary data with trusted third
              parties to fulfill our services:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>
                <strong>Logistics Partners:</strong> We share your name, phone
                number, and address with courier services (like Delhivery,
                Shiprocket, or India Post) strictly for delivery purposes.
              </li>
              <li>
                <strong>Payment Gateways:</strong> Your payment data is handled
                securely by Razorpay to process transactions.
              </li>
              <li>
                <strong>Legal Requirements:</strong> We may disclose information
                if required by law or to protect our rights.
              </li>
            </ul>
          </section>

          <Separator className="bg-border/60" />

          <section>
            <h2 className="text-lg md:text-xl font-bold text-foreground mb-3 flex items-center gap-2">
              5. Cookies
            </h2>
            <p>
              We use "cookies" to improve your shopping experience. Cookies help
              us remember what items you have in your cart and keep you logged
              in. You can choose to disable cookies through your browser
              settings, but some features of the site (like the Cart) may not
              work properly.
            </p>
          </section>

          <Separator className="bg-border/60" />

          <section>
            <h2 className="text-lg md:text-xl font-bold text-foreground mb-3 flex items-center gap-2">
              6. Data Security
            </h2>
            <p>
              We take reasonable security measures to protect your personal data
              from unauthorized access. Our website is scanned regularly for
              security holes and known vulnerabilities in order to make your
              visit to our site as safe as possible.
            </p>
          </section>

          <Separator className="bg-border/60" />

          <section>
            <h2 className="text-lg md:text-xl font-bold text-foreground mb-3 flex items-center gap-2">
              7. Contact Us regarding Privacy
            </h2>
            <p>
              If you have any questions about this Privacy Policy or wish to
              delete your account/data, please contact us.
            </p>
            <div className="mt-4 p-4 bg-muted/30 rounded-lg flex flex-col md:flex-row gap-4 md:items-center justify-between border border-border">
              <div>
                <p className="font-bold text-foreground">
                  Data Protection Officer
                </p>
                <p className="text-sm">support@devvastra.in</p>
              </div>
              <Link href="/contact-us">
                <Button size="sm" variant="outline">
                  Contact Support
                </Button>
              </Link>
            </div>
          </section>
        </div>

        {/* --- Footer Action --- */}
        <div className="mt-10 text-center pb-10">
          <Link href="/">
            <Button
              variant="ghost"
              className="gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" /> Return to Homepage
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
