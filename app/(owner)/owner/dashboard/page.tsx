"use client"

import Link from "next/link"
import Image from "next/image"
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
  BarChart3
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/hooks/use-auth"
import { cn } from "@/lib/utils"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts"

const statsCards = [
  { name: "Active Listings", value: "8", icon: Building2, color: "bg-emerald-500", label: "Approved" },
  { name: "Pending Review", value: "3", icon: Clock, color: "bg-amber-500", label: "In Review" },
  { name: "Total Enquiries", value: "124", icon: MessageSquare, color: "bg-blue-500", label: "All Time" },
  { name: "Total Views", value: "3,842", icon: Eye, color: "bg-purple-500", label: "Sum of Views" },
]

const viewsData = [
  { date: "1 Mar", views: 400 },
  { date: "5 Mar", views: 300 },
  { date: "10 Mar", views: 600 },
  { date: "15 Mar", views: 800 },
  { date: "20 Mar", views: 500 },
  { date: "25 Mar", views: 900 },
  { date: "30 Mar", views: 1100 },
]

const enquiriesData = [
  { property: "Villa Shela", count: 45 },
  { property: "3BHK Sci City", count: 32 },
  { property: "Plot SG Hwy", count: 28 },
  { property: "Office Prahlad", count: 15 },
  { property: "Flat Bopal", count: 12 },
]

