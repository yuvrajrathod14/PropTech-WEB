"use client"

import { useState, useEffect } from "react"
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
  Archive,
  Sparkles,
  Loader2
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
import { cn } from "@/lib/utils"
import { GridRowSkeleton } from "@/components/ui/skeleton"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"

export default function EnquiriesPage() {
  const supabase = createClient()
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [enquiries, setEnquiries] = useState<any[]>([])
  const [statusFilter, setStatusFilter] = useState("All")
  const [stats, setStats] = useState({ total: 0, newCount: 0, read: 0, replied: 0 })

  useEffect(() => {
    async function fetchEnquiries() {
      setIsLoading(true)
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        // Fetch all enquiries for owner's properties
        const { data: ownerProps } = await (supabase.from("properties") as any)
          .select("id, title")
          .eq("owner_id", user.id)

        const propIds = (ownerProps || []).map((p: any) => p.id)
        const propMap = Object.fromEntries((ownerProps || []).map((p: any) => [p.id, p.title]))

        if (propIds.length === 0) {
          setEnquiries([])
          setIsLoading(false)
          return
        }

        const { data: enqs, error } = await (supabase.from("enquiries") as any)
          .select("*, sender:sender_id(full_name, email, phone)")
          .in("property_id", propIds)
          .order("created_at", { ascending: false })

        if (error) throw error

        const enriched = (enqs || []).map((e: any) => ({
          ...e,
          property_title: propMap[e.property_id] || "Unknown Property"
        }))

        setEnquiries(enriched)

        // Calculate stats
        const total = enriched.length
        const newCount = enriched.filter((e: any) => e.status === "new" || !e.status).length
        const read = enriched.filter((e: any) => e.status === "read").length
        const replied = enriched.filter((e: any) => e.status === "replied").length
        setStats({ total, newCount, read, replied })
      } catch (error) {
        console.error("Error fetching enquiries:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchEnquiries()
  }, [supabase])

  // Filter logic
  const filtered = enquiries.filter(e => {
    const matchesSearch = searchQuery === "" || 
      (e.sender?.full_name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.property_title || "").toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === "All" || 
      (statusFilter === "New" && (e.status === "new" || !e.status)) ||
      (statusFilter === "Read" && e.status === "read") ||
      (statusFilter === "Replied" && e.status === "replied")

    return matchesSearch && matchesStatus
  })

  const updateEnquiryStatus = async (enquiryId: string, newStatus: string) => {
    try {
      await (supabase.from("enquiries") as any)
        .update({ status: newStatus })
        .eq("id", enquiryId)
      
      setEnquiries(prev => prev.map(e => e.id === enquiryId ? { ...e, status: newStatus } : e))
    } catch (e) {
      console.error(e)
    }
  }

  const timeAgo = (date: string) => {
    const now = new Date()
    const then = new Date(date)
    const diff = Math.floor((now.getTime() - then.getTime()) / 1000)
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
    return `${Math.floor(diff / 86400)}d ago`
  }

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight italic">Enquiries</h1>
          <p className="text-slate-500 font-medium">Manage and respond to property enquiries from potential buyers.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-12 rounded-2xl border-slate-100 bg-white font-bold gap-2">
            <Download className="w-4 h-4" /> Export
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1 space-y-6">
            <Card className="border-none shadow-sm rounded-[32px] p-6 bg-white space-y-6">
                <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Search Buyer</h4>
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
                        {[
                          { label: "All", count: stats.total },
                          { label: "New", count: stats.newCount },
                          { label: "Read", count: stats.read },
                          { label: "Replied", count: stats.replied },
                        ].map((f) => (
                            <button 
                                key={f.label} 
                                onClick={() => setStatusFilter(f.label)}
                                className={cn(
                                    "w-full flex items-center justify-between p-3 rounded-xl font-bold text-xs transition-all",
                                    statusFilter === f.label ? "bg-[#1A56DB]/5 text-[#1A56DB]" : "text-slate-500 hover:bg-slate-50"
                                )}
                            >
                                {f.label}
                                <span className="bg-slate-100 text-slate-400 px-2 py-0.5 rounded-lg text-[10px]">
                                    {f.count}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-50">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Performance</h4>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-emerald-50 p-3 rounded-2xl text-center">
                            <p className="text-xl font-black text-emerald-600 tracking-tight">
                              {stats.total > 0 ? Math.round(((stats.replied) / stats.total) * 100) : 0}%
                            </p>
                            <p className="text-[8px] font-black text-emerald-500 uppercase">Response</p>
                        </div>
                        <div className="bg-blue-50 p-3 rounded-2xl text-center">
                            <p className="text-xl font-black text-blue-600 tracking-tight">{stats.total}</p>
                            <p className="text-[8px] font-black text-blue-500 uppercase">Total</p>
                        </div>
                    </div>
                </div>
            </Card>

            <div className="bg-slate-900 rounded-[32px] p-6 text-white space-y-4 shadow-xl">
                 <div className="w-10 h-10 rounded-xl bg-[#1A56DB] flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-white" />
                 </div>
                 <h4 className="text-lg font-black italic tracking-tight">AI Insights</h4>
                 <p className="text-white/60 text-xs font-medium leading-relaxed">Buyers who receive a reply within <span className="text-white font-bold">15 minutes</span> are 4x more likely to schedule a visit.</p>
            </div>
        </div>

        {/* Enquiries List */}
        <div className="lg:col-span-3 space-y-4">
            {isLoading ? (
                Array(5).fill(0).map((_, i) => <GridRowSkeleton key={i} />)
            ) : filtered.length === 0 ? (
                <div className="bg-white rounded-[32px] p-20 text-center border border-slate-100">
                    <MessageSquare className="w-16 h-16 text-slate-100 mx-auto mb-6" />
                    <h3 className="text-2xl font-black text-slate-900 italic tracking-tight">No Enquiries Found</h3>
                    <p className="text-slate-400 font-bold mt-2">
                      {searchQuery || statusFilter !== "All" ? "Try adjusting your filters." : "When buyers enquire about your properties, they'll appear here."}
                    </p>
                </div>
            ) : filtered.map((enquiry) => (
                <div key={enquiry.id} className="bg-white rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl hover:border-[#1A56DB]/20 transition-all group overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                        <div className="p-8 flex-1 space-y-6">
                            {/* Enquiry Header */}
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-4">
                                    <Avatar className="w-14 h-14 border-4 border-slate-50 shadow-sm">
                                        <AvatarFallback className="bg-[#1A56DB]/5 text-[#1A56DB] text-lg font-black">
                                          {(enquiry.sender?.full_name || "U").split(' ').map((n: string) => n[0]).join('')}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <div className="flex items-center gap-3">
                                            <h3 className="text-xl font-black text-slate-900 tracking-tight">{enquiry.sender?.full_name || "Unknown"}</h3>
                                            <Badge 
                                              variant={(enquiry.status === "new" || !enquiry.status) ? "default" : enquiry.status === "read" ? "draft" as any : "approved" as any} 
                                              className="rounded-full font-black text-[9px] uppercase tracking-widest px-3 border-none shadow-none"
                                            >
                                                {enquiry.status || "New"}
                                            </Badge>
                                        </div>
                                        <p className="text-xs font-bold text-slate-400 flex items-center mt-1 italic">
                                            <Clock className="w-3.5 h-3.5 mr-1.5" /> Received {timeAgo(enquiry.created_at)}
                                        </p>
                                    </div>
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="rounded-xl hover:bg-slate-50">
                                            <MoreVertical className="w-5 h-5 text-slate-400" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-48 rounded-2xl p-2 bg-white/80 backdrop-blur-md">
                                        <DropdownMenuItem onClick={() => updateEnquiryStatus(enquiry.id, "read")} className="rounded-xl font-bold gap-2 px-3 py-2 cursor-pointer transition-colors focus:bg-slate-100">
                                            <Archive className="w-4 h-4" /> Mark as Read
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => updateEnquiryStatus(enquiry.id, "replied")} className="rounded-xl font-bold gap-2 px-3 py-2 cursor-pointer transition-colors focus:bg-slate-100">
                                            <MessageCircle className="w-4 h-4" /> Mark as Replied
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            {/* Message */}
                            <div className="bg-slate-50/80 p-6 rounded-3xl border border-slate-50 relative group">
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity">
                                    <MessageSquare className="w-12 h-12" />
                                </div>
                                <p className="text-[10px] font-black text-[#1A56DB] uppercase tracking-widest mb-3">Enquired about:</p>
                                <Link href={`/owner/listings/${enquiry.property_id}`}>
                                  <p className="text-sm font-black text-slate-900 group-hover:text-[#1A56DB] transition-colors cursor-pointer flex items-center gap-2 mb-4">
                                      {enquiry.property_title}
                                      <ArrowUpRight className="w-4 h-4" />
                                  </p>
                                </Link>
                                <p className="text-sm text-slate-600 font-medium leading-relaxed italic">
                                    &quot;{enquiry.message}&quot;
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-wrap items-center gap-3 pt-2">
                                <Button onClick={() => updateEnquiryStatus(enquiry.id, "replied")} className="h-12 bg-slate-900 hover:bg-slate-800 text-white font-black rounded-2xl px-8 shadow-xl shadow-slate-200 transition-all flex-1 md:flex-none italic">
                                    <MessageCircle className="w-4 h-4 mr-2" />
                                    Reply via Chat
                                </Button>
                                {enquiry.sender?.phone && (
                                  <Button variant="outline" className="h-12 rounded-2xl border-slate-100 font-bold px-6 gap-2 hover:bg-slate-50">
                                      <Phone className="w-4 h-4 text-[#1A56DB]" /> Call Buyer
                                  </Button>
                                )}
                                {enquiry.sender?.email && (
                                  <Button variant="outline" className="h-12 rounded-2xl border-slate-100 font-bold px-6 gap-2 hover:bg-slate-50">
                                      <Mail className="w-4 h-4 text-[#1A56DB]" /> Email
                                  </Button>
                                )}
                            </div>
                        </div>

                        {/* Side Info */}
                        <div className="bg-slate-50/50 border-t md:border-t-0 md:border-l border-slate-100 w-full md:w-64 p-8 flex flex-col justify-center space-y-6">
                            <div className="grid grid-cols-2 md:grid-cols-1 gap-6">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Phone</p>
                                    <p className="text-sm font-black text-slate-900 truncate">{enquiry.sender?.phone || "N/A"}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Email</p>
                                    <p className="text-sm font-black text-slate-900 truncate">{enquiry.sender?.email || "N/A"}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  )
}
