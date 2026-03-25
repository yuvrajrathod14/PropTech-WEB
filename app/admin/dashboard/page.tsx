"use client"

import Link from "next/link"
import { 
  TrendingUp, 
  Users, 
  Home, 
  CreditCard, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical,
  Activity,
  Zap,
  ShieldAlert
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"

const kpis = [
  { label: "Total Revenue", value: "₹12.4L", change: "+14.2%", icon: CreditCard, color: "bg-emerald-500", trend: "up" },
  { label: "Active Listings", value: "842", change: "+5.1%", icon: Home, color: "bg-blue-500", trend: "up" },
  { label: "New Users", value: "156", change: "-2.4%", icon: Users, color: "bg-primary", trend: "down" },
  { label: "Avg. Session", value: "4m 20s", change: "+12%", icon: Activity, color: "bg-amber-500", trend: "up" },
]

export default function AdminDashboard() {
  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight italic">Dashboard</h1>
          <p className="text-slate-500 font-medium">Welcome back, Super Admin. Here&apos;s what&apos;s happening today.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-12 rounded-2xl border-slate-100 bg-white font-bold gap-2">
            Weekly Report
          </Button>
          <Button className="h-12 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black px-6 shadow-xl shadow-slate-200 transition-all active:scale-95 italic">
            Download Audit
          </Button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, i) => (
          <Card key={i} className="border-none shadow-sm rounded-[32px] p-8 space-y-6 bg-white group hover:shadow-xl transition-all">
            <div className={`w-14 h-14 rounded-2xl ${kpi.color} text-white flex items-center justify-center shadow-lg shadow-slate-200 transition-transform group-hover:scale-110`}>
              <kpi.icon className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{kpi.label}</p>
              <div className="flex items-baseline gap-3">
                <h3 className="text-4xl font-black text-slate-900 tracking-tighter">{kpi.value}</h3>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg flex items-center gap-1 ${
                  kpi.trend === 'up' ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                }`}>
                  {kpi.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {kpi.change}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content Area: Pending Actions */}
        <div className="lg:col-span-2 space-y-6">
            <Card className="border-none shadow-sm rounded-[40px] p-8 bg-white space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight italic">Pending Moderation</h3>
                        <p className="text-sm font-medium text-slate-400">12 listings require your immediate attention.</p>
                    </div>
                    <Link href="/admin/listings">
                        <Button variant="ghost" className="text-primary font-black text-xs uppercase tracking-widest hover:bg-primary/5">View All</Button>
                    </Link>
                </div>

                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center gap-6 p-6 rounded-[24px] border border-slate-50 hover:border-primary/20 hover:bg-slate-50/30 transition-all group">
                            <div className="w-20 h-20 rounded-2xl bg-slate-100 overflow-hidden shrink-0 shadow-sm relative">
                                <div className="absolute top-1 right-1 bg-white/90 backdrop-blur-md rounded-lg p-1">
                                     <Zap className="w-3 h-3 text-primary fill-primary" />
                                </div>
                            </div>
                            <div className="flex-1 min-w-0 space-y-1">
                                <h4 className="text-lg font-black text-slate-900 truncate tracking-tight">Luxury 4BHK Villa</h4>
                                <p className="text-xs font-bold text-slate-400 italic">Posted by Aryan Kumar • 2h ago</p>
                                <div className="flex gap-2 pt-1">
                                    <Badge className="bg-slate-100 text-slate-400 border-none font-bold text-[9px] uppercase tracking-widest px-2">RESIDENTIAL</Badge>
                                    <Badge className="bg-primary/5 text-primary border-none font-bold text-[9px] uppercase tracking-widest px-2">₹2.4 Cr</Badge>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-black h-10 px-5 shadow-lg shadow-emerald-100 italic transition-all active:scale-95">Approve</Button>
                                <Button size="sm" variant="ghost" className="text-red-500 hover:bg-red-50 rounded-xl h-10 w-10 p-0"><CheckCircle2 className="w-5 h-5 rotate-45" /></Button>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-none shadow-sm rounded-[32px] p-8 bg-white space-y-6">
                    <h3 className="text-xl font-black text-slate-900 tracking-tight italic">User Growth</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-500">Owners</span>
                            <span className="text-xs font-black text-slate-900">+42%</span>
                        </div>
                        <Progress value={85} className="h-2 bg-slate-100" />
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-500">Buyers</span>
                            <span className="text-xs font-black text-slate-900">+58%</span>
                        </div>
                        <Progress value={65} className="h-2 bg-slate-100" />
                    </div>
                </Card>
                <Card className="border-none shadow-sm rounded-[32px] p-8 bg-white space-y-6">
                    <h3 className="text-xl font-black text-slate-900 tracking-tight italic">Platform Health</h3>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
                            <ShieldAlert className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs font-black text-slate-900">Zero Security Threats</p>
                            <p className="text-[10px] font-bold text-slate-400 italic">Last scan 5m ago</p>
                        </div>
                    </div>
                    <Button variant="outline" className="w-full h-11 rounded-xl border-slate-100 font-bold text-xs">Run Diagnostic</Button>
                </Card>
            </div>
        </div>

        {/* Sidebar: Recent Logs & Reports */}
        <div className="space-y-6">
             <Card className="border-none shadow-sm rounded-[40px] p-8 bg-white space-y-8">
                <h3 className="text-xl font-black text-slate-900 tracking-tight italic">Recent Activity</h3>
                <div className="space-y-6 relative before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-[1px] before:bg-slate-100">
                    {[
                        { title: "System payout completed", time: "10m ago", icon: CreditCard, color: "text-emerald-500" },
                        { title: "New user reported listing #2", time: "34m ago", icon: AlertCircle, color: "text-red-500" },
                        { title: "Admin 'Varun' approved #42", time: "1h ago", icon: CheckCircle2, color: "text-blue-500" },
                        { title: "New owner registration", time: "2h ago", icon: Users, color: "text-primary" },
                    ].map((log, i) => (
                        <div key={i} className="flex gap-4 relative pl-8">
                            <div className={`absolute left-0 w-5 h-5 rounded-full bg-white border-2 border-slate-100 flex items-center justify-center -translate-x-[2px] z-10 ${log.color}`}>
                                <log.icon className="w-2.5 h-2.5" />
                            </div>
                            <div className="space-y-0.5">
                                <p className="text-xs font-bold text-slate-900 leading-tight">{log.title}</p>
                                <p className="text-[10px] font-medium text-slate-400 italic">{log.time}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <Button variant="ghost" className="w-full text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-slate-900">View All Logs</Button>
             </Card>

             <div className="bg-slate-900 rounded-[40px] p-8 text-white space-y-6 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:rotate-12 transition-transform duration-700">
                    <Activity className="w-24 h-24" />
                </div>
                <div className="space-y-2 relative">
                    <h4 className="text-2xl font-black italic tracking-tight">System Alerts</h4>
                    <p className="text-white/60 text-xs font-medium leading-relaxed italic">The platform is experiencing higher than usual traffic in the <span className="text-white font-bold underline decoration-primary underline-offset-4">Ahmedabad</span> region.</p>
                </div>
                <div className="flex gap-2">
                    <Button className="flex-1 bg-white text-slate-900 hover:bg-slate-100 rounded-2xl font-black h-12 text-xs shadow-xl shadow-white/5 italic">
                        Optimize Load
                    </Button>
                    <Button variant="ghost" size="icon" className="w-12 h-12 rounded-2xl border border-white/10 hover:bg-white/5 transition-all">
                        <MoreVertical className="w-5 h-5" />
                    </Button>
                </div>
             </div>
        </div>
      </div>
    </div>
  )
}

function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
    return (
        <span className={cn("px-2 py-0.5 rounded-md text-[10px] font-bold", className)}>
            {children}
        </span>
    )
}
