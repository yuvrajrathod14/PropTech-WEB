import { Metadata } from "next"
import { Navbar } from "@/components/shared/navbar"
import { Footer } from "@/components/shared/footer"
import { MobileNav } from "@/components/shared/mobile-nav"

export const metadata: Metadata = {
  title: "PropTech | India's Most Transparent Real Estate Platform",
  description: "Browse verified listings, book properties, and experience a seamless real estate journey with PropTech.",
  openGraph: {
    title: "PropTech | Real Estate Reimagined",
    description: "Verified properties, transparent pricing, and instant bookings.",
    type: "website",
    locale: "en_IN",
    url: "https://proptech.in",
    siteName: "PropTech",
  },
}

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-grow pt-20 lg:pt-0">{children}</main>
      <Footer />
      <MobileNav />
    </div>
  );
}
