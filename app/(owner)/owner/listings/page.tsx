"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
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
  MapPin,
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
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { formatIndianPrice } from "@/lib/utils/formatPrice"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"

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
  const pageSize = 10

  const fetchListings = async () => {
    setIsLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      let query = (supabase.from("properties") as any)
        .select("*", { count: 'exact' })
        .eq("owner_id", user.id)
      
      if (activeTab !== 'all') {
        const status = activeTab === 'drafts' ? 'draft' : activeTab
        query = query.eq('status', status)
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
      console.error("Error fetching listings:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchListings()
  }, [page, activeTab, supabase])

  // Reset page when tab changes
  useEffect(() => {
    setPage(1)
  }, [activeTab])

  const filteredListings = useMemo(() => {
    return listings.filter(item => {
      const matchesSearch = (item.property_name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (item.address || "").toLowerCase().includes(searchQuery.toLowerCase())
      const matchesTab = activeTab === "all" || 
                        (activeTab === "drafts" ? item.status === "draft" : item.status === activeTab)
      return matchesSearch && matchesTab
    })
  }, [listings, searchQuery, activeTab])

  const stats = useMemo(() => {
    return {
      total: listings.length,
      live: listings.filter(l => l.status === 'live').length,
      drafts: listings.filter(l => l.status === 'draft').length,
      sold: listings.filter(l => l.status === 'sold').length
    }
  }, [listings])

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const toggleAll = () => {
    setSelectedIds(prev => 
      prev.length === filteredListings.length ? [] : filteredListings.map(l => l.id)
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

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'live': return 'bg-emerald-50 text-emerald-600 border-emerald-100'
      case 'pending': return 'bg-amber-50 text-amber-600 border-amber-100'
      case 'rejected': return 'bg-red-50 text-red-600 border-red-100'
      case 'draft': return 'bg-slate-50 text-slate-600 border-slate-100'
      case 'sold': return 'bg-blue-50 text-blue-600 border-blue-100'
      default: return 'bg-slate-50 text-slate-600'
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this listing?")) return
    try {
      const { error } = await supabase.from("properties").delete().eq("id", id)
      if (error) throw error
      setListings(prev => prev.filter(l => l.id !== id))
    } catch (error) {
      console.error("Delete error:", error)
      alert("Failed to delete property")
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
          <Button className="bg-primary hover:bg-primary/90 rounded-2xl h-14 px-8 font-black gap-2 shadow-xl shadow-primary/20 transition-all active:scale-95">
            <PlusCircle className="w-5 h-5" />
            Post New Property
          </Button>
        </Link>
      </div>

      {/* Stats Quick Look */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
            { label: "Total Properties", value: stats.total, sub: "All time" },
            { label: "Live Listings", value: stats.live, sub: "Currently visible" },
            { label: "Drafts", value: stats.drafts, sub: "Needs completion" },
            { label: "Sold Properties", value: stats.sold, sub: "Closed deals" },
        ].map((s, i) => (
            <div key={i} className="bg-white p-6 rounded-[28px] border border-slate-100 shadow-sm space-y-1">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.label}</span>
                <p className="text-2xl font-black text-slate-900">{s.value}</p>
                <p className="text-[10px] font-bold text-slate-500 italic">{s.sub}</p>
            </div>
        ))}
      </div>

      <Card className="border-none shadow-sm rounded-[40px] overflow-hidden">
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
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
                </div>
            </div>

            {/* Selection Bar omitted for brevity or implemented as needed */}
          </div>

          <TabsContent value={activeTab} className="mt-0">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
                <p className="text-slate-500 font-medium">Fetching your properties...</p>
              </div>
            ) : filteredListings.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-20 text-center space-y-4">
                <div className="w-20 h-20 rounded-3xl bg-slate-50 flex items-center justify-center text-slate-200">
                  <FileText className="w-10 h-10" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xl font-black text-slate-900 tracking-tight italic">No Listings Found</h4>
                  <p className="text-slate-500 font-medium">Try adjusting your filters or search query.</p>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <tr>
                      <th className="px-8 py-4 w-10">
                          <Checkbox checked={selectedIds.length === filteredListings.length && filteredListings.length > 0} onCheckedChange={toggleAll} className="border-slate-300 rounded-md" />
                      </th>
                      <th className="px-4 py-4">Property</th>
                      <th className="px-8 py-4">Type</th>
                      <th className="px-8 py-4">Price</th>
                      <th className="px-8 py-4">Status</th>
                      <th className="px-8 py-4 text-center">Stats</th>
                      <th className="px-8 py-4">Updated Date</th>
                      <th className="px-8 py-4"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredListings.map((item) => (
                      <tr key={item.id} className="group hover:bg-slate-50/30 transition-colors">
                        <td className="px-8 py-5">
                           <Checkbox checked={selectedIds.includes(item.id)} onCheckedChange={() => toggleSelect(item.id)} className="border-slate-200 rounded-md" />
                        </td>
                        <td className="px-4 py-5 min-w-[300px]">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-12 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-100 shadow-sm relative group">
                                <Image 
                                  src={item.images?.[0] || item.photo || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=400&fit=crop"} 
                                  alt={item.property_name || ""} 
                                  width={64} 
                                  height={48} 
                                  className="w-full h-full object-cover transition-transform group-hover:scale-110" 
                                />
                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Eye className="w-4 h-4 text-white" />
                                </div>
                            </div>
                            <div className="space-y-1">
                              <span className="font-black text-slate-900 group-hover:text-primary transition-colors block text-sm leading-none">{item.property_name || 'Untitled'}</span>
                              <span className="text-[10px] font-bold text-slate-400 flex items-center">
                                  <MapPin className="w-2.5 h-2.5 mr-1 text-slate-300" />
                                  {item.address || 'No Location'}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                           <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">{item.type || 'N/A'}</span>
                        </td>
                        <td className="px-8 py-5">
                           <span className="font-black text-slate-900">{formatIndianPrice(item.price || 0)}</span>
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
                                  <span className="text-xs font-black text-slate-900">{item.views || 0}</span>
                                  <span className="text-[8px] font-black text-slate-400 uppercase">Views</span>
                              </div>
                              <div className="flex flex-col items-center border-l border-slate-100 pl-4">
                                  <span className="text-xs font-black text-slate-900">{item.leads || 0}</span>
                                  <span className="text-[8px] font-black text-slate-400 uppercase">Leads</span>
                              </div>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                           <span className="text-[11px] font-bold text-slate-400 italic">
                             {new Date(item.updated_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                           </span>
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
                              <DropdownMenuItem 
                                  onSelect={() => router.push(`/property/${item.id}`)}
                                  className="rounded-xl font-bold gap-2 px-3 py-2 cursor-pointer transition-colors focus:bg-primary/5 focus:text-primary"
                              >
                                  <Eye className="w-4 h-4" /> View Public Listing
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
                                  className="rounded-xl font-bold gap-2 px-3 py-2 cursor-pointer transition-colors focus:bg-primary/5 focus:text-primary"
                              >
                                  <FileText className="w-4 h-4" /> Edit Details
                              </DropdownMenuItem>
                              <DropdownMenuSeparator className="bg-slate-50 mx-1" />
                              <DropdownMenuItem 
                                onSelect={() => handleDelete(item.id)}
                                className="rounded-xl font-bold gap-2 px-3 py-2 cursor-pointer text-red-500 focus:bg-red-50 focus:text-red-600"
                              >
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
            )}
          </TabsContent>
        </Tabs>
      </Card>

      {/* Pagination Footer */}
      {!isLoading && totalCount > 0 && (
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6 italic px-4 pb-4">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Showing <span className="text-slate-900">{((page - 1) * pageSize) + 1}</span> to <span className="text-slate-900">{Math.min(page * pageSize, totalCount)}</span> of <span className="text-slate-900">{totalCount}</span> Properties
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
