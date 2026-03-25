"use client"

import { motion } from "framer-motion"
import { Star, Quote } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const testimonials = [
  {
    name: "Rajesh Sharma",
    city: "Mumbai",
    quote: "Found my dream apartment in Mumbai within just a week. The verification process gave me peace of mind that I was dealing with a genuine owner.",
    avatar: "https://i.pravatar.cc/150?u=rajesh",
  },
  {
    name: "Priya Patel",
    city: "Ahmedabad",
    quote: "Selling my property was so much easier than I expected. I got verified quickly and started receiving genuine enquiries the next day.",
    avatar: "https://i.pravatar.cc/150?u=priya",
  },
  {
    name: "Ankit Gupta",
    city: "Bengaluru",
    quote: "The direct chat feature is a game changer. No middlemen, no commissions, just straight talk with the owners. Highly recommended!",
    avatar: "https://i.pravatar.cc/150?u=ankit",
  },
]

export function Testimonials() {
  return (
    <section className="py-24 bg-white relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <motion.h2 
            initial={{ opacity: 1, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-black text-slate-900 tracking-tight"
          >
            What Our Users Say
          </motion.h2>
          <motion.p 
            initial={{ opacity: 1, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-slate-500 font-medium"
          >
            Join thousands of happy users who found their perfect home with PropTech.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, index) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 1, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-slate-50/50 rounded-3xl p-8 border border-slate-100 flex flex-col items-center text-center space-y-6 relative"
            >
              <Quote className="absolute top-8 left-8 w-12 h-12 text-primary/5 -z-10" />
              
              <div className="flex items-center text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>

              <p className="text-slate-700 font-medium italic leading-relaxed">&ldquo;{t.quote}&rdquo;</p>

              <div className="flex flex-col items-center gap-3 pt-4">
                <Avatar className="w-14 h-14 border-4 border-white shadow-md">
                  <AvatarImage src={t.avatar} alt={t.name} />
                  <AvatarFallback>{t.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-bold text-slate-900">{t.name}</h4>
                  <p className="text-xs font-bold text-primary uppercase tracking-widest">{t.city}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
