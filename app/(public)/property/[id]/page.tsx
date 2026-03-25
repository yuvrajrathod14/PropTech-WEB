"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { 
  MapPin, 
  BedDouble, 
  Square, 
  Heart, 
  Share2, 
  CheckCircle2, 
  Calendar, 
  Clock, 
  ArrowRight, 
  Phone, 
  MessageSquare,
  ShieldCheck,
  Star,
  ChevronRight,
  Calculator,
  Info,
  ParkingCircle,
  Zap,
  Waves,
  Shield,
  Dumbbell,
  Trees,
  Users,
  FileWarning
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ImageCarousel } from "@/components/shared/image-carousel"
import { PropertyCard } from "@/components/shared/property-card"
import { formatIndianPrice } from "@/lib/utils/formatPrice"
import { mockProperties } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

export default function PropertyDetailPage({ params }: { params: { id: string } }) {
  const property = mockProperties.find(p => p.id === params.id) || mockProperties[0]
  
  // EMI Calculator State
  const [loanAmount, setLoanAmount] = useState(property.price * 0.8)
  const [interestRate, setInterestRate] = useState(8.5)
  const [tenure, setTenure] = useState(20)

  const emi = useMemo(() => {
    const r = interestRate / 12 / 100
    const n = tenure * 12
    const p = loanAmount
    const emiAmount = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
    return Math.round(emiAmount)
  }, [loanAmount, interestRate, tenure])

  const totalPayable = emi * tenure * 12
  const totalInterest = totalPayable - loanAmount

  const amenities = [
    { icon: ParkingCircle, label: "Parking", available: true },
    { icon: Zap, label: "Power Backup", available: true },
    { icon: Waves, label: "Swimming Pool", available: true },
    { icon: Shield, label: "Security", available: true },
    { icon: Dumbbell, label: "Gym", available: true },
    { icon: Trees, label: "Garden", available: true },
    { icon: Users, label: "Clubhouse", available: true },
    { icon: Clock, label: "24/7 Water", available: true },
    { icon: ShieldCheck, label: "Intercom", available: false },
    { icon: CheckCircle2, label: "Fire Safety", available: true },
    { icon: MessageSquare, label: "Kids Play Area", available: true },
    { icon: Zap, label: "EV Charging", available: false },
  ]

  const nearbyPlaces = [
    { name: "Global Indian International School", distance: "0.8 km", time: "5 mins", type: "School" },
    { name: "CIMS Hospital", distance: "1.2 km", time: "8 mins", type: "Hospital" },
    { name: "Iscon Mega Mall", distance: "2.5 km", time: "12 mins", type: "Mall" },
    { name: "Thaltej Metro Station", distance: "1.5 km", time: "7 mins", type: "Metro" },
  ]

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20">
      <div className="container mx-auto px-4">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-8">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/search" className="hover:text-primary transition-colors">Ahmedabad</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-slate-900">3 BHK Flat in Satellite</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Left Content Column */}
          <div className="flex-1 space-y-10">
            
            {/* Gallery Section */}
            <section className="relative rounded-[40px] overflow-hidden border-4 border-white shadow-2xl">
              <ImageCarousel images={[
                property.image,
                "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200",
                "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&q=80&w=1200",
                "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&q=80&w=1200",
              ]} />
              
              <div className="absolute top-6 left-6 flex flex-col gap-2">
                <Badge className="bg-amber-400 text-amber-900 border-none px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-wider shadow-lg">
                  <Star className="w-3 h-3 mr-1.5 fill-current" />
                  Featured
                </Badge>
                <Badge className="bg-emerald-500 text-white border-none px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-wider shadow-lg">
                  <ShieldCheck className="w-3 h-3 mr-1.5" />
                  Verified
                </Badge>
              </div>

              <div className="absolute top-6 right-6 flex gap-3">
                <Button size="icon" className="w-12 h-12 rounded-2xl bg-white/90 backdrop-blur-sm shadow-xl hover:bg-white text-slate-900 transition-all hover:scale-110">
                  <Share2 className="w-5 h-5" />
                </Button>
                <Button size="icon" className="w-12 h-12 rounded-2xl bg-white/90 backdrop-blur-sm shadow-xl hover:bg-white text-slate-900 hover:text-red-500 transition-all hover:scale-110">
                  <Heart className="w-5 h-5" />
                </Button>
              </div>
            </section>

            {/* Property Header */}
            <section className="bg-white rounded-[40px] p-8 md:p-10 shadow-xl shadow-slate-200/50 border border-slate-100">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                <div className="space-y-4">
                  <p className="text-xs font-black text-primary uppercase tracking-[0.2em]">{property.category} • Ahmedabad</p>
                  <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight max-w-2xl">
                    {property.title} in Satellite
                  </h1>
                  <div className="flex items-center text-slate-500 font-bold group">
                    <MapPin className="w-5 h-5 mr-2 text-primary group-hover:animate-bounce" />
                    <span className="text-lg">Near Iscon Cross Road, Satellite, Ahmedabad — 380015</span>
                  </div>
                </div>
                <div className="text-left md:text-right space-y-2">
                  <div className="flex items-center md:justify-end gap-3">
                    <p className="text-4xl font-black text-primary tracking-tighter">
                      {formatIndianPrice(property.price)}
                    </p>
                    <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-100 font-bold text-[10px] px-3 py-1 uppercase tracking-wider">
                      Negotiable
                    </Badge>
                  </div>
                  <p className="text-slate-400 font-bold text-sm tracking-wide uppercase">₹4,483 / SQ.FT</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[
                  { icon: BedDouble, label: "Config", val: property.beds + " BHK" },
                  { icon: Square, label: "Area", val: property.area + " sqft" },
                  { icon: Info, label: "Furnishing", val: "Semi" },
                  { icon: LayoutGrid, label: "Floor", val: "5th of 12" },
                  { icon: Calendar, label: "Status", val: "Ready" },
                ].map((item, i) => (
                  <div key={i} className="bg-slate-50/80 rounded-3xl p-4 border border-slate-100 group hover:bg-white hover:shadow-xl transition-all duration-300">
                    <item.icon className="w-5 h-5 text-slate-300 mb-3 group-hover:text-primary transition-colors" />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{item.label}</p>
                    <p className="text-sm font-black text-slate-800">{item.val}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Tabs Section */}
            <Tabs defaultValue="overview" className="space-y-8">
              <TabsList className="w-full justify-start bg-transparent h-auto p-0 border-b border-slate-200 rounded-none gap-8">
                {["Overview", "Amenities", "Location", "Similar"].map((t) => (
                  <TabsTrigger 
                    key={t}
                    value={t.toLowerCase()}
                    className="bg-transparent border-none text-slate-400 font-black text-sm uppercase tracking-widest px-0 py-4 h-auto data-[state=active]:text-primary data-[state=active]:border-b-4 data-[state=active]:border-primary transition-all rounded-none shadow-none"
                  >
                    {t}
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value="overview" className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid md:grid-cols-2 gap-10">
                  <div className="space-y-6">
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">Property Description</h3>
                    <div className="prose prose-slate max-w-none">
                      <p className="text-slate-600 leading-relaxed font-medium">
                        Welcome to this luxurious and spacious 3BHK apartment located in the heart of Ahmedabad&apos;s most premium residential neighborhood. 
                        This east-facing unit is flooded with natural light and features broad balconies that offer a serene view of the city skyline. 
                        The property has been meticulously maintained and comes with premium semi-furnishing including designer wardrobes in all bedrooms 
                        and a modern modular kitchen with a chimney. The location offers unparalleled connectivity to major business hubs, 
                        top-tier schools, and world-class healthcare facilities.
                      </p>
                    </div>
                    <Button variant="link" className="p-0 h-auto text-primary font-black uppercase tracking-widest text-xs gap-2">
                      Read Full Description <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="bg-white rounded-[40px] p-8 md:p-10 border border-slate-100 shadow-xl shadow-slate-200/50">
                    <h3 className="text-xl font-black text-slate-900 tracking-tight mb-6">Inside Details</h3>
                    <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                      {[
                        { k: "Carpet Area", v: "1450 sqft" },
                        { k: "Built-up Area", v: "1620 sqft" },
                        { k: "Facing", v: "East" },
                        { k: "Property Age", v: "3 Years" },
                        { k: "Possession", v: "Immediate" },
                        { k: "Authority", v: "AUDA Approved" },
                      ].map((d, i) => (
                        <div key={i} className="space-y-1">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{d.k}</p>
                          <p className="text-sm font-black text-slate-800">{d.v}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="amenities" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-white rounded-[40px] p-8 md:p-10 border border-slate-100 shadow-xl shadow-slate-200/50">
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-8">Modern Amenities</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {amenities.map((item, i) => (
                      <div key={i} className={cn(
                        "flex items-center gap-4 transition-all group",
                        !item.available && "opacity-40 grayscale"
                      )}>
                        <div className={cn(
                          "w-12 h-12 rounded-2xl flex items-center justify-center transition-all",
                          item.available ? "bg-primary/5 text-primary group-hover:bg-primary group-hover:text-white" : "bg-slate-100 text-slate-400"
                        )}>
                          <item.icon className={cn("w-6 h-6", !item.available && "stroke-[1]")} />
                        </div>
                        <span className={cn(
                          "text-sm font-black uppercase tracking-wider",
                          item.available ? "text-slate-700" : "text-slate-400 line-through"
                        )}>{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="location" className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="relative rounded-[40px] overflow-hidden h-[400px] border-4 border-white shadow-2xl">
                  <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/light-v10/static/72.5714,23.0225,12/1200x800?access_token=pk.eyJ1Ijoiam9obmRvZSIsImEiOiJjbDFhMmIzYTRjNWQzM2VwZXF6eGZpMW5oIn0.a1b2c3d4e5f6')] bg-cover bg-center" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 bg-primary rounded-full border-4 border-white shadow-2xl animate-bounce flex items-center justify-center">
                      <MapPin className="text-white w-6 h-6" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-[40px] p-8 md:p-10 border border-slate-100 shadow-xl shadow-slate-200/50">
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-8">What&apos;s Nearby?</h3>
                  <div className="grid md:grid-cols-2 gap-x-12 gap-y-10">
                    {nearbyPlaces.map((place, i) => (
                      <div key={i} className="flex items-start justify-between group">
                        <div className="flex gap-4">
                          <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 group-hover:bg-primary/5 transition-colors">
                            <MapPin className="w-5 h-5 text-slate-400 group-hover:text-primary transition-colors" />
                          </div>
                          <div>
                            <p className="text-sm font-black text-slate-800 tracking-tight">{place.name}</p>
                            <p className="text-xs font-bold text-slate-400 uppercase mt-1 tracking-widest">{place.type}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-black text-primary">{place.distance}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{place.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="similar" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid md:grid-cols-2 gap-8">
                  {mockProperties.slice(0, 2).map((p) => (
                    <PropertyCard key={p.id} property={p} />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Sidebar */}
          <aside className="w-full lg:w-[400px] shrink-0 space-y-8">
            
            {/* Owner Card */}
            <div className="bg-white rounded-[40px] p-8 border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16" />
              <div className="flex items-center gap-5 mb-8">
                <Avatar className="w-16 h-16 border-4 border-slate-50 shadow-xl">
                  <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150" />
                  <AvatarFallback className="bg-primary text-white font-black">PK</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xl font-black text-slate-900 tracking-tight">Pankaj Kumar</h4>
                    <ShieldCheck className="w-5 h-5 text-emerald-500" />
                  </div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.1em] mt-1">Owner • Individual</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Listings</p>
                  <p className="text-lg font-black text-slate-800">4 Active</p>
                </div>
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Joined</p>
                  <p className="text-lg font-black text-slate-800">2 Years</p>
                </div>
              </div>

              <div className="space-y-4">
                <Dialog>
                  <DialogTrigger asChild>
                    <button className={cn(
                      "w-full h-14 bg-primary hover:bg-primary-dark text-white font-black rounded-2xl text-lg shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] flex items-center justify-center gap-3"
                    )}>
                      <MessageSquare className="w-5 h-5" />
                      Send Enquiry
                    </button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md rounded-[40px] border-none shadow-2xl">
                    <DialogHeader>
                      <DialogTitle className="text-3xl font-black text-slate-900">Get Details</DialogTitle>
                      <DialogDescription className="font-bold text-slate-500">Send an enquiry to the owner directly.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6 pt-6">
                      <div className="space-y-2">
                        <Label className="text-xs font-black uppercase text-slate-400">Your Purpose</Label>
                        <div className="flex gap-2">
                          {['Buying', 'Renting', 'Investment'].map(p => (
                            <Badge key={p} variant="outline" className="px-4 py-2 rounded-xl border-2 cursor-pointer hover:border-primary transition-all font-bold uppercase text-[10px]">{p}</Badge>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs font-black uppercase text-slate-400">Message</Label>
                        <Input placeholder="I'm interested in this property..." className="h-12 rounded-xl bg-slate-50 border-none font-bold" />
                      </div>
                      <Button className="w-full h-14 rounded-2xl font-black text-lg">Send Now</Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <Dialog>
                  <DialogTrigger asChild>
                    <button className={cn(
                      "w-full h-14 border-2 border-slate-100 hover:border-primary hover:bg-white text-slate-900 font-black rounded-2xl text-lg transition-all hover:scale-[1.02] flex items-center justify-center gap-3"
                    )}>
                      <Calendar className="w-5 h-5 text-primary" />
                      Schedule Visit
                    </button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md rounded-[40px] border-none shadow-2xl">
                    <DialogHeader>
                      <DialogTitle className="text-3xl font-black text-slate-900">Book a Visit</DialogTitle>
                      <DialogDescription className="font-bold text-slate-500">Pick a preferred date and time for site inspection.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6 pt-6">
                      <div className="grid grid-cols-4 gap-2">
                        {[...Array(8)].map((_, i) => (
                           <div key={i} className="flex flex-col items-center p-2 rounded-xl border-2 border-slate-50 hover:border-primary cursor-pointer">
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Jan</span>
                              <span className="text-sm font-black text-slate-800">{20 + i}</span>
                           </div>
                        ))}
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs font-black uppercase text-slate-400">Time Slot</Label>
                        <div className="grid grid-cols-2 gap-2">
                           <Badge variant="outline" className="py-2 justify-center font-bold">10 AM - 12 PM</Badge>
                           <Badge variant="outline" className="py-2 justify-center font-bold">2 PM - 4 PM</Badge>
                        </div>
                      </div>
                      <Button className="w-full h-14 rounded-2xl font-black text-lg">Request Appointment</Button>
                    </div>
                  </DialogContent>
                </Dialog>
                
                <div className="pt-2">
                  <Button variant="ghost" className="w-full h-12 text-slate-500 hover:text-primary font-black uppercase tracking-widest text-xs gap-2">
                    <Phone className="w-4 h-4" />
                    +91 98*** **450 <span className="text-primary hover:underline">(Show Number)</span>
                  </Button>
                </div>
              </div>
            </div>

            {/* Book Now Card */}
            <div className="bg-emerald-600 rounded-[40px] p-8 text-white shadow-2xl shadow-emerald-600/20 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
              <div className="relative z-10 space-y-6">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                       <CheckCircle2 className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="text-xl font-black tracking-tight">Ready to Book?</h4>
                 </div>
                 <div className="space-y-2">
                    <p className="text-xs font-bold text-white/80 uppercase tracking-widest">Token Amount</p>
                    <p className="text-3xl font-black tracking-tighter">₹51,000</p>
                    <p className="text-[10px] font-bold text-white/60">Includes ₹1,000 platform fee (Refunadable*)</p>
                 </div>
                 <Button className="w-full h-14 bg-white text-emerald-600 hover:bg-emerald-50 font-black rounded-2xl text-lg shadow-xl shadow-white/10">
                    Pay Token & Book
                 </Button>
              </div>
            </div>

            {/* EMI Calculator */}
            <div className="bg-slate-900 rounded-[40px] p-8 text-white shadow-2xl shadow-slate-900/40 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8">
                <Calculator className="w-12 h-12 text-white/10" />
              </div>
              <h4 className="text-xl font-black tracking-tight mb-8 flex items-center gap-3">
                <Calculator className="w-6 h-6 text-primary" />
                EMI Calculator
              </h4>
              <div className="space-y-8 mb-10">
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest">
                    <span className="text-slate-400">Loan Amount</span>
                    <span className="text-primary">{formatIndianPrice(loanAmount)}</span>
                  </div>
                  <Slider 
                    value={[loanAmount]} 
                    max={property.price} 
                    step={100000} 
                    onValueChange={(v) => setLoanAmount(v[0])}
                    className="py-2"
                  />
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest">
                    <span className="text-slate-400">Rate (%)</span>
                    <span className="text-primary">{interestRate}%</span>
                  </div>
                  <Slider 
                    value={[interestRate]} 
                    max={15} 
                    step={0.1} 
                    onValueChange={(v) => setInterestRate(v[0])}
                    className="py-2"
                  />
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest">
                    <span className="text-slate-400">Tenure</span>
                    <span className="text-primary">{tenure} Years</span>
                  </div>
                  <Slider 
                    value={[tenure]} 
                    max={30} 
                    step={1} 
                    onValueChange={(v) => setTenure(v[0])}
                    className="py-2"
                  />
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 space-y-4">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-center text-slate-400">Estimated Monthly EMI</p>
                <div className="text-center">
                  <h5 className="text-4xl font-black text-white tracking-tighter mb-1">₹{emi.toLocaleString('en-IN')}</h5>
                  <p className="text-xs font-bold text-slate-400 line-through tracking-wider">Starting at ₹55,000</p>
                </div>
                <Separator className="bg-white/10" />
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                  <div className="text-center">
                    <p className="text-slate-400 mb-1">Total Payable</p>
                    <p className="text-white">{formatIndianPrice(totalPayable)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-slate-400 mb-1">Interest</p>
                    <p className="text-white">{formatIndianPrice(totalInterest)}</p>
                  </div>
                </div>
              </div>

              <Button className="w-full h-14 bg-white hover:bg-slate-100 text-slate-900 font-black rounded-2xl text-lg mt-8 transition-all hover:scale-[1.02]">
                Apply for Home Loan
              </Button>
            </div>

            {/* Support / Report */}
            <div className="text-center">
               <button className="flex items-center gap-2 mx-auto text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] hover:text-red-500 transition-colors">
                  <FileWarning className="w-4 h-4" />
                  Report this Listing
               </button>
            </div>
          </aside>
        </div>
      </div>

      {/* Mobile Sticky Action Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-100 p-4 z-50 flex items-center justify-between gap-4 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
        <div>
           <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Total Value</p>
           <p className="text-xl font-black text-slate-900">{formatIndianPrice(property.price)}</p>
        </div>
        <Button className="flex-1 h-14 bg-primary text-white font-black rounded-2xl text-lg shadow-xl shadow-primary/20">
           Enquire Now
        </Button>
      </div>
    </div>
  )
}

function LayoutGrid(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="7" height="7" x="3" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="14" rx="1" />
      <rect width="7" height="7" x="3" y="14" rx="1" />
    </svg>
  )
}
