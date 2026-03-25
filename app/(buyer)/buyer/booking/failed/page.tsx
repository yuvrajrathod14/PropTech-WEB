"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Suspense } from "react"
import { 
  RotateCcw, 
  AlertTriangle,
  ArrowLeft,
  X
} from "lucide-react"
import { Button } from "@/components/ui/button"

function FailedContent() {
  const searchParams = useSearchParams()
  const reason = searchParams.get("reason")

  const getErrorMessage = () => {
    switch (reason) {
      case "PAYMENT_CANCELLED":
        return "You cancelled the payment process. No money was deducted."
      case "BAD_REQUEST_ERROR":
        return "The payment could not be processed due to a technical issue."
      case "verification_failed":
        return "We couldn't verify your payment signature. Please contact support."
      default:
        return "Something went wrong with your payment. Please try again."
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 pt-24 pb-12">
      <div className="max-w-md w-full space-y-8 text-center">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", damping: 10, stiffness: 100 }}
          className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-red-200"
        >
          <X className="w-12 h-12 text-white" strokeWidth={4} />
        </motion.div>

        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.2 }}
           className="space-y-4"
        >
          <h1 className="text-3xl font-black text-slate-900 tracking-tight italic">Payment Failed</h1>
          <div className="p-6 bg-red-50 rounded-[32px] border border-red-100 flex items-start gap-4 text-left">
            <AlertTriangle className="w-6 h-6 text-red-500 shrink-0 mt-1" />
            <p className="text-red-900 font-bold text-sm leading-relaxed">
              {getErrorMessage()}
            </p>
          </div>
        </motion.div>

        <motion.div 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.4 }}
           className="space-y-4"
        >
          <Button 
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black h-14 rounded-2xl shadow-lg shadow-slate-200"
            onClick={() => window.history.back()}
          >
            <RotateCcw className="w-5 h-5 mr-2" /> Try Again
          </Button>
          <Button 
            variant="outline"
            className="w-full border-slate-200 text-slate-600 font-black h-14 rounded-2xl hover:bg-slate-100"
            asChild
          >
            <Link href="mailto:support@proptech.com">
               Contact Support
            </Link>
          </Button>
          <Link href="/search" className="inline-flex items-center text-slate-400 font-bold text-sm hover:text-slate-900 transition-colors pt-4">
            <ArrowLeft className="w-4 h-4 mr-2" /> Return to Search
          </Link>
        </motion.div>
      </div>
    </div>
  )
}

export default function BookingFailedPage() {
  return (
    <Suspense fallback={
       <div className="min-h-screen bg-slate-50 flex items-center justify-center">
         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
       </div>
    }>
      <FailedContent />
    </Suspense>
  )
}
