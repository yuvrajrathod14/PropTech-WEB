"use client"

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
  Target
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

const viewData = [
  { name: 'Mon', views: 400, leads: 24 },
  { name: 'Tue', views: 300, leads: 13 },
  { name: 'Wed', views: 200, leads: 98 },
  { name: 'Thu', views: 278, leads: 39 },
  { name: 'Fri', views: 189, leads: 48 },
  { name: 'Sat', views: 239, leads: 38 },
  { name: 'Sun', views: 349, leads: 43 },
]

const sourceData = [
  { name: 'Direct', value: 400, color: '#f59e0b' },
  { name: 'Social', value: 300, color: '#10b981' },
  { name: 'Search', value: 300, color: '#3b82f6' },
  { name: 'Others', value: 200, color: '#6366f1' },
]

export default function AnalyticsPage() {

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
                <SelectItem value="1y">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="h-12 rounded-2xl border-slate-100 bg-white font-bold gap-2">
            <Download className="w-4 h-4" /> Export Report
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[
            { label: "Total Views", val: "12,480", icon: Eye, color: "text-blue-500", bg: "bg-blue-50", change: "+14%" },
            { label: "Chat Leads", val: "452", icon: MessageSquare, color: "text-emerald-500", bg: "bg-emerald-50", change: "+28%" },
            { label: "Call Clicks", val: "186", icon: Phone, color: "text-amber-500", bg: "bg-amber-50", change: "+5%" },
            { label: "Shortlisted", val: "1,240", icon: Heart, color: "text-rose-500", bg: "bg-rose-50", change: "-2%" },
        ].map((kpi, i) => (
            <div key={i} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                    <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", kpi.bg)}>
                        <kpi.icon className={cn("w-6 h-6", kpi.color)} />
                    </div>
                    <span className={cn(
                        "font-black text-xs px-2 py-1 rounded-lg flex items-center gap-1",
                        kpi.change.startsWith('+') ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                    )}>
                        {kpi.change.startsWith('+') ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        {kpi.change}
                    </span>
                </div>
                <div>
                    <h4 className="text-3xl font-black text-slate-900 tracking-tight">{kpi.val}</h4>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{kpi.label}</p>
                </div>
            </div>
        ))}
      </div>

      {/* Main Charts */}
      <div className="grid lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border-none shadow-sm rounded-[40px] p-8 space-y-8 bg-white">
            <div className="flex items-center justify-between">
                <div>
                    <CardTitle className="text-2xl font-black italic tracking-tight">Views vs Leads</CardTitle>
                    <CardDescription className="font-bold text-slate-400">Daily interaction trends</CardDescription>
                </div>
                <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-primary" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Views</span>
                    </div>
                </div>
            </div>
            <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={viewData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.1}/>
                                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
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
                            stroke="#f59e0b" 
                            strokeWidth={4} 
                            fillOpacity={1} 
                            fill="url(#colorViews)" 
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </Card>

        <Card className="border-none shadow-sm rounded-[40px] p-8 space-y-8 bg-white">
            <div>
                <CardTitle className="text-2xl font-black italic tracking-tight">Lead Sources</CardTitle>
                <CardDescription className="font-bold text-slate-400">Where traffic comes from</CardDescription>
            </div>
            <div className="h-[250px] w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={sourceData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {sourceData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-2xl font-black text-slate-900 tracking-tighter">1,248</span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Leads</span>
                </div>
            </div>
            <div className="space-y-4">
                {sourceData.map((s, i) => (
                    <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
                            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">{s.name}</span>
                        </div>
                        <span className="text-sm font-black text-slate-900">{((s.value / 1200) * 100).toFixed(0)}%</span>
                    </div>
                ))}
            </div>
        </Card>
      </div>

      {/* Tables Section */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Top Properties */}
        <Card className="border-none shadow-sm rounded-[40px] overflow-hidden bg-white">
            <div className="p-8 pb-4">
                <CardTitle className="text-xl font-black italic tracking-tight">Top Performing Properties</CardTitle>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        <tr>
                            <th className="px-8 py-4">Property</th>
                            <th className="px-4 py-4 text-center">Inquiries</th>
                            <th className="px-8 py-4 text-right">Trend</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {[
                            { name: "Luxury Villa, Shela", leads: 145, trend: "+12%" },
                            { name: "3 BHK Flat, Satellite", leads: 98, trend: "+5%" },
                            { name: "Global Office, S.G Highway", leads: 82, trend: "-2%" },
                            { name: "Modern 2BHK, Bopal", leads: 64, trend: "+18%" },
                        ].map((p, i) => (
                            <tr key={i} className="group hover:bg-slate-50/50 transition-colors">
                                <td className="px-8 py-5">
                                    <p className="font-black text-sm text-slate-900 leading-none">{p.name}</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">Ahmedabad</p>
                                </td>
                                <td className="px-4 py-5 text-center">
                                    <span className="text-sm font-black text-slate-900">{p.leads}</span>
                                </td>
                                <td className="px-8 py-5 text-right">
                                    <span className={cn(
                                        "text-xs font-black",
                                        p.trend.startsWith('+') ? "text-emerald-500" : "text-red-500"
                                    )}>{p.trend}</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>

        {/* User Engagement */}
        <Card className="border-none shadow-sm rounded-[40px] p-8 space-y-6 bg-white">
            <CardTitle className="text-xl font-black italic tracking-tight">Active Hours</CardTitle>
            <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={viewData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis 
                            dataKey="name" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: '900' }} 
                            dy={10}
                        />
                        <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '16px', border: 'none', fontWeight: 'bold' }} />
                        <Bar 
                            dataKey="leads" 
                            fill="#f59e0b" 
                            radius={[8, 8, 0, 0]} 
                            barSize={32}
                            opacity={0.8}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
            <div className="p-6 rounded-3xl bg-slate-900 text-white flex items-center justify-between gap-6 shadow-xl shadow-slate-200">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                        <Target className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Peak Activity</p>
                        <p className="text-lg font-black tracking-tight italic">Weekends (Sat - Sun)</p>
                    </div>
                </div>
                <Button className="bg-white text-slate-900 hover:bg-slate-100 rounded-xl font-black h-12 px-6">
                    Boost Ads
                </Button>
            </div>
        </Card>
      </div>
    </div>
  )
}
