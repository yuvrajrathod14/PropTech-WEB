"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 400) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener("scroll", toggleVisibility)
    return () => window.removeEventListener("scroll", toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    })
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          className="fixed bottom-8 right-8 z-[90]"
        >
          <Button
            onClick={scrollToTop}
            className="w-14 h-14 rounded-2xl bg-white text-slate-900 border-2 border-slate-100 shadow-2xl shadow-slate-200 hover:bg-blue-600 hover:text-white transition-all group active:scale-95"
          >
            <ChevronUp className="w-6 h-6 group-hover:animate-bounce" />
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
