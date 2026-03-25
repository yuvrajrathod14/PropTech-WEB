"use client"

import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { CheckCircle2, ArrowRight, Share2, Eye, LayoutDashboard, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function PostStep7() {
  const router = useRouter()

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center text-center py-20 space-y-10"
    >
      <div className="relative">
        <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.2 }}
            className="w-32 h-32 rounded-[40px] bg-emerald-500 text-white flex items-center justify-center shadow-2xl shadow-emerald-200 relative z-10"
        >
            <CheckCircle2 className="w-16 h-16" />
        </motion.div>
        <motion.div 
            animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.1, 0.3]
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute inset-0 bg-emerald-400 rounded-full blur-3xl -z-10"
        />
      </div>

      <div className="space-y-4 max-w-lg">
        <h2 className="text-4xl font-black text-slate-900 tracking-tight">Property Published!</h2>
        <p className="text-slate-500 font-medium text-lg leading-relaxed">
          Your listing is now live and being indexed by our AI engine. Most owners receive their first enquiry within <span className="text-primary font-bold">24 hours</span>.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md">
        <Button variant="outline" className="h-16 rounded-2xl border-slate-100 font-black gap-2 hover:bg-slate-50 transition-all shadow-sm">
            <Share2 className="w-5 h-5 text-slate-400" />
            Share Listing
        </Button>
        <Button variant="outline" className="h-16 rounded-2xl border-slate-100 font-black gap-2 hover:bg-slate-50 transition-all shadow-sm">
            <Eye className="w-5 h-5 text-slate-400" />
            View Live
        </Button>
      </div>

      <div className="w-full max-w-xl bg-slate-900 rounded-[40px] p-8 mt-10 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-bl-full" />
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 text-left">
            <div className="w-20 h-20 rounded-3xl bg-primary flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
                <Sparkles className="w-10 h-10 text-white" />
            </div>
            <div className="space-y-2 flex-1">
                <h4 className="text-xl font-black text-white italic">Boost your visibility?</h4>
                <p className="text-slate-400 text-sm leading-relaxed">Get <span className="text-white font-bold">10x more leads</span> by featuring your property at the top of search results for 30 days.</p>
                <Button className="mt-4 bg-white text-slate-900 hover:bg-slate-100 font-black px-8 rounded-xl h-12 gap-2 shadow-xl shadow-white/5">
                    Explore Premium Plans
                    <ArrowRight className="w-4 h-4" />
                </Button>
            </div>
        </div>
      </div>

      <Link href="/owner/dashboard" className="text-slate-400 font-black text-xs uppercase tracking-widest hover:text-primary transition-colors flex items-center gap-2">
        <LayoutDashboard className="w-4 h-4" />
        Back to Dashboard
      </Link>
    </motion.div>
  )
}
