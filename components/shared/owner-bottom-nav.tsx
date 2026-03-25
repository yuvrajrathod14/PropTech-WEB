"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, List, PlusCircle, BarChart3, User } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { icon: LayoutDashboard, label: "Dash", href: "/owner/dashboard" },
  { icon: List, label: "Listings", href: "/owner/listings" },
  { icon: PlusCircle, label: "Post", href: "/owner/post", primary: true },
  { icon: BarChart3, label: "Stats", href: "/owner/analytics" },
  { icon: User, label: "Profile", href: "/owner/profile" },
]

export function OwnerBottomNav() {
  const pathname = usePathname()

  return (
    <div className="lg:hidden fixed bottom-6 left-6 right-6 z-50">
      <div className="bg-white/90 backdrop-blur-2xl border border-white/20 rounded-[2.5rem] shadow-[0_8px_32_0_rgba(31,38,135,0.15)] flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          
          if (item.primary) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative -top-8 bg-primary rounded-full p-4 shadow-xl shadow-primary/40 active:scale-95 transition-all text-white border-4 border-white"
              >
                <item.icon className="w-6 h-6" />
              </Link>
            )
          }

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
                "text-[10px] font-black uppercase tracking-widest mt-0.5",
                isActive ? "text-primary opacity-100" : "text-slate-400 opacity-0"
              )}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
