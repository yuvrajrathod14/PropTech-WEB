"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Switch } from "@/components/ui/switch"
import { Check, Zap, Rocket, ShieldCheck, X, Sparkles, TrendingUp, Target, Crown, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const plans = [
  {
    name: "Free Plan",
    id: "free",
    price: { monthly: 0, yearly: 0 },
    description: "Perfect for getting started and exploring the platform.",
    features: [
      "Up to 3 property listings",
      "Up to 5 photos per listing",
      "Basic enquiry management",
      "Real-time chat with buyers",
    ],
    notIncluded: [
      "Featured listing badge",
      "Professional analytics",
      "Video upload support",
      "Priority customer care",
    ],
    buttonText: "Get Started Free",
    secondaryButton: false,
    color: "slate",
    icon: Zap
  },
  {
    name: "Premium Plan",
    id: "premium",
    price: { monthly: 499, yearly: 399 },
    description: "The most popular choice for serious property owners.",
    popular: true,
    features: [
      "Unlimited property listings",
      "Up to 20 photos + HD Video",
      "Priority in search results",
      "Professional analytics dashboard",
      "Bulk enquiry management",
      "Verified official owner badge",
      "Priority 24/7 technical support",
    ],
    buttonText: "Start Premium",
    secondaryButton: false,
    color: "blue",
    icon: Rocket
  },
  {
    name: "Enterprise",
    id: "enterprise",
    price: { monthly: 1999, yearly: 1599 },
    description: "Designed for large builders and agencies.",
    features: [
      "Everything in Premium",
      "Team members (up to 5)",
      "New project listings support",
      "Dedicated account manager",
      "Developer API access",
      "White-label brand forms",
    ],
    buttonText: "Contact Sales",
    secondaryButton: true,
    color: "slate-900",
    icon: ShieldCheck
  }
]

const boostPlans = [
  { duration: "7 Days", price: 299, popular: false, icon: Target, label: "Starter" },
  { duration: "15 Days", price: 499, popular: true, icon: TrendingUp, label: "Growth" },
  { duration: "30 Days", price: 799, popular: false, icon: Crown, label: "Dominance" },
]

export function PricingContent() {
  const [isYearly, setIsYearly] = useState(false)

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-600 font-black text-sm mb-6"
          >
            <Sparkles className="w-4 h-4" />
            Pricing Plans
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-7xl font-black text-slate-900 mb-6 italic tracking-tight"
          >
            Pricing That Actually Makes Sense
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-slate-500 font-medium max-w-2xl mx-auto"
          >
            No hidden commissions. No surprise fees. Just simple, transparent pricing for everyone.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-center gap-4 py-4"
          >
            <span className={cn("text-lg font-black", !isYearly ? "text-slate-900" : "text-slate-400")}>Monthly</span>
            <Switch 
              checked={isYearly}
              onCheckedChange={setIsYearly}
              className="data-[state=checked]:bg-blue-600 h-8 w-14"
            />
            <span className={cn("text-lg font-black flex items-center gap-2", isYearly ? "text-slate-900" : "text-slate-400")}>
              Yearly
              <Badge className="bg-green-100 text-green-700 border-none font-black px-2 py-0">Save 20%</Badge>
            </span>
          </motion.div>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "relative bg-white rounded-[40px] p-10 border-2 transition-all hover:shadow-2xl hover:shadow-slate-200 group flex flex-col h-full",
                plan.popular ? "border-blue-600 shadow-xl shadow-blue-100" : "border-white"
              )}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-xl shadow-blue-200">
                  Most Popular
                </div>
              )}

              <div className="mb-8">
                <div className={cn(
                  "w-16 h-16 rounded-2xl flex items-center justify-center mb-6",
                  plan.color === 'blue' ? "bg-blue-50 text-blue-600" : "bg-slate-50 text-slate-600"
                )}>
                  <plan.icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tight italic">{plan.name}</h3>
                <p className="text-slate-500 font-medium text-sm leading-relaxed">{plan.description}</p>
              </div>

              <div className="mb-8 flex items-baseline gap-1">
                <span className="text-4xl font-black text-slate-900 italic tracking-tighter">₹{isYearly ? plan.price.yearly : plan.price.monthly}</span>
                <span className="text-slate-500 font-black text-sm uppercase tracking-widest">/ month</span>
              </div>

              <div className="space-y-4 mb-10 flex-grow">
                {plan.features.map((feature, fIndex) => (
                  <div key={fIndex} className="flex items-start gap-4">
                    <div className="w-5 h-5 rounded-full bg-green-50 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-green-600" strokeWidth={4} />
                    </div>
                    <span className="text-slate-600 font-bold text-sm">{feature}</span>
                  </div>
                ))}
                {plan.notIncluded?.map((feature, fIndex) => (
                  <div key={fIndex} className="flex items-start gap-4 opacity-40">
                    <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                      <X className="w-3 h-3 text-slate-400" strokeWidth={4} />
                    </div>
                    <span className="text-slate-400 font-bold text-sm line-through decoration-2">{feature}</span>
                  </div>
                ))}
              </div>

              <Button
                className={cn(
                  "w-full h-16 rounded-2xl font-black text-lg transition-transform hover:scale-105 active:scale-95 shadow-xl",
                  plan.popular 
                    ? "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200" 
                    : "bg-slate-900 hover:bg-slate-800 text-white shadow-slate-200"
                )}
                asChild
              >
                <Link href={plan.id === 'enterprise' ? '/contact' : '/register'}>
                  {plan.buttonText}
                </Link>
              </Button>
            </motion.div>
          ))}
        </div>

        {/* Boost Plans */}
        <section className="bg-slate-900 rounded-[64px] p-8 md:p-20 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 text-blue-400 font-black text-sm mb-6"
              >
                <TrendingUp className="w-4 h-4" />
                Visibility Boost
              </motion.div>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6 italic tracking-tight">Boost Individual Listings</h2>
              <p className="text-slate-400 text-xl font-medium mb-12">
                Need results even faster? Boost your properties to the top of search results and our homepage spotlight.
              </p>
              
              <ul className="space-y-6">
                {[
                  "Featured Badge on property cards",
                  "Top of Search results for selected locality",
                  "Homepage Spotlight inclusion",
                  "Verified status for the boost duration"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-4">
                    <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center shrink-0">
                      <Check className="w-4 h-4 text-white" strokeWidth={4} />
                    </div>
                    <span className="text-slate-200 font-black tracking-tight">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {boostPlans.map((boost, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  className={cn(
                    "p-8 rounded-3xl flex items-center justify-between transition-all",
                    boost.popular ? "bg-blue-600 text-white shadow-2xl shadow-blue-500/20" : "bg-slate-800 text-slate-300 border border-slate-700"
                  )}
                >
                  <div className="flex items-center gap-6">
                    <div className={cn(
                      "w-14 h-14 rounded-2xl flex items-center justify-center",
                      boost.popular ? "bg-white/20" : "bg-slate-700"
                    )}>
                      <boost.icon className="w-8 h-8" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-black text-xl italic tracking-tight">{boost.duration}</span>
                        <Badge className={cn(
                          "border-none font-black",
                          boost.popular ? "bg-white text-blue-600" : "bg-slate-700 text-slate-300"
                        )}>{boost.label}</Badge>
                      </div>
                      <p className={boost.popular ? "text-blue-100" : "text-slate-500"}>Boost your listing visibility</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-black italic tracking-tighter">₹{boost.price}</div>
                    <p className={cn("text-sm font-black uppercase tracking-widest", boost.popular ? "text-blue-200" : "text-slate-500")}>one-time</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing FAQ CTA */}
        <div className="mt-24 text-center">
          <p className="text-slate-500 font-bold mb-6 italic tracking-tight text-xl">Have more questions about our plans?</p>
          <Button variant="link" className="text-blue-600 font-black text-lg h-auto p-0" asChild>
            <Link href="/how-it-works">Read our Full FAQ <ArrowRight className="w-5 h-5 ml-2 inline" /></Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

