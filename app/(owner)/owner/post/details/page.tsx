"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ChevronRight, ChevronLeft, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { usePropertyDraft } from "@/hooks/use-property-draft"

const amenitiesList = [
  "Swimming Pool", "Gym", "Club House", 
  "Security", "Power Backup", "Garden",
  "Elevator", "Car Parking", "CCTV",
  "Kids Play Area", "Intercom", "WiFi"
]

export default function PostStep3() {
  const router = useRouter()
  const { saveStepData, loadDraft, draftId, isLoading: isDraftLoading } = usePropertyDraft()
  
  const [type, setType] = useState("flat")
  const [bhk, setBhk] = useState("2")
  const [carpetArea, setCarpetArea] = useState("")
  const [builtupArea, setBuiltupArea] = useState("")
  const [floorNumber, setFloorNumber] = useState("")
  const [totalFloors, setTotalFloors] = useState("")
  const [propertyAge, setPropertyAge] = useState("1-5 Y")
  const [furnishing, setFurnishing] = useState("un-furnished")
  const [possession, setPossession] = useState("Ready to Move")
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])
  const [description, setDescription] = useState("")
  const [isInitializing, setIsInitializing] = useState(true)

  const isResidential = type !== 'plot' && type !== 'office' && type !== 'shop' && type !== 'warehouse'

  // Load existing draft
  useEffect(() => {
    const fetchDraft = async () => {
      if (draftId) {
        const draft = await loadDraft() as any
        if (draft) {
          setType(draft.type || "flat")
          setBhk(draft.bhk?.toString() || "2")
          setCarpetArea(draft.carpet_area_sqft?.toString() || "")
          setBuiltupArea(draft.area?.toString() || "")
          setFloorNumber(draft.floor_number?.toString() || "")
          setTotalFloors(draft.total_floors?.toString() || "")
          setPropertyAge(draft.property_age || "1-5 Y")
          setFurnishing(draft.furnishing || "un-furnished")
          setPossession(draft.possession_status || "Ready to Move")
          setSelectedAmenities(draft.amenities || [])
          setDescription(draft.description || "")
        }
      }
      setIsInitializing(false)
    }
    fetchDraft()
  }, [draftId, loadDraft])

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities(prev => 
      prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]
    )
  }

  const handleNext = async () => {
    await saveStepData({
      bhk: isResidential ? parseInt(bhk) : null,
      carpet_area_sqft: parseInt(carpetArea),
      area: parseInt(builtupArea), // Primary area field
      floor_number: parseInt(floorNumber),
      total_floors: parseInt(totalFloors),
      furnishing: isResidential ? furnishing : null,
      amenities: selectedAmenities,
      description: description,
      // Fixed values for now
      property_age: propertyAge,
      possession_status: possession
    }, "/owner/post/media")
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-10 flex-1 flex flex-col"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="space-y-8">
            {isResidential && (
              <div className="space-y-4">
                  <Label className="text-base font-black text-slate-900">Config: BHK</Label>
                  <div className="flex flex-wrap gap-2">
                      {["1", "2", "3", "4", "4+", "N/A"].map(b => (
                          <Button 
                              key={b}
                              onClick={() => setBhk(b)}
                              variant="outline" 
                              className={cn(
                                  "rounded-xl w-12 h-12 font-black transition-all",
                                  bhk === b ? "bg-primary text-white border-primary border-4 shadow-lg shadow-primary/20 scale-110" : "border-slate-100 hover:border-slate-200"
                              )}
                          >
                              {b}
                          </Button>
                      ))}
                  </div>
              </div>
            )}

            <div className="space-y-4">
                 <Label className="text-base font-black text-slate-900">Area Details</Label>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <span className="text-[10px] font-black text-slate-400 uppercase">Carpet Area (Sqft)</span>
                        <Input 
                            value={carpetArea}
                            onChange={(e) => setCarpetArea(e.target.value)}
                            placeholder="1250" 
                            className="rounded-xl h-12 bg-slate-50 border-none font-medium" 
                        />
                    </div>
                    <div className="space-y-2">
                        <span className="text-[10px] font-black text-slate-400 uppercase">Built-up Area (Sqft)</span>
                        <Input 
                            value={builtupArea}
                            onChange={(e) => setBuiltupArea(e.target.value)}
                            placeholder="1400" 
                            className="rounded-xl h-12 bg-slate-50 border-none font-medium" 
                        />
                    </div>
                 </div>
            </div>

            <div className="space-y-4">
                 <Label className="text-base font-black text-slate-900">Floor Details</Label>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <span className="text-[10px] font-black text-slate-400 uppercase">Floor Number (0 for Ground)</span>
                        <Input 
                            value={floorNumber}
                            onChange={(e) => setFloorNumber(e.target.value)}
                            placeholder="5" 
                            className="rounded-xl h-12 bg-slate-50 border-none font-medium" 
                        />
                    </div>
                    <div className="space-y-2">
                        <span className="text-[10px] font-black text-slate-400 uppercase">Total Floors</span>
                        <Input 
                            value={totalFloors}
                            onChange={(e) => setTotalFloors(e.target.value)}
                            placeholder="12" 
                            className="rounded-xl h-12 bg-slate-50 border-none font-medium" 
                        />
                    </div>
                 </div>
            </div>
        </div>

        <div className="space-y-8">
            <div className="space-y-4">
                 <Label className="text-base font-black text-slate-900">Property Age</Label>
                 <div className="flex flex-wrap gap-2">
                    {["0-1 Y", "1-5 Y", "5-10 Y", "10+ Y"].map(a => (
                        <Button 
                            key={a}
                            onClick={() => setPropertyAge(a)}
                            variant="outline" 
                            className={cn(
                                "rounded-xl px-4 h-10 font-bold transition-all",
                                propertyAge === a ? "bg-primary/10 text-primary border-primary/20 shadow-sm" : "border-slate-100 hover:border-primary/30"
                            )}
                        >
                            {a}
                        </Button>
                    ))}
                 </div>
            </div>

            {isResidential && (
              <div className="space-y-4">
                  <Label className="text-base font-black text-slate-900">Furnishing</Label>
                  <div className="flex flex-wrap gap-2">
                      {["un-furnished", "semi-furnished", "fully-furnished"].map(f => (
                          <Button 
                              key={f}
                              onClick={() => setFurnishing(f)}
                              variant="outline" 
                              className={cn(
                                  "rounded-xl px-4 h-10 font-bold transition-all capitalize",
                                  furnishing === f ? "bg-primary/10 text-primary border-primary/20 shadow-sm" : "border-slate-100 hover:border-primary/30"
                              )}
                          >
                              {f.replace("-", " ")}
                          </Button>
                      ))}
                  </div>
              </div>
            )}

            <div className="space-y-4">
                 <Label className="text-base font-black text-slate-900">Possession</Label>
                 <div className="flex flex-wrap gap-2">
                    {["Ready to Move", "Under Construction"].map(p => (
                        <Button 
                            key={p}
                            onClick={() => setPossession(p)}
                            variant="outline" 
                            className={cn(
                                "rounded-xl px-4 h-10 font-bold transition-all",
                                possession === p ? "bg-primary/10 text-primary border-primary/20 shadow-sm" : "border-slate-100 hover:border-primary/30"
                            )}
                        >
                            {p}
                        </Button>
                    ))}
                 </div>
            </div>
        </div>
      </div>

      <div className="space-y-6 pt-10 border-t border-slate-50">
        <h4 className="text-lg font-black text-slate-900">Amenities</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {amenitiesList.map(amenity => (
                <label 
                    key={amenity} 
                    className={cn(
                        "flex items-center gap-3 p-4 rounded-2xl cursor-pointer transition-all border-2 group",
                        selectedAmenities.includes(amenity) ? "bg-white border-primary shadow-lg shadow-primary/5" : "bg-slate-50 border-transparent hover:border-primary/20"
                    )}
                >
                    <div className={cn(
                        "w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors",
                        selectedAmenities.includes(amenity) ? "border-primary bg-primary" : "border-slate-200 group-hover:border-primary"
                    )}>
                        <div className={cn(
                            "w-2 h-2 rounded-full bg-white transition-opacity",
                            selectedAmenities.includes(amenity) ? "opacity-100" : "opacity-0"
                        )} />
                    </div>
                    <input 
                        type="checkbox" 
                        className="hidden" 
                        checked={selectedAmenities.includes(amenity)}
                        onChange={() => toggleAmenity(amenity)}
                    />
                    <span className={cn(
                        "text-[11px] font-black uppercase tracking-wider transition-colors",
                        selectedAmenities.includes(amenity) ? "text-primary" : "text-slate-500 group-hover:text-primary"
                    )}>{amenity}</span>
                </label>
            ))}
        </div>
      </div>

      <div className="space-y-4 pt-10 border-t border-slate-50">
        <div className="flex items-center justify-between">
             <Label className="text-lg font-black text-slate-900">Description</Label>
             <span className={cn(
                 "text-[10px] font-bold",
                 description.length < 100 ? "text-amber-500" : "text-green-500"
             )}>Min 100 chars • {description.length}/2000</span>
        </div>
        <Textarea 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your property — highlight key features, nearby landmarks, unique selling points..." 
            className="rounded-3xl bg-slate-50 border-none font-medium min-h-[150px] p-6 focus-visible:ring-primary/20"
        />
      </div>

      <div className="fixed md:relative bottom-0 left-0 right-0 p-6 bg-white/95 backdrop-blur-md md:bg-transparent border-t md:border-none border-slate-100 z-50 flex items-center justify-between mt-auto">
        <Button 
          variant="ghost" 
          onClick={() => router.push("/owner/post/location")} 
          className="font-black text-slate-500 hover:text-primary rounded-xl h-14 px-4 md:px-8 gap-2"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="hidden md:inline">Back</span>
        </Button>
        <Button 
          onClick={handleNext} 
          disabled={isDraftLoading || isInitializing || description.length < 100 || !carpetArea || !builtupArea || !floorNumber}
          className="bg-slate-900 hover:bg-slate-800 text-white font-black h-14 px-8 md:px-10 rounded-2xl gap-2 shadow-xl shadow-slate-200 transition-all active:scale-95 disabled:opacity-50 flex-1 md:flex-none"
        >
          {isDraftLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Continue"}
          {!isDraftLoading && <ChevronRight className="w-5 h-5" />}
        </Button>
      </div>
    </motion.div>
  )
}
