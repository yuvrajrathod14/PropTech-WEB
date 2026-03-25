"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  Home, 
  Users, 
  CreditCard, 
  BarChart3, 
  Settings, 
  ShieldCheck, 
  Bell,
  Search,
  LogOut,
  Menu,
  X,
  Clock,
  Zap,
  CheckCircle2,
  AlertCircle
} from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Listings', href: '/admin/listings', icon: Home, count: 12 },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Bookings', href: '/admin/bookings', icon: CreditCard },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { name: 'Verifications', href: '/admin/verifications', icon: ShieldCheck, count: 5 },
  { name: 'Audit Log', href: '/admin/audit-log', icon: Clock },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-80 bg-white border-r border-slate-100 p-8 fixed h-screen">
        <div className="flex items-center gap-3 px-2 mb-12">
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white font-black text-xl italic shadow-xl shadow-slate-200">P</div>
            <div>
                <span className="text-xl font-black text-slate-900 tracking-tighter italic">PropTech</span>
                <Badge className="ml-2 bg-primary text-white border-none text-[8px] font-black uppercase px-2 py-0">ADMIN</Badge>
            </div>
        </div>

        <nav className="flex-1 space-y-2">
            {navigation.map((item) => {
                const isActive = pathname.startsWith(item.href)
                return (
                    <Link 
                        key={item.name} 
                        href={item.href}
                        className={cn(
                            "flex items-center justify-between px-4 h-14 rounded-2xl font-black text-sm transition-all group",
                            isActive 
                                ? "bg-slate-900 text-white shadow-xl shadow-slate-200" 
                                : "text-slate-400 hover:bg-slate-50 hover:text-slate-900"
                        )}
                    >
                        <div className="flex items-center gap-3">
                            <item.icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-slate-400 group-hover:text-primary transition-colors")} />
                            {item.name}
                        </div>
                        {item.count && (
                            <span className={cn(
                                "text-[10px] font-black px-2 py-0.5 rounded-lg",
                                isActive ? "bg-primary text-white" : "bg-slate-100 text-slate-400"
                            )}>
                                {item.count}
                            </span>
                        )}
                    </Link>
                )
            })}
        </nav>

        <div className="mt-auto pt-8 border-t border-slate-50 space-y-4">
             <div className="bg-slate-50 rounded-2xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-200" />
                <div className="flex-1 min-w-0">
                    <p className="text-xs font-black text-slate-900 truncate tracking-tight">System Admin</p>
                    <p className="text-[10px] font-bold text-slate-400 truncate italic">super@proptech.com</p>
                </div>
                <Button variant="ghost" size="icon" className="rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50">
                    <LogOut className="w-4 h-4" />
                </Button>
             </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:pl-80 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4 flex-1">
            <Button 
                variant="ghost" 
                size="icon" 
                className="lg:hidden rounded-xl"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
                {isMobileMenuOpen ? <X /> : <Menu />}
            </Button>
            <div className="relative max-w-md w-full hidden md:block">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                    type="text" 
                    placeholder="Search anything..." 
                    className="w-full h-11 pl-10 pr-4 rounded-xl bg-slate-50 border-none text-sm font-medium focus:ring-2 ring-primary/20 transition-all outline-none"
                />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="rounded-xl relative text-slate-400 hover:bg-slate-50">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-white" />
            </Button>
            <div className="h-8 w-[1px] bg-slate-100 hidden sm:block" />
            <div className="hidden sm:flex items-center gap-3 pl-2">
                <p className="text-xs font-black text-slate-900 italic tracking-tight uppercase">System Status</p>
                <div className="px-2 py-1 rounded-lg bg-emerald-50 text-emerald-600 text-[10px] font-black flex items-center gap-1.5 border border-emerald-100">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    OPERATIONAL
                </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8">
            {children}
        </div>
      </main>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden" onClick={() => setIsMobileMenuOpen(false)}>
            <div className="absolute top-0 left-0 w-80 h-full bg-white p-8" onClick={(e) => e.stopPropagation()}>
                {/* Mobile menu content same as sidebar but with close button */}
            </div>
        </div>
      )}
    </div>
  )
}

function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
    return (
        <span className={cn("px-2 py-0.5 rounded-md text-[10px] font-bold", className)}>
            {children}
        </span>
    )
}
