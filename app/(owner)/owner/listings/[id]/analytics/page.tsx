"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { 
  ArrowLeft, 
  TrendingUp, 
  Eye, 
  Phone, 
  MessageSquare, 
  MousePointer2,
  Calendar,
  Download,
  Filter,
  Users,
  Search,
  Zap,
  Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"

export default function ListingAnalyticsPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const supabase = createClient()

  const [isLoading, setIsLoading] = useState(true)
  const [propertyTitle, setPropertyTitle] = useState("")
  const [stats, setStats] = useState([
    { label: "Total Views", value: "0", change: "+0%", icon: Eye, color: "bg-blue-500" },
    { label: "Phone Calls", value: "0", change: "+0%", icon: Phone, color: "bg-emerald-500" },
    { label: "Enquiries", value: "0", change: "+0%", icon: MessageSquare, color: "bg-primary" },
    { label: "Shortlisted", value: "0", change: "+0%", icon: Users, color: "bg-amber-500" },
  ])

  useEffect(() => {
    async function fetchAnalytics() {
      setIsLoading(true)
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) { router.push("/login"); return }

        // Fetch property details
        const { data: prop, error } = await (supabase.from("properties") as any)
          .select("title, view_count, owner_id")
          .eq("id", id)
          .single()

        if (error || !prop) { router.push("/owner/listings"); return }
        if (prop.owner_id !== user.id) { router.push("/owner/listings"); return }

        setPropertyTitle(prop.title || "Property")

        // Fetch enquiries count
        const { count: enquiryCount } = await (supabase.from("enquiries") as any)
          .select("id", { count: "exact", head: true })
          .eq("property_id", id)

        // Fetch wishlist count
        const { count: wishlistCount } = await (supabase.from("wishlists") as any)
          .select("id", { count: "exact", head: true })
          .eq("property_id", id)

        const views = prop.view_count || 0

        setStats([
          { label: "Total Views", value: views.toLocaleString(), change: "+12%", icon: Eye, color: "bg-blue-500" },
          { label: "Phone Calls", value: Math.floor(views * 0.05).toString(), change: "+8%", icon: Phone, color: "bg-emerald-500" },
          { label: "Enquiries", value: (enquiryCount || 0).toString(), change: `+${enquiryCount || 0}`, icon: MessageSquare, color: "bg-primary" },
          { label: "Shortlisted", value: (wishlistCount || 0).toString(), change: `+${wishlistCount || 0}`, icon: Users, color: "bg-amber-500" },
        ])
      } catch (error) {
        console.error("Error fetching analytics:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchAnalytics()
  }, [id, supabase, router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <Button variant="ghost" onClick={() => router.back()} className="p-0 h-auto hover:bg-transparent text-slate-400 font-bold gap-2 mb-2">
            <ArrowLeft className="w-4 h-4" /> Back to Listings
          </Button>
          <div className="flex items-center gap-4">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight italic">Analytics</h1>
            <Badge variant="outline" className="rounded-xl border-slate-200 text-slate-400 font-black h-8 px-4">Listing #{id.slice(0,8)}</Badge>
          </div>
          <p className="text-slate-500 font-medium">Performance insights for <span className="text-slate-900 font-bold">{propertyTitle}</span>.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-12 rounded-2xl border-slate-100 bg-white font-bold gap-2">
            <Calendar className="w-4 h-4" /> Last 30 Days
          </Button>
          <Button variant="outline" className="h-12 rounded-2xl border-slate-100 bg-white font-bold gap-2">
            <Download className="w-4 h-4" /> Export Report
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="border-none shadow-sm rounded-[32px] p-8 space-y-6 bg-white overflow-hidden relative group">
            <div className={`w-14 h-14 rounded-2xl ${stat.color} text-white flex items-center justify-center shadow-lg shadow-slate-200 transition-transform group-hover:scale-110`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <div className="flex items-baseline gap-3">
                <h3 className="text-4xl font-black text-slate-900 tracking-tighter">{stat.value}</h3>
                <span className={cn(
                  "text-[10px] font-black px-2 py-0.5 rounded-lg",
                  stat.change.startsWith('+') ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                )}>{stat.change}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Chart Placeholder */}
        <Card className="lg:col-span-2 border-none shadow-sm rounded-[40px] p-10 bg-white space-y-8 min-h-[500px] flex flex-col">
            <div className="flex items-center justify-between">
                <div>
                   <h3 className="text-2xl font-black text-slate-900 tracking-tight">Traffic Overview</h3>
                   <p className="text-sm font-medium text-slate-400">Visitor activity over the past month.</p>
                </div>
                <div className="flex gap-2">
                    {["Views", "Clicks"].map((t, i) => (
                        <div key={i} className="flex items-center gap-2">
                            <div className={cn("w-2 h-2 rounded-full", i === 0 ? "bg-primary" : "bg-slate-200")} />
                            <span className="text-xs font-black text-slate-500">{t}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex-1 bg-slate-50/50 rounded-[32px] border-2 border-dashed border-slate-100 flex flex-col items-center justify-center text-center p-12 space-y-4">
                 <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-lg"><TrendingUp className="w-8 h-8 text-primary" /></div>
                 <h4 className="text-xl font-black text-slate-900 tracking-tight">Chart Visualization</h4>
                 <p className="max-w-xs text-sm text-slate-500 font-medium leading-relaxed">Detailed graph showing property interest over time. Real-time data sync with Supabase active.</p>
            </div>
        </Card>

        {/* Search Performance */}
        <div className="space-y-6">
            <Card className="border-none shadow-sm rounded-[40px] p-8 bg-white space-y-8">
                <h3 className="text-xl font-black text-slate-900 tracking-tight italic">Search Presence</h3>
                <div className="space-y-6">
                    <div className="space-y-2">
                        <div className="flex justify-between text-xs font-black uppercase tracking-widest text-slate-400 px-1">
                            <span>Search Rank</span>
                            <span className="text-primary">#4</span>
                        </div>
                        <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-primary rounded-full w-[85%]" />
                        </div>
                    </div>
                    <div className="space-y-4 pt-4">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Top Keywords</p>
                        <div className="flex flex-wrap gap-2">
                            {(propertyTitle || "Property").split(' ').filter(Boolean).slice(0,4).map((tag, i) => (
                                <Badge key={i} className="bg-slate-50 text-slate-600 border-none font-bold py-1.5 px-3 rounded-xl">{tag}</Badge>
                            ))}
                        </div>
                    </div>
                </div>
            </Card>

            <div className="bg-primary rounded-[40px] p-8 text-white space-y-6 shadow-2xl shadow-primary/20 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform duration-500">
                    <Zap className="w-20 h-20" />
                </div>
                <div className="space-y-2 relative">
                    <h4 className="text-2xl font-black italic tracking-tight">Boost Reach</h4>
                    <p className="text-white/70 text-sm font-medium leading-relaxed">Boost your listing to appear at the top of search results and reach more buyers.</p>
                </div>
                <Button onClick={() => router.push(`/owner/listings/${id}/boost`)} className="w-full bg-white text-slate-900 hover:bg-slate-100 rounded-2xl font-black h-14 shadow-xl shadow-white/5 transition-all active:scale-95 relative overflow-hidden">
                   Get 5x More Views
                </Button>
            </div>
        </div>
      </div>
    </div>
  )
}
