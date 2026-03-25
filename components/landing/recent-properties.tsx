"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { PropertyCard } from "@/components/shared/property-card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"
import { PropertyCardSkeleton } from "@/components/ui/skeleton"
import Link from "next/link"

const filters = ["All", "Buy", "Rent"]

export function RecentProperties() {
  const supabase = createClient()
  const [filter, setFilter] = useState("All")
  const [properties, setProperties] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchRecent() {
      setLoading(true)
      try {
        let query = (supabase.from("properties") as any)
          .select("*")
          .eq("status", "live")
          .order("created_at", { ascending: false })
          .limit(6)
        
        if (filter !== "All") {
          query = query.eq("type", filter.toLowerCase())
        }

        const { data } = await query
        setProperties(data || [])
      } catch (error) {
        console.error("Error fetching recent properties:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchRecent()
  }, [filter, supabase])

  return (
    <section className="py-24 bg-white relative">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-4">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl font-black text-slate-900 tracking-tight"
            >
              Recently Added
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
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
                    ? "bg-white text-[#1A56DB] shadow-sm" 
                    : "text-slate-500 hover:text-slate-900"
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {loading ? (
            Array(6).fill(0).map((_, i) => <PropertyCardSkeleton key={i} />)
          ) : properties.length > 0 ? (
            properties.map((property, index) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <PropertyCard property={property} />
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-20 bg-slate-50 rounded-[40px] border border-dashed border-slate-200 text-center">
               <p className="text-slate-400 font-bold mb-4">No recent listings found for "{filter}".</p>
               <Button variant="outline" onClick={() => setFilter("All")} className="rounded-xl font-bold">View All Listings</Button>
            </div>
          )}
        </div>

        <div className="text-center">
          <Link href="/search">
            <Button size="lg" className="bg-[#1A56DB] hover:bg-[#1341A8] text-white px-10 py-7 rounded-2xl font-bold shadow-lg shadow-[#1A56DB]/20">
              View All Properties
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
