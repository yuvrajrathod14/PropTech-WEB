"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Heart, Search, ArrowRight, Trash2, SlidersHorizontal, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PropertyCard } from "@/components/shared/property-card"
import Link from "next/link"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { createClient } from "@/lib/supabase/client"
import { PropertyCardSkeleton } from "@/components/ui/skeleton"
import { EmptyState } from "@/components/ui/empty-state"
import { useRouter } from "next/navigation"

export default function WishlistPage() {
  const supabase = createClient()
  const router = useRouter()
  const [items, setItems] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [removedItem, setRemovedItem] = useState<any | null>(null)

  const fetchWishlist = async () => {
    setIsLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await (supabase.from("wishlist") as any)
        .select(`
          id,
          property:property_id (*)
        `)
        .eq("user_id", user.id)
      
      if (error) throw error
      // Flatten the data to get property objects
      const properties = data?.map((item: any) => item.property).filter(Boolean) || []
      setItems(properties)
    } catch (error) {
      console.error("Error fetching wishlist:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchWishlist()
  }, [supabase])

  const handleRemove = async (propertyId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const itemToRemove = items.find(i => i.id === propertyId)
      if (itemToRemove) {
        setRemovedItem(itemToRemove)
      }

      const { error } = await (supabase.from("wishlist") as any)
        .delete()
        .eq("user_id", user.id)
        .eq("property_id", propertyId)

      if (error) throw error
      setItems(prev => prev.filter(item => item.id !== propertyId))
    } catch (error) {
      console.error("Remove error:", error)
    }
  }

  const handleUndo = async () => {
    if (removedItem) {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { error } = await (supabase.from("wishlist") as any)
          .insert({ user_id: user.id, property_id: removedItem.id })
        
        if (error) throw error
        setItems(prev => [...prev, removedItem])
        setRemovedItem(null)
      } catch (error) {
        console.error("Undo error:", error)
      }
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight italic">Saved Properties</h1>
          <p className="text-slate-500 font-medium">
            <span className="text-[#1A56DB] font-bold">{items.length} properties</span> saved in your wishlist
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <Select defaultValue="newest">
            <SelectTrigger className="w-[180px] rounded-xl h-12 border-slate-200 font-bold text-slate-600 bg-white">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4" />
                <SelectValue placeholder="Sort By" />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-xl border-slate-100 shadow-2xl">
              <SelectItem value="newest" className="font-bold">Recently Saved</SelectItem>
              <SelectItem value="price-low" className="font-bold">Price: Low to High</SelectItem>
              <SelectItem value="price-high" className="font-bold">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <AnimatePresence mode="popLayout">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {Array(6).fill(0).map((_, i) => <PropertyCardSkeleton key={i} />)}
          </div>
        ) : items.length > 0 ? (
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
          >
            {items.map((property) => (
              <motion.div
                key={property.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                className="relative group"
              >
                <PropertyCard property={property} />
                <button
                  onClick={() => handleRemove(property.id)}
                  className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg flex items-center justify-center text-slate-400 hover:text-[#EF4444] hover:scale-110 transition-all z-20 md:opacity-0 group-hover:opacity-100"
                  title="Remove from wishlist"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="bg-white rounded-[48px] border border-dashed border-slate-200">
            <EmptyState 
              title="No saved properties yet"
              description="Start exploring amazing properties and save your favorites to compare them later."
              action={{
                label: "Browse Properties",
                onClick: () => router.push("/search"),
                icon: ArrowRight
              }}
              className="py-24"
            />
          </div>
        )}
      </AnimatePresence>

      {/* Undo Notification */}
      <AnimatePresence>
        {removedItem && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-24 lg:bottom-10 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl border border-white/10 flex items-center gap-6 min-w-[320px] justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                <Heart className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-bold">Property removed</span>
            </div>
            <button 
              onClick={handleUndo}
              className="text-[#1A56DB] font-black text-sm uppercase tracking-widest hover:underline"
            >
              Undo
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
