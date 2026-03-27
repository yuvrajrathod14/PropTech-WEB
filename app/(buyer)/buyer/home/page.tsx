"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  Heart, 
  MessageSquare, 
  MapPin, 
  CreditCard, 
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  Calendar,
  X
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { PropertyCard } from "@/components/shared/property-card"
import { PropertyCardSkeleton, StatCardSkeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { createClient } from "@/lib/supabase/client"

export default function BuyerHomePage() {
  const { profile } = useAuth()
  const supabase = createClient()
  const [stats, setStats] = useState([
    { label: "Saved Properties", value: 0, icon: Heart, color: "text-rose-500", bg: "bg-rose-50" },
    { label: "Active Enquiries", value: 0, icon: MessageSquare, color: "text-blue-500", bg: "bg-blue-50" },
    { label: "Upcoming Visits", value: 0, icon: MapPin, color: "text-amber-500", bg: "bg-amber-50" },
    { label: "Bookings", value: 0, icon: CreditCard, color: "text-emerald-500", bg: "bg-emerald-50" },
  ])
  const [recommendations, setRecommendations] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const firstName = profile?.full_name?.split(" ")[0] || "User"

  useEffect(() => {
    async function fetchDashboardData() {
      setIsLoading(true)
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        // Parallel stats fetching
        const [wishlistRes, enquiriesRes, visitsRes, bookingsRes, propsRes] = await Promise.all([
          supabase.from("wishlist").select("id", { count: "exact" }).eq("user_id", user.id),
          (supabase.from("enquiries") as any).select("id", { count: "exact" }).eq("sender_id", user.id),
          (supabase.from("site_visits") as any).select("id", { count: "exact" }).eq("user_id", user.id),
          (supabase.from("bookings") as any).select("id", { count: "exact" }).eq("buyer_id", user.id),
          supabase.from("properties").select("*").limit(4)
        ])

        setStats([
          { label: "Saved Properties", value: wishlistRes.count || 0, icon: Heart, color: "text-rose-500", bg: "bg-rose-50" },
          { label: "Active Enquiries", value: enquiriesRes.count || 0, icon: MessageSquare, color: "text-blue-500", bg: "bg-blue-50" },
          { label: "Upcoming Visits", value: visitsRes.count || 0, icon: MapPin, color: "text-amber-500", bg: "bg-amber-50" },
          { label: "Bookings", value: bookingsRes.count || 0, icon: CreditCard, color: "text-emerald-500", bg: "bg-emerald-50" },
        ])
        setRecommendations(propsRes.data || [])
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [supabase])

  return (
    <div className="space-y-10">
      {/* Greeting Header */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm relative overflow-hidden">
        <div className="space-y-2 relative z-10">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">
            Good morning, {firstName}! 👋
          </h1>
          <p className="text-slate-500 font-medium">
            You have <span className="text-[#1A56DB] font-bold">{stats[1].value} active</span> enquiries in progress
          </p>
        </div>
        <Link href="/buyer/chat">
          <Button className="rounded-2xl h-14 px-8 font-black gap-2 relative z-10 bg-[#1A56DB] hover:bg-[#1A56DB]/90 text-white shadow-xl shadow-[#1A56DB]/20">
            View Enquiries <ArrowRight className="w-5 h-5" />
          </Button>
        </Link>
        <div className="absolute right-0 top-0 w-64 h-64 bg-[#1A56DB]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      </section>

      {/* Stats Row */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading ? (
          Array(4).fill(0).map((_, i) => <StatCardSkeleton key={i} />)
        ) : (
          stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-6 rounded-3xl border border-slate-100 flex items-center gap-5 hover:border-[#1A56DB]/20 transition-all hover:shadow-xl hover:shadow-slate-200/50"
            >
              <div className={`w-14 h-14 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black text-slate-900">{stat.value}</span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mt-1">{stat.label}</span>
              </div>
            </motion.div>
          ))
        )}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          {/* Recommended For You */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2 italic">
                Recommended For You <TrendingUp className="w-5 h-5 text-[#1A56DB]" />
              </h3>
              <Link href="/search" className="text-[#1A56DB] font-black text-xs uppercase tracking-widest hover:underline">
                See More
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {isLoading ? (
                Array(2).fill(0).map((_, i) => <PropertyCardSkeleton key={i} />)
              ) : (
                recommendations.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))
              )}
            </div>
          </section>

          {/* Quick Shortcuts */}
          <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
             <Link href="/buyer/wishlist">
               <div className="bg-rose-50 p-6 rounded-[24px] border border-rose-100 transition-all hover:shadow-lg group">
                 <Heart className="w-8 h-8 text-rose-500 mb-4 group-hover:scale-110 transition-transform" />
                 <h4 className="font-black text-slate-900 group-hover:text-rose-600">Wishlist</h4>
                 <p className="text-xs font-medium text-rose-400">View Saved</p>
               </div>
             </Link>
             <Link href="/buyer/bookings">
               <div className="bg-emerald-50 p-6 rounded-[24px] border border-emerald-100 transition-all hover:shadow-lg group">
                 <CreditCard className="w-8 h-8 text-emerald-500 mb-4 group-hover:scale-110 transition-transform" />
                 <h4 className="font-black text-slate-900 group-hover:text-emerald-600">History</h4>
                 <p className="text-xs font-medium text-emerald-400">Track Bookings</p>
               </div>
             </Link>
             <Link href="/search">
               <div className="bg-[#1A56DB]/5 p-6 rounded-[24px] border border-[#1A56DB]/10 transition-all hover:shadow-lg group">
                 <MapPin className="w-8 h-8 text-[#1A56DB] mb-4 group-hover:scale-110 transition-transform" />
                 <h4 className="font-black text-slate-900 group-hover:text-[#1A56DB]">Explorer</h4>
                 <p className="text-xs font-medium text-[#1A56DB]/60">Find Home</p>
               </div>
             </Link>
          </section>
        </div>

        {/* Sidebar Activity */}
        <div className="space-y-10">
          <section className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-8 space-y-8">
            <h3 className="text-xl font-black text-slate-900 tracking-tight italic">Upcoming Visits</h3>
            <div className="space-y-6">
               <div className="bg-slate-50 p-6 rounded-2xl border border-dashed border-slate-200 text-center">
                 <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                 <p className="text-xs font-bold text-slate-500">No visits scheduled today</p>
               </div>
            </div>
            <Link href="/buyer/bookings">
              <Button variant="outline" className="w-full rounded-2xl h-12 border-slate-100 font-black hover:bg-slate-50 text-slate-400 uppercase text-[10px] tracking-widest">
                Check Full Schedule
              </Button>
            </Link>
          </section>

          {/* Trust Badge */}
          <section className="bg-slate-900 p-8 rounded-[32px] text-white relative overflow-hidden group">
            <div className="relative z-10 space-y-4">
              <h4 className="text-xl font-black leading-tight italic">PropTech Shield®</h4>
              <p className="text-slate-400 font-medium text-xs leading-relaxed">
                Your payments are protected by our direct bank guarantee. 100% refund on cancellations.
              </p>
              <Button className="bg-[#1A56DB] text-white hover:bg-[#1A56DB]/90 rounded-xl font-black w-full shadow-lg border-none">
                Verified Security
              </Button>
            </div>
            <CheckCircle2 className="absolute -right-4 -bottom-4 w-32 h-32 opacity-10 -rotate-12 transition-transform group-hover:rotate-0 text-[#1A56DB]" />
          </section>
        </div>
      </div>
    </div>
  )
}
