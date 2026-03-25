"use client"

import { useParams, useRouter } from "next/navigation"
import { 
  ArrowLeft, 
  Zap, 
  Check, 
  Sparkles, 
  TrendingUp, 
  Eye, 
  ShieldCheck,
  CreditCard,
  ArrowRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const plans = [
  { 
    id: "basic", 
    name: "Standard Boost", 
    price: "₹499", 
    duration: "3 Days", 
    features: ["Top 10 Search Rank", "Basic Analytics", "Highlight Label"],
    color: "primary"
  },
  { 
    id: "pro", 
    name: "Professional", 
    price: "₹999", 
    duration: "7 Days", 
    features: ["Top 3 Search Rank", "Advanced Heatmaps", "SMS to Leads", "Featured Badge"],
    recommended: true,
    color: "slate-900"
  },
  { 
    id: "elite", 
    name: "Elite Reach", 
    price: "₹2,499", 
    duration: "1 Month", 
    features: ["Home Page Feature", "Priority Support", "Video Social Boost", "Verified Pro Status"],
    color: "primary"
  }
]

export default function ListingBoostPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      <div className="flex flex-col items-center text-center space-y-4 max-w-2xl mx-auto">
        <Button variant="ghost" onClick={() => router.back()} className="hover:bg-transparent text-slate-400 font-bold gap-2">
          <ArrowLeft className="w-4 h-4" /> Cancel & Return
        </Button>
        <div className="w-20 h-20 rounded-3xl bg-primary flex items-center justify-center shadow-2xl shadow-primary/20 animate-pulse">
            <Zap className="w-10 h-10 text-white fill-white" />
        </div>
        <h1 className="text-5xl font-black text-slate-900 tracking-tight italic">Boost Your Reach</h1>
        <p className="text-slate-500 font-medium text-lg leading-relaxed">
            Get your property in front of the right buyers. Boosted listings receive up to <span className="text-primary font-black">5x more enquiries</span> on average.
        </p>
      </div>

      {/* Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
            <Card key={plan.id} className={cn(
                "border-none shadow-sm rounded-[48px] p-10 flex flex-col items-center text-center space-y-8 relative overflow-hidden transition-all hover:shadow-2xl hover:-translate-y-2",
                plan.recommended ? "bg-slate-900 text-white scale-105 z-10" : "bg-white"
            )}>
                {plan.recommended && (
                    <div className="absolute top-6 right-6">
                        <Badge className="bg-primary text-white border-none font-black italic px-4 py-1.5 rounded-full shadow-lg">RECOMMENDED</Badge>
                    </div>
                )}
                
                <div className="space-y-2">
                    <p className={cn("text-xs font-black uppercase tracking-widest", plan.recommended ? "text-primary" : "text-slate-400")}>{plan.name}</p>
                    <div className="flex items-baseline justify-center gap-1">
                        <h2 className="text-5xl font-black tracking-tighter">{plan.price}</h2>
                        <span className="text-sm font-bold opacity-40">/ {plan.duration}</span>
                    </div>
                </div>

                <div className="w-full space-y-4">
                    {plan.features.map((feature, i) => (
                        <div key={i} className="flex items-center gap-3 text-sm font-bold">
                            <div className={cn("w-5 h-5 rounded-full flex items-center justify-center shrink-0", plan.recommended ? "bg-primary/20 text-primary" : "bg-primary/5 text-primary")}>
                                <Check className="w-3 h-3 stroke-[4]" />
                            </div>
                            <span className={plan.recommended ? "text-white/80" : "text-slate-600"}>{feature}</span>
                        </div>
                    ))}
                </div>

                <div className="pt-4 w-full">
                    <Button className={cn(
                        "w-full h-16 rounded-[24px] font-black text-lg transition-all active:scale-95 italic shadow-xl group",
                        plan.recommended ? "bg-primary text-white hover:bg-primary-dark shadow-primary/20" : "bg-slate-900 text-white hover:bg-slate-800"
                    )}>
                        Select Plan
                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                </div>
            </Card>
        ))}
      </div>

      {/* Features Detail */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-12 border-t border-slate-100">
          <div className="flex gap-6 items-start">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center shrink-0"><Eye className="w-6 h-6 text-slate-400" /></div>
              <div className="space-y-1">
                  <h4 className="font-black text-slate-900 italic tracking-tight">Maximum Visibility</h4>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">Appear at the top of search results and category pages instantly.</p>
              </div>
          </div>
          <div className="flex gap-6 items-start">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center shrink-0"><ShieldCheck className="w-6 h-6 text-slate-400" /></div>
              <div className="space-y-1">
                  <h4 className="font-black text-slate-900 italic tracking-tight">Verified Priority</h4>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">Boosted listings are prioritised in our moderation queue and get a verification badge.</p>
              </div>
          </div>
          <div className="flex gap-6 items-start">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center shrink-0"><TrendingUp className="w-6 h-6 text-slate-400" /></div>
              <div className="space-y-1">
                  <h4 className="font-black text-slate-900 italic tracking-tight">Real-time Insights</h4>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">See how your boost is performing with detailed impressions and conversion tracking.</p>
              </div>
          </div>
      </div>

      {/* Security Info */}
      <div className="flex flex-col items-center justify-center space-y-4 pt-10">
          <div className="flex items-center gap-6 opacity-30 grayscale hover:grayscale-0 transition-all">
              <CreditCard className="w-6 h-6" />
              <span className="font-black italic text-lg tracking-widest uppercase">RAZORPAY SECURE</span>
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center max-w-md">
              Secure 256-bit encrypted payments. By selecting a plan, you agree to our Property Services Terms & Conditions.
          </p>
      </div>
    </div>
  )
}
