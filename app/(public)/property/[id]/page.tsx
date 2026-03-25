"use client"

import { useEffect, useState, useMemo } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from "next/image"
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
  FileWarning,
  Loader2,
  LayoutGrid
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
import { formatIndianPrice } from "@/lib/utils/formatPrice"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"

export default function PropertyDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const router = useRouter()
  const [property, setProperty] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmittingEnquiry, setIsSubmittingEnquiry] = useState(false)
  const [enquiryMessage, setEnquiryMessage] = useState("")
  const [user, setUser] = useState<any>(null)
  const [isWishlisted, setIsWishlisted] = useState(false)

  // EMI Calculator State
  const [loanAmount, setLoanAmount] = useState(0)
  const [interestRate, setInterestRate] = useState(8.5)
  const [tenure, setTenure] = useState(20)

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      try {
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)

        const { data, error } = await (supabase.from("properties") as any)
          .select(`
            *,
            owner:owner_id (
              id,
              full_name,
              avatar_url,
              created_at
            )
          `)
          .eq("id", params.id)
          .single()

        if (error) throw error
        setProperty(data)
        if (data) {
          setLoanAmount(data.price * 0.8)
        }

        // Check wishlist status
        if (user) {
          const { data: wishlistData } = await (supabase.from("wishlist") as any)
            .select("id")
            .eq("user_id", user.id)
            .eq("property_id", params.id)
            .maybeSingle()
          
          setIsWishlisted(!!wishlistData)
        }
      } catch (error) {
        console.error("Error loading property:", error)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [params.id, supabase])

  const toggleWishlist = async () => {
    if (!user) {
      router.push(`/login?redirect=/property/${params.id}`)
      return
    }

    try {
      if (isWishlisted) {
        await (supabase.from("wishlist") as any)
          .delete()
          .eq("user_id", user.id)
          .eq("property_id", params.id)
        setIsWishlisted(false)
      } else {
        await (supabase.from("wishlist") as any)
          .insert({ user_id: user.id, property_id: params.id })
        setIsWishlisted(true)
      }
    } catch (error) {
      console.error("Wishlist error:", error)
    }
  }

  const handleSendEnquiry = async () => {
    if (!user) {
      router.push(`/login?redirect=/property/${params.id}`)
      return
    }

    setIsSubmittingEnquiry(true)
    try {
      const { error } = await (supabase.from("enquiries") as any).insert({
        property_id: params.id,
        sender_id: user.id,
        message: enquiryMessage || "I'm interested in this property. Please contact me."
      })

      if (error) throw error
      alert("Enquiry sent successfully!")
      setEnquiryMessage("")
    } catch (error) {
      console.error("Enquiry error:", error)
      alert("Failed to send enquiry")
    } finally {
      setIsSubmittingEnquiry(false)
    }
  }

  const emi = useMemo(() => {
    const r = interestRate / 12 / 100
    const n = tenure * 12
    const p = loanAmount
    if (!p || !r || !n) return 0
    const emiAmount = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
    return Math.round(emiAmount)
  }, [loanAmount, interestRate, tenure])

  const totalPayable = emi * tenure * 12

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
        <p className="text-slate-500 font-black italic tracking-widest uppercase text-xs">Loading Property Details...</p>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <h1 className="text-4xl font-black text-slate-900 mb-4 italic">Property Not Found</h1>
        <Link href="/search">
          <Button className="rounded-2xl h-14 px-8 font-black text-white bg-primary">Browse properties</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20">
      <div className="container mx-auto px-4">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-8">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/search" className="hover:text-primary transition-colors">{property.city || 'Ahmedabad'}</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-slate-900 line-clamp-1">{property.property_name}</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Left Content Column */}
          <div className="flex-1 space-y-10">
            
            {/* Gallery Section */}
            <section className="relative rounded-[40px] overflow-hidden border-4 border-white shadow-2xl bg-white">
              <ImageCarousel images={property.images?.length > 0 ? property.images : ["https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200"]} />
              
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
                <Button 
                  size="icon" 
                  onClick={toggleWishlist}
                  className={cn(
                    "w-12 h-12 rounded-2xl bg-white/90 backdrop-blur-sm shadow-xl hover:bg-white transition-all hover:scale-110",
                    isWishlisted ? "text-red-500 bg-white" : "text-slate-900 hover:text-red-500"
                  )}
                >
                  <Heart className={cn("w-5 h-5", isWishlisted && "fill-current")} />
                </Button>
              </div>
            </section>

            {/* Property Header */}
            <section className="bg-white rounded-[40px] p-8 md:p-10 shadow-xl shadow-slate-200/50 border border-slate-100">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                <div className="space-y-4">
                  <p className="text-xs font-black text-primary uppercase tracking-[0.2em]">{property.category} • {property.city}</p>
                  <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight max-w-2xl">
                    {property.property_name}
                  </h1>
                  <div className="flex items-center text-slate-500 font-bold group">
                    <MapPin className="w-5 h-5 mr-2 text-primary group-hover:animate-bounce" />
                    <span className="text-lg">{property.address || property.locality}</span>
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
                  <p className="text-slate-400 font-bold text-sm tracking-wide uppercase">
                    ₹{(property.price / (property.total_area_sqft || property.area || 1)).toFixed(0)} / SQ.FT
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[
                  { icon: BedDouble, label: "Config", val: (property.beds || property.bhk) + " BHK" },
                  { icon: Square, label: "Area", val: (property.total_area_sqft || property.area) + " sqft" },
                  { icon: Info, label: "Furnishing", val: property.furnishing || "Semi" },
                  { icon: LayoutGrid, label: "Floor", val: property.floor_number + " of " + property.total_floors },
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
              <TabsList className="w-full justify-start bg-transparent h-auto p-0 border-b border-slate-200 rounded-none gap-8 overflow-x-auto scrollbar-hide">
                {["Overview", "Amenities", "Location"].map((t) => (
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
                        {property.description || "No description provided."}
                      </p>
                    </div>
                  </div>

                  <div className="bg-white rounded-[40px] p-8 md:p-10 border border-slate-100 shadow-xl shadow-slate-200/50">
                    <h3 className="text-xl font-black text-slate-900 tracking-tight mb-6">Inside Details</h3>
                    <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                      {[
                        { k: "Carpet Area", v: (property.carpet_area_sqft || property.area) + " sqft" },
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
                    {property.amenities?.map((item: string, i: number) => (
                      <div key={i} className="flex items-center gap-4 transition-all group">
                        <div className="w-12 h-12 rounded-2xl bg-primary/5 text-primary group-hover:bg-primary group-hover:text-white flex items-center justify-center transition-all">
                          <Zap className="w-6 h-6" />
                        </div>
                        <span className="text-sm font-black uppercase tracking-wider text-slate-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="location" className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="relative rounded-[40px] overflow-hidden h-[400px] border-4 border-white shadow-2xl">
                   <div className="bg-slate-100 w-full h-full flex flex-col items-center justify-center space-y-2">
                        <MapPin className="w-10 h-10 text-primary animate-bounce" />
                        <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Location Data Restricted</p>
                        <p className="text-slate-900 font-bold text-sm text-center px-4">{property.address || property.locality}</p>
                   </div>
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
                  <AvatarImage src={property.owner?.avatar_url} />
                  <AvatarFallback className="bg-primary text-white font-black">
                    {property.owner?.full_name?.slice(0, 2).toUpperCase() || 'OW'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xl font-black text-slate-900 tracking-tight">{property.owner?.full_name || 'Verified Owner'}</h4>
                    <ShieldCheck className="w-5 h-5 text-emerald-500" />
                  </div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.1em] mt-1">Owner • Individual</p>
                </div>
              </div>

              <div className="space-y-4">
                <Dialog>
                  <DialogTrigger asChild>
                    <button className={cn(
                      "w-full h-14 bg-primary hover:bg-primary/90 text-white font-black rounded-2xl text-lg shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] flex items-center justify-center gap-3"
                    )}>
                      <MessageSquare className="w-5 h-5" />
                      Send Enquiry
                    </button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md rounded-[40px] border-none shadow-2xl bg-white p-8">
                    <DialogHeader>
                      <DialogTitle className="text-3xl font-black text-slate-900 italic">Get Details</DialogTitle>
                      <DialogDescription className="font-bold text-slate-500 italic">Send an enquiry to the owner directly.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6 pt-6">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Message</Label>
                        <Input 
                            value={enquiryMessage}
                            onChange={(e) => setEnquiryMessage(e.target.value)}
                            placeholder="I'm interested in this property..." 
                            className="h-14 rounded-2xl bg-slate-50 border-none font-bold text-sm focus-visible:ring-primary/20" 
                        />
                      </div>
                      <Button 
                        onClick={handleSendEnquiry}
                        disabled={isSubmittingEnquiry}
                        className="w-full h-14 rounded-2xl font-black text-lg bg-primary hover:bg-primary/90 text-white transition-all shadow-xl shadow-primary/10"
                      >
                        {isSubmittingEnquiry ? <Loader2 className="w-5 h-5 animate-spin" /> : "Send Enquiry Now"}
                      </Button>
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
                  <DialogContent className="max-w-md rounded-[40px] border-none shadow-2xl bg-white p-8">
                    <DialogHeader>
                      <DialogTitle className="text-3xl font-black text-slate-900 italic">Book a Visit</DialogTitle>
                      <DialogDescription className="font-bold text-slate-500 italic">Pick a preferred date and time for site inspection.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6 pt-6 text-center italic text-slate-400 font-bold">
                        Feature coming soon. Please send an enquiry.
                    </div>
                  </DialogContent>
                </Dialog>
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
                    <h4 className="text-xl font-black tracking-tight italic">Ready to Book?</h4>
                 </div>
                 <div className="space-y-2">
                    <p className="text-[10px] font-bold text-white/80 uppercase tracking-widest">Token Amount</p>
                    <p className="text-3xl font-black tracking-tighter">₹51,000</p>
                    <p className="text-[10px] font-bold text-white/60 italic">Includes ₹1,000 platform fee (Refunadable*)</p>
                 </div>
                 <Link href={`/buyer/book/${property.id}`} className="block w-full">
                    <Button className="w-full h-14 bg-white text-emerald-600 hover:bg-emerald-50 font-black rounded-2xl text-lg shadow-xl shadow-white/10 transition-all hover:scale-[1.02]">
                        Pay Token & Book
                    </Button>
                 </Link>
              </div>
            </div>

            {/* EMI Calculator */}
            <div className="bg-slate-900 rounded-[40px] p-8 text-white shadow-2xl shadow-slate-900/40 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8">
                <Calculator className="w-12 h-12 text-white/10" />
              </div>
              <h4 className="text-xl font-black tracking-tight mb-8 flex items-center gap-3 italic">
                <Calculator className="w-6 h-6 text-primary" />
                EMI Calculator
              </h4>
              <div className="space-y-8 mb-10">
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                    <span className="text-slate-400 tracking-[0.2em]">Loan Amount</span>
                    <span className="text-primary tracking-tighter text-sm">{formatIndianPrice(loanAmount)}</span>
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
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                    <span className="text-slate-400 tracking-[0.2em]">Interest Rate</span>
                    <span className="text-primary text-sm font-black">{interestRate}%</span>
                  </div>
                  <Slider 
                    value={[interestRate]} 
                    max={15} 
                    step={0.1} 
                    onValueChange={(v) => setInterestRate(v[0])}
                    className="py-2"
                  />
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/5 space-y-4">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-center text-slate-400">Monthly EMI Estimate</p>
                <div className="text-center">
                  <h5 className="text-4xl font-black text-white tracking-tighter mb-1">₹{emi.toLocaleString('en-IN')}</h5>
                </div>
                <Separator className="bg-white/5" />
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                  <div className="text-center">
                    <p className="text-slate-400 mb-1">Total Payable</p>
                    <p className="text-white tracking-tighter">{formatIndianPrice(totalPayable)}</p>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
