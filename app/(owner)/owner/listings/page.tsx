"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { 
  PlusCircle, 
  Search, 
  MoreVertical, 
  Eye, 
  Trash2,
  CheckCircle2,
  XCircle,
  Clock,
  FileText,
  MapPin,
  Plus,
  LayoutGrid
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
import { formatIndianPrice, cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"
import { TableRowSkeleton } from "@/components/ui/skeleton"
import { EmptyState } from "@/components/ui/empty-state"
import { OptimizedImage } from "@/components/shared/optimized-image"

export default function MyListingsPage() {
  const router = useRouter()
  const supabase = createClient()
  const [listings, setListings] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [page, setPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [globalStats, setGlobalStats] = useState({ live: 0, draft: 0, sold: 0 })
  const pageSize = 10

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Fetch Global Counts in Parallel (Optimized)
      const [liveRes, draftRes, soldRes] = await Promise.all([
        supabase.from("properties").select("id", { count: 'exact', head: true }).eq("owner_id", user.id).eq("status", "live"),
        supabase.from("properties").select("id", { count: 'exact', head: true }).eq("owner_id", user.id).eq("status", "draft"),
        supabase.from("properties").select("id", { count: 'exact', head: true }).eq("owner_id", user.id).eq("status", "sold"),
      ])

      setGlobalStats({
        live: liveRes.count || 0,
        draft: draftRes.count || 0,
        sold: soldRes.count || 0
      })

      // Fetch Paginated Listings
      let query = (supabase.from("properties") as any)
        .select("*", { count: 'exact' })
        .eq("owner_id", user.id)
      
      if (activeTab !== 'all') {
        const status = activeTab === 'drafts' ? 'draft' : activeTab
        query = query.eq('status', status)
      }

      if (searchQuery) {
        query = query.ilike('property_name', `%${searchQuery}%`)
      }

      const from = (page - 1) * pageSize
      const to = from + pageSize - 1

      const { data, error, count } = await query
        .order("created_at", { ascending: false })
        .range(from, to)

      if (error) throw error
      setListings(data || [])
      setTotalCount(count || 0)
    } catch (error) {
      console.error("Error fetching listings:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData()
    }, 300)
    return () => clearTimeout(timer)
  }, [page, activeTab, searchQuery, supabase])

  useEffect(() => {
    setPage(1)
  }, [activeTab, searchQuery])

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const toggleAll = () => {
    setSelectedIds(prev => 
      prev.length === listings.length ? [] : listings.map(l => l.id)
    )
  }

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'live': return <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
      case 'pending': return <Clock className="w-3.5 h-3.5 mr-1" />
      case 'rejected': return <XCircle className="w-3.5 h-3.5 mr-1" />
      case 'draft': return <FileText className="w-3.5 h-3.5 mr-1" />
      case 'sold': return <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
      default: return null
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this listing?")) return
    try {
      const { error } = await supabase.from("properties").delete().eq("id", id)
      if (error) throw error
      setListings(prev => prev.filter(l => l.id !== id))
      setTotalCount(prev => prev - 1)
    } catch (error) {
      console.error("Delete error:", error)
    }
  }

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight italic">Inventory</h1>
          <p className="text-slate-500 font-medium">Manage your active real estate portfolio.</p>
        </div>
        <Link href="/owner/post">
          <Button className="bg-[#1A56DB] hover:bg-[#1A56DB]/90 text-white rounded-2xl h-14 px-8 font-black gap-2 shadow-xl shadow-[#1A56DB]/20 transition-all active:scale-95">
            <PlusCircle className="w-5 h-5" />
            Add Property
          </Button>
        </Link>
      </div>

      {/* Stats Quick Look */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
            { label: "Total Properties", value: totalCount, sub: "All categories" },
            { label: "Live Listings", value: globalStats.live, sub: "Publicly visible" },
            { label: "Drafts", value: globalStats.draft, sub: "Incomplete" },
            { label: "Sold Properties", value: globalStats.sold, sub: "Closed units" },
        ].map((s, i) => (
            <div key={i} className="bg-white p-6 rounded-[28px] border border-slate-100 shadow-sm space-y-1 hover:shadow-lg transition-all">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{s.label}</span>
                <p className="text-3xl font-black text-slate-900 leading-tight">{s.value}</p>
                <p className="text-[10px] font-bold text-slate-400 italic">{s.sub}</p>
            </div>
        ))}
      </div>

      <Card className="border-none shadow-sm rounded-[40px] overflow-hidden bg-white">
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="px-8 pt-8 border-b border-slate-100 space-y-6 pb-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <TabsList className="bg-slate-100 p-1 rounded-2xl h-12 w-fit">
                    {["All", "Live", "Pending", "Rejected", "Sold", "Drafts"].map(tab => (
                        <TabsTrigger 
                            key={tab} 
                            value={tab.toLowerCase()}
                            className="rounded-xl px-4 font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-[#1A56DB] data-[state=active]:shadow-sm transition-all"
                        >
                            {tab}
                        </TabsTrigger>
                    ))}
                </TabsList>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 font-bold" />
                        <Input 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Find listing..." 
                            className="pl-10 h-12 rounded-2xl bg-slate-50 border-none font-black text-xs uppercase tracking-widest focus-visible:ring-[#1A56DB]/20" 
                        />
                    </div>
                </div>
            </div>
          </div>

          <TabsContent value={activeTab} className="mt-0">
            <div className="min-h-[400px]">
              {/* Desktop Table */}
              <table className="w-full text-left border-collapse hidden md:table">
                <thead className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <tr>
                    <th className="px-8 py-4 w-10 text-center">
                        <Checkbox checked={selectedIds.length === listings.length && listings.length > 0} onCheckedChange={toggleAll} className="border-slate-300 rounded-md" />
                    </th>
                    <th className="px-4 py-4">Property</th>
                    <th className="px-8 py-4">Price</th>
                    <th className="px-8 py-4">Status</th>
                    <th className="px-8 py-4 text-center">Stats</th>
                    <th className="px-8 py-4">Date</th>
                    <th className="px-8 py-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {isLoading ? (
                    Array(5).fill(0).map((_, i) => <TableRowSkeleton key={i} columns={7} />)
                  ) : listings.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-0">
                        <EmptyState 
                          title="No Inventory Found"
                          description={searchQuery ? `No results for "${searchQuery}"` : "You haven't added any listings here yet."}
                          icon={LayoutGrid}
                          action={!searchQuery && activeTab === 'all' ? {
                            label: "List Property",
                            onClick: () => router.push("/owner/post"),
                            icon: Plus
                          } : undefined}
                          className="py-24"
                        />
                      </td>
                    </tr>
                  ) : (
                    listings.map((item) => (
                      <tr key={item.id} className="group hover:bg-slate-50/50 transition-colors">
                        <td className="px-8 py-5 text-center">
                           <Checkbox checked={selectedIds.includes(item.id)} onCheckedChange={() => toggleSelect(item.id)} className="border-slate-200 rounded-md" />
                        </td>
                        <td className="px-4 py-5 min-w-[300px]">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-12 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-100 shadow-sm relative group">
                                <OptimizedImage 
                                  src={item.images?.[0] || ""} 
                                  alt={item.property_name || ""} 
                                  fill
                                  className="object-cover transition-transform group-hover:scale-110" 
                                />
                            </div>
                            <div className="space-y-1">
                              <span className="font-black text-slate-900 group-hover:text-[#1A56DB] transition-colors block text-sm leading-none">{item.property_name || 'Untitled'}</span>
                              <span className="text-[10px] font-bold text-slate-400 flex items-center italic">
                                  <MapPin className="w-2.5 h-2.5 mr-1 text-slate-300" />
                                  {item.city}, {item.locality}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                           <span className="font-black text-slate-900">{formatIndianPrice(item.price || 0)}</span>
                        </td>
                        <td className="px-8 py-5">
                          <Badge variant={item.status?.toLowerCase() as any} className="rounded-full shadow-none text-[8px] font-black uppercase tracking-widest px-3 py-1 flex items-center w-fit">
                            {getStatusIcon(item.status)}
                            {item.status}
                          </Badge>
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex items-center justify-center gap-4">
                              <div className="flex flex-col items-center">
                                  <span className="text-xs font-black text-slate-900">{item.views || 0}</span>
                                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">Views</span>
                              </div>
                              <div className="flex flex-col items-center border-l border-slate-100 pl-4">
                                  <span className="text-xs font-black text-slate-900">{Math.floor((item.views || 0) * 0.1)}</span>
                                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">Leads</span>
                              </div>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                             {new Date(item.created_at).toLocaleDateString()}
                           </span>
                        </td>
                        <td className="px-8 py-5 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="rounded-xl hover:bg-white hover:text-[#1A56DB] shadow-sm border border-transparent hover:border-slate-100 transition-all">
                                <MoreVertical className="w-5 h-5" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 rounded-2xl p-2 bg-white/80 backdrop-blur-xl border-slate-100 shadow-2xl">
                              <DropdownMenuLabel className="text-[10px] uppercase font-black text-slate-400 tracking-widest px-3 py-2 italic font-black">Control Panel</DropdownMenuLabel>
                              <DropdownMenuItem 
                                  onSelect={() => router.push(`/property/${item.id}`)}
                                  className="rounded-xl font-black text-[10px] uppercase tracking-widest gap-2 px-3 py-2.5 cursor-pointer transition-colors focus:bg-[#1A56DB]/5 focus:text-[#1A56DB]"
                              >
                                  <Eye className="w-4 h-4" /> View Listing
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                  onSelect={() => {
                                    if (item.status === 'draft') {
                                      localStorage.setItem("proptech_property_draft_id", item.id)
                                      router.push("/owner/post")
                                    } else {
                                      router.push(`/owner/listings/${item.id}/edit`)
                                    }
                                  }}
                                  className="rounded-xl font-black text-[10px] uppercase tracking-widest gap-2 px-3 py-2.5 cursor-pointer transition-colors focus:bg-[#1A56DB]/5 focus:text-[#1A56DB]"
                              >
                                  <FileText className="w-4 h-4" /> Edit Details
                              </DropdownMenuItem>
                              <DropdownMenuSeparator className="bg-slate-50 mx-1" />
                              <DropdownMenuItem 
                                onSelect={() => handleDelete(item.id)}
                                className="rounded-xl font-black text-[10px] uppercase tracking-widest gap-2 px-3 py-2.5 cursor-pointer text-[#EF4444] focus:bg-red-50 focus:text-[#EF4444]"
                              >
                                  <Trash2 className="w-4 h-4" /> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              {/* Mobile Card List */}
              <div className="flex flex-col md:hidden divide-y divide-slate-100">
                {isLoading ? (
                  Array(3).fill(0).map((_, i) => (
                    <div key={i} className="p-6 space-y-4 animate-pulse">
                      <div className="flex gap-4">
                        <div className="w-20 h-14 bg-slate-100 rounded-xl" />
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-slate-100 rounded w-3/4" />
                          <div className="h-3 bg-slate-100 rounded w-1/2" />
                        </div>
                      </div>
                    </div>
                  ))
                ) : listings.length === 0 ? (
                  <EmptyState 
                    title="No Inventory Found"
                    description={searchQuery ? `No results for "${searchQuery}"` : "You haven't added any listings here yet."}
                    icon={LayoutGrid}
                    className="py-24"
                  />
                ) : (
                  listings.map((item) => (
                    <div key={item.id} className="p-6 space-y-4 active:bg-slate-50 transition-colors">
                      <div className="flex gap-4">
                        <div className="w-24 h-20 rounded-2xl bg-slate-100 overflow-hidden shrink-0 border border-slate-100 shadow-sm relative">
                          <OptimizedImage src={item.images?.[0] || ""} alt={item.property_name || ""} fill className="object-cover" />
                        </div>
                        <div className="flex-1 min-w-0 space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-black text-slate-900 text-sm truncate leading-tight">{item.property_name || 'Untitled'}</h4>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg shrink-0">
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48 rounded-2xl p-2 bg-white/80 backdrop-blur-xl border-slate-100 shadow-2xl">
                                <DropdownMenuItem onSelect={() => router.push(`/property/${item.id}`)} className="rounded-xl font-black text-[10px] uppercase tracking-widest gap-2 px-3 py-2.5 cursor-pointer transition-colors focus:bg-[#1A56DB]/5 focus:text-[#1A56DB]">
                                  <Eye className="w-4 h-4" /> View Listing
                                </DropdownMenuItem>
                                <DropdownMenuItem onSelect={() => {
                                  if (item.status === 'draft') {
                                    localStorage.setItem("proptech_property_draft_id", item.id)
                                    router.push("/owner/post")
                                  } else {
                                    router.push(`/owner/listings/${item.id}/edit`)
                                  }
                                }} className="rounded-xl font-black text-[10px] uppercase tracking-widest gap-2 px-3 py-2.5 cursor-pointer transition-colors focus:bg-[#1A56DB]/5 focus:text-[#1A56DB]">
                                  <FileText className="w-4 h-4" /> Edit Details
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-slate-50 mx-1" />
                                <DropdownMenuItem onSelect={() => handleDelete(item.id)} className="rounded-xl font-black text-[10px] uppercase tracking-widest gap-2 px-3 py-2.5 cursor-pointer text-[#EF4444] focus:bg-red-50 focus:text-[#EF4444]">
                                  <Trash2 className="w-4 h-4" /> Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                          <p className="text-[10px] font-bold text-slate-400 flex items-center italic truncate">
                            <MapPin className="w-2.5 h-2.5 mr-1 text-slate-300" />
                            {item.city}, {item.locality}
                          </p>
                          <div className="flex items-center justify-between pt-1">
                            <span className="font-black text-slate-900 text-sm">{formatIndianPrice(item.price || 0)}</span>
                            <Badge variant={item.status?.toLowerCase() as any} className="rounded-full shadow-none text-[8px] font-black uppercase tracking-widest px-2 py-0.5 flex items-center w-fit">
                              {getStatusIcon(item.status)}
                              {item.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 bg-slate-50 rounded-2xl p-3">
                        <div className="flex-1 flex flex-col items-center">
                          <span className="text-xs font-black text-slate-900">{item.views || 0}</span>
                          <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">Views</span>
                        </div>
                        <div className="w-px h-6 bg-slate-200" />
                        <div className="flex-1 flex flex-col items-center">
                          <span className="text-xs font-black text-slate-900">{Math.floor((item.views || 0) * 0.1)}</span>
                          <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">Leads</span>
                        </div>
                        <div className="w-px h-6 bg-slate-200" />
                        <div className="flex-1 flex flex-col items-center">
                          <span className="text-xs font-black text-slate-900">{new Date(item.created_at).toLocaleDateString()}</span>
                          <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">Listed</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </Card>

      {/* Pagination Footer */}
      {!isLoading && totalCount > pageSize && (
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6 px-4">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
            Showing <span className="text-slate-900">{((page - 1) * pageSize) + 1} - {Math.min(page * pageSize, totalCount)}</span> of <span className="text-slate-900">{totalCount}</span> Assets
          </p>
          <div className="flex items-center gap-2">
            <Button 
                variant="outline" 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="h-10 rounded-xl border-slate-100 font-black text-[10px] uppercase tracking-widest px-6 hover:bg-slate-50 disabled:opacity-30"
            >
                Prev
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
