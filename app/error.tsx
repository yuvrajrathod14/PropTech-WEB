"use client"

import { useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { AlertTriangle, RotateCcw, Home } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Optionally log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-8">
        <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           className="w-24 h-24 bg-red-100 rounded-[32px] flex items-center justify-center mx-auto text-red-600 shadow-xl shadow-red-100"
        >
          <AlertTriangle className="w-12 h-12" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          <h1 className="text-4xl font-black text-slate-900 italic tracking-tight">Something went wrong!</h1>
          <p className="text-slate-500 font-medium">
            An unexpected error occurred while loading this page. Our team has been notified.
          </p>
          {error.digest && (
             <p className="text-[10px] text-slate-300 font-mono uppercase tracking-widest bg-slate-100 py-1 rounded-full px-3 inline-block">
               Error ID: {error.digest}
             </p>
          )}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col gap-4"
        >
          <Button 
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black h-16 rounded-2xl shadow-xl shadow-slate-200 text-lg"
            onClick={() => reset()}
          >
            <RotateCcw className="w-5 h-5 mr-3" /> Try Again
          </Button>
          <Button 
            variant="outline" 
            className="w-full border-slate-200 text-slate-600 font-black h-14 rounded-2xl hover:bg-slate-100"
            asChild
          >
            <Link href="/">
              <Home className="w-5 h-5 mr-3" /> Return to Homepage
            </Link>
          </Button>
        </motion.div>
      </div>
    </div>
  )
}
