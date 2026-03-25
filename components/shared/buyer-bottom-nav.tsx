"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { 
  LayoutDashboard, 
  Heart, 
  MessageSquare, 
  User 
} from "lucide-react"

const navItems = [
  { icon: LayoutDashboard, label: "Home", href: "/home" },
  { icon: Heart, label: "Saved", href: "/wishlist" },
  { icon: MessageSquare, label: "Chat", href: "/chat" },
  { icon: User, label: "Profile", href: "/profile" },
]

export function BuyerBottomNav() {
  const pathname = usePathname()

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 h-20 bg-white border-t flex items-center justify-around px-6 z-50">
      {navItems.map((item) => {
        const isActive = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center gap-1.5 transition-all duration-300",
              isActive ? "text-primary" : "text-slate-400"
            )}
          >
            <item.icon className={cn(
              "w-6 h-6",
              isActive ? "animate-bounce-short" : ""
            )} />
            <span className="text-[10px] font-black uppercase tracking-widest leading-none">
              {item.label}
            </span>
          </Link>
        )
      })}
    </div>
  )
}
