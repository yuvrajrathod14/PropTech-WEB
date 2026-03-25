"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { 
  LayoutDashboard, 
  Heart, 
  ShoppingBag, 
  MapPin, 
  MessageSquare, 
  User, 
  Bell, 
  LogOut,
  ChevronRight
} from "lucide-react"

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/home" },
  { icon: Heart, label: "Saved Properties", href: "/wishlist" },
  { icon: ShoppingBag, label: "My Bookings", href: "/bookings" },
  { icon: MapPin, label: "Site Visits", href: "/visits" },
  { icon: MessageSquare, label: "Enquiries", href: "/chat" },
  { icon: Bell, label: "Notifications", href: "/notifications" },
  { icon: User, label: "My Profile", href: "/profile" },
]

import { useAuth } from "@/hooks/use-auth"

export function BuyerSidebar() {
  const pathname = usePathname()
  const { profile, signOut } = useAuth()

  const displayName = profile?.full_name || "User"
  const initial = displayName.charAt(0).toUpperCase()

  return (
    <div className="w-72 border-r bg-white h-screen flex flex-col sticky top-0 overflow-y-auto hidden lg:flex">
      {/* Logo */}
      <div className="h-20 flex items-center px-8 border-b">
        <Link href="/" className="text-2xl font-black text-primary tracking-tighter">
          Prop<span className="text-slate-900">Tech</span>
        </Link>
      </div>

      {/* Profile Summary */}
      <div className="px-6 py-8">
        <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black text-lg">
            {initial}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-black text-slate-900 leading-tight">{displayName}</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              {profile?.role === 'owner' ? 'Owner Account' : 'Buyer Account'}
            </span>
          </div>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300 group",
                isActive 
                  ? "bg-primary text-white shadow-xl shadow-primary/20" 
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon className={cn(
                  "w-5 h-5",
                  isActive ? "text-white" : "text-slate-400 group-hover:text-primary transition-colors"
                )} />
                <span className="font-bold text-sm tracking-tight">{item.label}</span>
              </div>
              {isActive && <ChevronRight className="w-4 h-4 opacity-70" />}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-6 mt-auto">
        <button 
          onClick={signOut}
          className="flex items-center gap-3 px-4 py-3.5 rounded-2xl text-red-500 font-bold text-sm hover:bg-red-50 transition-all w-full"
        >
          <LogOut className="w-5 h-5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  )
}
