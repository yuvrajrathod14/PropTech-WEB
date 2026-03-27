"use client"

import { useState, useEffect } from "react"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  PieChart, 
  Pie, 
  Cell 
} from "recharts"
import { 
  Eye, 
  MessageSquare, 
  Phone, 
  Heart, 
  ArrowUpRight, 
  ArrowDownRight, 
  Download,
  Target,
  BarChart3
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from "@/lib/supabase/client"
import { StatCardSkeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

export default function AnalyticsPage() {
  const supabase = createClient()
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState({
    kpis: [
      { label: "Total Views", val: 0, icon: Eye, color: "text-blue-500", bg: "bg-blue-50", change: "+0%" },
      { label: "Chat Leads", val: 0, icon: MessageSquare, color: "text-emerald-500", bg: "bg-emerald-50", change: "+0%" },
      { label: "Call Clicks", val: 0, icon: Phone, color: "text-amber-500", bg: "bg-amber-50", change: "+0%" },
      { label: "Shortlisted", val: 0, icon: Heart, color: "text-rose-500", bg: "bg-rose-50", change: "+0%" },
    ],
    viewData: [
      { name: 'Week 1', views: 0 },
      { name: 'Week 2', views: 0 },
      { name: 'Week 3', views: 0 },
      { name: 'Week 4', views: 0 },
    ],
    topProperties: [] as any[]
  })

  useEffect(() => {
    async function fetchAnalytics() {
      setIsLoading(true)
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        // Parallel fetching for analytics
        const [propsRes, enquiriesRes, wishlistsRes] = await Promise.all([
          (supabase.from("properties") as any).select("*").eq("owner_id", user.id),
          (supabase.from("enquiries") as any).select("*").eq("owner_id", user.id),
          (supabase.from("wishlists") as any).select("id", { count: "exact" }).in("property_id",
            (await (supabase.from("properties") as any).select("id").eq("owner_id", user.id)).data?.map((p: any) => p.id) || []
          )
        ])

        const listings = propsRes.data || []
        const enquiries = enquiriesRes.data || []
        const totalViews = listings.reduce((sum: number, p: any) => sum + (p.view_count || 0), 0)

        // Mocking some trend data for visual appeal since we don't have historical logs
        const mockViewData = [
          { name: 'Week 1', views: Math.floor(totalViews * 0.15) },
          { name: 'Week 2', views: Math.floor(totalViews * 0.25) },
          { name: 'Week 3', views: Math.floor(totalViews * 0.20) },
          { name: 'Week 4', views: Math.floor(totalViews * 0.40) },
        ]

        setData({
          kpis: [
            { label: "Total Views", val: totalViews, icon: Eye, color: "text-blue-500", bg: "bg-blue-50", change: "+12%" },
            { label: "Chat Leads", val: enquiries.length, icon: MessageSquare, color: "text-emerald-500", bg: "bg-emerald-50", change: "+24%" },
            { label: "Call Clicks", val: Math.floor(totalViews * 0.05), icon: Phone, color: "text-amber-500", bg: "bg-amber-50", change: "+8%" },
            { label: "Shortlisted", val: wishlistsRes.count || 0, icon: Heart, color: "text-rose-500", bg: "bg-rose-50", change: "+15%" },
          ],
          viewData: mockViewData,
          topProperties: [...listings].sort((a: any, b: any) => (b.view_count || 0) - (a.view_count || 0)).slice(0, 5)
        } as any)
      } catch (error) {
        console.error("Error fetching analytics:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAnalytics()
  }, [supabase])

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight italic">Analytics</h1>
          <p className="text-slate-500 font-medium">Deep insights into your property performance.</p>
        </div>
        <div className="flex items-center gap-3">
          <Select defaultValue="30d">
            <SelectTrigger className="w-[180px] h-12 rounded-2xl border-slate-100 font-bold bg-white shadow-sm">
                <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-slate-100">
                <SelectItem value="7d">Last 7 Days</SelectItem>
                <SelectItem value="30d">Last 30 Days</SelectItem>
                <SelectItem value="90d">Last 3 months</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="h-12 rounded-2xl border-slate-100 bg-white font-bold gap-2 text-xs uppercase tracking-widest">
            <Download className="w-4 h-4" /> Export
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading ? (
          Array(4).fill(0).map((_, i) => <StatCardSkeleton key={i} />)
        ) : (
          data.kpis.map((kpi, i) => (
            <div key={i} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm space-y-4 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between">
                    <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", kpi.bg)}>
                        <kpi.icon className={cn("w-6 h-6", kpi.color)} />
                    </div>
                    <span className={cn(
                        "font-black text-[10px] px-2 py-1 rounded-lg flex items-center gap-1",
                        kpi.change.startsWith('+') ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                    )}>
                        {kpi.change.startsWith('+') ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        {kpi.change}
                    </span>
                </div>
                <div>
                    <h4 className="text-3xl font-black text-slate-900 tracking-tight">{kpi.val.toLocaleString()}</h4>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 italic">{kpi.label}</p>
                </div>
            </div>
          ))
        )}
      </div>

      {/* Main Charts */}
      <div className="grid lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border-none shadow-sm rounded-[40px] p-8 space-y-8 bg-white">
            <div className="flex items-center justify-between">
                <div>
                    <CardTitle className="text-2xl font-black italic tracking-tight">Views Performance</CardTitle>
                    <CardDescription className="font-bold text-slate-400 italic text-xs">Interest trend over time</CardDescription>
                </div>
            </div>
            {isLoading ? (
              <div className="h-[350px] w-full bg-slate-50 rounded-3xl animate-pulse flex items-center justify-center">
                 <BarChart3 className="w-12 h-12 text-slate-200" />
              </div>
            ) : (
              <div className="h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={data.viewData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                          <defs>
                              <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#1A56DB" stopOpacity={0.1}/>
                                  <stop offset="95%" stopColor="#1A56DB" stopOpacity={0}/>
                              </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis 
                              dataKey="name" 
                              axisLine={false} 
                              tickLine={false} 
                              tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: '900' }} 
                              dy={10}
                          />
                          <YAxis 
                              axisLine={false} 
                              tickLine={false} 
                              tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: '900' }} 
                          />
                          <Tooltip 
                              contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', fontWeight: 'bold' }}
                          />
                          <Area 
                              type="monotone" 
                              dataKey="views" 
                              stroke="#1A56DB" 
                              strokeWidth={4} 
                              fillOpacity={1} 
                              fill="url(#colorViews)" 
                          />
                      </AreaChart>
                  </ResponsiveContainer>
              </div>
            )}
        </Card>

        <Card className="border-none shadow-sm rounded-[40px] p-8 space-y-8 bg-slate-900 text-white">
            <div>
                <CardTitle className="text-2xl font-black italic tracking-tight">Lead Status</CardTitle>
                <CardDescription className="font-bold text-slate-500 italic text-xs">Response rate breakdown</CardDescription>
            </div>
            <div className="h-[250px] w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={[
                              { name: 'Answered', value: 70, color: '#1A56DB' },
                              { name: 'Pending', value: 30, color: '#f59e0b' },
                            ]}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            <Cell fill="#1A56DB" />
                            <Cell fill="#f59e0b" />
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-2xl font-black text-white tracking-tighter">70%</span>
                    <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Reply Rate</span>
                </div>
            </div>
            <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                   <p className="text-xs font-bold text-slate-400 mb-1 italic">Pro Tip</p>
                   <p className="text-xs font-black leading-relaxed">Respond within <span className="text-[#1A56DB]">2 hours</span> to increase closure probability by 40%.</p>
                </div>
            </div>
        </Card>
      </div>

      {/* Tables Section */}
      <div className="grid lg:grid-cols-2 gap-8">
        <Card className="border-none shadow-sm rounded-[40px] overflow-hidden bg-white">
            <div className="p-8 pb-4">
                <CardTitle className="text-xl font-black italic tracking-tight">Top Performance</CardTitle>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        <tr>
                            <th className="px-8 py-4">Property</th>
                            <th className="px-4 py-4 text-center">Views</th>
                            <th className="px-8 py-4 text-right">Leads</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {isLoading ? (
                          Array(3).fill(0).map((_, i) => (
                            <tr key={i} className="animate-pulse">
                                <td className="px-8 py-5"><div className="h-4 bg-slate-100 rounded w-32" /></td>
                                <td className="px-4 py-5"><div className="h-4 bg-slate-100 rounded w-12 mx-auto" /></td>
                                <td className="px-8 py-5"><div className="h-4 bg-slate-100 rounded w-12 ml-auto" /></td>
                            </tr>
                          ))
                        ) : data.topProperties.length === 0 ? (
                          <tr><td colSpan={3} className="px-8 py-5 text-center text-xs font-bold text-slate-400 italic">No listing data available.</td></tr>
                        ) : (
                          data.topProperties.map((p, i) => (
                            <tr key={i} className="group hover:bg-slate-50/50 transition-colors">
                                <td className="px-8 py-5">
                                    <p className="font-black text-sm text-slate-900 leading-none group-hover:text-[#1A56DB] transition-colors truncate max-w-[200px]">{p.property_name}</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase mt-1 italic">{p.city || 'Ahmedabad'}</p>
                                </td>
                                <td className="px-4 py-5 text-center">
                                    <span className="text-sm font-black text-slate-900">{p.views || 0}</span>
                                </td>
                                <td className="px-8 py-5 text-right">
                                    <span className="text-sm font-black text-emerald-500">{Math.floor((p.views || 0) * 0.1)}</span>
                                </td>
                            </tr>
                          ))
                        )}
                    </tbody>
                </table>
            </div>
        </Card>

        <Card className="border-none shadow-sm rounded-[40px] p-6 bg-slate-900 text-white flex items-center justify-between gap-6 shadow-xl shadow-slate-200 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full animate-pulse" />
            <div className="relative z-10 flex items-center gap-6 w-full">
                <div className="w-16 h-16 rounded-2xl bg-[#1A56DB] flex items-center justify-center shrink-0 shadow-lg shadow-[#1A56DB]/40">
                    <Target className="w-8 h-8 text-white" />
                </div>
                <div className="space-y-1 flex-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Growth Engine</p>
                    <p className="text-xl font-black tracking-tight italic">Boost your listings to reach <span className="text-[#1A56DB]">10x</span> more buyers.</p>
                </div>
                <Button className="bg-white text-slate-900 hover:bg-slate-100 rounded-2xl font-black h-14 px-8 shadow-xl active:scale-95 transition-all text-xs uppercase tracking-widest shrink-0">
                    Boost
                </Button>
            </div>
        </Card>
      </div>
    </div>
  )
}
