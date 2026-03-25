"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { 
  ShieldCheck, 
  Users, 
  Building2, 
  CheckCircle2, 
  XCircle, 
  Eye, 
  TrendingUp, 
  AlertCircle,
  ArrowRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatIndianPrice } from "@/lib/utils/formatPrice"
import { mockProperties } from "@/lib/mock-data"

const adminStats = [
  { name: "Total Properties", value: "1,248", icon: Building2, color: "bg-blue-500", trend: "+12%" },
  { name: "Total Users", value: "542", icon: Users, color: "bg-purple-500", trend: "+8%" },
  { name: "Pending Approval", value: "24", icon: Clock, color: "bg-amber-500", trend: "-5%" },
  { name: "Total Revenue", value: "₹45.2L", icon: TrendingUp, color: "bg-emerald-500", trend: "+24%" },
]

import { Clock } from "lucide-react"

export default function AdminDashboardPage() {
  const [pendingProperties] = useState(mockProperties.slice(0, 4))

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <ShieldCheck className="w-10 h-10 text-primary" />
              Admin Command Center
            </h1>
            <p className="text-slate-500 font-medium tracking-tight">Managing the PropTech ecosystem and moderating content.</p>
          </div>
          <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
            <Button variant="ghost" size="sm" className="font-bold text-slate-600 rounded-xl">Logs</Button>
            <Button size="sm" className="bg-slate-900 hover:bg-slate-800 rounded-xl font-bold px-6">System Status</Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {adminStats.map((stat) => (
            <Card key={stat.name} className="border-none shadow-sm rounded-3xl overflow-hidden group hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg", stat.color)}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-black text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full">{stat.trend}</span>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.name}</p>
                  <p className="text-2xl font-black text-slate-900">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Moderation Queue */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="border-none shadow-sm rounded-[32px] overflow-hidden">
              <CardHeader className="p-8 border-b border-slate-50 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-black flex items-center gap-2">
                    <Clock className="w-5 h-5 text-amber-500" />
                    Pending Moderation
                  </CardTitle>
                  <CardDescription className="font-medium">Property listings awaiting verification.</CardDescription>
                </div>
                <Button variant="ghost" className="text-xs font-bold text-primary px-0 hover:bg-transparent">View All (24)</Button>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-slate-50">
                  {pendingProperties.map((property) => (
                    <div key={property.id} className="p-8 flex flex-col md:flex-row items-center justify-between gap-6 group hover:bg-slate-50/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-20 h-20 rounded-2xl bg-slate-100 overflow-hidden shrink-0 relative">
                          <Image src={property.image} fill className="object-cover" alt={property.title} />
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-black text-slate-900 group-hover:text-primary transition-colors">{property.title}</h4>
                          <p className="text-xs text-slate-500 font-bold flex items-center gap-2">
                            <MapPin className="w-3 h-3" /> {property.location} • <IndianRupee className="w-3 h-3" /> {formatIndianPrice(property.price)}
                          </p>
                          <div className="flex items-center gap-2 pt-1">
                            <div className="w-4 h-4 rounded-full bg-slate-200" />
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{property.owner_name}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 w-full md:w-auto">
                        <Button className="flex-1 md:flex-none bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold h-11 gap-2">
                          <CheckCircle2 className="w-4 h-4" /> Approve
                        </Button>
                        <Button variant="outline" className="flex-1 md:flex-none text-red-500 border-red-100 hover:bg-red-50 rounded-xl font-bold h-11 gap-2">
                          <XCircle className="w-4 h-4" /> Reject
                        </Button>
                        <Button variant="ghost" size="icon" className="rounded-xl h-11 w-11 hover:bg-white border border-transparent hover:border-slate-100">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* System Health */}
          <div className="space-y-8">
            <Card className="border-none shadow-sm rounded-[32px] p-8">
              <CardTitle className="text-lg font-black mb-6 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-primary" />
                Security & Health
              </CardTitle>
              <div className="space-y-6">
                {[
                  { label: "Storage Capacity", value: "42%", color: "bg-blue-500" },
                  { label: "API Requests", value: "88%", color: "bg-emerald-500" },
                  { label: "Moderation Queue", value: "12%", color: "bg-amber-500" },
                  { label: "Server Load", value: "24%", color: "bg-purple-500" },
                ].map((item, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between items-center text-xs font-black text-slate-500 uppercase tracking-widest">
                      <span>{item.label}</span>
                      <span className="text-slate-900">{item.value}</span>
                    </div>
                    <div className="h-2 bg-slate-50 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: item.value }}
                        transition={{ duration: 1, delay: i * 0.1 }}
                        className={cn("h-full rounded-full shadow-sm", item.color)} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="border-none shadow-sm rounded-[32px] p-8 bg-slate-900 text-white overflow-hidden group">
              <div className="relative z-10 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-black">User Reports</h3>
                  <Badge className="bg-red-500 text-white border-none font-bold">3 New</Badge>
                </div>
                <div className="space-y-4">
                  {[1, 2].map(i => (
                    <div key={i} className="bg-white/5 p-4 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
                      <p className="text-xs text-slate-400 font-bold uppercase mb-2">Spam / Incorrect Info</p>
                      <h6 className="font-bold text-sm mb-1">Reported Property ID: #4205</h6>
                      <p className="text-[10px] text-slate-500">By user: @ashish_kr • 12m ago</p>
                    </div>
                  ))}
                </div>
                <Button className="w-full bg-primary hover:bg-primary-dark rounded-xl h-12 font-black group gap-2">
                  Handle Reports <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

import { cn } from "@/lib/utils"
import { MapPin, IndianRupee } from "lucide-react"
