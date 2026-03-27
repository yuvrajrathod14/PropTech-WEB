"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowRight,
  Download,
  CheckCircle2,
  Clock,
  XCircle,
  History,
  AlertCircle,
  CreditCard,
  RotateCcw,
  Loader2,
  MapPin, // Keep MapPin as it's used in BookingCard
  MessageSquare // Keep MessageSquare if it's used elsewhere, though not in the provided snippet
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatIndianPrice, cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"
import { BookingCardSkeleton } from "@/components/ui/skeleton"
import { EmptyState } from "@/components/ui/empty-state"
import { OptimizedImage } from "@/components/shared/optimized-image"
import Link from "next/link"
import { processRefund } from "@/app/actions/booking.actions"
import { toast } from "sonner"

const statusConfig = {
  paid: { label: "Paid", color: "bg-emerald-50 text-emerald-600 border-emerald-100", icon: CheckCircle2 },
  pending: { label: "Pending", color: "bg-amber-50 text-amber-600 border-amber-100", icon: Clock },
  cancelled: { label: "Refunded", color: "bg-slate-50 text-slate-500 border-slate-100", icon: RotateCcw },
  failed: { label: "Failed", color: "bg-red-50 text-red-600 border-red-100", icon: XCircle },
  confirmed: { label: "Confirmed", color: "bg-emerald-50 text-emerald-600 border-emerald-100", icon: CheckCircle2 },
  requested: { label: "Requested", color: "bg-blue-50 text-blue-600 border-blue-100", icon: Clock },
  refunded: { label: "Refunded", color: "bg-slate-50 text-slate-500 border-slate-100", icon: RotateCcw },
  refund_requested: { label: "Refund Pending", color: "bg-amber-50 text-amber-600 border-amber-100", icon: Clock },
}

