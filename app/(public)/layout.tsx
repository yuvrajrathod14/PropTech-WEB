import { Navbar } from "@/components/shared/navbar"
import { Footer } from "@/components/shared/footer"

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
    </div>
  );
}
