"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils/cn"

const cities = [
  { 
    name: "Ahmedabad", 
    count: "2,450+ Properties", 
    image: "https://images.unsplash.com/photo-1548013146-72479768bbaa?auto=format&fit=crop&q=80&w=800",
    cols: 2,
  },
  { 
    name: "Mumbai", 
    count: "5,100+ Properties", 
    image: "https://images.unsplash.com/photo-1570160897548-394f9f07ad0c?auto=format&fit=crop&q=80&w=800",
    cols: 1,
  },
  { 
    name: "Surat", 
    count: "1,800+ Properties", 
    image: "https://images.unsplash.com/photo-1545620853-93d3b7084534?auto=format&fit=crop&q=80&w=800",
    cols: 1,
  },
  { 
    name: "Vadodara", 
    count: "1,200+ Properties", 
    image: "https://images.unsplash.com/photo-1554483539-715783355099?auto=format&fit=crop&q=80&w=800",
    cols: 1,
  },
  { 
    name: "Bengaluru", 
    count: "4,300+ Properties", 
    image: "https://images.unsplash.com/photo-1596422846543-b5c65161fe43?auto=format&fit=crop&q=80&w=800",
    cols: 1,
  },
]

export function CityExplorer() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
          <motion.h2 
            initial={{ opacity: 1, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-black text-slate-900 tracking-tight"
          >
            Explore by City
          </motion.h2>
          <motion.p 
            initial={{ opacity: 1, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-slate-500 font-medium"
          >
            Find properties in India&apos;s major real estate hubs.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[280px]">
          {cities.map((city, index) => (
            <motion.div
              key={city.name}
              initial={{ opacity: 1, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className={cn(
                "relative rounded-3xl overflow-hidden group cursor-pointer shadow-lg shadow-slate-200/50",
                city.cols === 2 ? "sm:col-span-2" : ""
              )}
            >
              <Image
                src={city.image}
                alt={city.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="absolute bottom-6 left-6 text-white space-y-1">
                <h3 className="text-2xl font-black tracking-tight">{city.name}</h3>
                <p className="text-slate-200 text-sm font-semibold">{city.count}</p>
              </div>
              <Link href={`/search?city=${city.name}`} className="absolute inset-0 z-10" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
