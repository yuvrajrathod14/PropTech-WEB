"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { MapPin, ChevronRight, ChevronLeft, PlusCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { usePropertyDraft } from "@/hooks/use-property-draft"

export default function PostStep2() {
  const router = useRouter()
  const { saveStepData, loadDraft, draftId, isLoading: isDraftLoading } = usePropertyDraft()
  
  const [address, setAddress] = useState("")
  const [locality, setLocality] = useState("")
  const [city, setCity] = useState("ahmedabad")
  const [pincode, setPincode] = useState("")
  const [lat, setLat] = useState(23.0225)
  const [lng, setLng] = useState(72.5714)
  const [isInitializing, setIsInitializing] = useState(true)
  const [isGeocoding, setIsGeocoding] = useState(false)

  // Load existing draft
  useEffect(() => {
    const fetchDraft = async () => {
      if (draftId) {
        const draft = await loadDraft() as any
        if (draft) {
          setAddress(draft.address || "")
          setLocality(draft.locality || "")
          setCity(draft.city?.toLowerCase() || "ahmedabad")
          setPincode(draft.pincode || "")
          setLat(Number(draft.latitude) || 23.0225)
          setLng(Number(draft.longitude) || 72.5714)
        }
      }
      setIsInitializing(false)
    }
    fetchDraft()
  }, [draftId, loadDraft])

  const reverseGeocode = async (latitude: number, longitude: number) => {
    setIsGeocoding(true)
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`)
      const data = await response.json()
      if (data.address) {
        setLocality(data.address.suburb || data.address.neighbourhood || data.address.residential || "")
        setPincode(data.address.postcode || "")
      }
    } catch (error) {
      console.error("Geocoding error:", error)
    } finally {
      setIsGeocoding(false)
    }
  }

  const handleUseMyLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const newLat = position.coords.latitude
        const newLng = position.coords.longitude
        setLat(newLat)
        setLng(newLng)
        reverseGeocode(newLat, newLng)
      })
    }
  }

  const handleNext = async () => {
    await saveStepData({
      address: address, // Society/Building
      locality: locality,
      city: city,
      state: "Gujarat",
      pincode: pincode,
      latitude: lat,
      longitude: lng
    }, "/owner/post/details")
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 flex-1 flex flex-col"
    >
      <div className="space-y-6">
        <h3 className="text-2xl font-black text-slate-900 tracking-tight">Where is your property located?</h3>
        
        {/* Mock Map */}
        <div className="relative rounded-3xl overflow-hidden bg-slate-100 border-2 border-slate-50 shadow-inner group h-[300px]">
            <div className="absolute inset-0 bg-[#f8f9fa] flex items-center justify-center">
                <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'radial-gradient(#000 1px, transparent 0)', backgroundSize: '40px 40px'}} />
                <motion.div 
                    drag 
                    dragConstraints={{top: -100, left: -150, right: 150, bottom: 100}}
                    onDragEnd={(_, info) => {
                        // Simulate coordinate change based on drag
                        const newLat = lat + (info.point.y / 10000)
                        const newLng = lng + (info.point.x / 10000)
                        setLat(newLat)
                        setLng(newLng)
                        reverseGeocode(newLat, newLng)
                    }}
                    className="z-10 cursor-grab active:cursor-grabbing w-10 h-10 text-primary"
                >
                    <MapPin className="w-full h-full drop-shadow-xl" />
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-slate-900/10 rounded-full blur-sm" />
                </motion.div>
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
                    {isGeocoding && <div className="bg-white/90 backdrop-blur-md px-4 py-1 rounded-full flex items-center gap-2 shadow-xl border border-slate-100">
                        <Loader2 className="w-3 h-3 animate-spin text-primary" />
                        <span className="text-[10px] font-black text-slate-500 uppercase">Geocoding...</span>
                    </div>}
                    <p className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full text-[10px] font-black text-slate-500 uppercase tracking-widest shadow-xl border border-slate-100">Drag marker to exact location</p>
                </div>
            </div>
            <div className="absolute top-6 right-6 flex flex-col gap-2 font-mono text-[10px] bg-white/80 p-2 rounded-xl border">
                <div>LAT: {lat.toFixed(4)}</div>
                <div>LNG: {lng.toFixed(4)}</div>
            </div>
            <Button 
                onClick={handleUseMyLocation}
                className="absolute bottom-6 left-6 bg-primary text-white h-12 px-6 rounded-2xl shadow-xl shadow-primary/20 font-black gap-2 transition-all active:scale-95"
            >
                <MapPin className="w-4 h-4" />
                Use My Current Location
            </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
                <Label className="font-bold text-slate-700">Society/Building Name</Label>
                <Input 
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. Godrej Garden City" 
                    className="rounded-xl h-12 bg-slate-50 border-none font-medium" 
                />
            </div>
            <div className="space-y-2">
                <Label className="font-bold text-slate-700">Locality</Label>
                <Input 
                    value={locality}
                    onChange={(e) => setLocality(e.target.value)}
                    placeholder="e.g. Science City Road" 
                    className="rounded-xl h-12 bg-slate-50 border-none font-medium" 
                />
            </div>
            <div className="space-y-2">
                <Label className="font-bold text-slate-700">City</Label>
                <Select value={city} onValueChange={setCity}>
                    <SelectTrigger className="rounded-xl h-12 bg-slate-50 border-none font-medium">
                        <SelectValue placeholder="Select City" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                        <SelectItem value="ahmedabad">Ahmedabad</SelectItem>
                        <SelectItem value="surat">Surat</SelectItem>
                        <SelectItem value="vadodara">Vadodara</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <Label className="font-bold text-slate-700">Pincode</Label>
                <Input 
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    placeholder="380060" 
                    className="rounded-xl h-12 bg-slate-50 border-none font-medium text-center tracking-widest" 
                    maxLength={6} 
                />
            </div>
        </div>
      </div>

      <div className="fixed md:relative bottom-0 left-0 right-0 p-6 bg-white/95 backdrop-blur-md md:bg-transparent border-t md:border-none border-slate-100 z-50 flex items-center justify-between mt-auto">
        <Button 
          variant="ghost" 
          onClick={() => router.push("/owner/post")} 
          className="font-black text-slate-500 hover:text-primary rounded-xl h-14 px-4 md:px-8 gap-2"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="hidden md:inline">Back</span>
        </Button>
        <Button 
          onClick={handleNext} 
          disabled={isDraftLoading || isInitializing || !address || !locality || !pincode}
          className="bg-slate-900 hover:bg-slate-800 text-white font-black h-14 px-8 md:px-10 rounded-2xl gap-2 shadow-xl shadow-slate-200 transition-all active:scale-95 disabled:opacity-50 flex-1 md:flex-none"
        >
          {isDraftLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Continue"}
          {!isDraftLoading && <ChevronRight className="w-5 h-5" />}
        </Button>
      </div>
    </motion.div>
  )
}
