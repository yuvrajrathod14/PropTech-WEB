"use client"

import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Home, 
  Map as MapIcon, 
  ArrowUpRight, 
  Download, 
  Calendar,
  Filter,
  PieChart as PieChartIcon,
  Activity,
  Zap
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight italic">Platform Analytics</h1>
          <p className="text-slate-500 font-medium">In-depth insights into platform growth, revenue, and user behavior.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-12 rounded-2xl border-slate-100 bg-white font-bold gap-2">
            <Calendar className="w-4 h-4" /> Custom Range
          </Button>
          <Button className="h-12 rounded-2xl bg-slate-900 text-white font-black px-6 gap-2 italic">
            <Download className="w-4 h-4" /> Generate PDF
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Revenue Growth Chart Placeholder */}
        <Card className="lg:col-span-2 border-none shadow-sm rounded-[40px] p-10 bg-white space-y-8 flex flex-col min-h-[500px]">
            <div className="flex items-center justify-between">
                <div>
                   <h3 className="text-2xl font-black text-slate-900 tracking-tight italic">Revenue Growth</h3>
                   <p className="text-sm font-medium text-slate-400">Total transaction value & commission over time.</p>
                </div>
                <div className="flex bg-slate-100 p-1 rounded-xl">
                    <Button variant="ghost" className="h-8 rounded-lg text-[10px] font-black uppercase bg-white text-primary shadow-sm px-4">Daily</Button>
                    <Button variant="ghost" className="h-8 rounded-lg text-[10px] font-black uppercase text-slate-400 px-4">Weekly</Button>
                </div>
            </div>

            <div className="flex-1 bg-slate-50/50 rounded-[32px] border-2 border-dashed border-slate-100 flex flex-col items-center justify-center text-center p-12 space-y-4">
                 <div className="w-16 h-16 rounded-3xl bg-emerald-500 text-white flex items-center justify-center shadow-xl shadow-emerald-100"><TrendingUp className="w-8 h-8" /></div>
                 <h4 className="text-xl font-black text-slate-900 tracking-tight">Revenue Visualization Pending</h4>
                 <p className="max-w-xs text-sm text-slate-500 font-medium leading-relaxed italic">Real-time financial charts connecting to Razorpay and Supabase Ledger.</p>
            </div>
        </Card>

        {/* Regional Distribution */}
        <Card className="border-none shadow-sm rounded-[40px] p-10 bg-white space-y-8">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight italic">Top Regions</h3>
            <div className="space-y-8">
                {[
                    { city: "Ahmedabad", leads: 1240, color: "bg-primary", width: "85%" },
                    { city: "Gandhinagar", leads: 820, color: "bg-blue-500", width: "65%" },
                    { city: "Vadodara", leads: 450, color: "bg-amber-500", width: "45%" },
                    { city: "Rajkot", leads: 310, color: "bg-slate-400", width: "30%" },
                ].map((item, i) => (
                    <div key={i} className="space-y-3">
                        <div className="flex justify-between items-end">
                            <span className="text-sm font-black text-slate-900">{item.city}</span>
                            <span className="text-xs font-bold text-slate-400 italic">{item.leads} Leads</span>
                        </div>
                        <div className="h-3 bg-slate-50 rounded-full overflow-hidden">
                            <div className={cn("h-full rounded-full transition-all duration-1000", item.color)} style={{ width: item.width }} />
                        </div>
                    </div>
                ))}
            </div>
            <div className="pt-6 border-t border-slate-50">
                 <Button variant="ghost" className="w-full text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-primary transition-all gap-2">
                    Open Heatmap <MapIcon className="w-4 h-4" />
                 </Button>
            </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
              { label: "Conv. Rate", value: "3.2%", icon: Activity, trend: "+0.4%" },
              { label: "Active Subs", value: "142", icon: Zap, trend: "+12" },
              { label: "Avg Listing Age", value: "14 Days", icon: Home, trend: "-2 Days" },
              { label: "Support Vol", value: "High", icon: PieChartIcon, trend: "+15%" },
          ].map((stat, i) => (
              <Card key={i} className="border-none shadow-sm rounded-[32px] p-8 bg-slate-900 text-white space-y-4 group hover:shadow-2xl transition-all">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-primary"><stat.icon className="w-5 h-5" /></div>
                  <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-white/40">{stat.label}</p>
                      <h4 className="text-3xl font-black italic tracking-tighter">{stat.value}</h4>
                  </div>
                  <Badge className="bg-white/10 text-white/60 border-none font-bold text-[10px] px-2">{stat.trend}</Badge>
              </Card>
          ))}
      </div>
    </div>
  )
}
