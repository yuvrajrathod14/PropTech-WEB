import { BuyerSidebar } from "@/components/shared/buyer-sidebar"
import { BuyerBottomNav } from "@/components/shared/buyer-bottom-nav"
import { Bell, Search } from "lucide-react"
import Link from "next/link"

export default function BuyerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 flex overflow-hidden">
      {/* Desktop Sidebar */}
      <BuyerSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden h-20 bg-white border-b flex items-center justify-between px-6 shrink-0 z-40">
          <Link href="/" className="text-xl font-black text-primary tracking-tighter text-nowrap">
            Prop<span className="text-slate-900">Tech</span>
          </Link>
          <div className="flex items-center gap-4">
            <button className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
              <Search className="w-5 h-5" />
            </button>
            <Link href="/notifications" className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full border-2 border-white" />
            </Link>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 pb-24 lg:pb-0 overflow-y-auto">
          <div className="p-4 md:p-8 lg:p-10 max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BuyerBottomNav />
    </div>
  );
}
