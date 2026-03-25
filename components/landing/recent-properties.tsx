"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { PropertyCard } from "@/components/shared/property-card"
import { mockProperties } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const filters = ["All", "Buy", "Rent"]

export function RecentProperties() {
  const [filter, setFilter] = useState("All")

  const filtered = mockProperties.filter(p => {
    if (filter === "All") return true
    return p.type.toLowerCase() === filter.toLowerCase()
  })

  return (
    <section className="py-24 bg-white relative">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-4">
            <motion.h2 
              initial={{ opacity: 1, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl font-black text-slate-900 tracking-tight"
            >
              Recently Added
            </motion.h2>
            <motion.p 
              initial={{ opacity: 1, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-slate-500 font-medium"
            >
              Latest listings uploaded to PropTech.
            </motion.p>
          </div>

          <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-100">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "px-6 py-2 rounded-lg text-sm font-bold transition-all",
                  filter === f 
                    ? "bg-white text-primary shadow-sm" 
                    : "text-slate-500 hover:text-slate-900"
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {filtered.map((property, index) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 1, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              <PropertyCard property={property} />
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Button size="lg" className="bg-primary hover:bg-primary-dark text-white px-10 py-7 rounded-2xl font-bold shadow-lg shadow-primary/20">
            View All Properties
          </Button>
        </div>
      </div>
    </section>
  )
}
