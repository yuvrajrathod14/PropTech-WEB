"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Search, PlusCircle, Heart, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/hooks/use-auth"

export function MobileNav() {
  const pathname = usePathname()
  const { user } = useAuth()

  const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Search", href: "/search", icon: Search },
    { name: "Post", href: user ? "/owner/post" : "/register?role=owner", icon: PlusCircle, primary: true },
    { name: "Saved", href: "/buyer/wishlist", icon: Heart },
    { name: "Profile", href: user ? (user.user_metadata?.role === 'owner' ? "/owner/dashboard" : "/buyer/profile") : "/login", icon: User },
  ]

  return (
    <div className="md:hidden fixed bottom-6 left-6 right-6 z-50">
      <div className="bg-white/80 backdrop-blur-2xl border border-white/20 rounded-[2.5rem] shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] flex items-center justify-between px-2 py-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          
          if (item.primary) {
            return (
              <Link
                key={item.name}
                href={item.href}
                className="relative -top-8 bg-primary rounded-full p-4 shadow-xl shadow-primary/40 active:scale-95 transition-all text-white border-4 border-white"
              >
                <item.icon className="w-6 h-6" />
              </Link>
            )
          }

          return (
            <Link
              key={item.name}
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
                {item.name}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
