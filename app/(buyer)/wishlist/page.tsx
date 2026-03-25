"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Heart, Search, ArrowRight, Trash2, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PropertyCard } from "@/components/shared/property-card"
import { mockProperties } from "@/lib/mock-data"
import Link from "next/link"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function WishlistPage() {
  const [items, setItems] = useState(mockProperties.slice(0, 6))
  const [removedItem, setRemovedItem] = useState<(typeof mockProperties)[0] | null>(null)

  const handleRemove = (id: string) => {
    const itemToRemove = items.find(i => i.id === id)
    if (itemToRemove) {
      setRemovedItem(itemToRemove)
    }
    setItems(prev => prev.filter(item => item.id !== id))
    
    // In a real app, we'd fire the API call here
    // And show a toast with an "Undo" action
  }

  const handleUndo = () => {
    if (removedItem) {
      setItems(prev => [...prev, removedItem])
      setRemovedItem(null)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">My Saved Properties</h1>
          <p className="text-slate-500 font-medium">
            <span className="text-primary font-bold">{items.length} properties</span> saved in your wishlist
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
        {items.length > 0 ? (
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
                  className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg flex items-center justify-center text-slate-400 hover:text-red-500 hover:scale-110 transition-all z-20 opacity-0 group-hover:opacity-100"
                  title="Remove from wishlist"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                
                {/* Overlay for unavailable properties (simulated) */}
                {property.id === "p3" && (
                  <div className="absolute inset-0 bg-slate-100/60 backdrop-blur-[2px] rounded-[32px] z-30 flex items-center justify-center p-6 text-center select-none">
                    <div className="bg-white p-6 rounded-2xl shadow-xl space-y-2 border border-slate-100">
                      <p className="font-black text-slate-900 leading-tight">No longer available</p>
                      <p className="text-xs text-slate-500 font-medium line-clamp-2">This property has been sold or removed by the owner.</p>
                      <Button variant="ghost" className="text-red-500 font-bold hover:bg-red-50 h-8 rounded-lg mt-2 px-4 shadow-none">
                        Remove
                      </Button>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 px-6 text-center space-y-6 bg-white rounded-[48px] border border-dashed border-slate-200"
          >
            <div className="w-32 h-32 rounded-full bg-slate-50 flex items-center justify-center relative">
              <Heart className="w-16 h-16 text-slate-200" />
              <div className="absolute top-0 right-0 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-50">
                <Search className="w-4 h-4 text-slate-300" />
              </div>
            </div>
            <div className="space-y-2 max-w-sm">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">No saved properties yet</h3>
              <p className="text-slate-500 font-medium">
                Start exploring amazing properties and save your favorites to compare them later.
              </p>
            </div>
            <Link href="/search">
              <Button className="rounded-2xl h-14 px-10 font-black gap-2 shadow-xl shadow-primary/20">
                Browse Properties <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Undo Notification Simulated */}
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
              className="text-primary font-black text-sm uppercase tracking-widest hover:underline"
            >
              Undo
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
