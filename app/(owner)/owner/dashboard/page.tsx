"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { 
  PlusCircle, 
  TrendingUp, 
  Eye, 
  MessageSquare, 
  Clock, 
  MoreVertical,
  Building2,
  ChevronRight,
  ArrowRight,
  BarChart3,
  Calendar,
  LayoutGrid
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/hooks/use-auth"
import { cn, formatIndianPrice } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"
import { StatCardSkeleton, TableRowSkeleton, ChartSkeleton } from "@/components/ui/skeleton"
import { EmptyState } from "@/components/ui/empty-state"
import { OptimizedImage } from "@/components/shared/optimized-image"
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts"

export default function OwnerDashboardPage() {
  const { profile } = useAuth()
  const supabase = createClient()
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState({
    stats: [
      { name: "Active Listings", value: 0, icon: Building2, color: "bg-emerald-500", label: "Approved" },
      { name: "Pending Review", value: 0, icon: Clock, color: "bg-amber-500", label: "In Review" },
      { name: "Total Enquiries", value: 0, icon: MessageSquare, color: "bg-[#1A56DB]", label: "All Time" },
      { name: "Total Bookings", value: 0, icon: Eye, color: "bg-purple-500", label: "Paid" },
    ],
    listings: [] as any[],
    enquiries: [] as any[],
    viewsData: [
      { date: "1 Mar", views: 10 },
      { date: "10 Mar", views: 25 },
      { date: "20 Mar", views: 15 },
      { date: "30 Mar", views: 40 },
    ]
  })

  useEffect(() => {
    async function fetchOwnerDashboard() {
      setIsLoading(true)
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        // Parallel fetching
        const [propsRes, enquiriesRes, bookingsRes] = await Promise.all([
          supabase.from("properties").select("*").eq("owner_id", user.id).order("created_at", { ascending: false }),
          (supabase.from("enquiries") as any).select("*, sender:user_id(full_name), property:property_id(property_name)").eq("owner_id", user.id).order("created_at", { ascending: false }).limit(5),
          (supabase.from("bookings") as any).select("id", { count: "exact" }).eq("owner_id", user.id)
        ])

        const listings = (propsRes.data || []) as any[]
        const enquiries = (enquiriesRes.data || []) as any[]
        
        const activeCount = listings.filter(l => l.status === 'live').length
        const pendingCount = listings.filter(l => l.status === 'pending').length
        
        setData(prev => ({
          ...prev,
          stats: [
            { name: "Active Listings", value: activeCount, icon: Building2, color: "bg-emerald-500", label: "Approved" },
            { name: "Pending Review", value: pendingCount, icon: Clock, color: "bg-amber-500", label: "In Review" },
            { name: "Total Enquiries", value: enquiries.length, icon: MessageSquare, color: "bg-[#1A56DB]", label: "Recent" },
            { name: "Total Bookings", value: bookingsRes.count || 0, icon: Eye, color: "bg-purple-500", label: "Paid" },
          ],
          listings: listings.slice(0, 5),
          enquiries: enquiries
        }))
      } catch (error) {
        console.error("Error fetching owner dashboard:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchOwnerDashboard()
  }, [supabase])

  return (
    <div className="space-y-10">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3 italic">
            Dashboard
          </h1>
          <p className="text-slate-500 font-medium text-lg">Managing property performance for <span className="text-[#1A56DB] font-black">{profile?.full_name || "Owner"}</span></p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/owner/post">
            <Button className="bg-[#1A56DB] hover:bg-[#1A56DB]/90 text-white rounded-2xl h-12 px-6 font-black shadow-xl shadow-[#1A56DB]/20 transition-all active:scale-95">
              <PlusCircle className="w-4 h-4 mr-2" />
              Post New Property
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading ? (
          Array(4).fill(0).map((_, i) => <StatCardSkeleton key={i} />)
        ) : (
          data.stats.map((stat) => (
            <Card key={stat.name} className="border-none shadow-sm rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-300 bg-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg", stat.color)}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <Badge variant={stat.label?.toLowerCase() as any} className="rounded-md shadow-none text-[8px] uppercase font-black tracking-widest">
                    {stat.label}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{stat.name}</p>
                  <div className="flex items-end gap-2">
                    <p className="text-3xl font-black text-slate-900 leading-none">{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Performance Chart */}
          <Card className="border-none shadow-sm rounded-[32px] p-8 bg-white">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="text-xl font-black italic">Platform Traffic</CardTitle>
              <CardDescription className="font-medium">Direct interactions with your listings</CardDescription>
            </CardHeader>
            <div className="h-[300px] mt-6">
              {isLoading ? (
                <ChartSkeleton />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.viewsData}>
                    <defs>
                      <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#1A56DB" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#1A56DB" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis 
                      dataKey="date" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fill: '#64748B', fontWeight: 600, fontSize: 12}} 
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fill: '#64748B', fontWeight: 600, fontSize: 12}}
                    />
                    <Tooltip 
                      contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} 
                    />
                    <Area type="monotone" dataKey="views" stroke="#1A56DB" strokeWidth={3} fillOpacity={1} fill="url(#colorViews)" />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </Card>

          {/* Listings Preview */}
          <Card className="border-none shadow-sm rounded-[32px] overflow-hidden bg-white">
            <CardHeader className="p-8 border-b border-slate-50 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl font-black italic">Recent Listings</CardTitle>
                <CardDescription className="font-medium">Your newest property additions</CardDescription>
              </div>
              <Link href="/owner/listings">
                <Button variant="ghost" className="font-black text-[10px] uppercase tracking-widest text-[#1A56DB] hover:bg-[#1A56DB]/5 rounded-xl">
                  Manage All <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <tr>
                      <th className="px-8 py-4">Property</th>
                      <th className="px-8 py-4">Price</th>
                      <th className="px-8 py-4">Status</th>
                      <th className="px-8 py-4 text-right">View</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {isLoading ? (
                      Array(3).fill(0).map((_, i) => (
                        <TableRowSkeleton key={i} columns={4} />
                      ))
                    ) : data.listings.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-20">
                          <EmptyState 
                            title="No listings yet"
                            description="Take the first step and list your property to reach thousands of buyers."
                            icon={LayoutGrid}
                            className="bg-transparent"
                          />
                        </td>
                      </tr>
                    ) : (
                      data.listings.map((item) => (
                        <tr key={item.id} className="group hover:bg-slate-50/50 transition-colors">
                          <td className="px-8 py-5">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden shrink-0 relative">
                                  <OptimizedImage src={item.images?.[0] || ""} alt={item.property_name} fill className="object-cover" />
                              </div>
                              <span className="font-black text-slate-900 group-hover:text-[#1A56DB] transition-colors line-clamp-1">{item.property_name}</span>
                            </div>
                          </td>
                          <td className="px-8 py-5">
                             <p className="text-sm font-black text-slate-900">{formatIndianPrice(item.price)}</p>
                          </td>
                          <td className="px-8 py-5">
                            <Badge variant={item.status?.toLowerCase() as any} className="border-none text-[8px] font-black uppercase tracking-widest px-2 py-0.5 shadow-none">
                              {item.status}
                            </Badge>
                          </td>
                          <td className="px-8 py-5 text-right">
                            <Link href={`/property/${item.id}`}>
                              <Button variant="ghost" size="icon" className="rounded-xl hover:bg-white hover:text-[#1A56DB] shadow-sm border border-transparent hover:border-slate-100 transition-all">
                                  <ArrowRight className="w-5 h-5" />
                              </Button>
                            </Link>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          <Card className="border-none shadow-sm rounded-[32px] p-8 bg-white">
            <div className="flex items-center justify-between mb-8">
              <CardTitle className="text-xl font-black italic">Recent Leads</CardTitle>
              <Link href="/owner/chat" className="text-[#1A56DB] text-[10px] font-black uppercase tracking-widest hover:underline">
                View All
              </Link>
            </div>
            <div className="space-y-6">
              {isLoading ? (
                Array(3).fill(0).map((_, i) => (
                  <div key={i} className="h-24 bg-slate-50 rounded-2xl animate-pulse" />
                ))
              ) : data.enquiries.length === 0 ? (
                <div className="text-center py-10">
                   <MessageSquare className="w-10 h-10 text-slate-200 mx-auto mb-2" />
                   <p className="text-xs font-bold text-slate-400 italic">No enquiries yet</p>
                </div>
              ) : (
                data.enquiries.map((item, i) => (
                  <div key={i} className="flex flex-col gap-3 p-4 rounded-2xl bg-slate-50 border-2 border-transparent hover:border-[#1A56DB]/5 transition-all group">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center font-black text-[#1A56DB] text-xs">
                              {item.sender?.full_name?.charAt(0) || "U"}
                          </div>
                          <div>
                              <h6 className="font-black text-slate-900 text-xs leading-none truncate max-w-[100px]">{item.sender?.full_name || "Buyer"}</h6>
                              <span className="text-[10px] font-bold text-slate-400 italic truncate max-w-[100px] block mt-1">{item.property?.property_name}</span>
                          </div>
                      </div>
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">
                        {new Date(item.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium line-clamp-2 italic">&quot;{item.message}&quot;</p>
                    <Link href={`/owner/chat?user=${item.user_id}`}>
                      <Button className="w-full bg-white hover:bg-[#1A56DB] hover:text-white text-[#1A56DB] border-none shadow-sm h-10 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95">
                        Reply Now
                      </Button>
                    </Link>
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* Marketing Card */}
          <Card className="border-none shadow-sm rounded-[32px] p-8 bg-slate-900 text-white overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full group-hover:scale-110 transition-transform duration-500" />
            <div className="relative z-10 space-y-6">
              <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10">
                <TrendingUp className="w-7 h-7 text-[#1A56DB]" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black leading-tight tracking-tight italic">Boost Visibility</h3>
                <p className="text-slate-400 font-medium text-sm leading-relaxed">Featured properties get 10x more engagement and faster closures.</p>
              </div>
              <Button className="w-full bg-[#1A56DB] text-white hover:bg-[#1A56DB]/90 rounded-2xl h-12 font-black shadow-xl shadow-black/10 transition-all active:scale-95 border-none">
                Upgrade Listing <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
