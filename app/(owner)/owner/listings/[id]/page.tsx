"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { 
  MapPin, 
  CheckCircle2, 
  Clock, 
  Zap, 
  AlertCircle, 
  Eye, 
  ArrowUpRight, 
  MessageCircle, 
  Star,
  ChevronRight,
  Edit3,
  Trash2,
  MessageSquare,
  TrendingUp,
  Phone,
  ArrowRight,
  Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ImageCarousel } from "@/components/shared/image-carousel"
import { formatIndianPrice } from "@/lib/utils/formatPrice"
import { createClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"

export default function OwnerPropertyDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const supabase = createClient()

  const [property, setProperty] = useState<any>(null)
  const [enquiries, setEnquiries] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchProperty() {
      setIsLoading(true)
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) { router.push("/login"); return }

        // Fetch property
        const { data: prop, error } = await (supabase.from("properties") as any)
          .select("*")
          .eq("id", id)
          .single()

        if (error || !prop) { router.push("/owner/listings"); return }

        // Verify ownership
        if (prop.owner_id !== user.id) { router.push("/owner/listings"); return }

        setProperty(prop)

        // Fetch enquiries for this property
        const { data: enqs } = await (supabase.from("enquiries") as any)
          .select("*, sender:sender_id(full_name, email)")
          .eq("property_id", id)
          .order("created_at", { ascending: false })
          .limit(5)

        setEnquiries(enqs || [])
      } catch (error) {
        console.error("Error loading property:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProperty()
  }, [id, supabase, router])

  if (isLoading || !property) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    )
  }

  const status = (property.status || "draft").charAt(0).toUpperCase() + (property.status || "draft").slice(1)
  const views = property.view_count || 0
  const enquiryCount = enquiries.length

  const statusConfig: Record<string, { color: string; icon: any; text: string }> = {
    Live: { color: "bg-emerald-500", icon: CheckCircle2, text: "Your listing is live and visible to everyone." },
    Pending: { color: "bg-amber-500", icon: Clock, text: "Our team is reviewing your property. Usually takes 24h." },
    Rejected: { color: "bg-red-500", icon: AlertCircle, text: property.rejection_reason || "Your listing was rejected. Please update and resubmit." },
    Draft: { color: "bg-slate-500", icon: Star, text: "Finish your listing to make it visible." },
    Sold: { color: "bg-blue-500", icon: CheckCircle2, text: "Congratulations! This property is marked as sold." }
  }

  const currentStatus = statusConfig[status] || statusConfig.Draft

  const images = property.images?.length > 0 
    ? property.images 
    : [property.thumbnail || "/placeholder-property.jpg"]

  const pricePerSqft = property.area > 0 && property.price 
    ? Math.round(property.price / property.area) 
    : 0

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this listing? This cannot be undone.")) return
    try {
      await (supabase.from("properties") as any).delete().eq("id", id)
      router.push("/owner/listings")
    } catch (e) {
      console.error(e)
      alert("Failed to delete property")
    }
  }

  return (
    <div className="space-y-8 pb-20">
      {/* Breadcrumb & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <nav className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
          <Link href="/owner/dashboard" className="hover:text-primary transition-colors">Dashboard</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/owner/listings" className="hover:text-primary transition-colors">My Listings</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-slate-900">{property.title}</span>
        </nav>
        <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => router.push(`/owner/listings/${id}/edit`)} className="rounded-2xl h-11 border-slate-200 font-bold gap-2">
                <Edit3 className="w-4 h-4" /> Edit
            </Button>
            <Button variant="outline" onClick={handleDelete} className="rounded-2xl h-11 border-red-100 text-red-500 hover:bg-red-50 font-bold gap-2">
                <Trash2 className="w-4 h-4" /> Delete
            </Button>
            <Button onClick={() => router.push(`/owner/listings/${id}/boost`)} className="rounded-2xl h-11 bg-primary hover:bg-primary-dark font-black gap-2 shadow-xl shadow-primary/20 transition-all active:scale-95 px-6">
                <Zap className="w-4 h-4" /> Boost Listing
            </Button>
        </div>
      </div>

      {/* Status Banner */}
      <div className={cn(
        "p-6 rounded-[32px] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl",
        currentStatus.color
      )}>
        <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
                <currentStatus.icon className="w-8 h-8 text-white" />
            </div>
            <div className="space-y-1">
                <h3 className="text-xl font-black italic tracking-tight">Status: {status}</h3>
                <p className="text-white/80 font-bold text-sm tracking-wide">{currentStatus.text}</p>
            </div>
        </div>
        {status === "Rejected" && (
            <Button onClick={() => router.push(`/owner/listings/${id}/edit`)} className="bg-white text-red-600 hover:bg-slate-100 rounded-xl h-12 px-8 font-black shadow-lg">
                Fix Listing Now
            </Button>
        )}
      </div>

      {/* Main Content Layout */}
      <div className="grid lg:grid-cols-3 gap-10">
        
        {/* Left: Property Overview & Gallery */}
        <div className="lg:col-span-2 space-y-10">
            {/* Gallery */}
            <section className="relative rounded-[40px] overflow-hidden border-4 border-white shadow-2xl bg-slate-100 aspect-[16/9]">
                <ImageCarousel images={images} />
            </section>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4">
                {[
                    { label: "Total Views", val: views, icon: Eye, change: "+12%" },
                    { label: "New Enquiries", val: enquiryCount, icon: MessageSquare, change: `+${enquiryCount}` },
                    { label: "Price/sqft", val: pricePerSqft > 0 ? `₹${pricePerSqft.toLocaleString('en-IN')}` : "N/A", icon: TrendingUp, change: "" },
                ].map((s, i) => (
                    <div key={i} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm space-y-3 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                            <s.icon className="w-12 h-12" />
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.label}</p>
                        <div className="flex items-end gap-3">
                            <h4 className="text-3xl font-black text-slate-900">{s.val}</h4>
                            {s.change && (
                              <span className="text-emerald-500 font-bold text-xs mb-1 flex items-center">
                                  <ArrowUpRight className="w-3 h-3 mr-0.5" />
                                  {s.change}
                              </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Content Tabs */}
            <Tabs defaultValue="details" className="bg-white rounded-[40px] p-8 md:p-10 border border-slate-100 shadow-sm">
                <TabsList className="bg-slate-50 p-1 rounded-2xl h-14 mb-8">
                    {["Details", "Location", "Amenities"].map(t => (
                        <TabsTrigger key={t} value={t.toLowerCase()} className="rounded-xl px-8 font-black text-xs uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all h-full">
                            {t}
                        </TabsTrigger>
                    ))}
                </TabsList>

                <TabsContent value="details" className="space-y-8">
                     <div className="flex flex-col md:flex-row justify-between gap-6">
                        <div className="space-y-2">
                            <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{property.category || property.type}</p>
                            <h2 className="text-3xl font-black text-slate-900 tracking-tight italic">{property.title}</h2>
                            <div className="flex items-center text-slate-500 font-bold">
                                <MapPin className="w-4 h-4 mr-2 text-primary" />
                                <span>{property.locality ? `${property.locality}, ` : ''}{property.city || 'Ahmedabad'}</span>
                            </div>
                        </div>
                        <div className="text-left md:text-right">
                            <p className="text-3xl font-black text-primary tracking-tighter">{formatIndianPrice(property.price)}</p>
                            {pricePerSqft > 0 && <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">₹{pricePerSqft.toLocaleString('en-IN')} / SQ.FT</p>}
                        </div>
                     </div>

                     <Separator className="bg-slate-100" />

                     <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                            { label: "BHK", val: property.bhk || "N/A" },
                            { label: "Bath", val: property.bathrooms || "N/A" },
                            { label: "Area", val: property.area ? `${property.area}sqft` : "N/A" },
                            { label: "Floor", val: property.floor_number != null ? `${property.floor_number}${property.total_floors ? `/${property.total_floors}` : ''}` : "N/A" },
                        ].map((f, i) => (
                            <div key={i} className="space-y-1">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{f.label}</p>
                                <p className="text-lg font-black text-slate-800">{f.val}</p>
                            </div>
                        ))}
                     </div>

                     <div className="space-y-4">
                        <h4 className="text-lg font-black text-slate-900 italic">Property Description</h4>
                        <p className="text-slate-600 font-medium leading-relaxed">
                            {property.description || "No description provided."}
                        </p>
                     </div>
                </TabsContent>

                <TabsContent value="location" className="space-y-6">
                    <div className="space-y-4">
                        <h4 className="text-lg font-black text-slate-900 italic">Address</h4>
                        <p className="text-slate-600 font-medium">{property.address || "N/A"}</p>
                        <div className="grid grid-cols-2 gap-4">
                            <div><p className="text-[10px] font-black text-slate-400 uppercase">Locality</p><p className="font-bold text-slate-800">{property.locality || "N/A"}</p></div>
                            <div><p className="text-[10px] font-black text-slate-400 uppercase">City</p><p className="font-bold text-slate-800">{property.city || "N/A"}</p></div>
                            <div><p className="text-[10px] font-black text-slate-400 uppercase">State</p><p className="font-bold text-slate-800">{property.state || "Gujarat"}</p></div>
                            <div><p className="text-[10px] font-black text-slate-400 uppercase">Pincode</p><p className="font-bold text-slate-800">{property.pincode || "N/A"}</p></div>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="amenities" className="space-y-6">
                    <h4 className="text-lg font-black text-slate-900 italic">Amenities</h4>
                    {property.amenities && property.amenities.length > 0 ? (
                        <div className="flex flex-wrap gap-3">
                            {property.amenities.map((a: string, i: number) => (
                                <span key={i} className="bg-primary/5 text-primary font-black text-xs px-4 py-2 rounded-xl border border-primary/10">{a}</span>
                            ))}
                        </div>
                    ) : (
                        <p className="text-slate-400 font-medium italic">No amenities listed.</p>
                    )}
                </TabsContent>
            </Tabs>
        </div>

        {/* Right: Enquiries & Lead Management */}
        <div className="space-y-8">
             <Card className="border-none shadow-sm rounded-[40px] overflow-hidden">
                <CardHeader className="bg-slate-900 text-white p-8">
                    <CardTitle className="text-2xl font-black italic tracking-tight flex items-center gap-3">
                        <MessageSquare className="w-6 h-6 text-primary" />
                        Recent Leads
                    </CardTitle>
                    <CardDescription className="text-white/60 font-bold uppercase text-[10px] tracking-widest">
                        {enquiryCount} enquiries for this property
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-4 space-y-4 max-h-[600px] overflow-y-auto">
                    {enquiries.length === 0 ? (
                        <div className="p-8 text-center">
                            <MessageSquare className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                            <p className="text-sm font-bold text-slate-400">No enquiries yet</p>
                        </div>
                    ) : enquiries.map((lead, i) => (
                        <div key={i} className="p-4 rounded-3xl bg-slate-50 hover:bg-white border border-transparent hover:border-slate-100 hover:shadow-xl transition-all group cursor-pointer">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <Avatar className="w-8 h-8">
                                        <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-black">
                                            {(lead.sender?.full_name || "U").split(' ').map((n: string) => n[0]).join('')}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-black text-sm text-slate-900 leading-none">{lead.sender?.full_name || "Unknown"}</p>
                                        <p className="text-[10px] font-bold text-slate-400 italic mt-1">
                                            {new Date(lead.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                        </p>
                                    </div>
                                </div>
                                {lead.status === "new" && (
                                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                )}
                            </div>
                            <p className="text-xs text-slate-500 font-medium line-clamp-2 mb-4 leading-relaxed italic">&quot;{lead.message}&quot;</p>
                            <div className="flex items-center gap-2">
                                <Button size="sm" className="rounded-xl h-9 bg-slate-900 text-white font-bold text-[10px] flex-1">
                                    <MessageCircle className="w-3.5 h-3.5 mr-2" />
                                    Reply via Chat
                                </Button>
                                <Button size="icon" variant="outline" className="rounded-xl h-9 w-9 border-slate-200">
                                    <Phone className="w-3.5 h-3.5" />
                                </Button>
                            </div>
                        </div>
                    ))}
                    
                    <Link href="/owner/enquiries">
                      <Button variant="ghost" className="w-full text-slate-400 font-black uppercase text-[10px] tracking-widest h-12 hover:text-primary transition-colors">
                          View All Leads <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                </CardContent>
             </Card>

             <div className="bg-primary/5 rounded-[40px] p-8 border border-primary/10 space-y-6">
                <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center">
                    <TrendingUp className="text-white w-8 h-8" />
                </div>
                <div className="space-y-2">
                    <h4 className="text-xl font-black text-slate-900 tracking-tight italic">View Analytics</h4>
                    <p className="text-slate-500 font-medium text-sm leading-relaxed">
                        See detailed performance data including views, enquiries, and conversion rates.
                    </p>
                </div>
                <Button onClick={() => router.push(`/owner/listings/${id}/analytics`)} className="w-full h-14 bg-primary hover:bg-primary-dark text-white font-black rounded-2xl text-lg shadow-xl shadow-primary/20">
                    View Analytics
                </Button>
             </div>
        </div>
      </div>
    </div>
  )
}
