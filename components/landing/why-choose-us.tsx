"use client"

import { motion } from "framer-motion"
import { CheckCircle2, ShieldCheck, MessageSquare, Smartphone } from "lucide-react"

const features = [
  {
    icon: <CheckCircle2 className="w-8 h-8" />,
    title: "Verified Listings",
    desc: "Every listing reviewed by our team before going live",
  },
  {
    icon: <ShieldCheck className="w-8 h-8" />,
    title: "Secure Payments",
    desc: "Token payments via Razorpay — 100% secure",
  },
  {
    icon: <MessageSquare className="w-8 h-8" />,
    title: "Direct Connect",
    desc: "Chat directly with owners, no middlemen",
  },
  {
    icon: <Smartphone className="w-8 h-8" />,
    title: "Easy to Use",
    desc: "Post your property in 10 minutes, find one in 5",
  },
]

export function WhyChooseUs() {
  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <motion.h2 
            initial={{ opacity: 1, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-black text-slate-900 tracking-tight"
          >
            Why Choose PropTech?
          </motion.h2>
          <motion.p 
            initial={{ opacity: 1, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-slate-500 font-medium"
          >
            We&apos;re redefining the real estate experience in India with trust and transparency.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col items-center text-center space-y-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/5"
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-900">{feature.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
