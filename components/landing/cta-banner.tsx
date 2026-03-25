"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PlusCircle } from "lucide-react"

export function CTABanner() {
  return (
    <section className="py-24 container mx-auto px-4">
      <motion.div
        initial={{ opacity: 1, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="w-full bg-gradient-to-br from-primary to-primary-dark rounded-[2.5rem] p-12 md:p-24 text-center text-white relative overflow-hidden shadow-2xl shadow-primary/30"
      >
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-black/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>

        <div className="relative z-10 max-w-2xl mx-auto space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
              Ready to Sell Your Property?
            </h2>
            <p className="text-lg md:text-xl text-blue-100 font-medium">
              List your first property free. Reach thousands of verified buyers across India. No middleman, no hidden charges.
            </p>
          </div>

          <div className="flex flex-col items-center gap-4">
            <Link href="/owner/post">
              <Button size="lg" className="bg-white text-primary hover:bg-blue-50 px-12 py-8 rounded-2xl font-black text-xl shadow-xl transition-all hover:scale-105 active:scale-95 group">
                <PlusCircle className="w-6 h-6 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                Post Property Free
              </Button>
            </Link>
            <p className="text-sm font-bold text-blue-200/80 uppercase tracking-widest">
              No registration fee. No hidden charges.
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
