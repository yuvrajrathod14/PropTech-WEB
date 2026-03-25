"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { 
  Search, 
  Calendar, 
  Clock, 
  MoreHorizontal, 
  Eye, 
  CheckCircle2, 
  XCircle,
  Download,
  Filter,
  User,
  MapPin,
  ArrowUpRight,
  CreditCard,
  Briefcase,
  Home,
  Users,
  AlertCircle,
  History
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
import { createClient } from "@/lib/supabase/client"
import { formatIndianPrice, cn } from "@/lib/utils"
import { GridRowSkeleton } from "@/components/ui/skeleton"
import { EmptyState } from "@/components/ui/empty-state"
import { OptimizedImage } from "@/components/shared/optimized-image"

export default function AdminBookingsPage() {
  const supabase = createClient()
  const [bookings, setBookings] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({
    totalValue: 0,
    commission: 0,
    activeCount: 0
  })

  useEffect(() => {
    async function fetchAdminBookings() {
      setIsLoading(true)
      try {
        const { data, error } = await (supabase
          .from("bookings") as any)
          .select(`
            *,
            property:property_id(*),
            buyer:user_id(full_name, email)
          `)
          .order("created_at", { ascending: false })

        if (error) throw error
        setBookings(data || [])

        // Calculate stats
        const total = data?.reduce((acc: number, curr: any) => acc + (curr.amount || 0), 0) || 0
        setStats({
          totalValue: total,
          commission: total * 0.02, // Example 2% commission
          activeCount: data?.filter((b: any) => b.status === 'paid').length || 0
        })
      } catch (error) {
        console.error("Error fetching admin bookings:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAdminBookings()
  }, [supabase])

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight italic">Bookings</h1>
          <p className="text-slate-500 font-medium">Track all financial transactions and property bookings across the platform.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-12 rounded-2xl border-slate-100 bg-white font-black gap-2 text-[10px] uppercase tracking-widest">
            <Download className="w-4 h-4" /> Export Report
          </Button>
          <Button className="h-12 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-black px-6 shadow-xl shadow-amber-100 transition-all active:scale-95 italic text-sm">
            <AlertCircle className="w-4 h-4 mr-2" /> Pending Refunds
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-none shadow-sm rounded-[32px] p-8 bg-white flex items-center justify-between group hover:shadow-xl transition-all">
              <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Transaction Value</p>
                  <h3 className="text-3xl font-black text-slate-900 tracking-tight italic">{formatIndianPrice(stats.totalValue)}</h3>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center"><CreditCard className="w-6 h-6" /></div>
          </Card>
          <Card className="border-none shadow-sm rounded-[32px] p-8 bg-white flex items-center justify-between group hover:shadow-xl transition-all">
              <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Commission Earned</p>
                  <h3 className="text-3xl font-black text-slate-900 tracking-tight italic">{formatIndianPrice(stats.commission)}</h3>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center"><Briefcase className="w-6 h-6" /></div>
          </Card>
          <Card className="border-none shadow-sm rounded-[32px] p-8 bg-white flex items-center justify-between group hover:shadow-xl transition-all">
              <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Bookings</p>
                  <h3 className="text-3xl font-black text-slate-900 tracking-tight italic">{stats.activeCount}</h3>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-primary/5 text-primary flex items-center justify-center"><Calendar className="w-6 h-6" /></div>
          </Card>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
          <div className="hidden lg:grid grid-cols-12 gap-4 px-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
              <div className="col-span-1">ID</div>
              <div className="col-span-4">Property & Parties</div>
              <div className="col-span-2">Amount</div>
              <div className="col-span-2">Date</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-1 text-right">View</div>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {Array(5).fill(0).map((_, i) => <GridRowSkeleton key={i} />)}
            </div>
          ) : bookings.length === 0 ? (
            <EmptyState 
              title="No bookings recorded"
              description="Awaiting the first financial transaction on the platform. All secure payments will appear here."
              className="py-24 bg-white rounded-[32px]"
            />
          ) : (
            bookings.map((booking) => (
              <Card key={booking.id} className="border-none shadow-sm rounded-[24px] bg-white group overflow-hidden hover:shadow-xl transition-all">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center p-6 lg:px-8">
                      <div className="col-span-1 font-black text-slate-300 text-[10px] italic tracking-tighter uppercase truncate">
                        {booking.payment_id?.slice(-8) || booking.id.slice(0, 8)}
                      </div>
                      
                      <div className="col-span-4 space-y-1">
                          <h4 className="text-base font-black text-slate-900 flex items-center gap-2 truncate">
                             <Home className="w-4 h-4 text-slate-300 shrink-0" />
                             {booking.property?.property_name || 'Deleted Property'}
                             <Badge className="bg-slate-50 text-slate-400 border-none font-bold text-[8px] uppercase tracking-widest px-2 shrink-0">
                               {booking.amount > 100000 ? "Advance" : "Token"}
                             </Badge>
                          </h4>
                          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 italic truncate">
                             <Users className="w-3 h-3 shrink-0" />
                             {booking.buyer?.full_name || 'Unknown User'} 
                             <span className="opacity-30">→</span> 
                             Owner Agent
                          </div>
                      </div>

                      <div className="col-span-2">
                          <p className="text-sm font-black text-[#1A56DB]">{formatIndianPrice(booking.amount)}</p>
                      </div>

                      <div className="col-span-2 flex items-center gap-2 text-xs font-bold text-slate-500 italic">
                          <Clock className="w-3.5 h-3.5 text-slate-300" />
                          {new Date(booking.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </div>

                      <div className="col-span-2">
                          <Badge variant={booking.status?.toLowerCase() as any} className="rounded-full font-black text-[9px] uppercase tracking-widest px-3 border-none shadow-none">
                            {booking.status || 'Pending'}
                        </Badge>
                      </div>

                      <div className="col-span-1 flex justify-end">
                          <Link href={`/admin/bookings/${booking.id}`}>
                              <Button variant="ghost" size="icon" className="rounded-xl group-hover:bg-slate-50">
                                  <ArrowUpRight className="w-5 h-5 text-slate-300 group-hover:text-[#1A56DB] transition-colors" />
                              </Button>
                          </Link>
                      </div>
                  </div>
              </Card>
            ))
          )}
      </div>
    </div>
  )
}
