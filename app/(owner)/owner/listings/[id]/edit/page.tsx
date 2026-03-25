"use client"

import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Save, ArrowLeft, AlertCircle, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"

export default function EditListingPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-20">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Button variant="ghost" onClick={() => router.back()} className="p-0 h-auto hover:bg-transparent text-slate-400 font-bold gap-2 mb-2">
            <ArrowLeft className="w-4 h-4" /> Back to Listings
          </Button>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Edit Listing #{id}</h1>
        </div>
        <Button className="bg-primary hover:bg-primary-dark rounded-2xl h-14 px-10 font-black gap-2 shadow-xl shadow-primary/20 transition-all active:scale-95 italic">
          <Save className="w-5 h-5" />
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
            <Card className="border-none shadow-sm rounded-[32px] p-8 space-y-8 bg-white">
                <div className="space-y-4">
                    <Label className="text-base font-black text-slate-900">Listing Title</Label>
                    <Input defaultValue="Luxury Villa in Shela" className="h-14 rounded-2xl bg-slate-50 border-none font-medium px-6" />
                </div>
                <div className="space-y-4">
                    <Label className="text-base font-black text-slate-900">Description</Label>
                    <Textarea 
                        defaultValue="Beautifully designed 4BHK villa with a private garden and high-end interiors..." 
                        className="min-h-[200px] rounded-[32px] bg-slate-50 border-none font-medium p-8" 
                    />
                </div>
                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <Label className="text-base font-black text-slate-900">Price (₹)</Label>
                        <Input defaultValue="2,50,00,000" className="h-14 rounded-2xl bg-slate-50 border-none font-medium px-6" />
                    </div>
                    <div className="space-y-4">
                        <Label className="text-base font-black text-slate-900">Maintenance (Monthly)</Label>
                        <Input defaultValue="4,500" className="h-14 rounded-2xl bg-slate-50 border-none font-medium px-6" />
                    </div>
                </div>
            </Card>

            <Card className="border-none shadow-sm rounded-[32px] p-8 space-y-6 bg-white">
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Media Management</h3>
                <div className="grid grid-cols-3 gap-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="aspect-video rounded-2xl bg-slate-100 flex items-center justify-center border-2 border-dashed border-slate-200">
                             <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm text-slate-300 font-black">+</div>
                        </div>
                    ))}
                </div>
                <Button variant="outline" className="w-full h-12 rounded-xl border-dashed border-2 hover:bg-slate-50 text-slate-400 font-bold">Manage Photos & Videos</Button>
            </Card>
        </div>

        <div className="space-y-6">
            <div className="bg-amber-50 rounded-[32px] p-8 space-y-4 border border-amber-100/50">
                <div className="flex items-center gap-3 text-amber-600">
                    <AlertCircle className="w-6 h-6" />
                    <h4 className="text-lg font-black tracking-tight italic">Review Pending</h4>
                </div>
                <p className="text-amber-800/70 text-sm font-medium leading-relaxed">Changes to price or title will trigger a re-audit by our team. Your listing will remain live during this time.</p>
            </div>

            <div className="bg-slate-900 rounded-[32px] p-8 text-white space-y-6">
                <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center">
                    <Info className="w-6 h-6 text-white" />
                </div>
                <div className="space-y-2">
                    <h4 className="text-xl font-black italic tracking-tight">Audit Checklist</h4>
                    <ul className="space-y-3">
                        {["High-res photos", "Valid Pincode", "Detailed Description", "Correct Type"].map((item, i) => (
                            <li key={i} className="flex items-center gap-3 text-xs font-bold text-white/60">
                                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
      </div>
    </div>
  )
}