const recentListings = [
  { id: "1", title: "Luxury Villa in Shela", photo: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&h=400&fit=crop", status: "Live", views: 1240, enquiries: 45 },
  { id: "2", title: "3 BHK Apartment, Science City", photo: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=400&fit=crop", status: "Pending", views: 342, enquiries: 12 },
  { id: "3", title: "Commercial Plot, SG Highway", photo: "https://images.unsplash.com/photo-1500382017468-9049fee74a62?w=400&h=400&fit=crop", status: "Live", views: 890, enquiries: 28 },
  { id: "4", title: "Office in Prahlad Nagar", photo: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=400&fit=crop", status: "Rejected", views: 156, enquiries: 2 },
  { id: "5", title: "Modern Flat in Bopal", photo: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=400&fit=crop", status: "Draft", views: 0, enquiries: 0 },
]

const recentEnquiries = [
  { name: "John Doe", property: "Villa in Shela", message: "Is the price negotiable? I want to...", time: "2h ago" },
  { name: "Amit Shah", property: "3BHK Apartment", message: "I want to schedule a visit tomorrow.", time: "5h ago" },
  { name: "Suresh P.", property: "Plot SG Highway", message: "Send me the floor plan please.", time: "1d ago" },
  { name: "Priya V.", property: "Villa in Shela", message: "Is this property RERA approved?", time: "2d ago" },
  { name: "Rahul M.", property: "Office Space", message: "When can we meet for a site visit?", time: "3d ago" },
]

export default function OwnerDashboardPage() {
  const { user, profile } = useAuth()

  return (
    <div className="space-y-10">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            Welcome back, {profile?.full_name || user?.user_metadata?.full_name || "Owner"}! 🏠
          </h1>
          <p className="text-slate-500 font-medium text-lg">Here&apos;s how your properties are performing today.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/owner/analytics">
            <Button variant="outline" className="rounded-2xl h-12 px-6 font-bold border-slate-200">
              <BarChart3 className="w-4 h-4 mr-2" />
              View Analytics
            </Button>
          </Link>
          <Link href="/owner/post">
            <Button className="bg-primary hover:bg-primary-dark rounded-2xl h-12 px-6 font-black shadow-lg shadow-primary/20 transition-all active:scale-95">
              <PlusCircle className="w-4 h-4 mr-2" />
              Post New Property
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat) => (
          <Card key={stat.name} className="border-none shadow-sm rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg", stat.color)}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <Badge variant="outline" className="rounded-md border-slate-100 text-[10px] uppercase font-black tracking-wider text-slate-400">
                  {stat.label}
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.name}</p>
                <div className="flex items-end gap-2">
                  <p className="text-3xl font-black text-slate-900 leading-none">{stat.value}</p>
                  <span className="text-emerald-500 text-xs font-black flex items-center mb-1">
                    <TrendingUp className="w-3 h-3 mr-0.5" />
                    +12%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-none shadow-sm rounded-[32px] p-8">
          <CardHeader className="px-0 pt-0">
            <CardTitle className="text-xl font-black">Listing Views</CardTitle>
            <CardDescription className="font-medium">Daily views over last 30 days</CardDescription>
          </CardHeader>
          <div className="h-[300px] mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={viewsData}>
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
          </div>
        </Card>

        <Card className="border-none shadow-sm rounded-[32px] p-8">
          <CardHeader className="px-0 pt-0">
            <CardTitle className="text-xl font-black">Enquiries by Property</CardTitle>
            <CardDescription className="font-medium">Total leads received per listing</CardDescription>
          </CardHeader>
          <div className="h-[300px] mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={enquiriesData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis 
                  dataKey="property" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#64748B', fontWeight: 600, fontSize: 11}} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#64748B', fontWeight: 600, fontSize: 12}}
                />
                <Tooltip 
                  cursor={{fill: '#f1f5f9'}}
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} 
                />
                <Bar dataKey="count" fill="#1A56DB" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* My Listings Preview */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-none shadow-sm rounded-[32px] overflow-hidden">
            <CardHeader className="p-8 border-b border-slate-50 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl font-black">My Listings</CardTitle>
                <CardDescription className="font-medium">Manage your active properties</CardDescription>
              </div>
              <Link href="/owner/listings">
                <Button variant="ghost" className="font-bold text-primary hover:bg-primary/5 rounded-xl">
                  View All <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <tr>
                      <th className="px-8 py-4">Property</th>
                      <th className="px-8 py-4">Status</th>
                      <th className="px-8 py-4 text-center">Views</th>
                      <th className="px-8 py-4 text-center">Enquiries</th>
                      <th className="px-8 py-4"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {recentListings.map((item) => (
                      <tr key={item.id} className="group hover:bg-slate-50/50 transition-colors">
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden shrink-0">
                                <Image src={item.photo} alt={item.title} width={48} height={48} className="w-full h-full object-cover" />
                            </div>
                            <span className="font-bold text-slate-900 group-hover:text-primary transition-colors line-clamp-1">{item.title}</span>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <Badge className={cn(
                            "border-none text-[10px] font-black uppercase tracking-wider px-2 py-0.5",
                            item.status === 'Live' ? 'bg-emerald-50 text-emerald-600' :
                            item.status === 'Pending' ? 'bg-amber-50 text-amber-600' : 
                            item.status === 'Rejected' ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-600'
                          )}>
                            {item.status}
                          </Badge>
                        </td>
                        <td className="px-8 py-5 text-center font-bold text-slate-600">{item.views}</td>
                        <td className="px-8 py-5 text-center font-bold text-slate-600">{item.enquiries}</td>
                        <td className="px-8 py-5 text-right">
                          <Link href={`/owner/listings/${item.id}`}>
                            <Button variant="ghost" size="icon" className="rounded-xl hover:bg-white hover:text-primary shadow-sm border border-transparent hover:border-slate-100 transition-all">
                                <MoreVertical className="w-5 h-5" />
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Enquiries Sidebar */}
        <div className="space-y-8">
          <Card className="border-none shadow-sm rounded-[32px] p-8">
            <div className="flex items-center justify-between mb-8">
              <CardTitle className="text-xl font-black">Recent Enquiries</CardTitle>
              <Link href="/owner/enquiries" className="text-primary text-xs font-black uppercase tracking-widest hover:underline">
                View All
              </Link>
            </div>
            <div className="space-y-6">
              {recentEnquiries.map((item, i) => (
                <div key={i} className="flex flex-col gap-3 p-4 rounded-2xl bg-slate-50 border-2 border-transparent hover:border-primary/5 transition-all group">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center font-black text-primary text-sm">
                            {item.name.charAt(0)}
                        </div>
                        <div>
                            <h6 className="font-bold text-slate-900 text-sm leading-none">{item.name}</h6>
                            <span className="text-[10px] font-bold text-slate-400 uppercase">{item.property}</span>
                        </div>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">{item.time}</span>
                  </div>
                  <p className="text-xs text-slate-500 font-bold line-clamp-2">&quot;{item.message}&quot;</p>
                  <Button className="w-full bg-white hover:bg-primary hover:text-white text-primary border-none shadow-sm h-10 rounded-xl font-black text-xs transition-all active:scale-95">
                    Reply to Enquiry
                  </Button>
                </div>
              ))}
            </div>
          </Card>

          {/* Upgrade Card / Tip */}
          <Card className="border-none shadow-sm rounded-[32px] p-8 bg-blue-600 text-white overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-full group-hover:scale-110 transition-transform duration-500" />
            <div className="relative z-10 space-y-6">
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20">
                <TrendingUp className="w-7 h-7" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black leading-tight tracking-tight">Boost Your Listing</h3>
                <p className="text-blue-100 font-medium text-sm leading-relaxed">Featured properties get 10x more visibility and higher conversion rates.</p>
              </div>
              <Button className="w-full bg-white text-blue-600 hover:bg-blue-50 rounded-2xl h-12 font-black shadow-xl shadow-black/10 transition-all active:scale-95">
                Boost Now <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
