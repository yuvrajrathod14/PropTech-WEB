"use client"

import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, MessageSquare, CheckCircle, PlusCircle, ShieldCheck, Banknote } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const buyerSteps = [
  {
    icon: <Search className="w-8 h-8" />,
    title: "Search Properties",
    desc: "Browse thousands of verified listings. Filter by location, budget, BHK, and more.",
  },
  {
    icon: <MessageSquare className="w-8 h-8" />,
    title: "Connect with Owners",
    desc: "Send enquiry, chat directly with property owners, and schedule site visits.",
  },
  {
    icon: <CheckCircle className="w-8 h-8" />,
    title: "Book with Confidence",
    desc: "Pay secure token amount via Razorpay. Get receipt instantly.",
  },
]

const sellerSteps = [
  {
    icon: <PlusCircle className="w-8 h-8" />,
    title: "List Your Property",
    desc: "Post your property in under 10 minutes with photos, video and location.",
  },
  {
    icon: <ShieldCheck className="w-8 h-8" />,
    title: "Admin Verification",
    desc: "Our team reviews and verifies your listing within 24 hours.",
  },
  {
    icon: <Banknote className="w-8 h-8" />,
    title: "Connect with Buyers",
    desc: "Receive enquiries, chat with buyers, and close deals faster.",
  },
]

export function HowItWorks() {
  return (
    <section className="py-24 bg-blue-50/50 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <motion.h2 
            initial={{ opacity: 1, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-black text-slate-900 tracking-tight"
          >
            How PropTech Works
          </motion.h2>
          <motion.p 
            initial={{ opacity: 1, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-slate-500 font-medium"
          >
            A simple 3-step process to buy or sell your property.
          </motion.p>
        </div>

        <Tabs defaultValue="buyers" className="w-full max-w-5xl mx-auto">
          <TabsList className="grid w-[300px] mx-auto grid-cols-2 mb-12 bg-white rounded-xl h-12 p-1 shadow-sm border border-slate-100">
            <TabsTrigger value="buyers" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white transition-all font-bold">For Buyers</TabsTrigger>
            <TabsTrigger value="sellers" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white transition-all font-bold">For Sellers</TabsTrigger>
          </TabsList>
          
          <TabsContent value="buyers">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
              {/* Dotted Line */}
              <div className="absolute top-1/3 left-0 right-0 h-0.5 border-t-2 border-dotted border-slate-200 -z-10 hidden md:block mx-12"></div>
              
              {buyerSteps.map((step, index) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 1, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-3xl p-8 border border-white shadow-xl shadow-blue-900/5 text-center space-y-6"
                >
                  <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mx-auto">
                    {step.icon}
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-slate-900">Step {index + 1}: {step.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            <motion.div 
              initial={{ opacity: 1, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-12 text-center"
            >
              <Link href="/register">
                <Button size="lg" className="rounded-2xl px-8 py-6 font-black text-lg shadow-xl shadow-primary/20">
                  Join as Buyer
                </Button>
              </Link>
            </motion.div>
          </TabsContent>

          <TabsContent value="sellers">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
              <div className="absolute top-1/3 left-0 right-0 h-0.5 border-t-2 border-dotted border-slate-200 -z-10 hidden md:block mx-12"></div>
              
              {sellerSteps.map((step, index) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 1, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-3xl p-8 border border-white shadow-xl shadow-blue-900/5 text-center space-y-6"
                >
                  <div className="w-20 h-20 bg-success/10 rounded-2xl flex items-center justify-center text-success mx-auto">
                    {step.icon}
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-slate-900">Step {index + 1}: {step.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            <motion.div 
              initial={{ opacity: 1, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-12 text-center"
            >
              <Link href="/register?role=owner">
                <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl px-8 py-6 font-black text-lg shadow-xl shadow-emerald-900/20">
                  List as Owner
                </Button>
              </Link>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}