export default function BookingsPage() {
  const supabase = createClient()
  const [activeTab, setActiveTab] = useState("all")
  const [data, setData] = useState<{ bookings: any[], visits: any[] }>({ bookings: [], visits: [] })
  const [isLoading, setIsLoading] = useState(true)

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const [bookingsRes, visitsRes] = await Promise.all([
        (supabase.from("bookings") as any).select("*, property:property_id(*)").eq("buyer_id", user.id).order("created_at", { ascending: false }),
        (supabase.from("site_visits") as any).select("*, property:property_id(*)").eq("user_id", user.id).order("created_at", { ascending: false })
      ])

      setData({
        bookings: bookingsRes.data || [],
        visits: visitsRes.data || []
      })
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [supabase])

  const isEmpty = data.bookings.length === 0 && data.visits.length === 0

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight italic">My Bookings & Visits</h1>
        <p className="text-slate-500 font-medium">Manage your token deposits, rental payments, and property visits.</p>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="space-y-8">
        <TabsList className="bg-white p-1.5 rounded-2xl h-14 border border-slate-100 shadow-sm w-full md:w-auto">
          <TabsTrigger value="all" className="rounded-xl px-8 font-black text-sm data-[state=active]:bg-[#1A56DB] data-[state=active]:text-white transition-all">All History</TabsTrigger>
          <TabsTrigger value="visits" className="rounded-xl px-8 font-black text-sm data-[state=active]:bg-[#1A56DB] data-[state=active]:text-white transition-all">Site Visits</TabsTrigger>
          <TabsTrigger value="payments" className="rounded-xl px-8 font-black text-sm data-[state=active]:bg-[#1A56DB] data-[state=active]:text-white transition-all">Payments</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          {isLoading ? (
             <div className="space-y-4">
               {Array(3).fill(0).map((_, i) => <BookingCardSkeleton key={i} />)}
             </div>
          ) : isEmpty ? (
            <EmptyState 
              title="No activities yet"
              description="You haven't booked any visits or made any payments yet. Start exploring to find your dream property."
              icon={History}
              action={{
                label: "Explore Properties",
                onClick: () => window.location.href = "/search",
                icon: ArrowRight
              }}
              className="py-24"
            />
          ) : (
            <>
              {activeTab === 'all' && (
                <div className="space-y-6">
                  {data.bookings.map((booking) => (
                    <BookingCard key={booking.id} booking={booking} type="payment" />
                  ))}
                  {data.visits.map((visit) => (
                    <BookingCard key={visit.id} booking={visit} type="visit" />
                  ))}
                </div>
              )}
            </>
          )}
        </TabsContent>

        <TabsContent value="visits" className="space-y-6">
           {isLoading ? (
             <div className="space-y-4">
               {Array(3).fill(0).map((_, i) => <BookingCardSkeleton key={i} />)}
             </div>
          ) : data.visits.length === 0 ? (
            <EmptyState 
              title="No visits scheduled"
              description="Request a site visit from any property detail page to see it in person."
              icon={MapPin}
              className="py-24"
            />
          ) : (
            data.visits.map((visit) => (
              <BookingCard key={visit.id} booking={visit} type="visit" />
            ))
          )}
        </TabsContent>

        <TabsContent value="payments" className="space-y-6">
           {isLoading ? (
             <div className="space-y-4">
               {Array(3).fill(0).map((_, i) => <BookingCardSkeleton key={i} />)}
             </div>
          ) : data.bookings.length === 0 ? (
            <EmptyState 
              title="No payments made"
              description="Pay token amounts securely via PropTech Shield to book your properties."
              icon={CreditCard}
              className="py-24"
            />
          ) : (
            data.bookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} type="payment" />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function BookingCard({ booking, type }: { booking: any, type: 'payment' | 'visit' }) {
  const [isRefunding, setIsRefunding] = useState(false)
  const status = statusConfig[booking.status as keyof typeof statusConfig] || statusConfig.pending
  const property = booking.property
  
  const handleRefund = async () => {
    if (!confirm("Are you sure you want to cancel this booking and request a refund? This action cannot be undone.")) return
    
    setIsRefunding(true)
    try {
      await processRefund(booking.id)
      toast.success("Refund processed successfully")
      // The page will revalidate via the action
    } catch (error: any) {
      toast.error(error.message || "Failed to process refund")
    } finally {
      setIsRefunding(false)
    }
  }

  if (!property) return null

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      whileInView={{ opacity: 1, scale: 1 }}
      className="bg-white p-6 rounded-[32px] border border-slate-100 hover:border-[#1A56DB]/20 transition-all hover:shadow-xl hover:shadow-slate-200/50 group"
    >
      <div className="flex flex-col md:flex-row gap-6">
        {/* Image */}
        <div className="w-full md:w-32 h-44 md:h-32 rounded-2xl overflow-hidden relative shrink-0 border border-slate-100">
          <OptimizedImage 
            src={property.images?.[0] || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=800"} 
            alt={property.property_name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
          <div className="space-y-1">
            <div className="flex items-start justify-between gap-4">
              <Link href={`/property/${property.id}`} className="text-xl font-black text-slate-900 leading-tight hover:text-[#1A56DB] transition-colors line-clamp-1">
                {property.property_name}
              </Link>
              <Badge variant="outline" className={cn("px-4 py-1.5 rounded-xl border-2 shrink-0 border-transparent", status.color)}>
                <status.icon className="w-3.5 h-3.5 mr-2" />
                <span className="font-black text-[10px] uppercase tracking-widest">{status.label}</span>
              </Badge>
            </div>
            <p className="text-sm font-bold text-slate-400 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              {property.address || property.locality}
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-6 border-t border-slate-50 mt-4">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Date</span>
              <p className="text-sm font-black text-slate-700">
                {new Date(booking.preferred_date || booking.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Type</span>
              <p className="text-sm font-black text-[#1A56DB] uppercase">
                {type === 'payment' ? (booking.amount > 100000 ? "Advance" : "Token") : "Site Visit"}
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">
                {type === 'payment' ? "Amount Paid" : "Scheduled Time"}
              </span>
              <p className="text-lg font-black text-slate-900">
                {type === 'payment' ? formatIndianPrice(booking.amount) : "10:00 AM"}
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">
                {type === 'payment' ? "Transaction ID" : "Visit Status"}
              </span>
              <p className="text-xs font-bold text-slate-400 font-mono tracking-tighter truncate italic uppercase">
                {booking.razorpay_payment_id || booking.status || "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col md:flex-row lg:flex-col gap-3 md:justify-center shrink-0 w-full lg:w-48">
          {type === 'payment' && (booking.status === 'paid' || booking.status === 'confirmed') ? (
            <Button 
              onClick={handleRefund}
              disabled={isRefunding}
              className="w-full rounded-2xl h-12 px-6 font-black gap-2 bg-rose-500 hover:bg-rose-600 text-white shadow-xl shadow-rose-200"
            >
              {isRefunding ? <Loader2 className="w-4 h-4 animate-spin" /> : <RotateCcw className="w-4 h-4" />}
              Cancel & Refund
            </Button>
          ) : (
            <Link href={`/property/${property.id}`} className="flex-1 lg:flex-none">
              <Button className="w-full rounded-2xl h-12 px-6 font-black gap-2 bg-slate-900 hover:bg-slate-800 text-white shadow-xl shadow-slate-200">
                View Property <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          )}
          <div className="flex gap-2">
            <Link href={`/buyer/chat?property=${property.id}`} className="flex-1">
              <Button variant="outline" className="w-full rounded-2xl h-12 border-slate-100 hover:bg-slate-50 gap-2 font-bold hover:border-[#1A56DB]/20">
                <MessageSquare className="w-4 h-4 text-[#1A56DB]" />
                Chat
              </Button>
            </Link>
            <Button variant="outline" className="rounded-2xl h-12 w-12 p-0 border-slate-100 hover:bg-slate-50 group-hover:border-[#1A56DB]/20">
              <Download className="w-4 h-4 text-slate-400" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
