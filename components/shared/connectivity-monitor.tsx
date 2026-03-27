"use client"

import { useEffect, useState } from "react"
import { Wifi, WifiOff } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

export function ConnectivityMonitor() {
  const [isOnline, setIsOnline] = useState(true)
  const [showNotification, setShowNotification] = useState(false)

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      setShowNotification(true)
      setTimeout(() => setShowNotification(false), 5000)
    }

    const handleOffline = () => {
      setIsOnline(false)
      setShowNotification(true)
    }

    if (typeof window !== 'undefined') {
      setIsOnline(navigator.onLine)
      window.addEventListener('online', handleOnline)
      window.addEventListener('offline', handleOffline)
    }

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return (
    <AnimatePresence>
      {showNotification && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          className={cn(
            "fixed top-4 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-3 px-6 py-3 rounded-2xl shadow-2xl border backdrop-blur-md",
            isOnline 
              ? "bg-emerald-50/90 border-emerald-100 text-emerald-800" 
              : "bg-amber-50/90 border-amber-100 text-amber-800"
          )}
        >
          {isOnline ? (
            <>
              <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <Wifi className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-black uppercase tracking-widest">Back Online</span>
                <span className="text-[10px] font-bold opacity-70">Connection restored successfully</span>
              </div>
            </>
          ) : (
            <>
              <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center">
                <WifiOff className="w-4 h-4 text-amber-600" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-black uppercase tracking-widest">Offline Mode</span>
                <span className="text-[10px] font-bold opacity-70">Using cached data where available</span>
              </div>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
