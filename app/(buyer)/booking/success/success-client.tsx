"use client"

import { useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import confetti from "canvas-confetti"
import { 
  CheckCircle2, 
  ArrowRight, 
  Download, 
  MessageSquare, 
  Calendar,
  Check
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatIndianPrice } from "@/lib/utils/formatPrice"
import { format } from "date-fns"

export function BookingSuccessClient({ booking }: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
  useEffect(() => {
    const duration = 5 * 1000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min

    const interval: any = setInterval(function() { // eslint-disable-line @typescript-eslint/no-explicit-any
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      const particleCount = 50 * (timeLeft / duration)
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } })
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } })
    }, 250)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 pt-24 pb-12">
      <div className="max-w-2xl w-full space-y-8">
        {/* Success Header */}
        <div className="text-center space-y-4">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 10, stiffness: 100 }}
            className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-emerald-200"
          >
            <Check className="w-12 h-12 text-white" strokeWidth={4} />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-2"
          >
            <h1 className="text-4xl font-black text-slate-900 tracking-tight italic">Booking Confirmed! 🎉</h1>
            <p className="text-slate-500 font-medium text-lg">Your token payment was successful.</p>
          </motion.div>
        </div>

        {/* Booking Summary Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-[40px] border border-slate-100 p-8 shadow-xl shadow-slate-200/50 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-full -mr-16 -mt-16 opacity-50" />
          
          <div className="relative flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
            <div className="relative w-32 h-32 md:w-40 md:h-40 shrink-0">
              <Image 
                src={booking.properties?.images?.[0] || "/placeholder-property.jpg"} 
                alt={booking.properties?.title}
                fill
                className="object-cover rounded-3xl"
              />
            </div>
            
            <div className="flex-1 space-y-4 w-full">
              <div>
                <h3 className="text-2xl font-black text-slate-900 leading-tight mb-2">
                  {booking.properties?.title}
                </h3>
                <p className="text-slate-500 font-bold text-sm uppercase tracking-wider">
                  {booking.properties?.location}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-2xl p-4">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 leading-none">Paid Amount</p>
                  <p className="text-xl font-black text-primary">{formatIndianPrice(booking.total_amount)}</p>
                </div>
                <div className="bg-slate-50 rounded-2xl p-4">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 leading-none">Status</p>
                  <div className="flex items-center gap-1.5 text-emerald-600">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-sm font-black uppercase">Success</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center text-slate-500">
                  <span className="font-medium">Transaction ID</span>
                  <span className="font-bold text-slate-900 font-mono">{booking.razorpay_payment_id}</span>
                </div>
                <div className="flex justify-between items-center text-slate-500">
                  <span className="font-medium">Paid On</span>
                  <span className="font-bold text-slate-900">{format(new Date(booking.created_at), "PPP p")}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <Button 
            className="bg-slate-900 hover:bg-slate-800 text-white font-black h-14 rounded-2xl shadow-lg shadow-slate-200"
            asChild
          >
            <Link href={`/api/payment/receipt/${booking.id}`}>
              <Download className="w-5 h-5 mr-2" /> Download Receipt
            </Link>
          </Button>
          <Button 
            variant="outline"
            className="border-slate-200 text-slate-600 font-black h-14 rounded-2xl hover:bg-slate-100"
            asChild
          >
            <Link href="/buyer/chat">
              <MessageSquare className="w-5 h-5 mr-2" /> Message Owner
            </Link>
          </Button>
          <Button 
            variant="ghost"
            className="md:col-span-2 text-primary font-black h-14 rounded-2xl hover:bg-primary/5 group"
            asChild
          >
            <Link href="/search">
              Browse More Properties <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </motion.div>

        {/* What's Next Timeline */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white rounded-[40px] border border-slate-100 p-10 shadow-sm"
        >
          <h4 className="text-xl font-black text-slate-900 mb-8 tracking-tight">What Happens Next?</h4>
          <div className="space-y-8 relative">
             <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-slate-100" />
             
             <div className="relative flex gap-6">
                <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white z-10 shrink-0">
                  <Check className="w-4 h-4" strokeWidth={3} />
                </div>
                <div>
                  <p className="font-black text-slate-900">Token Amount Paid</p>
                  <p className="text-sm text-slate-500 font-medium">The property is now reserved for you.</p>
                </div>
             </div>

             <div className="relative flex gap-6">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white z-10 shrink-0">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-black text-slate-900">Owner Contact</p>
                  <p className="text-sm text-slate-500 font-medium">The owner will reach out to you within 24 hours to schedule a site visit.</p>
                </div>
             </div>

             <div className="relative flex gap-6">
                <div className="w-8 h-8 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center text-slate-400 z-10 shrink-0">
                  <ArrowRight className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-slate-500">Agreement & Full Payment</p>
                  <p className="text-sm text-slate-400 font-medium">Once satisfied, sign the legal agreement and complete the remaining payment offline.</p>
                </div>
             </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
