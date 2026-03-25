"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Building2, 
  MapPin, 
  Camera, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft,
  IndianRupee,
  LayoutGrid,
  Info,
  Loader2,
  Home,
  Store,
  Warehouse,
  Video,
  Calendar,
  Phone,
  MessageSquare,
  PlusCircle
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"

const steps = [
  { id: 1, title: "Type", icon: Building2 },
  { id: 2, title: "Location", icon: MapPin },
  { id: 3, title: "Details", icon: LayoutGrid },
  { id: 4, title: "Photos", icon: Camera },
  { id: 5, title: "Price", icon: IndianRupee },
]

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

const amenities = [
  "Swimming Pool", "Gym", "Club House", 
  "Security", "Power Backup", "Garden",
  "Elevator", "Car Parking", "CCTV",
  "Kids Play Area", "Intercom", "WiFi"
]

export default function PostPropertyPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  // Form State
  const [formData, setFormData] = useState({
    type: "flat",
    intent: "Sale", // Sale, Rent, Both
    title: "",
    description: "",
    price: "",
    rent: "",
    deposit: "",
    maintenance: "",
    maintenanceIncluded: false,
    bhk: "2",
    carpetArea: "",
    builtUpArea: "",
    floorNum: "",
    totalFloors: "",
    age: "0-1 Years",
    furnishing: "Unfurnished",
    facing: "North",
    possession: "Ready to Move",
    city: "",
    locality: "",
    society: "",
    address: "",
    lat: 23.0225,
    lng: 72.5714,
    images: [] as string[],
    coverPhoto: "" as string,
    video: null as File | null,
    selectedAmenities: [] as string[],
    availableFrom: "",
    contactPreference: "Both", // Call, Chat, Both
  })

  // Mock auto-save
  useEffect(() => {
    const timer = setTimeout(() => {
      console.log("Auto-saving draft...", formData)
    }, 2000)
    return () => clearTimeout(timer)
  }, [formData])

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, steps.length))
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1))

  const handleSubmit = async () => {
    setIsLoading(true)
    // Simulate submission
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Listing Submitted! 🎉",
        description: "Our team reviews listings within 24 hours.",
      })
      router.push("/owner/dashboard")
    }, 2000)
  }

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Post Your Property</h1>
          <p className="text-slate-500 font-medium text-lg">Detailed information helps you get 3x more enquiries.</p>
        </div>
        <div className="flex items-center gap-2">
            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Draft Saved</span>
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        </div>
      </div>

      {/* Stepper */}
      <div className="relative flex justify-between items-center px-4 max-w-3xl mx-auto">
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-100 -z-10 -translate-y-1/2" />
        {steps.map((step) => (
          <div key={step.id} className="relative flex flex-col items-center gap-2">
            <div className={cn(
              "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 border-4 border-white shadow-xl",
              currentStep === step.id ? "bg-primary text-white scale-110 shadow-primary/20 ring-4 ring-primary/5" : 
              currentStep > step.id ? "bg-emerald-500 text-white" : "bg-white text-slate-400"
            )}>
              {currentStep > step.id ? <CheckCircle2 className="w-6 h-6" /> : <step.icon className="w-5 h-5" />}
            </div>
            <span className={cn(
              "text-[10px] font-black uppercase tracking-widest transition-colors hidden sm:block",
              currentStep === step.id ? "text-primary" : "text-slate-400"
            )}>
              {step.title}
            </span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        <div className="lg:col-span-3">
          <Card className="border-none shadow-sm rounded-[32px] p-8 md:p-10 min-h-[600px] flex flex-col">
            <AnimatePresence mode="wait">
              {/* STEP 1: Type & Intent */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-10 flex-1"
                >
                  <div className="space-y-6">
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">What are you listing?</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {propertyTypes.map((pt) => (
                        <div 
                          key={pt.id}
                          onClick={() => setFormData({...formData, type: pt.id})}
                          className={cn(
                            "cursor-pointer p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-3 text-center group",
                            formData.type === pt.id 
                                ? "border-primary bg-primary/5 shadow-lg shadow-primary/5" 
                                : "border-slate-50 bg-slate-50/50 hover:bg-white hover:border-slate-200"
                          )}
                        >
                          <div className={cn(
                            "w-12 h-12 rounded-2xl flex items-center justify-center transition-colors",
                            formData.type === pt.id ? "bg-primary text-white" : "bg-white text-slate-400 group-hover:bg-slate-100 group-hover:text-slate-600"
                          )}>
                             <pt.icon className="w-6 h-6" />
                          </div>
                          <span className={cn("text-xs font-black leading-tight", formData.type === pt.id ? "text-primary" : "text-slate-600")}>
                            {pt.label}
                          </span>
                          {formData.type === pt.id && (
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
                      {["For Sale", "For Rent", "Both"].map((mode) => (
                        <Button
                          key={mode}
                          variant="ghost"
                          onClick={() => setFormData({...formData, intent: mode})}
                          className={cn(
                            "rounded-xl px-8 h-12 font-black text-sm transition-all",
                            formData.intent === mode ? "bg-white text-primary shadow-sm scale-[1.02]" : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
                          )}
                        >
                          {mode}
                        </Button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: Location */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8 flex-1"
                >
                  <div className="space-y-6">
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">Where is your property located?</h3>
                    
                    {/* Mock Map */}
                    <div className="relative rounded-3xl overflow-hidden bg-slate-100 border-2 border-slate-50 shadow-inner group">
                        <div className="absolute inset-0 bg-[#f8f9fa] flex items-center justify-center">
                            {/* Simple grid pattern for mock map */}
                            <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'radial-gradient(#000 1px, transparent 0)', backgroundSize: '40px 40px'}} />
                            <motion.div 
                                drag 
                                dragConstraints={{top: 0, left: 0, right: 0, bottom: 0}}
                                className="z-10 cursor-grab active:cursor-grabbing w-10 h-10 text-primary"
                            >
                                <MapPin className="w-full h-full drop-shadow-xl" />
                                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-slate-900/10 rounded-full blur-sm" />
                            </motion.div>
                            <p className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full text-[10px] font-black text-slate-500 uppercase tracking-widest shadow-xl border border-slate-100">Drag marker to exact location</p>
                        </div>
                        <div className="absolute top-6 right-6 flex flex-col gap-2">
                             <Button size="icon" className="bg-white hover:bg-slate-50 text-slate-900 shadow-xl rounded-xl border-none"><PlusCircle className="w-4 h-4" /></Button>
                             <Button size="icon" className="bg-white hover:bg-slate-50 text-slate-900 shadow-xl rounded-xl border-none"><PlusCircle className="w-4 h-4 rotate-45" /></Button>
                        </div>
                        <Button className="absolute bottom-6 left-6 bg-primary text-white h-12 px-6 rounded-2xl shadow-xl shadow-primary/20 font-black gap-2">
                            <MapPin className="w-4 h-4" />
                            Use My Current Location
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label className="font-bold text-slate-700">Society/Building Name</Label>
                            <Input placeholder="e.g. Godrej Garden City" className="rounded-xl h-12 bg-slate-50 border-none font-medium" />
                        </div>
                        <div className="space-y-2">
                            <Label className="font-bold text-slate-700">Locality</Label>
                            <Input placeholder="e.g. Science City Road" className="rounded-xl h-12 bg-slate-50 border-none font-medium" />
                        </div>
                        <div className="space-y-2">
                            <Label className="font-bold text-slate-700">City</Label>
                            <Select>
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
                            <Input placeholder="380060" className="rounded-xl h-12 bg-slate-50 border-none font-medium text-center tracking-widest" maxLength={6} />
                        </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: Details */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-10 flex-1"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-8">
                        <div className="space-y-4">
                             <Label className="text-base font-black text-slate-900">Config: BHK</Label>
                             <div className="flex flex-wrap gap-2">
                                {["1", "2", "3", "4", "4+", "N/A"].map(b => (
                                    <Button 
                                        key={b}
                                        onClick={() => setFormData({...formData, bhk: b})}
                                        variant="outline" 
                                        className={cn(
                                            "rounded-xl w-12 h-12 font-black transition-all",
                                            formData.bhk === b ? "bg-primary text-white border-primary border-4 shadow-lg shadow-primary/20 scale-110" : "border-slate-100 hover:border-slate-200"
                                        )}
                                    >
                                        {b}
                                    </Button>
                                ))}
                             </div>
                        </div>

                        <div className="space-y-4">
                             <Label className="text-base font-black text-slate-900">Area Details</Label>
                             <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <span className="text-[10px] font-black text-slate-400 uppercase">Carpet Area (Sqft)</span>
                                    <Input placeholder="1250" className="rounded-xl h-12 bg-slate-50 border-none font-medium" />
                                </div>
                                <div className="space-y-2">
                                    <span className="text-[10px] font-black text-slate-400 uppercase">Built-up Area (Sqft)</span>
                                    <Input placeholder="1400" className="rounded-xl h-12 bg-slate-50 border-none font-medium" />
                                </div>
                             </div>
                        </div>

                        <div className="space-y-4">
                             <Label className="text-base font-black text-slate-900">Floor Details</Label>
                             <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <span className="text-[10px] font-black text-slate-400 uppercase">Floor Number</span>
                                    <Input placeholder="5" className="rounded-xl h-12 bg-slate-50 border-none font-medium" />
                                </div>
                                <div className="space-y-2">
                                    <span className="text-[10px] font-black text-slate-400 uppercase">Total Floors</span>
                                    <Input placeholder="12" className="rounded-xl h-12 bg-slate-50 border-none font-medium" />
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
                                        variant="outline" 
                                        className="rounded-xl px-4 h-10 font-bold border-slate-100 hover:border-primary/30"
                                    >
                                        {a}
                                    </Button>
                                ))}
                             </div>
                        </div>

                        <div className="space-y-4">
                             <Label className="text-base font-black text-slate-900">Furnishing</Label>
                             <div className="flex flex-wrap gap-2">
                                {["Unfurnished", "Semi", "Full"].map(f => (
                                    <Button 
                                        key={f}
                                        variant="outline" 
                                        className="rounded-xl px-4 h-10 font-bold border-slate-100 hover:border-primary/30"
                                    >
                                        {f}
                                    </Button>
                                ))}
                             </div>
                        </div>

                        <div className="space-y-4">
                             <Label className="text-base font-black text-slate-900">Possession</Label>
                             <div className="flex flex-wrap gap-2">
                                {["Ready to Move", "Under Construction"].map(p => (
                                    <Button 
                                        key={p}
                                        variant="outline" 
                                        className="rounded-xl px-4 h-10 font-bold border-slate-100 hover:border-primary/30"
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
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {amenities.map(amenity => (
                            <label key={amenity} className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 cursor-pointer hover:bg-white border-2 border-transparent hover:border-primary/20 transition-all group">
                                <div className="w-5 h-5 rounded-md border-2 border-slate-200 group-hover:border-primary flex items-center justify-center transition-colors">
                                    <div className="w-2.5 h-2.5 rounded-sm bg-primary opacity-0 group-has-[:checked]:opacity-100 transition-opacity" />
                                </div>
                                <input type="checkbox" className="hidden peer" />
                                <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider group-hover:text-primary transition-colors">{amenity}</span>
                            </label>
                        ))}
                    </div>
                  </div>

                  <div className="space-y-4 pt-10 border-t border-slate-50">
                    <div className="flex items-center justify-between">
                         <Label className="text-lg font-black text-slate-900">Description</Label>
                         <span className="text-[10px] font-bold text-slate-400">Min 50 chars • 0/2000</span>
                    </div>
                    <Textarea 
                        placeholder="Describe your property — highlight key features, nearby landmarks, unique selling points..." 
                        className="rounded-3xl bg-slate-50 border-none font-medium min-h-[150px] p-6 focus-visible:ring-primary/20"
                    />
                  </div>
                </motion.div>
              )}

              {/* STEP 4: Photos & Video */}
              {currentStep === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-10 flex-1"
                >
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight">Add Photos & Video</h3>
                        <Badge className="bg-emerald-50 text-emerald-600 font-black border-none px-4 py-1">Min 3 Photos Required</Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2 aspect-[16/9] rounded-[32px] bg-slate-50 border-4 border-dashed border-slate-100 flex flex-col items-center justify-center gap-4 cursor-pointer hover:bg-white hover:border-primary/20 transition-all group">
                             <div className="w-16 h-16 rounded-3xl bg-white shadow-xl flex items-center justify-center text-slate-300 group-hover:text-primary group-hover:scale-110 transition-all">
                                <Camera className="w-8 h-8" />
                             </div>
                             <div className="text-center">
                                <p className="font-black text-slate-900">Upload Cover Photo</p>
                                <p className="text-xs font-medium text-slate-400">Click or drag & drop high-res image</p>
                             </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="aspect-square rounded-3xl bg-slate-50/50 border-2 border-dashed border-slate-100 flex items-center justify-center text-slate-200 hover:border-primary/20 hover:text-primary transition-all cursor-pointer">
                                    <PlusCircle className="w-6 h-6" />
                                </div>
                            ))}
                        </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-10 border-t border-slate-50">
                    <div className="space-y-6">
                         <h4 className="text-lg font-black text-slate-900">Property Video</h4>
                         <div className="aspect-video rounded-3xl bg-slate-900 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-slate-800 transition-colors group">
                            <Video className="w-10 h-10 text-white/20 group-hover:text-primary transition-colors" />
                            <p className="text-xs font-black text-white/40 uppercase tracking-widest">Upload Property Video</p>
                            <span className="text-[10px] text-white/20 font-medium">Max 2 mins • MP4 format</span>
                         </div>
                    </div>
                    <div className="space-y-6">
                        <h4 className="text-lg font-black text-slate-900">Tips for Best Results</h4>
                        <div className="bg-blue-50 rounded-3xl p-6 space-y-4">
                            <div className="flex gap-4">
                                <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-blue-600 shrink-0">💡</div>
                                <p className="text-xs font-bold text-blue-900 leading-relaxed">Listings with 10+ photos get 3x more enquiries. Show every corner!</p>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-blue-600 shrink-0">📷</div>
                                <p className="text-xs font-bold text-blue-900 leading-relaxed">Daylight photos work best. Avoid vertical/blurred shots.</p>
                            </div>
                        </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 5: Pricing */}
              {currentStep === 5 && (
                <motion.div
                  key="step5"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-10 flex-1"
                >
                  <div className="space-y-10">
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">Set Your Asking Price</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-8">
                             {formData.intent === "For Sale" || formData.intent === "Both" ? (
                                <div className="space-y-4">
                                    <Label className="text-base font-black text-slate-900">Expected Sale Price</Label>
                                    <div className="relative">
                                        <div className="absolute left-6 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-black">₹</div>
                                        <Input placeholder="6500000" className="pl-16 rounded-2xl h-16 bg-slate-50 border-none text-xl font-black text-slate-900 focus-visible:ring-primary/20" />
                                    </div>
                                    <p className="text-xs font-black text-primary uppercase tracking-widest px-2">₹ 65.0 Lakh</p>
                                </div>
                             ) : null}

                             {formData.intent === "For Rent" || formData.intent === "Both" ? (
                                <div className="space-y-6">
                                    <div className="space-y-4">
                                        <Label className="text-base font-black text-slate-900">Monthly Rent</Label>
                                        <div className="relative">
                                            <div className="absolute left-6 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-black">₹</div>
                                            <Input placeholder="25000" className="pl-16 rounded-2xl h-14 bg-slate-50 border-none text-lg font-black text-slate-900" />
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <Label className="text-base font-black text-slate-900">Security Deposit</Label>
                                        <div className="relative">
                                            <div className="absolute left-6 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-black">₹</div>
                                            <Input placeholder="50000" className="pl-16 rounded-2xl h-14 bg-slate-50 border-none text-lg font-black text-slate-900" />
                                        </div>
                                    </div>
                                </div>
                             ) : null}
                        </div>

                        <div className="space-y-8">
                            <div className="space-y-4">
                                <Label className="text-base font-black text-slate-900">Available From</Label>
                                <div className="relative">
                                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <Input type="date" className="pl-12 rounded-2xl h-14 bg-slate-50 border-none font-bold" />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <Label className="text-base font-black text-slate-900">Contact Preference</Label>
                                <div className="flex gap-4">
                                    {["Calls", "Chat", "Both"].map(pref => (
                                        <Button 
                                            key={pref}
                                            variant="outline"
                                            onClick={() => setFormData({...formData, contactPreference: pref})}
                                            className={cn(
                                                "flex-1 h-14 rounded-2xl border-slate-100 font-black transition-all",
                                                formData.contactPreference === pref ? "bg-primary text-white border-primary shadow-lg shadow-primary/10" : "hover:border-primary/20"
                                            )}
                                        >
                                            {pref === "Calls" ? <Phone className="w-4 h-4 mr-2" /> : pref === "Chat" ? <MessageSquare className="w-4 h-4 mr-2" /> : null}
                                            {pref}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Actions */}
            <div className="flex items-center justify-between pt-12 mt-auto">
              <Button 
                variant="ghost" 
                onClick={prevStep} 
                disabled={currentStep === 1 || isLoading}
                className="font-black text-slate-500 hover:text-primary rounded-xl h-14 px-8 gap-2"
              >
                <ChevronLeft className="w-5 h-5" />
                Back
              </Button>

              {currentStep < 5 ? (
                <Button 
                  onClick={nextStep} 
                  className="bg-slate-900 hover:bg-slate-800 text-white font-black h-14 px-10 rounded-2xl gap-2 shadow-xl shadow-slate-200 transition-all active:scale-95"
                >
                  Continue
                  <ChevronRight className="w-5 h-5" />
                </Button>
              ) : (
                <Button 
                  onClick={handleSubmit} 
                  disabled={isLoading}
                  className="bg-primary hover:bg-primary-dark text-white font-black h-14 px-10 rounded-2xl gap-2 shadow-xl shadow-primary/30 transition-all active:scale-95"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Post Property"}
                  <CheckCircle2 className="w-5 h-5" />
                </Button>
              )}
            </div>
          </Card>
        </div>

        {/* Sidebar Tips */}
        <div className="space-y-8">
            <div className="bg-slate-900 text-white rounded-[40px] p-8 space-y-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-bl-full" />
                <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center">
                    <Info className="w-6 h-6" />
                </div>
                <div className="space-y-2">
                    <h4 className="text-xl font-black italic">Speedy Listing Tip</h4>
                    <p className="text-slate-400 text-sm font-medium leading-relaxed">Verified owners who upload a site map or floor plan receive <span className="text-white font-bold">45% higher enquiry rates</span> from genuine buyers.</p>
                </div>
                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Need Help?</span>
                    <Button variant="link" className="text-primary font-bold p-0">Contact Support</Button>
                </div>
            </div>

            <div className="bg-white rounded-[40px] p-8 space-y-6 shadow-sm border border-slate-50">
                <div className="flex items-center justify-between">
                    <h4 className="font-black text-slate-900">Your Progress</h4>
                    <span className="text-primary font-black text-sm">{Math.round((currentStep / 5) * 100)}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(currentStep / 5) * 100}%` }}
                        className="h-full bg-primary"
                    />
                </div>
                <ul className="space-y-4">
                    {steps.map((s) => (
                        <li key={s.id} className="flex items-center gap-3">
                            <div className={cn(
                                "w-6 h-6 rounded-lg flex items-center justify-center transition-colors",
                                currentStep > s.id ? "bg-emerald-100 text-emerald-600" : 
                                currentStep === s.id ? "bg-primary/10 text-primary" : "bg-slate-50 text-slate-300"
                            )}>
                                {currentStep > s.id ? <CheckCircle2 className="w-4 h-4" /> : <s.icon className="w-3.5 h-3.5" />}
                            </div>
                            <span className={cn(
                                "text-xs font-bold",
                                currentStep >= s.id ? "text-slate-900" : "text-slate-400"
                            )}>
                                {s.title}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
      </div>
    </div>
  )
}
