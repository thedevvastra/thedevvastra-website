import { SiteHeader } from "@/components/layout/site-header";
import { Footer } from "@/components/layout/footer";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar yahan shift ho gaya */}
      <SiteHeader />
      <main className="flex-1">{children}</main>

      <Footer />
    </div>
  );
}
