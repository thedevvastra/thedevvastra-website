import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Leaf,
  HeartHandshake,
  ShieldCheck,
  Sparkles,
  Quote,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const metadata = {
  title: "About Us | The Dev Vastra",
  description:
    "Discover the story behind The Dev Vastra. Where tradition meets modern elegance.",
};

export default function AboutUsPage() {
  return (
    <div className="bg-background min-h-screen">
      {/* --- SECTION 1: COMPACT HERO --- */}
      <section className="relative w-full py-20 md:py-24 flex items-center justify-center overflow-hidden bg-primary/5 border-b border-border/40">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background opacity-50" />

        <div className="container relative z-10 text-center max-w-2xl px-4">
          <Badge
            variant="outline"
            className="mb-4 px-3 py-1 text-xs tracking-widest uppercase bg-background/50 backdrop-blur"
          >
            Our Philosophy
          </Badge>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-4 leading-tight">
            Weaving Stories Into <br /> Every{" "}
            <span className="text-primary">Thread</span>.
          </h1>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto">
            The Dev Vastra is a celebration of style, comfort, and the
            confidence that comes with wearing something truly exceptional.
          </p>
        </div>
      </section>

      {/* --- SECTION 2: OUR STORY --- */}
      <section className="py-12 md:py-16 container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="relative group">
            <div className="relative h-[300px] md:h-[400px] w-full rounded-xl overflow-hidden shadow-lg border border-border/50 bg-muted">
              <Image
                src="/about-story.jpg"
                alt="Our Studio"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center -z-10 text-muted-foreground bg-secondary/30">
                <span className="text-sm font-medium">
                  Add 'about-story.jpg' to public folder
                </span>
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 bg-card p-4 rounded-lg shadow-lg border border-border text-center">
              <p className="text-2xl font-bold text-primary leading-none">
                2026
              </p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium mt-1">
                Est.
              </p>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                From Passion to Fashion
              </h2>
              <Separator className="w-12 bg-primary h-1 mt-2 rounded-full" />
            </div>
            <div className="space-y-3 text-muted-foreground text-sm md:text-base leading-relaxed">
              <p>
                The journey of <strong>The Dev Vastra</strong> began with a
                realization: fashion is the unspoken language of personality. We
                bridge the gap between high-end luxury and everyday comfort.
              </p>
              <p>
                Our name, <em>&quot;Vastra&quot;</em> (Sanskrit for Cloth), pays
                homage to our roots, while <em>&quot;Dev&quot;</em> symbolizes
                the dedication we pour into every stitch.
              </p>
            </div>
            <div className="pt-2">
              <Link href="/shop">
                <Button
                  variant="default"
                  className="rounded-full h-10 px-6 text-sm"
                >
                  Explore Collection <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* --- SECTION 3: CORE VALUES --- */}
      <section className="bg-muted/20 py-12 md:py-16 border-y border-border/40">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="text-2xl font-bold mb-2">Why Choose Us?</h2>
            <p className="text-sm text-muted-foreground">
              Building trust through quality, integrity, and sustainable
              practices.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-card p-6 rounded-xl border border-border hover:border-primary/30 transition-all hover:shadow-md group">
              <div className="h-10 w-10 bg-green-100/50 text-green-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Leaf className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold mb-2">Sustainable</h3>
              <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                We prioritize eco-friendly fabrics and sustainable packaging to
                reduce our footprint.
              </p>
            </div>

            <div className="bg-card p-6 rounded-xl border border-border hover:border-primary/30 transition-all hover:shadow-md group">
              <div className="h-10 w-10 bg-blue-100/50 text-blue-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold mb-2">Premium Quality</h3>
              <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                Handpicked fabrics and rigorous quality checks ensure you get
                the best product every time.
              </p>
            </div>

            <div className="bg-card p-6 rounded-xl border border-border hover:border-primary/30 transition-all hover:shadow-md group">
              <div className="h-10 w-10 bg-pink-100/50 text-pink-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <HeartHandshake className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold mb-2">Customer First</h3>
              <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                With 24/7 support and hassle-free returns, your happiness is our
                ultimate success.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- SECTION 4: FAQs (Added) --- */}
      <section className="py-16 md:py-20 container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-10">
          <Badge variant="secondary" className="mb-3">
            Support
          </Badge>
          <h2 className="text-2xl md:text-3xl font-bold mb-3 flex items-center justify-center gap-2">
            <HelpCircle className="h-6 w-6 text-primary" /> Frequently Asked
            Questions
          </h2>
          <p className="text-muted-foreground text-sm max-w-lg mx-auto">
            Got questions about your order or our products? Here is everything
            you need to know.
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-2">
          <AccordionItem
            value="item-1"
            className="border rounded-lg px-4 bg-card"
          >
            <AccordionTrigger className="hover:no-underline font-medium">
              What kind of clothing do you sell?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground leading-relaxed">
              At The Dev Vastra, we offer a wide range of stylish clothing for
              both men and women. Our collection includes everything from casual
              t-shirts and shirts to elegant dresses and ethnic wear that suits
              every occasion. We focus on providing trendy designs without
              compromising on comfort.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="item-2"
            className="border rounded-lg px-4 bg-card"
          >
            <AccordionTrigger className="hover:no-underline font-medium">
              How long does delivery take?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground leading-relaxed">
              We know you are excited to wear your new clothes. That is why we
              usually deliver orders within 5 to 7 business days across India.
              You will also get a tracking link to see exactly where your
              package is once we dispatch it from our warehouse.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="item-3"
            className="border rounded-lg px-4 bg-card"
          >
            <AccordionTrigger className="hover:no-underline font-medium">
              What is your return policy?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground leading-relaxed">
              Don't worry if the fit isn't right. We offer a hassle-free 7-day
              return policy. You can easily exchange the item for a different
              size or get a refund if the product remains unused and has all its
              original tags intact.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="item-4"
            className="border rounded-lg px-4 bg-card"
          >
            <AccordionTrigger className="hover:no-underline font-medium">
              How do I choose the right size?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground leading-relaxed">
              Finding the perfect fit is easy with us. Every product page has a
              detailed size chart that helps you measure yourself correctly. If
              you are stuck between two sizes, we usually recommend going for
              the larger one for a more comfortable fit.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="item-5"
            className="border rounded-lg px-4 bg-card"
          >
            <AccordionTrigger className="hover:no-underline font-medium">
              Is the fabric quality good?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground leading-relaxed">
              Quality is our top priority here. We use premium fabrics like
              breathable cotton and soft blends to ensure you feel comfortable
              all day long. Every piece goes through a strict quality check
              before we pack it for you.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="item-6"
            className="border rounded-lg px-4 bg-card"
          >
            <AccordionTrigger className="hover:no-underline font-medium">
              What payment methods do you accept?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground leading-relaxed">
              We accept all major payment methods including credit cards, debit
              cards, and UPI. If you prefer paying when the package arrives at
              your doorstep, we also have a Cash on Delivery option available
              for most locations.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="item-7"
            className="border rounded-lg px-4 bg-card"
          >
            <AccordionTrigger className="hover:no-underline font-medium">
              Do you ship internationally?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground leading-relaxed">
              Currently, we only ship within India. We want to focus on
              providing the best possible service to our domestic customers
              first, but we definitely plan to expand globally in the future.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="item-8"
            className="border rounded-lg px-4 bg-card"
          >
            <AccordionTrigger className="hover:no-underline font-medium">
              Can I cancel my order?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground leading-relaxed">
              Yes, you can cancel your order if we haven't shipped it yet. Just
              go to your order history or contact our support team immediately.
              Once the order leaves our warehouse, we might not be able to stop
              it.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="item-9"
            className="border rounded-lg px-4 bg-card"
          >
            <AccordionTrigger className="hover:no-underline font-medium">
              Are your products sustainable?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground leading-relaxed">
              We care about the planet just as much as we care about fashion. We
              are actively moving towards sustainable practices by using
              eco-friendly packaging and sourcing fabrics that are kind to the
              environment.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="item-10"
            className="border rounded-lg px-4 bg-card"
          >
            <AccordionTrigger className="hover:no-underline font-medium">
              How can I contact customer support?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground leading-relaxed">
              Our customer support team is always ready to help you. You can
              reach out to us via the contact form on our website or email us
              directly. We try our best to resolve your queries within 24 hours.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {/* --- SECTION 5: QUOTE --- */}
      <section className="py-12 md:py-16 container mx-auto px-4 max-w-4xl">
        <div className="relative bg-primary/90 text-primary-foreground rounded-2xl p-8 md:p-12 text-center overflow-hidden shadow-xl">
          <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl translate-x-1/2 translate-y-1/2" />

          <Quote className="h-8 w-8 text-white/40 mx-auto mb-4" />

          <blockquote className="text-xl md:text-2xl font-serif font-medium leading-relaxed">
            &quot;Fashion is about dreaming and making other people dream. At
            The Dev Vastra, we dream of a world where style meets soul.&quot;
          </blockquote>

          <div className="mt-6 flex flex-col items-center">
            <div className="font-bold text-sm">The Founders</div>
            <div className="text-xs opacity-75">The Dev Vastra Team</div>
          </div>
        </div>
      </section>

      {/* --- SECTION 6: STATS --- */}
      <section className="pb-16 pt-4 container mx-auto px-4 max-w-5xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 text-center">
          <div className="p-4 rounded-lg bg-muted/30">
            <div className="text-2xl md:text-3xl font-bold text-primary">
              10k+
            </div>
            <div className="text-[10px] md:text-xs text-muted-foreground font-semibold uppercase mt-1">
              Happy Customers
            </div>
          </div>
          <div className="p-4 rounded-lg bg-muted/30">
            <div className="text-2xl md:text-3xl font-bold text-primary">
              500+
            </div>
            <div className="text-[10px] md:text-xs text-muted-foreground font-semibold uppercase mt-1">
              Unique Designs
            </div>
          </div>
          <div className="p-4 rounded-lg bg-muted/30">
            <div className="text-2xl md:text-3xl font-bold text-primary">
              4.8
            </div>
            <div className="text-[10px] md:text-xs text-muted-foreground font-semibold uppercase mt-1">
              Average Rating
            </div>
          </div>
          <div className="p-4 rounded-lg bg-muted/30">
            <div className="text-2xl md:text-3xl font-bold text-primary">
              24/7
            </div>
            <div className="text-[10px] md:text-xs text-muted-foreground font-semibold uppercase mt-1">
              Support
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}