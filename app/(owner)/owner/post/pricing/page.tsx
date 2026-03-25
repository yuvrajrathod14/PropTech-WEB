"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ChevronRight, ChevronLeft, IndianRupee, Info, HelpCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { usePropertyDraft } from "@/hooks/use-property-draft"
import { cn } from "@/lib/utils"

export default function PostStep5() {
  const router = useRouter()
  const { saveStepData, loadDraft, draftId, isLoading: isDraftLoading } = usePropertyDraft()
  
  const [intent, setIntent] = useState("sale")
  const [price, setPrice] = useState("")
  const [maintenance, setMaintenance] = useState("")
  const [bookingAmount, setBookingAmount] = useState("")
  const [negotiable, setNegotiable] = useState(true)
  const [area, setArea] = useState(0)
  const [isInitializing, setIsInitializing] = useState(true)

  // Load existing draft
  useEffect(() => {
    const fetchDraft = async () => {
      if (draftId) {
        const draft = await loadDraft() as any
        if (draft) {
          setIntent(draft.intent || "sale")
          setPrice(draft.price?.toString() || "")
          setMaintenance(draft.maintenance_charge?.toString() || "")
          setBookingAmount(draft.booking_amount?.toString() || "")
          setNegotiable(draft.is_negotiable ?? true)
          setArea(draft.area || 0)
        }
      }
      setIsInitializing(false)
    }
    fetchDraft()
  }, [draftId, loadDraft])

  const formatIndianCurrency = (val: string) => {
    const num = parseFloat(val)
    if (isNaN(num)) return ""
    if (num >= 10000000) return `${(num / 10000000).toFixed(2)} Cr`
    if (num >= 100000) return `${(num / 100000).toFixed(2)} Lac`
    return num.toLocaleString('en-IN')
  }

  const handleNext = async () => {
    await saveStepData({
      price: parseFloat(price),
      maintenance_charge: parseFloat(maintenance),
      booking_amount: parseFloat(bookingAmount),
      is_negotiable: negotiable,
    }, "/owner/post/preview")
  }

  const pricePerSqft = area > 0 && price ? Math.round(parseFloat(price) / area) : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-10 flex-1 flex flex-col"
    >
      <div className="space-y-8">
        <h3 className="text-2xl font-black text-slate-900 tracking-tight">Set Your Price</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-6">
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label className="text-base font-black text-slate-900">
                            {intent === 'rent' ? 'Expected Monthly Rent' : 'Total Price (Expected)'}
                        </Label>
                        <HelpCircle className="w-4 h-4 text-slate-300" />
                    </div>
                    <div className="relative group focus-within:ring-4 focus-within:ring-primary/5 rounded-3xl transition-all">
                        <div className="absolute left-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500 font-black group-focus-within:bg-primary group-focus-within:text-white transition-colors">
                            <IndianRupee className="w-5 h-5" />
                        </div>
                        <Input 
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder="e.g. 65,00,000" 
                            className="h-20 pl-20 pr-6 rounded-3xl bg-slate-50 border-none text-2xl font-black text-slate-900 placeholder:text-slate-200" 
                        />
                        {price && (
                            <div className="absolute right-6 top-1/2 -translate-y-1/2 text-sm font-black text-primary bg-primary/5 px-3 py-1 rounded-lg">
                                {formatIndianCurrency(price)}
                            </div>
                        )}
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">
                        {intent === 'rent' ? 'Monthly rental amount' : 'Expected price for the property'}
                    </p>
                </div>

                <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-between group cursor-pointer" onClick={() => setNegotiable(!negotiable)}>
                    <div className="space-y-1">
                        <p className="text-sm font-black text-slate-900">Negotiable Price</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Willing to discuss if offer is right</p>
                    </div>
                    <Switch checked={negotiable} onCheckedChange={setNegotiable} className="data-[state=checked]:bg-primary" />
                </div>
            </div>

            <div className="space-y-6">
                <div className="space-y-2">
                    <Label className="text-base font-black text-slate-900">Maintenance (Monthly)</Label>
                    <div className="relative group">
                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 font-black">₹</div>
                        <Input 
                            value={maintenance}
                            onChange={(e) => setMaintenance(e.target.value)}
                            placeholder="3,500" 
                            className="h-16 pl-12 pr-6 rounded-[24px] bg-slate-50 border-none text-lg font-black text-slate-900" 
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label className="text-base font-black text-slate-900">
                        {intent === 'rent' ? 'Security Deposit' : 'Booking Amount (Token)'}
                    </Label>
                    <div className="relative group">
                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 font-black">₹</div>
                        <Input 
                            value={bookingAmount}
                            onChange={(e) => setBookingAmount(e.target.value)}
                            placeholder="1,00,000" 
                            className="h-16 pl-12 pr-6 rounded-[24px] bg-slate-50 border-none text-lg font-black text-slate-900" 
                        />
                    </div>
                </div>
            </div>
        </div>
      </div>

      <div className="bg-primary/5 rounded-[40px] p-8 space-y-4 border border-primary/10">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center shadow-lg"><Info className="w-5 h-5" /></div>
            <h4 className="text-lg font-black tracking-tight italic text-primary">Price Intelligence</h4>
        </div>
        <p className="text-sm font-medium text-slate-600 leading-relaxed max-w-2xl">
            Based on your area of <span className="text-slate-900 font-bold">{area} Sqft</span>, your rate is 
            <span className="text-slate-900 font-bold ml-1">₹{pricePerSqft}/sqft</span>. 
            {pricePerSqft > 0 && pricePerSqft < 6000 ? (
                <span className="text-emerald-500 font-black ml-1">COMPETITIVE</span>
            ) : (
                <span className="text-amber-500 font-black ml-1">PREMIUM</span>
            )}
        </p>
      </div>

      <div className="flex items-center justify-between pt-12 mt-auto">
        <Button 
          variant="ghost" 
          onClick={() => router.push("/owner/post/media")} 
          className="font-black text-slate-500 hover:text-primary rounded-xl h-14 px-8 gap-2"
        >
          <ChevronLeft className="w-5 h-5" />
          Back
        </Button>
        <Button 
          onClick={handleNext} 
          disabled={isDraftLoading || isInitializing || !price || !bookingAmount}
          className="bg-slate-900 hover:bg-slate-800 text-white font-black h-14 px-10 rounded-2xl gap-2 shadow-xl shadow-slate-200 transition-all active:scale-95 disabled:opacity-50"
        >
          {isDraftLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Continue"}
          {!isDraftLoading && <ChevronRight className="w-5 h-5" />}
        </Button>
      </div>
    </motion.div>
  )
}
