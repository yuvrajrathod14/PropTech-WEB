import { OwnerSidebar } from "@/components/owner/owner-sidebar"
import { OwnerBottomNav } from "@/components/shared/owner-bottom-nav"

export default function OwnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col lg:flex-row">
      <OwnerSidebar />
      <main className="flex-1 w-full bg-slate-50/50 min-h-screen md:pl-[280px]">
        <div className="w-full max-w-7xl mx-auto p-4 md:p-8 lg:p-12 pb-32 md:pb-8">
          {children}
        </div>
      </main>
      <OwnerBottomNav />
    </div>
  );
}
