"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { PropertyCard } from "@/components/shared/property-card"
import { ArrowRight, RefreshCcw } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { PropertyCardSkeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"

export function FeaturedProperties() {
  const supabase = createClient()
  const [properties, setProperties] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchFeatured() {
      setLoading(true)
      try {
        const { data } = await (supabase.from("properties") as any)
          .select("*")
          .eq("is_featured", true)
          .eq("status", "live")
          .limit(6)
        
        setProperties(data || [])
      } catch (error) {
        console.error("Error fetching featured properties:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchFeatured()
  }, [supabase])

  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-12">
          <div className="space-y-4">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl font-black text-slate-900 tracking-tight"
            >
              Featured Properties
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-slate-500 font-medium"
            >
              Handpicked premium properties for your dream lifestyle.
            </motion.p>
          </div>
          <Link href="/search" className="hidden md:flex items-center text-[#1A56DB] font-bold hover:gap-2 transition-all">
            View All Properties <ArrowRight className="w-5 h-5 ml-1" />
          </Link>
        </div>

        <div className="relative group">
          <div className="flex items-center gap-6 overflow-x-auto pb-12 no-scrollbar scroll-smooth">
            {loading ? (
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="min-w-[300px] md:min-w-[380px]">
                  <PropertyCardSkeleton />
                </div>
              ))
            ) : properties.length > 0 ? (
              properties.map((property, index) => (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="min-w-[300px] md:min-w-[380px]"
                >
                  <PropertyCard property={property} />
                </motion.div>
              ))
            ) : (
              <div className="w-full flex flex-col items-center justify-center py-20 bg-white rounded-[40px] border border-dashed border-slate-200">
                <p className="text-slate-400 font-bold mb-4">No featured properties at the moment.</p>
                <Link href="/search">
                  <Button variant="outline" className="rounded-xl font-bold">Browse All Listings</Button>
                </Link>
              </div>
            )}
          </div>
          
          {/* Gradient Fade */}
          <div className="absolute top-0 right-0 bottom-12 w-32 bg-gradient-to-l from-slate-50 to-transparent pointer-events-none hidden md:block"></div>
        </div>
      </div>
    </section>
  )
}
