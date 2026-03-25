"use client"

import { ShieldAlert, LogOut, MessageCircle, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function BlockedPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-500/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]" />

      <div className="max-w-md w-full space-y-10 text-center relative z-10">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-[40px] bg-red-500/10 border border-red-500/20 mb-4 animate-bounce">
          <ShieldAlert className="w-12 h-12 text-red-500" />
        </div>

        <div className="space-y-4">
          <h1 className="text-5xl font-black text-white tracking-tighter italic">Access Restricted</h1>
          <p className="text-slate-400 font-medium text-lg leading-relaxed">
            Your account has been restricted due to a violation of our <span className="text-white font-bold underline underline-offset-4 decoration-primary">Community Guidelines</span> or suspicious activity.
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-md rounded-[32px] p-8 border border-white/10 text-left space-y-6 shadow-2xl">
            <div className="space-y-1">
                <p className="text-[10px] font-black text-red-400 uppercase tracking-[0.2em]">Reason for Action</p>
                <p className="text-white font-bold text-sm italic">Incomplete verification or reported behavior.</p>
            </div>
            <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Restricted Since</p>
                <p className="text-white/80 font-bold text-sm">March 25, 2024</p>
            </div>
            
            <div className="pt-4 border-t border-white/5 space-y-4">
                <p className="text-slate-500 text-xs font-medium leading-relaxed italic">
                   If you believe this is a mistake, you can request an appeal by contacting our support team.
                </p>
                <Button className="w-full h-14 bg-white text-slate-950 hover:bg-slate-100 rounded-2xl font-black italic shadow-xl shadow-white/5 transition-all active:scale-95">
                    <MessageCircle className="w-5 h-5 mr-3 fill-slate-950" />
                    Contact Support
                </Button>
            </div>
        </div>

        <div className="flex flex-col gap-4">
            <Button variant="ghost" asChild className="text-slate-500 hover:text-white font-black uppercase text-[10px] tracking-widest gap-2">
                <Link href="/">
                    <ArrowLeft className="w-4 h-4" /> Back to Home Page
                </Link>
            </Button>
            <div className="flex items-center justify-center gap-2 text-white/20">
                <LogOut className="w-4 h-4" />
                <span className="text-[9px] font-black tracking-widest uppercase">Logout Securely</span>
            </div>
        </div>
      </div>
      
      <div className="mt-20">
          <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] italic leading-none">PROPTECH SAFETY CORE • VERSION 2.0</p>
      </div>
    </div>
  )
}
