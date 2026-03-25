"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { 
  PlusCircle, 
  Search, 
  Filter, 
  MoreVertical, 
  Eye, 
  TrendingUp, 
  Trash2,
  CheckCircle2,
  XCircle,
  Clock,
  FileText,
  ArrowUpDown,
  MapPin
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { formatIndianPrice } from "@/lib/utils/formatPrice"
import { cn } from "@/lib/utils"

const mockListings = [
  { id: "1", title: "Luxury Villa in Shela", locality: "Shela, Ahmedabad", type: "Villa", price: 25000000, status: "Live", views: 1240, enquiries: 45, date: "24 Mar 2024", photo: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&h=400&fit=crop" },
  { id: "2", title: "3 BHK Apartment, Science City", locality: "Science City, Ahmedabad", type: "Flat", price: 8500000, status: "Pending", views: 342, enquiries: 12, date: "25 Mar 2024", photo: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=400&fit=crop" },
  { id: "3", title: "Commercial Plot, SG Highway", locality: "SG Highway, Ahmedabad", type: "Plot", price: 120000000, status: "Live", views: 890, enquiries: 28, date: "22 Mar 2024", photo: "https://images.unsplash.com/photo-1500382017468-9049fee74a62?w=400&h=400&fit=crop" },
  { id: "4", title: "Office in Prahlad Nagar", locality: "Prahlad Nagar, Ahmedabad", type: "Office", price: 4500000, status: "Rejected", views: 156, enquiries: 2, date: "20 Mar 2024", photo: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=400&fit=crop" },
  { id: "5", title: "Modern Flat in Bopal", locality: "Bopal, Ahmedabad", type: "Flat", price: 6500000, status: "Draft", views: 0, enquiries: 0, date: "15 Mar 2024", photo: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=400&fit=crop" },
  { id: "6", title: "Penthouse at South Bopal", locality: "South Bopal, Ahmedabad", type: "Flat", price: 15000000, status: "Sold", views: 2450, enquiries: 85, date: "10 Feb 2024", photo: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=400&fit=crop" },
]

export default function MyListingsPage() {
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const toggleAll = () => {
    setSelectedIds(prev => 
      prev.length === mockListings.length ? [] : mockListings.map(l => l.id)
    )
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Live': return <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
      case 'Pending': return <Clock className="w-3.5 h-3.5 mr-1" />
      case 'Rejected': return <XCircle className="w-3.5 h-3.5 mr-1" />
      case 'Draft': return <FileText className="w-3.5 h-3.5 mr-1" />
      case 'Sold': return <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
      default: return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Live': return 'bg-emerald-50 text-emerald-600 border-emerald-100'
      case 'Pending': return 'bg-amber-50 text-amber-600 border-amber-100'
      case 'Rejected': return 'bg-red-50 text-red-600 border-red-100'
      case 'Draft': return 'bg-slate-50 text-slate-600 border-slate-100'
      case 'Sold': return 'bg-blue-50 text-blue-600 border-blue-100'
      default: return 'bg-slate-50 text-slate-600'
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight italic">My Listings</h1>
          <p className="text-slate-500 font-medium">Track, edit, and optimize your property performance.</p>
        </div>
        <Link href="/owner/post">
          <Button className="bg-primary hover:bg-primary-dark rounded-2xl h-14 px-8 font-black gap-2 shadow-xl shadow-primary/20 transition-all active:scale-95">
            <PlusCircle className="w-5 h-5" />
            Post New Property
          </Button>
        </Link>
      </div>

      {/* Stats Quick Look */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
            { label: "Total Properties", value: "12", sub: "All time" },
            { label: "Live Listings", value: "8", sub: "Currently visible" },
            { label: "Drafts", value: "2", sub: "Needs completion" },
            { label: "Sold Properties", value: "2", sub: "Closed deals" },
        ].map((s, i) => (
            <div key={i} className="bg-white p-6 rounded-[28px] border border-slate-100 shadow-sm space-y-1">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.label}</span>
                <p className="text-2xl font-black text-slate-900">{s.value}</p>
                <p className="text-[10px] font-bold text-slate-500 italic">{s.sub}</p>
            </div>
        ))}
      </div>

      <Card className="border-none shadow-sm rounded-[40px] overflow-hidden">
        <Tabs defaultValue="all" className="w-full">
          <div className="px-8 pt-8 border-b border-slate-50 space-y-6 pb-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <TabsList className="bg-slate-100 p-1 rounded-2xl h-12 w-fit">
                    {["All", "Live", "Pending", "Rejected", "Sold", "Drafts"].map(tab => (
                        <TabsTrigger 
                            key={tab} 
                            value={tab.toLowerCase()}
                            className="rounded-xl px-6 font-black text-xs data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all"
                        >
                            {tab}
                        </TabsTrigger>
                    ))}
                </TabsList>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search properties..." 
                            className="pl-10 h-12 rounded-2xl bg-slate-50 border-none font-medium focus-visible:ring-primary/20" 
                        />
                    </div>
                    <Button variant="outline" className="h-12 w-12 rounded-2xl border-slate-100 shrink-0">
                        <Filter className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* Selection Bar */}
            <AnimatePresence>
                {selectedIds.length > 0 && (
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center justify-between bg-slate-900 text-white p-4 rounded-2xl shadow-xl shadow-slate-200"
                    >
                        <div className="flex items-center gap-3 pl-2">
                             <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center font-black text-xs">{selectedIds.length}</div>
                             <span className="text-sm font-bold">Properties Selected</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 font-bold rounded-xl h-10">Mark Sold</Button>
                            <Button variant="ghost" size="sm" className="text-red-400 hover:bg-red-500/10 font-bold rounded-xl h-10 gap-2">
                                <Trash2 className="w-4 h-4" />
                                Delete Selected
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
          </div>

          <TabsContent value="all" className="mt-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <tr>
                    <th className="px-8 py-4 w-10">
                        <Checkbox checked={selectedIds.length === mockListings.length} onCheckedChange={toggleAll} className="border-slate-300 rounded-md" />
                    </th>
                    <th className="px-4 py-4">Property</th>
                    <th className="px-8 py-4">Type</th>
                    <th className="px-8 py-4">Price</th>
                    <th className="px-8 py-4">Status</th>
                    <th className="px-8 py-4 text-center">Stats</th>
                    <th className="px-8 py-4">Posted Date</th>
                    <th className="px-8 py-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {mockListings.map((item) => (
                    <tr key={item.id} className="group hover:bg-slate-50/30 transition-colors">
                      <td className="px-8 py-5">
                         <Checkbox checked={selectedIds.includes(item.id)} onCheckedChange={() => toggleSelect(item.id)} className="border-slate-200 rounded-md" />
                      </td>
                      <td className="px-4 py-5 min-w-[300px]">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-12 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-100 shadow-sm relative group">
                              <Image src={item.photo} alt={item.title} width={64} height={48} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <Eye className="w-4 h-4 text-white" />
                              </div>
                          </div>
                          <div className="space-y-1">
                            <span className="font-black text-slate-900 group-hover:text-primary transition-colors block text-sm leading-none">{item.title}</span>
                            <span className="text-[10px] font-bold text-slate-400 flex items-center">
                                <MapPin className="w-2.5 h-2.5 mr-1 text-slate-300" />
                                {item.locality}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                         <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">{item.type}</span>
                      </td>
                      <td className="px-8 py-5">
                         <span className="font-black text-slate-900">{formatIndianPrice(item.price)}</span>
                      </td>
                      <td className="px-8 py-5">
                        <Badge variant="outline" className={cn(
                          "rounded-full border shadow-none text-[10px] font-black uppercase tracking-wider px-3 py-1 flex items-center w-fit",
                          getStatusColor(item.status)
                        )}>
                          {getStatusIcon(item.status)}
                          {item.status}
                        </Badge>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center justify-center gap-4">
                            <div className="flex flex-col items-center">
                                <span className="text-xs font-black text-slate-900">{item.views}</span>
                                <span className="text-[8px] font-black text-slate-400 uppercase">Views</span>
                            </div>
                            <div className="flex flex-col items-center border-l border-slate-100 pl-4">
                                <span className="text-xs font-black text-slate-900">{item.enquiries}</span>
                                <span className="text-[8px] font-black text-slate-400 uppercase">Leads</span>
                            </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                         <span className="text-[11px] font-bold text-slate-400 italic">{item.date}</span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="rounded-xl hover:bg-white hover:text-primary shadow-sm border border-transparent hover:border-slate-100 transition-all">
                              <MoreVertical className="w-5 h-5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48 rounded-2xl p-2 bg-white/80 backdrop-blur-xl border-slate-100 shadow-2xl">
                            <DropdownMenuLabel className="text-[10px] uppercase font-black text-slate-400 tracking-widest px-3">Actions</DropdownMenuLabel>
                            <DropdownMenuItem className="rounded-xl font-bold gap-2 px-3 py-2 cursor-pointer transition-colors focus:bg-primary/5 focus:text-primary">
                                <Eye className="w-4 h-4" /> View Public Listing
                            </DropdownMenuItem>
                            <DropdownMenuItem className="rounded-xl font-bold gap-2 px-3 py-2 cursor-pointer transition-colors focus:bg-primary/5 focus:text-primary">
                                <FileText className="w-4 h-4" /> Edit Details
                            </DropdownMenuItem>
                            <DropdownMenuItem className="rounded-xl font-bold gap-2 px-3 py-2 cursor-pointer transition-colors focus:bg-blue-50 focus:text-blue-600">
                                <TrendingUp className="w-4 h-4" /> View Analytics
                            </DropdownMenuItem>
                            <DropdownMenuItem className="rounded-xl font-bold gap-2 px-3 py-2 cursor-pointer transition-colors focus:bg-primary focus:text-white">
                                <ArrowUpDown className="w-4 h-4" /> Boost Visibility
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-slate-50 mx-1" />
                            <DropdownMenuItem className="rounded-xl font-bold gap-2 px-3 py-2 cursor-pointer text-red-500 focus:bg-red-50 focus:text-red-600">
                                <Trash2 className="w-4 h-4" /> Delete Permanently
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>
          
          {/* Empty state for other tabs */}
          <TabsContent value="pending" className="flex flex-col items-center justify-center p-20 text-center space-y-4">
              <div className="w-20 h-20 rounded-3xl bg-slate-50 flex items-center justify-center text-slate-200">
                <Clock className="w-10 h-10" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xl font-black text-slate-900 tracking-tight italic">No Listings Pending</h4>
                <p className="text-slate-500 font-medium">Any property you submit will appear here during review.</p>
              </div>
          </TabsContent>
        </Tabs>
      </Card>

      <div className="flex items-center justify-between pt-4">
         <p className="text-xs font-bold text-slate-400">Showing 6 properties from your account</p>
         <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="rounded-xl font-bold h-10 px-4 border-slate-100 disabled:opacity-50" disabled>Previous</Button>
            <Button variant="outline" size="sm" className="rounded-xl font-bold h-10 px-4 border-slate-100 bg-white shadow-sm border-primary/20 text-primary">1</Button>
            <Button variant="outline" size="sm" className="rounded-xl font-bold h-10 px-4 border-slate-100">2</Button>
            <Button variant="outline" size="sm" className="rounded-xl font-bold h-10 px-4 border-slate-100">Next</Button>
         </div>
      </div>
    </div>
  )
}
