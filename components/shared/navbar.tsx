"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import { createClient } from "@/lib/supabase/client"
import { 
  Menu, 
  X, 
  Home, 
  PlusCircle, 
  Bell,
  User,
  LogOut,
  LayoutDashboard,
  Heart,
  ShoppingBag,
  MessageSquare,
  BarChart3,
  List,
  Calendar,
} from "lucide-react"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Properties", href: "/search" },
  { name: "How it Works", href: "/how-it-works" },
  { name: "Pricing", href: "/pricing" },
  { name: "About", href: "/about" },
]

export function Navbar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { user, loading } = useAuth()
  const supabase = createClient()

  const [unreadCount, setUnreadCount] = useState(0)
  const [notifications, setNotifications] = useState<any[]>([])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)

    if (user) {
      fetchNotifications()
      
      // Subscribe to real-time notifications
      const channel = supabase
        .channel(`notifications:${user.id}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${user.id}`
          },
          (payload) => {
            setNotifications((prev) => [payload.new, ...prev].slice(0, 10))
            setUnreadCount((prev) => prev + 1)
          }
        )
        .subscribe()

      return () => {
        window.removeEventListener("scroll", handleScroll)
        supabase.removeChannel(channel)
      }
    }

    return () => window.removeEventListener("scroll", handleScroll)
  }, [user])

  const fetchNotifications = async () => {
    if (!user) return
    try {
      const { data, count, error } = await (supabase.from("notifications") as any)
        .select("*", { count: 'exact' })
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10)

      if (error) throw error
      setNotifications(data || [])
      
      const { count: unread } = await (supabase.from("notifications") as any)
        .select("*", { count: 'exact' })
        .eq("user_id", user.id)
        .eq("is_read", false)

      setUnreadCount(unread || 0)
    } catch (e) {
      console.error(e)
    }
  }

  const markAsRead = async (id: string) => {
    if (!user) return
    await (supabase.from("notifications") as any).update({ is_read: true }).eq("id", id)
    setUnreadCount((prev) => Math.max(0, prev - 1))
    setNotifications((prev) => prev.map(n => n.id === id ? { ...n, is_read: true } : n))
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.reload()
  }

  return (
    <nav
      className={cn(
        "fixed left-0 right-0 z-50 transition-all duration-500",
        scrolled 
          ? "top-4 mx-4 md:mx-auto max-w-6xl rounded-[2rem] bg-white/70 backdrop-blur-xl border border-white/20 py-3 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)]" 
          : "top-0 bg-transparent border-transparent py-6"
      )}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="w-11 h-11 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform duration-300">
            <Home className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-black tracking-tighter text-primary">
            Prop<span className="text-slate-900">Tech</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-10">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                "text-sm font-bold transition-all relative py-1 hover:text-primary",
                pathname === link.href ? "text-primary" : "text-slate-500"
              )}
            >
              {link.name}
              {pathname === link.href && (
                <motion.div 
                  layoutId="nav-underline"
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full"
                />
              )}
            </Link>
          ))}
        </div>

        {/* Auth Actions */}
        <div className="hidden md:flex items-center space-x-4">
          {!loading && (
            <>
              {user ? (
                <div className="flex items-center space-x-4">
                  {/* Notifications */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="relative rounded-xl hover:bg-slate-100">
                        <Bell className="w-5 h-5 text-slate-600" />
                        {unreadCount > 0 && (
                          <Badge className="absolute -top-1 -right-1 min-w-[18px] h-[18px] p-0 flex items-center justify-center bg-primary text-[10px] border-2 border-white font-black">
                            {unreadCount}
                          </Badge>
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-80 p-2 rounded-2xl shadow-2xl border-slate-100 bg-white">
                      <DropdownMenuLabel className="font-black text-slate-900 border-b border-slate-50 pb-2 mb-2 italic">Notifications</DropdownMenuLabel>
                      <div className="space-y-1 max-h-[400px] overflow-y-auto">
                         {notifications.length === 0 ? (
                           <div className="p-8 text-center">
                              <Bell className="w-8 h-8 text-slate-200 mx-auto mb-2" />
                              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">No notifications yet</p>
                           </div>
                         ) : (
                           notifications.map((n) => (
                             <DropdownMenuItem 
                               key={n.id} 
                               className={cn(
                                 "p-3 rounded-xl cursor-pointer flex gap-3 transition-colors",
                                 !n.is_read ? "bg-primary/5 hover:bg-primary/10" : "hover:bg-slate-50"
                               )}
                               onClick={() => markAsRead(n.id)}
                             >
                                <div className={cn(
                                  "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
                                  !n.is_read ? "bg-primary text-white" : "bg-slate-100 text-slate-400"
                                )}>
                                  <Bell className="w-4 h-4" />
                                </div>
                                <div className="flex flex-col gap-0.5">
                                  <p className={cn("text-xs font-bold", !n.is_read ? "text-slate-900" : "text-slate-500")}>
                                    {n.title}
                                  </p>
                                  <p className="text-[10px] text-slate-400 font-medium">
                                    {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </p>
                                </div>
                             </DropdownMenuItem>
                           ))
                         )}
                      </div>
                      <DropdownMenuSeparator className="my-2 bg-slate-50" />
                      <DropdownMenuItem className="w-full justify-center text-[10px] font-black uppercase tracking-widest text-primary cursor-pointer hover:bg-slate-50 rounded-xl py-2">
                        View All
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Profile Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="p-1 rounded-2xl hover:bg-slate-100 h-auto">
                        <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                          <AvatarImage src={user.user_metadata?.avatar_url} />
                          <AvatarFallback className="bg-slate-200 text-slate-600 font-bold">
                            {user.email?.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-64 p-2 rounded-2xl shadow-2xl border-slate-100">
                        <DropdownMenuLabel className="p-3">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-black text-slate-900 truncate">{user.user_metadata?.full_name || "User Account"}</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{user.user_metadata?.role || "Buyer"}</p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-slate-50" />
                        
                        {/* Role Based Links */}
                        {user.user_metadata?.role === 'owner' ? (
                          <>
                            <DropdownMenuItem className="p-0">
                              <Link href="/owner/dashboard" className="flex items-center gap-3 p-3 w-full rounded-xl cursor-pointer">
                                <LayoutDashboard className="w-4 h-4 text-slate-500" />
                                <span className="font-bold text-slate-700">Dashboard</span>
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="p-0">
                              <Link href="/owner/listings" className="flex items-center gap-3 p-3 w-full rounded-xl cursor-pointer">
                                <List className="w-4 h-4 text-slate-500" />
                                <span className="font-bold text-slate-700">My Listings</span>
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="p-0">
                              <Link href="/owner/post" className="flex items-center gap-3 p-3 w-full rounded-xl cursor-pointer">
                                <PlusCircle className="w-4 h-4 text-slate-500" />
                                <span className="font-bold text-slate-700">Post Property</span>
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="p-0">
                              <Link href="/owner/visits" className="flex items-center gap-3 p-3 w-full rounded-xl cursor-pointer">
                                <Calendar className="w-4 h-4 text-slate-500" />
                                <span className="font-bold text-slate-700">My Visits</span>
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="p-0">
                              <Link href="/owner/analytics" className="flex items-center gap-3 p-3 w-full rounded-xl cursor-pointer">
                                <BarChart3 className="w-4 h-4 text-slate-500" />
                                <span className="font-bold text-slate-700">Analytics</span>
                              </Link>
                            </DropdownMenuItem>
                          </>
                        ) : (
                          <>
                            <DropdownMenuItem className="p-0">
                              <Link href="/buyer/profile" className="flex items-center gap-3 p-3 w-full rounded-xl cursor-pointer">
                                <User className="w-4 h-4 text-slate-500" />
                                <span className="font-bold text-slate-700">My Profile</span>
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="p-0">
                              <Link href="/buyer/wishlist" className="flex items-center gap-3 p-3 w-full rounded-xl cursor-pointer">
                                <Heart className="w-4 h-4 text-slate-500" />
                                <span className="font-bold text-slate-700">Saved Properties</span>
                              </Link>
                            </DropdownMenuItem>
                             <DropdownMenuItem className="p-0">
                               <Link href="/buyer/visits" className="flex items-center gap-3 p-3 w-full rounded-xl cursor-pointer">
                                 <Calendar className="w-4 h-4 text-slate-500" />
                                 <span className="font-bold text-slate-700">My Visits</span>
                               </Link>
                             </DropdownMenuItem>
                             <DropdownMenuItem className="p-0">
                               <Link href="/buyer/bookings" className="flex items-center gap-3 p-3 w-full rounded-xl cursor-pointer">
                                 <ShoppingBag className="w-4 h-4 text-slate-500" />
                                 <span className="font-bold text-slate-700">My Bookings</span>
                               </Link>
                             </DropdownMenuItem>
                            <DropdownMenuItem className="p-0">
                              <Link href="/buyer/chat" className="flex items-center gap-3 p-3 w-full rounded-xl cursor-pointer">
                                <MessageSquare className="w-4 h-4 text-slate-500" />
                                <span className="font-bold text-slate-700">My Chats</span>
                              </Link>
                            </DropdownMenuItem>
                          </>
                        )}
                        
                        <DropdownMenuSeparator className="bg-slate-50" />
                        <DropdownMenuItem 
                            onClick={handleLogout}
                            className="flex items-center gap-3 p-3 rounded-xl cursor-pointer text-destructive focus:bg-destructive/5 focus:text-destructive"
                        >
                            <LogOut className="w-4 h-4" />
                            <span className="font-bold text-sm">Sign Out</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="font-bold text-slate-600 hover:text-primary rounded-xl px-5">
                    Sign In
                  </Button>
                </Link>
              )}
            </>
          )}
          <Link href={user ? "/owner/post" : "/register?role=owner"}>
            <Button size="sm" className="bg-primary hover:bg-primary-dark shadow-lg shadow-primary/20 rounded-xl px-6 h-11 font-bold group transition-all active:scale-95 text-white">
              <PlusCircle className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform" />
              List Property
            </Button>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-600 hover:text-primary transition-colors"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="absolute top-[calc(100%+12px)] left-0 right-0 mx-4 bg-white/90 backdrop-blur-xl border border-white/20 rounded-[2rem] shadow-2xl md:hidden p-8 space-y-6"
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "block text-xl font-black transition-all",
                  pathname === link.href ? "text-primary translate-x-2" : "text-slate-600 hover:translate-x-2"
                )}
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-6 flex flex-col space-y-4 border-t border-slate-100">
              {user ? (
                <Link href="/buyer/dashboard" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" className="w-full justify-center h-14 rounded-2xl font-bold border-slate-200">
                    Dashboard
                  </Button>
                </Link>
              ) : (
                <Link href="/login" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" className="w-full justify-center h-14 rounded-2xl font-bold border-slate-200">
                    Sign In
                  </Button>
                </Link>
              )}
              <Link href="/owner/post" onClick={() => setIsOpen(false)}>
                <Button className="w-full justify-center h-14 rounded-2xl font-black bg-primary hover:bg-primary-dark shadow-xl shadow-primary/20">
                  <PlusCircle className="w-5 h-5 mr-3" />
                  List Property
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
