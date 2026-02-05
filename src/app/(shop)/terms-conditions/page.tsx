import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ScrollText, ArrowLeft, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Terms & Conditions | The Dev Vastra",
  description:
    "Review the terms and conditions for using The Dev Vastra website.",
};

export default function TermsConditionsPage() {
  return (
    <div className="bg-background min-h-screen py-12">
      {/* ✅ Website Standard Max Width Container */}
      <div className="container mx-auto px-4">
        {/* --- Header Section --- */}
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <Badge variant="secondary" className="mb-4">
            Legal Information
          </Badge>
          <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4 flex items-center justify-center gap-3">
            <ScrollText className="h-8 w-8 text-primary" />
            Terms & Conditions
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Please read these terms carefully before using our website. <br />
            <span className="opacity-70">Last Updated: February 2026</span>
          </p>
        </div>

        {/* --- Content Section --- */}
        <div className="bg-card border border-border/60 rounded-2xl p-6 md:p-10 shadow-sm space-y-8 text-muted-foreground leading-relaxed text-sm md:text-base">
          <section>
            <h2 className="text-lg md:text-xl font-bold text-foreground mb-3 flex items-center gap-2">
              1. General Overview
            </h2>
            <p>
              The Dev Vastra ("we", "us", "our") operates the website{" "}
              <strong>thedevvastra.in</strong>. By visiting our site and/or
              purchasing something from us, you engage in our "Service" and
              agree to be bound by the following terms and conditions. These
              terms apply to all users of the site, including browsers, vendors,
              customers, merchants, and contributors of content.
            </p>
          </section>

          <Separator className="bg-border/60" />

          <section>
            <h2 className="text-lg md:text-xl font-bold text-foreground mb-3 flex items-center gap-2">
              2. Accuracy of Information
            </h2>
            <p>
              We are not responsible if information made available on this site
              is not accurate, complete, or current. The material on this site
              is provided for general information only. We reserve the right to
              modify the contents of this site at any time, but we have no
              obligation to update any information on our site.
            </p>
            <p className="mt-2">
              <strong>Product Colors:</strong> We have made every effort to
              display as accurately as possible the colors and images of our
              products. We cannot guarantee that your computer monitor's display
              of any color will be accurate.
            </p>
          </section>

          <Separator className="bg-border/60" />

          <section>
            <h2 className="text-lg md:text-xl font-bold text-foreground mb-3 flex items-center gap-2">
              3. Pricing and Payments
            </h2>
            <p>
              Prices for our products are subject to change without notice. We
              accept payments through the following methods:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>
                <strong>Online Payments:</strong> Securely processed via
                Razorpay (Credit/Debit Cards, UPI, Net Banking).
              </li>
              <li>
                <strong>Cash on Delivery (COD):</strong> Available for select
                pin codes within India.
              </li>
            </ul>
            <p className="mt-2 text-xs italic opacity-80">
              * We reserve the right to refuse any order you place with us.
            </p>
          </section>

          <Separator className="bg-border/60" />

          <section>
            <h2 className="text-lg md:text-xl font-bold text-foreground mb-3 flex items-center gap-2">
              4. Shipping and Returns Reference
            </h2>
            <p>
              Our shipping and return processes are governed by specific
              policies. By agreeing to these Terms, you also acknowledge that
              you have read and understood our:
            </p>
            <div className="flex flex-wrap gap-4 mt-4">
              <Link href="/shipping-delivery">
                <Button variant="outline" size="sm">
                  View Shipping Policy
                </Button>
              </Link>
              <Link href="/return-refund">
                <Button variant="outline" size="sm">
                  View Return & Refund Policy
                </Button>
              </Link>
            </div>
          </section>

          <Separator className="bg-border/60" />

          <section>
            <h2 className="text-lg md:text-xl font-bold text-foreground mb-3 flex items-center gap-2">
              5. User Account & Security
            </h2>
            <p>
              If you create an account on The Dev Vastra, you are responsible
              for maintaining the security of your account and password. You
              agree to accept responsibility for all activities that occur under
              your account. We reserve the right to terminate accounts, remove
              or edit content, or cancel orders in our sole discretion.
            </p>
          </section>

          <Separator className="bg-border/60" />

          <section>
            <h2 className="text-lg md:text-xl font-bold text-foreground mb-3 flex items-center gap-2">
              6. Prohibited Uses
            </h2>
            <p>
              In addition to other prohibitions as set forth in the Terms of
              Service, you are prohibited from using the site or its content:
              (a) for any unlawful purpose; (b) to solicit others to perform or
              participate in any unlawful acts; (c) to infringe upon or violate
              our intellectual property rights; (d) to submit false or
              misleading information.
            </p>
          </section>

          <Separator className="bg-border/60" />

          <section>
            <h2 className="text-lg md:text-xl font-bold text-foreground mb-3 flex items-center gap-2">
              7. Governing Law
            </h2>
            <p>
              These Terms of Service and any separate agreements whereby we
              provide you Services shall be governed by and construed in
              accordance with the laws of India. Any disputes arising out of
              these terms will be subject to the jurisdiction of the courts in
              West Bengal, India.
            </p>
          </section>

          <Separator className="bg-border/60" />

          <section>
            <h2 className="text-lg md:text-xl font-bold text-foreground mb-3 flex items-center gap-2">
              8. Contact Information
            </h2>
            <p>
              Questions about the Terms of Service should be sent to us via our
              support channels.
            </p>
            <div className="mt-4 p-4 bg-muted/30 rounded-lg flex flex-col md:flex-row gap-4 md:items-center justify-between border border-border">
              <div>
                <p className="font-bold text-foreground">
                  The Dev Vastra Support
                </p>
                <p className="text-sm">support@devvastra.in</p>
              </div>
              <Link href="/contact-us">
                <Button size="sm">Contact Us</Button>
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
