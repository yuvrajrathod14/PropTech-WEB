"use client"

import { useEffect, useState, useMemo } from "react"
import Link from "next/link"
import { 
  Search, 
  Filter, 
  Eye, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  MapPin,
  Home,
  ArrowUpRight,
  Download,
  MoreHorizontal,
  Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"
import { formatIndianPrice } from "@/lib/utils/formatPrice"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function AdminListingsPage() {
  const supabase = createClient()
  const router = useRouter()
  const [listings, setListings] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [page, setPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const pageSize = 10

  const fetchListings = async () => {
    setIsLoading(true)
    try {
      let query = (supabase
        .from("properties") as any)
        .select(`
          *,
          profiles:owner_id (
            full_name,
            email
          )
        `, { count: 'exact' })
      
      if (filter !== 'all') {
        query = query.eq('status', filter)
      }

      const from = (page - 1) * pageSize
      const to = from + pageSize - 1

      const { data, error, count } = await query
        .order("updated_at", { ascending: false })
        .range(from, to)

      if (error) throw error
      setListings(data || [])
      setTotalCount(count || 0)
    } catch (error) {
      console.error("Error fetching admin listings:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchListings()
  }, [page, filter])

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      const { error } = await (supabase.from("properties") as any)
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", id)
      
      if (error) throw error

      // 2. Log Action
      if (user) {
        await (supabase.from("admin_audit_log") as any).insert({
          admin_id: user.id,
          action: status === 'live' ? 'approve' : 'reject',
          property_id: id,
          details: `Changed status to ${status}`
        })
      }
      
      // Refresh local state
      setListings(prev => prev.map(l => l.id === id ? { ...l, status } : l))
    } catch (error) {
      console.error("Update status error:", error)
      alert("Failed to update status")
    }
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'live': return 'bg-emerald-50 text-emerald-600 border-emerald-100'
      case 'pending': return 'bg-amber-50 text-amber-600 border-amber-100'
      case 'rejected': return 'bg-red-50 text-red-600 border-red-100'
      default: return 'bg-slate-50 text-slate-600'
    }
  }

  const filteredListings = useMemo(() => {
    return listings.filter(item => {
      const matchesSearch = (item.property_name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (item.profiles?.full_name || "").toLowerCase().includes(searchQuery.toLowerCase())
      const matchesTab = filter === "all" || item.status?.toLowerCase() === filter.toLowerCase()
      return matchesSearch && matchesTab
    })
  }, [listings, searchQuery, filter])

  const pendingCount = useMemo(() => listings.filter(l => l.status === 'pending').length, [listings])

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight italic">Listings</h1>
          <p className="text-slate-500 font-medium">Manage and audit all property listings across the platform.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-12 rounded-2xl border-slate-100 bg-white font-bold gap-2">
            <Download className="w-4 h-4" /> Export CSV
          </Button>
          <Button className="h-12 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black px-6 shadow-xl shadow-slate-200 transition-all active:scale-95 italic">
            Audit Queue ({pendingCount})
          </Button>
        </div>
      </div>

      {/* Filters & Search */}
      <Card className="border-none shadow-sm rounded-[32px] p-4 bg-white flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search property, owner, or ID..." 
                    className="pl-10 h-12 rounded-2xl bg-slate-50 border-none font-medium text-sm" 
                />
            </div>
            <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-2xl w-full md:w-auto">
                {["All", "Pending", "Live", "Rejected"].map((t) => (
                    <Button 
                        key={t}
                        variant={filter === t.toLowerCase() ? "secondary" : "ghost"}
                        onClick={() => setFilter(t.toLowerCase())}
                        className={cn(
                            "rounded-xl px-4 h-10 font-black text-[10px] uppercase tracking-widest transition-all flex-1 md:flex-none",
                            filter === t.toLowerCase() ? "bg-white text-primary shadow-sm" : "text-slate-500"
                        )}
                    >
                        {t}
                    </Button>
                ))}
            </div>
      </Card>

      {/* Listings Table Layout */}
      <div className="space-y-4">
          <div className="hidden lg:grid grid-cols-12 gap-4 px-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
              <div className="col-span-1">ID</div>
              <div className="col-span-4">Property & Owner</div>
              <div className="col-span-2">Price & Type</div>
              <div className="col-span-2">Updated At</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-1 text-right">Actions</div>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[32px]">
                <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
                <p className="text-slate-500 font-medium italic">Scanning listings database...</p>
            </div>
          ) : filteredListings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[32px] text-center space-y-4">
                <div className="w-20 h-20 rounded-3xl bg-slate-50 flex items-center justify-center">
                    <Home className="w-10 h-10 text-slate-200" />
                </div>
                <div className="space-y-1">
                    <h4 className="text-xl font-black text-slate-900 tracking-tight italic">No Listings Match</h4>
                    <p className="text-slate-500 font-medium max-w-xs">Check your filters or search query to find properties.</p>
                </div>
            </div>
          ) : (
            filteredListings.map((listing) => (
                <Card key={listing.id} className="border-none shadow-sm rounded-[24px] bg-white hover:shadow-xl transition-all group">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center p-6 lg:px-8">
                        <div className="col-span-1 font-black text-slate-300 text-sm italic">#{listing.id.slice(0, 5)}</div>
                        
                        <div className="col-span-4 flex items-center gap-4">
                            <div className="w-14 h-14 rounded-xl bg-slate-100 overflow-hidden shrink-0 flex items-center justify-center relative group-hover:bg-primary/5 transition-colors">
                                {listing.images?.[0] ? (
                                    <Image src={listing.images[0]} alt="" width={56} height={56} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                ) : (
                                    <Home className="w-6 h-6 text-slate-300 group-hover:text-primary transition-colors" />
                                )}
                            </div>
                            <div className="min-w-0">
                                <Link href={`/property/${listing.id}`}>
                                  <h4 className="text-base font-black text-slate-900 truncate tracking-tight group-hover:text-primary transition-colors cursor-pointer flex items-center gap-2">
                                      {listing.property_name || 'Untitled'}
                                      <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                  </h4>
                                </Link>
                                <p className="text-xs font-bold text-slate-400 italic">Owner: {listing.profiles?.full_name || 'Unknown'}</p>
                            </div>
                        </div>
  
                        <div className="col-span-2 space-y-1">
                            <p className="text-sm font-black text-slate-900">{formatIndianPrice(listing.price || 0)}</p>
                            <Badge className="bg-slate-50 text-slate-400 border-none font-black text-[8px] uppercase tracking-widest px-2">{listing.type || 'N/A'}</Badge>
                        </div>
  
                        <div className="col-span-2 flex items-center gap-2 text-xs font-bold text-slate-500 italic">
                            <Clock className="w-3.5 h-3.5 text-slate-300" />
                            {new Date(listing.updated_at).toLocaleDateString()}
                        </div>
  
                        <div className="col-span-2">
                            <Badge className={cn("rounded-full font-black text-[9px] uppercase tracking-widest px-3 border shadow-none", getStatusColor(listing.status))}>
                                {listing.status || 'Draft'}
                            </Badge>
                        </div>
  
                        <div className="col-span-1 flex justify-end gap-2">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="rounded-xl hover:bg-slate-50">
                                        <MoreHorizontal className="w-5 h-5 text-slate-400" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2 bg-white/80 backdrop-blur-md border-slate-100 shadow-2xl">
                                    <DropdownMenuItem asChild className="rounded-xl font-bold gap-3 px-3 py-2.5 cursor-pointer transition-colors focus:bg-slate-100">
                                        <Link href={`/property/${listing.id}`} className="flex items-center gap-3 w-full">
                                            <Eye className="w-4 h-4 text-blue-500" /> View Full Listing
                                        </Link>
                                    </DropdownMenuItem>
                                    {listing.status?.toLowerCase() === 'pending' && (
                                      <>
                                        <DropdownMenuItem 
                                            onSelect={() => handleUpdateStatus(listing.id, 'live')}
                                            className="rounded-xl font-bold gap-3 px-3 py-2.5 cursor-pointer transition-colors focus:bg-emerald-50 focus:text-emerald-600"
                                        >
                                            <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Approve Listing
                                        </DropdownMenuItem>
                                        <DropdownMenuItem 
                                            onSelect={() => handleUpdateStatus(listing.id, 'rejected')}
                                            className="rounded-xl font-bold gap-3 px-3 py-2.5 cursor-pointer transition-colors focus:bg-red-50 focus:text-red-600"
                                        >
                                            <XCircle className="w-4 h-4 text-red-500" /> Reject Listing
                                        </DropdownMenuItem>
                                      </>
                                    )}
                                    <div className="h-[1px] bg-slate-100 my-1" />
                                    <DropdownMenuItem 
                                        onSelect={() => router.push(`/admin/listings/${listing.id}/edit`)}
                                        className="rounded-xl font-bold gap-3 px-3 py-2.5 cursor-pointer transition-colors focus:bg-slate-100"
                                    >
                                        <MapPin className="w-4 h-4 text-slate-400" /> Map Location
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </Card>
            ))
          )}
      </div>

      {/* Pagination Footer */}
      {!isLoading && totalCount > 0 && (
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-100 italic">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Showing <span className="text-slate-900">{((page - 1) * pageSize) + 1}</span> to <span className="text-slate-900">{Math.min(page * pageSize, totalCount)}</span> of <span className="text-slate-900">{totalCount}</span> Listings
          </p>
          <div className="flex items-center gap-2">
            <Button 
                variant="outline" 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="h-10 rounded-xl border-slate-100 font-black text-[10px] uppercase tracking-widest px-6 hover:bg-slate-50 disabled:opacity-30"
            >
                Previous
            </Button>
            <Button 
                variant="outline" 
                onClick={() => setPage(p => p + 1)}
                disabled={page * pageSize >= totalCount}
                className="h-10 rounded-xl border-slate-100 font-black text-[10px] uppercase tracking-widest px-6 hover:bg-slate-50 disabled:opacity-30"
            >
                Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
