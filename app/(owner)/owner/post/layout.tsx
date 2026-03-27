"use client"

import { usePathname } from "next/navigation"
import { Building2, MapPin, LayoutGrid, Camera, IndianRupee, CheckCircle2, Info } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

const steps = [
  { id: 1, title: "Type", icon: Building2, path: "/owner/post" },
  { id: 2, title: "Location", icon: MapPin, path: "/owner/post/location" },
  { id: 3, title: "Details", icon: LayoutGrid, path: "/owner/post/details" },
  { id: 4, title: "Photos", icon: Camera, path: "/owner/post/media" },
  { id: 5, title: "Price", icon: IndianRupee, path: "/owner/post/pricing" },
  { id: 6, title: "Preview", icon: CheckCircle2, path: "/owner/post/preview" },
]

export default function PostPropertyLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const currentStepIndex = steps.findIndex(step => step.path === pathname) + 1
  const currentStep = currentStepIndex > 0 ? currentStepIndex : 1

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-32 md:pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Post Your Property</h1>
          <p className="text-slate-500 font-medium text-lg">Detailed information helps you get 3x more enquiries.</p>
        </div>
        <div className="flex items-center gap-2">
            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Draft Saved</span>
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        </div>
      </div>

      {/* Stepper */}
      <div className="relative flex justify-between items-center px-4 max-w-3xl mx-auto md:px-0">
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-100 -z-10 -translate-y-1/2 hidden md:block" />
        {steps.map((step) => (
          <div key={step.id} className={cn(
            "relative flex flex-col items-center gap-2",
            currentStep !== step.id && "hidden md:flex"
          )}>
            <div className={cn(
              "w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center transition-all duration-500 border-4 border-white shadow-xl",
              currentStep === step.id ? "bg-primary text-white scale-110 shadow-primary/20 ring-4 ring-primary/5" : 
              currentStep > step.id ? "bg-emerald-500 text-white" : "bg-white text-slate-400"
            )}>
              {currentStep > step.id ? <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6" /> : <step.icon className="w-4 h-4 md:w-5 md:h-5" />}
            </div>
            <span className={cn(
              "text-[8px] md:text-[10px] font-black uppercase tracking-widest transition-colors",
              currentStep === step.id ? "text-primary" : "text-slate-400"
            )}>
              {step.title}
              <span className="md:hidden ml-1 opacity-50">• Step {currentStep} of {steps.length}</span>
            </span>
          </div>
        ))}
        {/* Simple Progress Bar for Mobile */}
        <div className="md:hidden absolute -bottom-4 left-4 right-4 h-1 bg-slate-100 rounded-full overflow-hidden">
            <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${(currentStep / steps.length) * 100}%` }}
                className="h-full bg-primary"
            />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        <div className="lg:col-span-3">
          <Card className="border-none shadow-sm rounded-[32px] p-6 md:p-10 min-h-[500px] md:min-h-[600px] flex flex-col">
            {children}
          </Card>
        </div>

        {/* Sidebar Tips */}
        <div className="space-y-8">
            <div className="bg-slate-900 text-white rounded-[40px] p-8 space-y-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-bl-full" />
                <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center">
                    <Info className="w-6 h-6" />
                </div>
                <div className="space-y-2">
                    <h4 className="text-xl font-black italic">Speedy Listing Tip</h4>
                    <p className="text-slate-400 text-sm font-medium leading-relaxed">Verified owners who upload a site map or floor plan receive <span className="text-white font-bold">45% higher enquiry rates</span> from genuine buyers.</p>
                </div>
                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Need Help?</span>
                    <Button variant="link" className="text-primary font-bold p-0">Contact Support</Button>
                </div>
            </div>

            <div className="bg-white rounded-[40px] p-8 space-y-6 shadow-sm border border-slate-50">
                <div className="flex items-center justify-between">
                    <h4 className="font-black text-slate-900">Your Progress</h4>
                    <span className="text-primary font-black text-sm">{Math.round((currentStep / steps.length) * 100)}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(currentStep / steps.length) * 100}%` }}
                        className="h-full bg-primary"
                    />
                </div>
                <ul className="space-y-4">
                    {steps.map((s) => (
                        <li key={s.id} className="flex items-center gap-3">
                            <div className={cn(
                                "w-6 h-6 rounded-lg flex items-center justify-center transition-colors",
                                currentStep > s.id ? "bg-emerald-100 text-emerald-600" : 
                                currentStep === s.id ? "bg-primary/10 text-primary" : "bg-slate-50 text-slate-300"
                            )}>
                                {currentStep > s.id ? <CheckCircle2 className="w-4 h-4" /> : <s.icon className="w-3.5 h-3.5" />}
                            </div>
                            <span className={cn(
                                "text-xs font-bold",
                                currentStep >= s.id ? "text-slate-900" : "text-slate-400"
                            )}>
                                {s.title}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
      </div>
    </div>
  )
}
