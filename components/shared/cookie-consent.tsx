"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Cookie
} from "lucide-react"
import { Button } from "@/components/ui/button"

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem("proptech-cookie-consent")
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 2000)
      return () => clearTimeout(timer)
    }
  }, [])

  const accept = () => {
    localStorage.setItem("proptech-cookie-consent", "true")
    setIsVisible(false)
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          className="fixed bottom-6 left-6 right-6 md:left-auto md:right-8 md:max-w-md z-[100]"
        >
          <div className="bg-slate-900 rounded-[32px] p-6 shadow-2xl shadow-slate-900/40 text-white border border-white/10 relative overflow-hidden group">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 blur-[50px] -translate-y-1/2 translate-x-1/2 group-hover:bg-blue-600/30 transition-colors"></div>
            
            <div className="relative z-10">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-blue-400 shrink-0">
                  <Cookie className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-lg font-black italic tracking-tight mb-1">Cookie Experience</h4>
                  <p className="text-slate-400 text-sm font-medium leading-relaxed">
                    We use cookies to enhance your experience, analyze performance, and show you listings tailored to your neighborhood.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button 
                  onClick={accept}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-black h-12 rounded-xl text-sm"
                >
                  Accept All
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setIsVisible(false)}
                  className="flex-1 border-white/10 text-white hover:bg-white/5 font-black h-12 rounded-xl text-sm"
                >
                  Configure
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
