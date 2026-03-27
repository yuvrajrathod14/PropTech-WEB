"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Save, ArrowLeft, AlertCircle, Info, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import Image from "next/image"

export default function EditListingPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const supabase = createClient()

  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [property, setProperty] = useState<any>(null)

  // Form state
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [maintenance, setMaintenance] = useState("")
  const [bhk, setBhk] = useState("")
  const [area, setArea] = useState("")
  const [floorNumber, setFloorNumber] = useState("")
  const [totalFloors, setTotalFloors] = useState("")

  useEffect(() => {
    async function fetchProperty() {
      setIsLoading(true)
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) { router.push("/login"); return }

        const { data: prop, error } = await (supabase.from("properties") as any)
          .select("*")
          .eq("id", id)
          .single()

        if (error || !prop) { router.push("/owner/listings"); return }
        if (prop.owner_id !== user.id) { router.push("/owner/listings"); return }

        setProperty(prop)
        setTitle(prop.title || "")
        setDescription(prop.description || "")
        setPrice(prop.price?.toString() || "")
        setMaintenance(prop.maintenance_charge?.toString() || "")
        setBhk(prop.bhk?.toString() || "")
        setArea(prop.area?.toString() || "")
        setFloorNumber(prop.floor_number?.toString() || "")
        setTotalFloors(prop.total_floors?.toString() || "")
      } catch (error) {
        console.error("Error loading property:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchProperty()
  }, [id, supabase, router])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const { error } = await (supabase.from("properties") as any)
        .update({
          title,
          description,
          price: parseFloat(price) || 0,
          maintenance_charge: parseFloat(maintenance) || 0,
          bhk: parseInt(bhk) || null,
          area: parseInt(area) || null,
          floor_number: parseInt(floorNumber) || null,
          total_floors: parseInt(totalFloors) || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)

      if (error) throw error
      router.push(`/owner/listings/${id}`)
    } catch (error) {
      console.error("Save error:", error)
      alert("Failed to save changes. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-20">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Button variant="ghost" onClick={() => router.back()} className="p-0 h-auto hover:bg-transparent text-slate-400 font-bold gap-2 mb-2">
            <ArrowLeft className="w-4 h-4" /> Back to Listings
          </Button>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Edit: {property?.title}</h1>
        </div>
        <Button onClick={handleSave} disabled={isSaving} className="bg-primary hover:bg-primary-dark rounded-2xl h-14 px-10 font-black gap-2 shadow-xl shadow-primary/20 transition-all active:scale-95 italic">
          {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
            <Card className="border-none shadow-sm rounded-[32px] p-8 space-y-8 bg-white">
                <div className="space-y-4">
                    <Label className="text-base font-black text-slate-900">Listing Title</Label>
                    <Input value={title} onChange={(e) => setTitle(e.target.value)} className="h-14 rounded-2xl bg-slate-50 border-none font-medium px-6" />
                </div>
                <div className="space-y-4">
                    <Label className="text-base font-black text-slate-900">Description</Label>
                    <Textarea 
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="min-h-[200px] rounded-[32px] bg-slate-50 border-none font-medium p-8" 
                    />
                </div>
                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <Label className="text-base font-black text-slate-900">Price (₹)</Label>
                        <Input value={price} onChange={(e) => setPrice(e.target.value)} className="h-14 rounded-2xl bg-slate-50 border-none font-medium px-6" />
                    </div>
                    <div className="space-y-4">
                        <Label className="text-base font-black text-slate-900">Maintenance (Monthly)</Label>
                        <Input value={maintenance} onChange={(e) => setMaintenance(e.target.value)} className="h-14 rounded-2xl bg-slate-50 border-none font-medium px-6" />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <Label className="text-base font-black text-slate-900">BHK</Label>
                        <Input value={bhk} onChange={(e) => setBhk(e.target.value)} className="h-14 rounded-2xl bg-slate-50 border-none font-medium px-6" />
                    </div>
                    <div className="space-y-4">
                        <Label className="text-base font-black text-slate-900">Area (Sqft)</Label>
                        <Input value={area} onChange={(e) => setArea(e.target.value)} className="h-14 rounded-2xl bg-slate-50 border-none font-medium px-6" />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <Label className="text-base font-black text-slate-900">Floor Number</Label>
                        <Input value={floorNumber} onChange={(e) => setFloorNumber(e.target.value)} className="h-14 rounded-2xl bg-slate-50 border-none font-medium px-6" />
                    </div>
                    <div className="space-y-4">
                        <Label className="text-base font-black text-slate-900">Total Floors</Label>
                        <Input value={totalFloors} onChange={(e) => setTotalFloors(e.target.value)} className="h-14 rounded-2xl bg-slate-50 border-none font-medium px-6" />
                    </div>
                </div>
            </Card>

            <Card className="border-none shadow-sm rounded-[32px] p-8 space-y-6 bg-white">
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Current Media</h3>
                <div className="grid grid-cols-3 gap-4">
                    {(property?.images || []).length > 0 ? (
                        property.images.map((img: string, i: number) => (
                            <div key={i} className="aspect-video rounded-2xl overflow-hidden relative border border-slate-100">
                                <Image src={img} alt={`Photo ${i+1}`} fill className="object-cover" />
                            </div>
                        ))
                    ) : (
                        [1, 2, 3].map(i => (
                            <div key={i} className="aspect-video rounded-2xl bg-slate-100 flex items-center justify-center border-2 border-dashed border-slate-200">
                                 <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm text-slate-300 font-black">+</div>
                            </div>
                        ))
                    )}
                </div>
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
