"use client"

import { useState } from "react"
import { 
  CheckCircle2, 
  Eye, 
  Target, 
  MessageSquare, 
  ShieldCheck,
  CreditCard,
  Lock
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const plans = [
    {
        name: "Quick Boost",
        price: 999,
        duration: "7 Days",
        tagline: "Perfect for quick sales",
        features: [
            "Top of search for 7 days",
            "3x more visibility",
            "Direct WhatsApp enquiries",
            "Standard Support",
        ],
        color: "bg-slate-50",
        btnColor: "bg-slate-900",
        popular: false
    },
    {
        name: "Premium Featured",
        price: 2499,
        duration: "15 Days",
        tagline: "Most popular choice",
        features: [
            "Featured badge on listing",
            "5x more visibility",
            "Top of search in locality",
            "Weekly performance report",
            "Priority Support",
        ],
        color: "bg-primary/5",
        btnColor: "bg-primary",
        popular: true
    },
    {
        name: "Enterprise Pro",
        price: 4999,
        duration: "30 Days",
        tagline: "Maximum exposure",
        features: [
            "Featured in 'Recommended'",
            "10x more visibility",
            "Social Media Promotion",
            "Professional Photography*",
            "24/7 Dedicated Support",
        ],
        color: "bg-slate-900 text-white",
        btnColor: "bg-white text-slate-900",
        popular: false
    }
]

export default function BoostPage() {
  const [selectedPlan, setSelectedPlan] = useState<number | null>(1)

  return (
    <div className="space-y-12 pb-20">
      {/* Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto pt-8">
        <Badge className="bg-primary/10 text-primary border-none rounded-full px-6 py-2 font-black text-xs uppercase tracking-widest shadow-sm">
            PropTech Boost
        </Badge>
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight italic">
            Sell Your Property <span className="text-primary underline decoration-amber-400 decoration-4 underline-offset-8">5x Faster</span>
        </h1>
        <p className="text-slate-500 font-medium text-lg">
            Choose a premium plan to increase your property visibility and get verified leads instantly.
        </p>
      </div>

      {/* Plans Grid */}
      <div className="grid md:grid-cols-3 gap-8">
        {plans.map((plan, i) => (
            <Card 
                key={i} 
                className={cn(
                    "border-none shadow-xl rounded-[40px] overflow-hidden transition-all duration-500 relative group cursor-pointer",
                    plan.color,
                    selectedPlan === i ? "ring-4 ring-primary ring-offset-8 scale-105" : "hover:scale-[1.02]"
                )}
                onClick={() => setSelectedPlan(i)}
            >
                {plan.popular && (
                    <div className="absolute top-6 right-6 bg-amber-400 text-amber-900 text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg">
                        Best Value
                    </div>
                )}

                <div className="p-10 space-y-8">
                    <div className="space-y-2">
                        <h3 className="text-2xl font-black tracking-tight italic">{plan.name}</h3>
                        <p className={cn("text-xs font-bold uppercase tracking-widest", plan.popular ? "text-primary" : "text-slate-400")}>
                            {plan.tagline}
                        </p>
                    </div>

                    <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-black tracking-tighter italic">₹{plan.price.toLocaleString()}</span>
                        <span className="text-xs font-black uppercase tracking-widest opacity-60">/ {plan.duration}</span>
                    </div>

                    <Separator className={cn("opacity-10", plan.name === "Enterprise Pro" ? "bg-white" : "bg-black")} />

                    <div className="space-y-5">
                        {plan.features.map((f, idx) => (
                            <div key={idx} className="flex items-center gap-4">
                                <CheckCircle2 className={cn("w-5 h-5 shrink-0", plan.popular ? "text-primary" : "text-emerald-500")} />
                                <span className="text-sm font-bold opacity-80">{f}</span>
                            </div>
                        ))}
                    </div>

                    <Button className={cn(
                        "w-full h-14 rounded-2xl font-black text-lg transition-all shadow-xl",
                        plan.btnColor,
                        plan.name === "Quick Boost" && "hover:bg-slate-800 text-white",
                        plan.name === "Premium Featured" && "shadow-primary/20",
                        plan.name === "Enterprise Pro" && "hover:bg-slate-100"
                    )}>
                        Select Plan
                    </Button>
                </div>
            </Card>
        ))}
      </div>

      {/* Why Boost Section */}
      <div className="bg-white rounded-[48px] p-10 md:p-16 border border-slate-100 shadow-2xl shadow-slate-200/50">
           <div className="grid md:grid-cols-2 gap-16 items-center">
                <div className="space-y-10">
                    <div className="space-y-4">
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight italic">Why Boost Your Listing?</h2>
                        <p className="text-slate-500 font-medium">Data shows that boosted listings perform significantly better across all key metrics.</p>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-8">
                        {[
                            { label: "Reach", val: "5x More", desc: "Buyers daily", icon: Eye },
                            { label: "Leads", val: "3x More", desc: "Phone enquiries", icon: MessageSquare },
                            { label: "In-Search", val: "Top #1", desc: "In your locality", icon: Target },
                            { label: "Trust", val: "Verified", desc: "Premium badge", icon: ShieldCheck },
                        ].map((s, i) => (
                            <div key={i} className="space-y-2">
                                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-primary">
                                    <s.icon className="w-6 h-6" />
                                </div>
                                <h4 className="text-xl font-black text-slate-900">{s.val}</h4>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full" />
                    <Card className="relative border-none shadow-2xl rounded-[40px] p-8 space-y-8 bg-slate-900 text-white overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <CreditCard className="w-24 h-24" />
                        </div>
                        <h3 className="text-2xl font-black italic tracking-tight">Order Summary</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/10">
                                <div>
                                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Plan Selected</p>
                                    <p className="text-lg font-black italic text-primary">{plans[selectedPlan || 1].name}</p>
                                </div>
                                <Button variant="ghost" className="text-white font-black text-xs underline decoration-primary decoration-2 underline-offset-4">Change</Button>
                            </div>
                            
                            <Separator className="bg-white/10" />

                            <div className="space-y-3">
                                <div className="flex justify-between text-sm font-bold text-slate-400">
                                    <span>Base Price</span>
                                    <span>₹{plans[selectedPlan || 1].price}</span>
                                </div>
                                <div className="flex justify-between text-sm font-bold text-slate-400">
                                    <span>GST (18%)</span>
                                    <span>₹{Math.round(plans[selectedPlan || 1].price * 0.18)}</span>
                                </div>
                                <Separator className="bg-white/10 border-dashed" />
                                <div className="flex justify-between text-2xl font-black italic">
                                    <span>Total Payable</span>
                                    <span className="text-primary">₹{Math.round(plans[selectedPlan || 1].price * 1.18).toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                             <Button className="w-full h-16 bg-white text-slate-900 hover:bg-slate-100 rounded-3xl font-black text-lg gap-3">
                                <CreditCard className="w-6 h-6" />
                                Pay via Razorpay
                             </Button>
                             <div className="flex items-center justify-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                <Lock className="w-3.5 h-3.5" />
                                256-bit Secure SSL Payment
                             </div>
                        </div>
                    </Card>
                </div>
           </div>
      </div>
    </div>
  )
}
