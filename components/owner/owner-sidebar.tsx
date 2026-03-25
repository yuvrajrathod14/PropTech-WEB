"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { 
  LayoutDashboard, 
  Building2, 
  PlusCircle, 
  BarChart3, 
  MessageSquare, 
  Settings, 
  LogOut,
  ChevronRight,
  Menu,
  X
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const navItems = [
  { name: "Dashboard", href: "/owner/dashboard", icon: LayoutDashboard },
  { name: "My Listings", href: "/owner/listings", icon: Building2 },
  { name: "Post Property", href: "/owner/post", icon: PlusCircle },
  { name: "Analytics", href: "/owner/analytics", icon: BarChart3 },
  { name: "Enquiries", href: "/owner/enquiries", icon: MessageSquare },
]

export function OwnerSidebar() {
  const pathname = usePathname()
  const { user, profile, signOut } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  const displayName = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || "User"
  const initial = displayName.charAt(0).toUpperCase()

  const NavContent = () => (
    <div className="flex flex-col h-full py-6 px-4">
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 mb-10">
        <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
          <Building2 className="w-6 h-6 text-white" />
        </div>
        <span className="text-xl font-black tracking-tight text-slate-900 italic">PropTech <span className="text-primary not-italic text-sm">Owner</span></span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link key={item.name} href={item.href}>
              <div className={cn(
                "group flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 relative overflow-hidden",
                isActive 
                  ? "bg-slate-900 text-white shadow-xl shadow-slate-200" 
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
              )}>
                {isActive && (
                  <motion.div 
                    layoutId="active-pill"
                    className="absolute left-0 w-1 h-6 bg-primary rounded-r-full"
                  />
                )}
                <item.icon className={cn("w-5 h-5", isActive ? "text-primary" : "group-hover:text-primary transition-colors")} />
                <span className="font-bold text-sm">{item.name}</span>
                {isActive && <ChevronRight className="w-4 h-4 ml-auto opacity-50" />}
              </div>
            </Link>
          )
        })}
      </nav>

      {/* User Info & Actions */}
      <div className="mt-auto pt-6 border-t border-slate-100">
        <div className="bg-slate-50 rounded-[28px] p-4 flex items-center gap-3 mb-4">
          <Avatar className="w-10 h-10 border-2 border-white shadow-sm">
            <AvatarImage src={user?.user_metadata?.avatar_url} />
            <AvatarFallback className="bg-primary text-white font-black">{initial}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-black text-slate-900 truncate">{displayName}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Property Owner</p>
          </div>
        </div>

        <div className="space-y-1">
          <Link href="/owner/settings">
            <Button variant="ghost" className="w-auto justify-start gap-3 text-slate-500 font-bold hover:text-slate-900 hover:bg-slate-100 px-4 rounded-xl">
              <Settings className="w-4 h-4" />
              Settings
            </Button>
          </Link>
          <Button 
            variant="ghost" 
            onClick={() => signOut()}
            className="w-full justify-start gap-3 text-red-500 font-bold hover:text-red-600 hover:bg-red-50 px-4 rounded-xl"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile Toggle */}
      <Button 
        variant="outline" 
        size="icon" 
        onClick={() => setIsOpen(true)}
        className="fixed top-20 left-4 z-40 md:hidden bg-white/80 backdrop-blur-xl border-none shadow-xl rounded-2xl h-12 w-12"
      >
        <Menu className="w-6 h-6 text-slate-900" />
      </Button>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 md:hidden"
          >
            <motion.div 
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
              className="absolute left-0 top-0 bottom-0 w-[280px] bg-white shadow-2xl"
            >
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 rounded-xl"
              >
                <X className="w-5 h-5" />
              </Button>
              <NavContent />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="hidden md:block fixed left-0 top-0 bottom-0 w-[280px] bg-white border-r border-slate-100 z-40">
        <NavContent />
      </aside>
    </>
  )
}
