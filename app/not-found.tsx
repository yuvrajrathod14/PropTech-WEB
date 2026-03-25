"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Home, Search, ArrowLeft, Ghost } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-8">
        <motion.div
           initial={{ opacity: 0, y: -20 }}
           animate={{ opacity: 1, y: 0 }}
           className="relative inline-block"
        >
          <div className="w-48 h-48 bg-blue-100 rounded-full flex items-center justify-center mx-auto text-blue-600 shadow-2xl shadow-blue-200">
            <Ghost className="w-24 h-24 animate-bounce" />
          </div>
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute -top-4 -right-4 w-12 h-12 bg-white rounded-2xl shadow-lg flex items-center justify-center text-slate-400"
          >
            <Home className="w-6 h-6" />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 italic tracking-tight italic">404 - Lost at Home?</h1>
          <p className="text-xl text-slate-500 font-medium">
            Looks like this property doesn&apos;t exist or has been moved to a new neighborhood!
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col gap-4"
        >
          <Button 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black h-16 rounded-2xl shadow-xl shadow-blue-100 text-lg"
            asChild
          >
            <Link href="/search">
              <Search className="w-5 h-5 mr-3" /> Browse All Properties
            </Link>
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

        <Link 
          href="javascript:history.back()" 
          className="inline-flex items-center text-slate-400 font-bold text-sm hover:text-slate-900 transition-colors pt-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Go back to previous page
        </Link>
      </div>
    </div>
  )
}
