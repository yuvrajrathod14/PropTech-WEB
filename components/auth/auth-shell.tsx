"use client"

import Link from "next/link"
import { Home, CheckCircle2, ShieldCheck, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

interface AuthShellProps {
  children: React.ReactNode
  heading: string
  subheading?: string
  illustration?: React.ReactNode
}

export function AuthShell({ 
  children, 
  heading, 
  illustration 
}: AuthShellProps) {
  return (
    <div className="flex min-h-screen bg-white overflow-hidden">
      {/* Left Column (40%) - Desktop Only */}
      <div className="hidden lg:flex lg:w-[40%] flex-col relative bg-gradient-to-br from-[#1A56DB] to-[#1341A8] p-12 text-white overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-20%] left-[-20%] w-[600px] h-[600px] bg-primary-dark/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <Home className="text-[#1A56DB] w-6 h-6" />
            </div>
            <span className="text-3xl font-black tracking-tight text-white italic">Prop<span className="text-white/80">Tech</span></span>
          </Link>

          <div className="mt-20">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-black leading-tight mb-8"
            >
              {heading}
            </motion.h1>
            
            <div className="space-y-6 mt-12">
              <TrustPoint 
                icon={<Home className="w-6 h-6" />}
                text="10,000+ properties available"
                delay={0.1}
              />
              <TrustPoint 
                icon={<CheckCircle2 className="w-6 h-6" />}
                text="Verified listings only"
                delay={0.2}
              />
              <TrustPoint 
                icon={<ShieldCheck className="w-6 h-6" />}
                text="Secure payments via Razorpay"
                delay={0.3}
              />
            </div>
          </div>
        </div>

        <div className="mt-auto relative z-10">
          {illustration || (
            <div className="relative h-64 w-full">
               <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="absolute inset-0 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20 p-6 flex flex-col justify-end overflow-hidden group hover:bg-white/15 transition-colors"
               >
                 <div className="absolute top-0 right-0 p-4">
                   <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                     <ArrowRight className="w-6 h-6 text-white/40" />
                   </div>
                 </div>
                 <h3 className="text-xl font-bold mb-2">Build Your Future</h3>
                 <p className="text-white/60 text-sm">Join India&apos;s most trusted real estate ecosystem today.</p>
               </motion.div>
            </div>
          )}
        </div>
      </div>

      {/* Right Column (60% or 100% on Mobile) */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 lg:p-24 bg-slate-50/50">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-[440px] space-y-8"
        >
          <div className="lg:hidden mb-8">
             <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg">
                <Home className="text-white w-6 h-6" />
              </div>
              <span className="text-3xl font-black tracking-tight text-slate-900">Prop<span className="text-primary italic">Tech</span></span>
            </Link>
          </div>
          
          <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100">
            {children}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

function TrustPoint({ icon, text, delay }: { icon: React.ReactNode, text: string, delay: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className="flex items-center gap-4 group"
    >
      <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center group-hover:bg-white/20 transition-colors border border-white/10">
        {icon}
      </div>
      <p className="text-lg font-bold text-white/90">{text}</p>
    </motion.div>
  )
}
