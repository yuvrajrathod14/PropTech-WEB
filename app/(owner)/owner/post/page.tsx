"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Building2, Home, MapPin, Store, Warehouse, ChevronRight, CheckCircle2, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { usePropertyDraft } from "@/hooks/use-property-draft"

const propertyTypes = [
  { id: "flat", label: "Flat/Apartment", icon: Building2 },
  { id: "villa", label: "Villa", icon: Home },
  { id: "house", label: "Independent House", icon: Home },
  { id: "plot", label: "Plot/Land", icon: MapPin },
  { id: "office", label: "Commercial Office", icon: Building2 },
  { id: "shop", label: "Shop", icon: Store },
  { id: "pg", label: "PG/Hostel", icon: Building2 },
  { id: "warehouse", label: "Warehouse", icon: Warehouse },
]

export default function PostStep1() {
  const router = useRouter()
  const { saveStepData, loadDraft, draftId, isLoading: isDraftLoading } = usePropertyDraft()
  const [type, setType] = useState("flat")
  const [intent, setIntent] = useState("sale")
  const [isInitializing, setIsInitializing] = useState(true)

  // Load existing draft
  useEffect(() => {
    const fetchDraft = async () => {
      if (draftId) {
        const draft = await loadDraft() as any
        if (draft) {
          setType(draft.type || "flat")
          setIntent(draft.listing_for || "sale")
        }
      }
      setIsInitializing(false)
    }
    fetchDraft()
  }, [draftId, loadDraft])

  const handleNext = async () => {
    await saveStepData({
      type: type,
      listing_for: intent,
      title: `New ${type.charAt(0).toUpperCase() + type.slice(1)} for ${intent === 'both' ? 'Sale/Rent' : intent === 'sale' ? 'Sale' : 'Rent'}`,
      category: type === 'plot' ? 'land' : (type === 'office' || type === 'shop' || type === 'warehouse') ? 'commercial' : 'residential'
    }, "/owner/post/location")
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-10 flex-1 flex flex-col"
    >
      <div className="space-y-6">
        <h3 className="text-2xl font-black text-slate-900 tracking-tight">What are you listing?</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {propertyTypes.map((pt) => (
            <div 
              key={pt.id}
              onClick={() => setType(pt.id)}
              className={cn(
                "cursor-pointer p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-3 text-center group relative",
                type === pt.id 
                    ? "border-primary bg-primary/5 shadow-lg shadow-primary/5" 
                    : "border-slate-50 bg-slate-50/50 hover:bg-white hover:border-slate-200"
              )}
            >
              <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center transition-colors",
                type === pt.id ? "bg-primary text-white" : "bg-white text-slate-400 group-hover:bg-slate-100 group-hover:text-slate-600"
              )}>
                 <pt.icon className="w-6 h-6" />
              </div>
              <span className={cn("text-xs font-black leading-tight", type === pt.id ? "text-primary" : "text-slate-600")}>
                {pt.label}
              </span>
              {type === pt.id && (
                <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                    <CheckCircle2 className="w-3 h-3 text-white" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-2xl font-black text-slate-900 tracking-tight">You want to:</h3>
        <div className="flex gap-4 p-2 bg-slate-100 rounded-2xl w-fit">
          {[
            { id: "sale", label: "For Sale" },
            { id: "rent", label: "For Rent" },
            { id: "both", label: "Both" }
          ].map((mode) => (
            <Button
              key={mode.id}
              variant="ghost"
              onClick={() => setIntent(mode.id)}
              className={cn(
                "rounded-xl px-8 h-12 font-black text-sm transition-all",
                intent === mode.id ? "bg-white text-primary shadow-sm scale-[1.02]" : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
              )}
            >
              {mode.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="fixed md:relative bottom-0 left-0 right-0 p-6 bg-white/95 backdrop-blur-md md:bg-transparent border-t md:border-none border-slate-100 z-50 flex items-center justify-end mt-auto">
        <Button 
          onClick={handleNext} 
          disabled={isDraftLoading || isInitializing}
          className="bg-slate-900 hover:bg-slate-800 text-white font-black h-14 px-8 md:px-10 rounded-2xl gap-2 shadow-xl shadow-slate-200 transition-all active:scale-95 disabled:opacity-50 w-full md:w-auto"
        >
          {isDraftLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Continue"}
          {!isDraftLoading && <ChevronRight className="w-5 h-5" />}
        </Button>
      </div>
    </motion.div>
  )
}
