"use client"

import { useState } from "react"
import { 
  MessageSquare, 
  Search, 
  MoreVertical, 
  Phone, 
  Mail, 
  ChevronRight,
  Download,
  Clock,
  ArrowUpRight,
  MessageCircle,
  Trash2,
  Archive
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
// Removed unused Tabs imports
import { cn } from "@/lib/utils"

const mockLeads = [
  { id: "1", name: "Aryan Kumar", property: "Luxury Villa in Shela", msg: "I'm interested in the 3BHK. Is the price negotiable? I would like to visit this Saturday.", time: "2h ago", status: "New", phone: "+91 98*** **450", email: "ary***@example.com" },
  { id: "2", name: "Rahul Mehta", property: "3 BHK Apartment, Science City", msg: "Can we schedule a visit this weekend at 11 AM? Also, let me know about the parking situation.", time: "5h ago", status: "Read", phone: "+91 87*** **123", email: "rah***@example.com" },
  { id: "3", name: "Sonal Patel", property: "Commercial Plot, SG Highway", msg: "Does this include 2 parking spaces? Also, what is the exact frontage on the main road?", time: "1d ago", status: "Replied", phone: "+91 76*** **890", email: "son***@example.com" },
  { id: "4", name: "Anish Shah", property: "Office in Prahlad Nagar", msg: "What is the maintenance cost per month? Is there a separate cafeteria in the building?", time: "2d ago", status: "Read", phone: "+91 99*** **567", email: "ani***@example.com" },
  { id: "5", name: "Priya Varma", property: "Modern Flat in Bopal", msg: "Is this property RERA registered? When can we expect possession?", time: "3d ago", status: "New", phone: "+91 91*** **234", email: "pri***@example.com" },
]

export default function LeadsPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New': return 'bg-primary text-white border-none'
      case 'Read': return 'bg-slate-100 text-slate-600 border-slate-200'
      case 'Replied': return 'bg-emerald-50 text-emerald-600 border-emerald-100'
      default: return 'bg-slate-50 text-slate-600'
    }
  }

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight italic">Leads</h1>
          <p className="text-slate-500 font-medium">Manage and respond to property enquiries.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-12 rounded-2xl border-slate-100 bg-white font-bold gap-2">
            <Download className="w-4 h-4" /> Export CSV
          </Button>
          <Button className="h-12 rounded-2xl bg-primary hover:bg-primary-dark font-black gap-2 shadow-xl shadow-primary/20 transition-all active:scale-95 px-6">
            <Archive className="w-4 h-4" /> Archived Leads
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1 space-y-6">
            <Card className="border-none shadow-sm rounded-[32px] p-6 bg-white space-y-6">
                <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Search Lead</h4>
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Name, Property..." 
                            className="pl-10 h-12 rounded-2xl bg-slate-50 border-none font-medium text-sm" 
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Filter By Status</h4>
                    <div className="space-y-2">
                        {["All Leads", "New", "Read", "Replied", "Action Required"].map((f, i) => (
                            <button 
                                key={i} 
                                className={cn(
                                    "w-full flex items-center justify-between p-3 rounded-xl font-bold text-xs transition-all",
                                    i === 0 ? "bg-primary/5 text-primary" : "text-slate-500 hover:bg-slate-50"
                                )}
                            >
                                {f}
                                <span className="bg-slate-100 text-slate-400 px-2 py-0.5 rounded-lg text-[10px]">
                                    {i === 0 ? "45" : i === 1 ? "12" : "15"}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-50">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Quick Stats</h4>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-emerald-50 p-3 rounded-2xl text-center">
                            <p className="text-xl font-black text-emerald-600 tracking-tight">85%</p>
                            <p className="text-[8px] font-black text-emerald-500 uppercase">Response</p>
                        </div>
                        <div className="bg-blue-50 p-3 rounded-2xl text-center">
                            <p className="text-xl font-black text-blue-600 tracking-tight">1.2h</p>
                            <p className="text-[8px] font-black text-blue-500 uppercase">Avg Time</p>
                        </div>
                    </div>
                </div>
            </Card>

            <div className="bg-slate-900 rounded-[32px] p-6 text-white space-y-4 shadow-xl">
                 <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-white" />
                 </div>
                 <h4 className="text-lg font-black italic tracking-tight">AI Lead Assistant</h4>
                 <p className="text-white/60 text-xs font-medium leading-relaxed">Let our AI bot handle basic queries like area, price, and amenities while you&apos;re away.</p>
                 <Button className="w-full bg-white text-slate-900 hover:bg-slate-100 rounded-xl font-black h-11 text-xs">
                    Activate Now
                 </Button>
            </div>
        </div>

        {/* Leads List */}
        <div className="lg:col-span-3 space-y-4">
            {mockLeads.map((lead) => (
                <div key={lead.id} className="bg-white rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all group overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                        <div className="p-8 flex-1 space-y-6">
                            {/* Lead Header */}
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-4">
                                    <Avatar className="w-14 h-14 border-4 border-slate-50 shadow-sm">
                                        <AvatarFallback className="bg-primary/5 text-primary text-lg font-black">{lead.name.split(' ').map(n=>n[0]).join('')}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <div className="flex items-center gap-3">
                                            <h3 className="text-xl font-black text-slate-900 tracking-tight">{lead.name}</h3>
                                            <Badge className={cn("rounded-full font-black text-[9px] uppercase tracking-widest px-3", getStatusColor(lead.status))}>
                                                {lead.status}
                                            </Badge>
                                        </div>
                                        <p className="text-xs font-bold text-slate-400 flex items-center mt-1 italic">
                                            <Clock className="w-3.5 h-3.5 mr-1.5" /> Received {lead.time}
                                        </p>
                                    </div>
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="rounded-xl hover:bg-slate-50">
                                            <MoreVertical className="w-5 h-5 text-slate-400" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-48 rounded-2xl p-2">
                                        <DropdownMenuItem className="rounded-xl font-bold gap-2 px-3 py-2">
                                            <Archive className="w-4 h-4" /> Archive Lead
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="rounded-xl font-bold gap-2 px-3 py-2 text-red-500">
                                            <Trash2 className="w-4 h-4" /> Mark as Spam
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            {/* Message */}
                            <div className="bg-slate-50/80 p-6 rounded-3xl border border-slate-50 relative">
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity">
                                    <MessageSquare className="w-12 h-12" />
                                </div>
                                <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-3">Enquired about:</p>
                                <p className="text-sm font-black text-slate-900 group-hover:text-primary transition-colors cursor-pointer flex items-center gap-2 mb-4">
                                    {lead.property}
                                    <ArrowUpRight className="w-4 h-4" />
                                </p>
                                <p className="text-sm text-slate-600 font-medium leading-relaxed italic">
                                    &quot;{lead.msg}&quot;
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-wrap items-center gap-3 pt-2">
                                <Button className="h-12 bg-slate-900 hover:bg-slate-800 text-white font-black rounded-2xl px-8 shadow-xl shadow-slate-200 transition-all flex-1 md:flex-none">
                                    <MessageCircle className="w-4 h-4 mr-2" />
                                    Reply via Portal
                                </Button>
                                <Button variant="outline" className="h-12 rounded-2xl border-slate-100 font-bold px-6 gap-2">
                                    <Phone className="w-4 h-4 text-primary" /> Call Buyer
                                </Button>
                                <Button variant="outline" className="h-12 rounded-2xl border-slate-100 font-bold px-6 gap-2">
                                    <Mail className="w-4 h-4 text-primary" /> Email
                                </Button>
                            </div>
                        </div>

                        {/* Side Info */}
                        <div className="bg-slate-50/30 border-l border-slate-50 w-full md:w-64 p-8 flex flex-col justify-center space-y-6">
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Phone</p>
                                <p className="text-sm font-black text-slate-900">{lead.phone}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email</p>
                                <p className="text-sm font-black text-slate-900">{lead.email}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Preference</p>
                                <Badge className="bg-white text-slate-900 border-slate-200 font-bold shadow-none rounded-lg px-2 text-[10px]">Wants a Call</Badge>
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            <div className="flex items-center justify-center pt-8">
                 <Button variant="ghost" className="text-slate-400 font-black uppercase text-xs tracking-widest gap-2 hover:text-primary transition-all">
                    Load More Leads <ChevronRight className="w-4 h-4" />
                 </Button>
            </div>
        </div>
      </div>
    </div>
  )
}
