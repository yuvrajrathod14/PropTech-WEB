"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Heart, MessageSquare, User, Search } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { icon: LayoutDashboard, label: "Home", href: "/buyer/dashboard" },
  { icon: Search, label: "Search", href: "/search" },
  { icon: Heart, label: "Saved", href: "/buyer/wishlist" },
  { icon: MessageSquare, label: "Chat", href: "/buyer/chat" },
]

export function BuyerBottomNav() {
  const pathname = usePathname()

  return (
    <div className="lg:hidden fixed bottom-6 left-6 right-6 z-50">
      <div className="bg-white/90 backdrop-blur-2xl border border-white/20 rounded-[2.5rem] shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center justify-center flex-1 py-1"
            >
              <div className={cn(
                "p-2 rounded-2xl transition-all duration-300",
                isActive ? "bg-primary/10 text-primary" : "text-slate-400 hover:text-slate-600"
              )}>
                <item.icon className={cn("w-5 h-5", isActive && "fill-current")} />
              </div>
              <span className={cn(
                "text-[10px] font-black uppercase tracking-widest mt-0.5 transition-all duration-300",
                isActive ? "text-primary opacity-100 h-auto" : "text-slate-400 opacity-0 h-0 overflow-hidden"
              )}>
                {item.label}
              </span>
            </Link>
          )
        })}
        <Link
          href="/buyer/profile"
          className="flex flex-col items-center justify-center flex-1 py-1"
        >
          <div className={cn(
            "p-2 rounded-2xl transition-all duration-300",
            pathname === "/buyer/profile" ? "bg-primary/10 text-primary" : "text-slate-400 hover:text-slate-600"
          )}>
            <User className={cn("w-5 h-5", pathname === "/buyer/profile" && "fill-current")} />
          </div>
        </Link>
      </div>
    </div>
  )
}
