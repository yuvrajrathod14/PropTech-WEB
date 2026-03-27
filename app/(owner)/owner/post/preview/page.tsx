"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ChevronRight, ChevronLeft, MapPin, Bed, Bath, Square, IndianRupee, Rocket, ShieldCheck, Loader2, Edit3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { usePropertyDraft } from "@/hooks/use-property-draft"
import { supabase } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"

export default function PostStep6() {
  const router = useRouter()
  const { loadDraft, clearDraft, draftId, isLoading: isDraftLoading } = usePropertyDraft()
  const [draft, setDraft] = useState<any>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isInitializing, setIsInitializing] = useState(true)

  useEffect(() => {
    const fetchDraft = async () => {
      if (draftId) {
        const data = await loadDraft()
        setDraft(data)
      }
      setIsInitializing(false)
    }
    fetchDraft()
  }, [draftId, loadDraft])

  const formatPrice = (num: number) => {
    if (!num) return "₹0"
    if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`
    if (num >= 100000) return `₹${(num / 100000).toFixed(2)} Lac`
    return `₹${num.toLocaleString('en-IN')}`
  }

  const handleSubmit = async () => {
    if (!draftId) return
    setIsSubmitting(true)
    try {
      const { error } = await (supabase.from("properties") as any)
        .update({
          status: 'pending',
          updated_at: new Date().toISOString()
        })
        .eq("id", draftId)

      if (error) throw error

      clearDraft()
      router.push("/owner/post/success")
    } catch (error) {
      console.error("Submission error:", error)
      alert("Failed to submit property. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isInitializing || !draft) {
    return (
        <div className="flex-1 flex items-center justify-center">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-10 flex-1 flex flex-col"
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Final Preview</h3>
            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 italic">Looks Great!</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Left: Card Mock */}
            <div className="space-y-6">
                <div className="rounded-[40px] overflow-hidden bg-white border border-slate-100 shadow-2xl relative group">
                    <div className="aspect-[4/3] relative">
                         <Image 
                            src={draft.images?.[0] || "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800"} 
                            alt={draft.title || "Property"} 
                            fill 
                            className="object-cover" 
                         />
                         <div className="absolute top-6 left-6 flex flex-wrap gap-2">
                            <span className="bg-white/90 backdrop-blur-md text-slate-900 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl shadow-lg">
                                For {draft.intent || 'Sale'}
                            </span>
                            <span className="bg-primary text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl shadow-lg">
                                {draft.type || 'Residential'}
                            </span>
                         </div>
                         <Button 
                            variant="secondary"
                            onClick={() => router.push("/owner/post/media")}
                            className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-md hover:bg-white text-slate-900 font-black rounded-xl h-10 gap-2 shadow-lg"
                         >
                            <Edit3 className="w-4 h-4" />
                            Edit Media
                         </Button>
                    </div>
                    <div className="p-8 space-y-4">
                        <div className="flex justify-between items-start gap-4">
                            <h4 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">
                                {draft.title || 'Untitled Property'}
                            </h4>
                            <p className="text-2xl font-black text-primary tracking-tighter whitespace-nowrap">
                                {formatPrice(draft.price)}
                            </p>
                        </div>
                        <div className="flex items-center gap-2 text-slate-400">
                            <MapPin className="w-4 h-4 text-primary" />
                            <span className="text-sm font-bold truncate">
                                {draft.address || 'Location not specified'}
                            </span>
                        </div>
                        <div className="grid grid-cols-3 gap-4 py-6 border-y border-slate-50">
                            <div className="flex flex-col items-center gap-1">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">BHK</span>
                                <div className="flex items-center gap-2">
                                    <Bed className="w-4 h-4 text-slate-400" />
                                    <span className="text-sm font-black text-slate-900">{draft.bhk || 0}</span>
                                </div>
                            </div>
                            <div className="flex flex-col items-center gap-1 border-x border-slate-50">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">BATH</span>
                                <div className="flex items-center gap-2">
                                    <Bath className="w-4 h-4 text-slate-400" />
                                    <span className="text-sm font-black text-slate-900">{draft.bathrooms || 0}</span>
                                </div>
                            </div>
                            <div className="flex flex-col items-center gap-1">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">SQFT</span>
                                <div className="flex items-center gap-2">
                                    <Square className="w-4 h-4 text-slate-400" />
                                    <span className="text-sm font-black text-slate-900">{draft.area || 0}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right: Summary List */}
            <div className="space-y-8">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Key Highlights</h5>
                        <Button 
                            variant="link" 
                            onClick={() => router.push("/owner/post/details")}
                            className="text-[10px] font-black text-primary uppercase tracking-widest p-0 h-auto"
                        >
                            Edit
                        </Button>
                    </div>
                    <div className="space-y-3">
                        {[
                            { label: "Possession", value: draft.possession_status || 'N/A' },
                            { label: "Furnishing", value: draft.furnishing_status || 'N/A' },
                            { label: "Property Age", value: draft.property_age ? `${draft.property_age} Years` : 'New' },
                            { label: "Maintenance", value: formatPrice(draft.maintenance_charge) + " / Mo" }
                        ].map((item, i) => (
                            <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50/50 border border-slate-50 group transition-all hover:bg-white hover:border-slate-100 hover:shadow-sm">
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{item.label}</span>
                                <span className="text-sm font-black text-slate-900">{item.value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-4">
                    <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Trust Indicators</h5>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 flex flex-col gap-2">
                            <ShieldCheck className="w-5 h-5 text-emerald-600" />
                            <span className="text-[10px] font-black text-emerald-700 uppercase leading-tight">Verified Owner Status</span>
                        </div>
                        <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 flex flex-col gap-2">
                            <Rocket className="w-5 h-5 text-primary" />
                            <span className="text-[10px] font-black text-primary uppercase leading-tight">AI Optimized Visibility</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>

      <div className="fixed md:relative bottom-0 left-0 right-0 p-6 bg-white/95 backdrop-blur-md md:bg-transparent border-t md:border-none border-slate-100 z-50 flex items-center justify-between mt-auto">
        <Button 
          variant="ghost" 
          onClick={() => router.push("/owner/post/pricing")} 
          className="font-black text-slate-500 hover:text-primary rounded-xl h-14 px-4 md:px-8 gap-2"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="hidden md:inline">Back</span>
        </Button>
        <Button 
          onClick={handleSubmit} 
          disabled={isSubmitting}
          className="bg-primary hover:bg-primary/90 text-white font-black h-14 px-8 md:px-10 rounded-2xl gap-3 shadow-xl shadow-primary/20 transition-all active:scale-95 animate-shimmer disabled:opacity-50 flex-1 md:flex-none"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Publishing...
            </>
          ) : (
            <>
              Publish Property
              <Rocket className="w-5 h-5" />
            </>
          )}
        </Button>
      </div>
    </motion.div>
  )
}
