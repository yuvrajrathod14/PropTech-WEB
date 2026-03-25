"use client"

// Removed unused useState import
import Link from "next/link"
// Removed unused motion import
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
  ArrowRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
// Removed unused Badge import
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
// Removed unused useAuth import
import { ImageCarousel } from "@/components/shared/image-carousel"
// Removed unused formatIndianPrice import
import { formatIndianPrice } from "@/lib/utils/formatPrice"
import { mockProperties } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

export default function OwnerPropertyDetailPage({ params }: { params: { id: string } }) {
  const property = mockProperties.find(p => p.id === params.id) || mockProperties[0]
  
  // Mock owner-specific state
  const status = "Rejected" // Example: Rejected to show the alert
  const views = 1240
  const enquiries = 45
  
  const statusConfig = {
    Live: { color: "bg-emerald-500", icon: CheckCircle2, text: "Your listing is live and visible to everyone." },
    Pending: { color: "bg-amber-500", icon: Clock, text: "Our team is reviewing your property. Usually takes 24h." },
    Rejected: { color: "bg-red-500", icon: AlertCircle, text: "Action Required: Your listing was rejected due to blurry photos." },
    Draft: { color: "bg-slate-500", icon: Star, text: "Finish your listing to make it visible." },
    Sold: { color: "bg-blue-500", icon: CheckCircle2, text: "Congratulations! This property is marked as sold." }
  }

  const currentStatus = statusConfig[status as keyof typeof statusConfig] || statusConfig.Live

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
            <Button variant="outline" className="rounded-2xl h-11 border-slate-200 font-bold gap-2">
                <Edit3 className="w-4 h-4" /> Edit
            </Button>
            <Button variant="outline" className="rounded-2xl h-11 border-red-100 text-red-500 hover:bg-red-50 font-bold gap-2">
                <Trash2 className="w-4 h-4" /> Delete
            </Button>
            <Button className="rounded-2xl h-11 bg-primary hover:bg-primary-dark font-black gap-2 shadow-xl shadow-primary/20 transition-all active:scale-95 px-6">
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
            <Button className="bg-white text-red-600 hover:bg-slate-100 rounded-xl h-12 px-8 font-black shadow-lg">
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
                <ImageCarousel images={[
                    property.image,
                    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200",
                    "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&q=80&w=1200",
                ]} />
            </section>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4">
                {[
                    { label: "Total Views", val: views, icon: Eye, change: "+12%" },
                    { label: "New Enquiries", val: enquiries, icon: MessageSquare, change: "+5" },
                    { label: "Conversion Rate", val: "3.2%", icon: TrendingUp, change: "+0.8%" },
                ].map((s, i) => (
                    <div key={i} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm space-y-3 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                            <s.icon className="w-12 h-12" />
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.label}</p>
                        <div className="flex items-end gap-3">
                            <h4 className="text-3xl font-black text-slate-900">{s.val}</h4>
                            <span className="text-emerald-500 font-bold text-xs mb-1 flex items-center">
                                <ArrowUpRight className="w-3 h-3 mr-0.5" />
                                {s.change}
                            </span>
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
                            <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{property.category}</p>
                            <h2 className="text-3xl font-black text-slate-900 tracking-tight italic">{property.title}</h2>
                            <div className="flex items-center text-slate-500 font-bold">
                                <MapPin className="w-4 h-4 mr-2 text-primary" />
                                <span>Satellite, Ahmedabad</span>
                            </div>
                        </div>
                        <div className="text-left md:text-right">
                            <p className="text-3xl font-black text-primary tracking-tighter">{formatIndianPrice(property.price)}</p>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">₹4,483 / SQ.FT</p>
                        </div>
                     </div>

                     <Separator className="bg-slate-100" />

                     <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                            { label: "BHK", val: "3.5" },
                            { label: "Bath", val: "3" },
                            { label: "Area", val: "1850sqft" },
                            { label: "Floor", val: "12th" },
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
                            Luxury living in the heart of Ahmedabad. This spacious 3.5 BHK apartment offers panoramic city views, 
                            premium finishes, and high-end fixtures. Ideal for families looking for comfort and convenience.
                        </p>
                     </div>
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
                        Manage your property enquiries
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-4 space-y-4 max-h-[600px] overflow-y-auto">
                    {[
                        { name: "Aryan Kumar", msg: "I'm interested in the 3BHK. Is the price negotiable?", time: "2h ago", status: "New" },
                        { name: "Rahul Mehta", msg: "Can we schedule a visit this weekend at 11 AM?", time: "5h ago", status: "Read" },
                        { name: "Sonal Patel", msg: "Does this include 2 parking spaces?", time: "1d ago", status: "Replied" },
                    ].map((lead, i) => (
                        <div key={i} className="p-4 rounded-3xl bg-slate-50 hover:bg-white border border-transparent hover:border-slate-100 hover:shadow-xl transition-all group cursor-pointer">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <Avatar className="w-8 h-8">
                                        <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-black">{lead.name.split(' ').map(n=>n[0]).join('')}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-black text-sm text-slate-900 leading-none">{lead.name}</p>
                                        <p className="text-[10px] font-bold text-slate-400 italic mt-1">{lead.time}</p>
                                    </div>
                                </div>
                                {lead.status === "New" && (
                                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                )}
                            </div>
                            <p className="text-xs text-slate-500 font-medium line-clamp-2 mb-4 leading-relaxed italic">&quot;{lead.msg}&quot;</p>
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
                    
                    <Button variant="ghost" className="w-full text-slate-400 font-black uppercase text-[10px] tracking-widest h-12 hover:text-primary transition-colors">
                        View All 45 Leads <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                </CardContent>
             </Card>

             <div className="bg-primary/5 rounded-[40px] p-8 border border-primary/10 space-y-6">
                <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center">
                    <TrendingUp className="text-white w-8 h-8" />
                </div>
                <div className="space-y-2">
                    <h4 className="text-xl font-black text-slate-900 tracking-tight italic">Improve Visibility</h4>
                    <p className="text-slate-500 font-medium text-sm leading-relaxed">
                        Your listing is performing <span className="text-emerald-500 font-bold">20% better</span> than last week. 
                        Boost now to reach 5x more buyers in Ahmedabad.
                    </p>
                </div>
                <Button className="w-full h-14 bg-primary hover:bg-primary-dark text-white font-black rounded-2xl text-lg shadow-xl shadow-primary/20">
                    Boost Listing Now
                </Button>
             </div>
        </div>
      </div>
    </div>
  )
}
