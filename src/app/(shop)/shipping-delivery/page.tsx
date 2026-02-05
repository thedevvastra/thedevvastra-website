import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Truck,
  ArrowLeft,
  Clock,
  MapPin,
  PackageSearch,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Shipping & Delivery | The Dev Vastra",
  description:
    "Information about shipping methods, delivery timelines, and order tracking.",
};

export default function ShippingDeliveryPage() {
  return (
    <div className="bg-background min-h-screen py-12">
      {/* ✅ Website Standard Max Width Container */}
      <div className="container mx-auto px-4">
        {/* --- Header Section --- */}
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <Badge variant="secondary" className="mb-4">
            Order Fulfillment
          </Badge>
          <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4 flex items-center justify-center gap-3">
            <Truck className="h-8 w-8 text-primary" />
            Shipping & Delivery
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Fast, safe, and reliable delivery directly to your doorstep. <br />
            <span className="opacity-70">Last Updated: February 2026</span>
          </p>
        </div>

        {/* --- Content Section --- */}
        <div className="bg-card border border-border/60 rounded-2xl p-6 md:p-10 shadow-sm space-y-8 text-muted-foreground leading-relaxed text-sm md:text-base">
          <section>
            <h2 className="text-lg md:text-xl font-bold text-foreground mb-3 flex items-center gap-2">
              1. How We Deliver
            </h2>
            <p>
              At <strong>The Dev Vastra</strong>, we understand that you are
              excited to receive your order. That is why we partner with India's
              most trusted logistics services to ensure your clothes reach you
              safely and on time. Our delivery partners include:
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              <Badge variant="outline" className="px-3 py-1">
                Shiprocket
              </Badge>
              <Badge variant="outline" className="px-3 py-1">
                Delhivery
              </Badge>
              <Badge variant="outline" className="px-3 py-1">
                India Post
              </Badge>
              <Badge variant="outline" className="px-3 py-1">
                Ecom Express
              </Badge>
            </div>
          </section>

          <Separator className="bg-border/60" />

          <section>
            <h2 className="text-lg md:text-xl font-bold text-foreground mb-3 flex items-center gap-2">
                          {/* <Clock className="h-5 w-5 text-primary" /> */}
                          2. Estimated Delivery
              Time
            </h2>
            <p>
              We strive to dispatch all orders within{" "}
              <strong>24-48 hours</strong> of placing them. Once shipped, the
              estimated delivery time depends on your location:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>
                <strong>Metros & Major Cities:</strong> 3 to 5 business days.
              </li>
              <li>
                <strong>Rest of India:</strong> 5 to 7 business days.
              </li>
              <li>
                <strong>Remote Areas:</strong> Might take slightly longer
                depending on courier coverage.
              </li>
            </ul>
          </section>

          <Separator className="bg-border/60" />

          <section>
            <h2 className="text-lg md:text-xl font-bold text-foreground mb-3 flex items-center gap-2">
                          {/* <AlertCircle className="h-5 w-5 text-primary" /> */}
                          3. Delays &
              Support
            </h2>
            <p>
              While we always aim for speed, sometimes unforeseen circumstances
              like weather, strikes, or high operational volume can cause
              delays.
            </p>
            <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
              <p className="text-foreground font-medium mb-1">
                Has it been more than 10 days?
              </p>
              <p className="text-sm">
                If your order has not arrived within <strong>10 days</strong>,
                please do not worry. Contact us immediately, and we will
                escalate the issue with our courier partner to locate your
                package.
              </p>
              <div className="mt-3">
                <Link href="/contact-us">
                  <Button size="sm" variant="secondary">
                    Report a Delay
                  </Button>
                </Link>
              </div>
            </div>
          </section>

          <Separator className="bg-border/60" />

          <section>
            <h2 className="text-lg md:text-xl font-bold text-foreground mb-3 flex items-center gap-2">
                          {/* <PackageSearch className="h-5 w-5 text-primary" /> */}
                          4. Order Tracking
            </h2>
            <p>
              Once your order is shipped, you will receive a{" "}
              <strong>Tracking ID</strong> via SMS and Email. You can use this
              ID on our logistics partner's website or the tracking link
              provided in the message to see exactly where your package is.
            </p>
          </section>

          <Separator className="bg-border/60" />

          <section>
            <h2 className="text-lg md:text-xl font-bold text-foreground mb-3 flex items-center gap-2">
                          {/* <MapPin className="h-5 w-5 text-primary" /> */}
                          5. Shipping Charges
            </h2>
            <p>We try to keep shipping costs as low as possible.</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>
                <strong>Prepaid Orders:</strong> Often come with free or
                discounted shipping (check current offers).
              </li>
              <li>
                <strong>Cash on Delivery (COD):</strong> A nominal handling fee
                may apply to COD orders to facilitate cash collection by the
                courier.
              </li>
            </ul>
            <p className="mt-2 text-sm italic">
              * Exact shipping charges will be calculated and shown to you at
              checkout before payment.
            </p>
          </section>

          <Separator className="bg-border/60" />

          <section>
            <h2 className="text-lg md:text-xl font-bold text-foreground mb-3 flex items-center gap-2">
              6. International Shipping
            </h2>
            <p>
              Currently, <strong>The Dev Vastra</strong> ships only within
              India. We are working on expanding our reach to international
              customers soon. Stay tuned for updates!
            </p>
          </section>

          <Separator className="bg-border/60" />

          <section>
            <div className="flex flex-col items-center justify-center text-center gap-3">
              <p className="font-medium text-foreground">
                Have a question about your delivery?
              </p>
              <Link href="/contact-us">
                <Button size="lg" className="rounded-full px-8">
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
