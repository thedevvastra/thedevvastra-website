import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  RotateCcw,
  ArrowLeft,
  Banknote,
  PackageCheck,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Return & Refund Policy | The Dev Vastra",
  description: "Easy returns and quick refunds at The Dev Vastra.",
};

export default function ReturnRefundPage() {
  return (
    <div className="bg-background min-h-screen py-12">
      {/* ✅ Website Standard Max Width Container */}
      <div className="container mx-auto px-4">
        {/* --- Header Section --- */}
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <Badge variant="secondary" className="mb-4">
            Customer Guarantee
          </Badge>
          <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4 flex items-center justify-center gap-3">
            <RotateCcw className="h-8 w-8 text-primary" />
            Return & Refund
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Didn't love the fit? No problem. Here is how you can return it.{" "}
            <br />
            <span className="opacity-70">Last Updated: February 2026</span>
          </p>
        </div>

        {/* --- Content Section --- */}
        <div className="bg-card border border-border/60 rounded-2xl p-6 md:p-10 shadow-sm space-y-8 text-muted-foreground leading-relaxed text-sm md:text-base">
          <section>
            <h2 className="text-lg md:text-xl font-bold text-foreground mb-3 flex items-center gap-2">
              1. 7-Day Return Policy
            </h2>
            <p>
              At <strong>The Dev Vastra</strong>, we want you to look and feel
              your best. If you are not completely satisfied with your purchase,
              you have <strong>7 days</strong> from the date of delivery to
              request a return.
            </p>
            <p className="mt-2 text-sm italic">
              * Note: The return window starts from the day the package is
              marked as "Delivered" by our logistics partner.
            </p>
          </section>

          <Separator className="bg-border/60" />

          <section>
            <h2 className="text-lg md:text-xl font-bold text-foreground mb-3 flex items-center gap-2">
              {/* <PackageCheck className="h-5 w-5 text-primary" /> */}
              2. Eligibility for Return
            </h2>
            <p>
              To ensure a smooth return process, please make sure that the item
              meets the following conditions:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>
                The product must be{" "}
                <strong>unused, unwashed, and undamaged</strong>.
              </li>
              <li>
                All original <strong>tags and packaging</strong> must be intact.
              </li>
              <li>The receipt or proof of purchase should be available.</li>
            </ul>
            <p className="mt-2">
              We reserve the right to reject a return if the product shows signs
              of wear or damage caused by the customer.
            </p>
          </section>

          <Separator className="bg-border/60" />

          <section>
            <h2 className="text-lg md:text-xl font-bold text-foreground mb-3 flex items-center gap-2">
              {/* <MessageCircle className="h-5 w-5 text-primary" /> */}
              3. How to Initiate a Return
            </h2>
            <p>
              We have kept the process simple. You don't need to navigate
              complex portals. Just reach out to us, and we will handle the
              rest.
            </p>
            <div className="mt-4 p-4 bg-muted/30 rounded-xl border border-border">
              <p className="font-semibold text-foreground mb-2">
                Step-by-Step Process:
              </p>
              <ol className="list-decimal pl-5 space-y-2">
                <li>
                  <strong>Contact Us:</strong> Send us a message via our{" "}
                  <Link
                    href="/contact-us"
                    className="text-primary hover:underline"
                  >
                    Contact Page
                  </Link>
                  , Email, or WhatsApp. Mention your <strong>Order ID</strong>{" "}
                  and the reason for return.
                </li>
                <li>
                  <strong>Pickup Scheduling:</strong> Once approved, we will
                  arrange a reverse pickup via our logistics partners (like
                  Delhivery or Shiprocket) within 2-3 business days.
                </li>
                <li>
                  <strong>Handover:</strong> Please pack the item securely and
                  hand it over to the courier person.
                </li>
              </ol>
            </div>
          </section>

          <Separator className="bg-border/60" />

          <section>
            <h2 className="text-lg md:text-xl font-bold text-foreground mb-3 flex items-center gap-2">
              {/* <Banknote className="h-5 w-5 text-primary" /> */}
              4. Refund Process
            </h2>
            <p>
              Once the returned item reaches our warehouse, our quality team
              will inspect it. If everything looks good, we will initiate your
              refund.
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>
                <strong>Prepaid Orders (Razorpay):</strong> The amount will be
                refunded to your original payment source (Credit Card, Debit
                Card, or UPI) within <strong>5-7 business days</strong>.
              </li>
              <li>
                <strong>Cash on Delivery (COD) Orders:</strong> Since we cannot
                refund cash, we will transfer the amount to your{" "}
                <strong>Bank Account or UPI ID</strong>. Our team will ask for
                these details once the return is approved.
              </li>
            </ul>
          </section>

          <Separator className="bg-border/60" />

          <section>
            <h2 className="text-lg md:text-xl font-bold text-foreground mb-3 flex items-center gap-2">
              5. Exchanges
            </h2>
            <p>
              If you received a size that doesn't fit, we recommend initiating a
              return and placing a new order for the correct size. This ensures
              you get the new product faster without waiting for the exchange
              process to complete.
            </p>
          </section>

          <Separator className="bg-border/60" />

          <section>
            <h2 className="text-lg md:text-xl font-bold text-foreground mb-3 flex items-center gap-2">
              6. Damaged or Wrong Product
            </h2>
            <p>
              In the rare case that you receive a damaged or incorrect product,
              please notify us within <strong>48 hours</strong> of delivery. We
              will arrange an immediate replacement or a full refund at no extra
              cost to you.
            </p>
          </section>

          <Separator className="bg-border/60" />

          <section>
            <div className="flex flex-col items-center justify-center text-center gap-3">
              <p className="font-medium text-foreground">
                Ready to start a return?
              </p>
              <Link href="/contact-us">
                <Button size="lg" className="rounded-full px-8">
                  Contact Support Team
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
