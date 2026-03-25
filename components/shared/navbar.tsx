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
} from "lucide-react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Search", href: "/search" },
  { name: "How it Works", href: "/how-it-works" },
  { name: "About", href: "/about" },
]

export function Navbar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { user, loading } = useAuth()
  const supabase = createClient()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

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
                <div className="flex items-center space-x-2">
                  <Link href="/buyer/dashboard">
                    <Button variant="ghost" size="sm" className="font-bold text-slate-600 hover:text-primary rounded-xl">
                      Dashboard
                    </Button>
                  </Link>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleLogout}
                    className="font-bold text-slate-600 hover:text-destructive rounded-xl"
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="font-bold text-slate-600 hover:text-primary rounded-xl">
                    Sign In
                  </Button>
                </Link>
              )}
            </>
          )}
          <Link href="/owner/post">
            <Button size="sm" className="bg-primary hover:bg-primary-dark shadow-lg shadow-primary/20 rounded-xl px-6 h-11 font-bold">
              <PlusCircle className="w-4 h-4 mr-2" />
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
