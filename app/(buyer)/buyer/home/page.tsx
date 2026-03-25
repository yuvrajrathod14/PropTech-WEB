"use client"

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
import { mockProperties } from "@/lib/mock-data"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"

const stats = [
  { label: "Saved Properties", value: 12, icon: Heart, color: "text-rose-500", bg: "bg-rose-50" },
  { label: "Active Enquiries", value: 3, icon: MessageSquare, color: "text-blue-500", bg: "bg-blue-50" },
  { label: "Upcoming Visits", value: 2, icon: MapPin, color: "text-amber-500", bg: "bg-amber-50" },
  { label: "Bookings", value: 1, icon: CreditCard, color: "text-emerald-500", bg: "bg-emerald-50" },
]

const recentActivity = [
  { 
    id: 1, 
    type: "reply", 
    text: "Your enquiry on '3BHK Satellite' was replied", 
    time: "2h ago", 
    icon: MessageSquare,
    color: "bg-blue-50 text-blue-500"
  },
  { 
    id: 2, 
    type: "visit", 
    text: "Visit confirmed for 'Villa in Shela'", 
    time: "Tomorrow 11 AM", 
    icon: Calendar,
    color: "bg-amber-50 text-amber-500"
  },
  { 
    id: 3, 
    type: "save", 
    text: "You saved '2BHK near CEPT'", 
    time: "Yesterday", 
    icon: Heart,
    color: "bg-rose-50 text-rose-500"
  },
]

const savedSearches = [
  "Flat in Ahmedabad",
  "3 BHK for Rent",
  "Villa in Satellite"
]

export default function BuyerHomePage() {
  const { profile } = useAuth()
  const firstName = profile?.full_name?.split(" ")[0] || "User"

  return (
    <div className="space-y-10">
      {/* Greeting Header */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm relative overflow-hidden">
        <div className="space-y-2 relative z-10">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">
            Good morning, {firstName}! 👋
          </h1>
          <p className="text-slate-500 font-medium">
            You have <span className="text-primary font-bold">3 new responses</span> to your enquiries
          </p>
        </div>
        <Button className="rounded-2xl h-14 px-8 font-black gap-2 relative z-10">
          View Enquiries <ArrowRight className="w-5 h-5" />
        </Button>
        {/* Abstract background element */}
        <div className="absolute right-0 top-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      </section>

      {/* Stats Row */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-3xl border border-slate-100 flex items-center gap-5 hover:border-primary/20 transition-all hover:shadow-xl hover:shadow-slate-200/50"
          >
            <div className={`w-14 h-14 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black text-slate-900">{stat.value}</span>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{stat.label}</span>
            </div>
          </motion.div>
        ))}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          {/* Saved Searches */}
          <section className="space-y-4">
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Saved Searches</h3>
            <div className="flex flex-wrap gap-3">
              {savedSearches.map((search) => (
                <div key={search} className="group flex items-center gap-2 bg-white border border-slate-100 pl-4 pr-2 py-2 rounded-xl hover:border-primary/30 transition-all cursor-pointer">
                  <span className="text-sm font-bold text-slate-600 group-hover:text-primary">{search}</span>
                  <button className="w-6 h-6 rounded-lg hover:bg-slate-50 flex items-center justify-center text-slate-300 hover:text-red-500 transition-colors">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              <Button variant="ghost" className="rounded-xl font-bold text-primary group underline-offset-4 hover:underline">
                View All
              </Button>
            </div>
          </section>

          {/* Recommended For You */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                Recommended For You <TrendingUp className="w-5 h-5 text-primary" />
              </h3>
              <Link href="/search" className="text-primary font-bold text-sm hover:underline">
                See More
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mockProperties.slice(0, 4).map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          </section>

          {/* Recently Viewed */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                Recently Viewed <Clock className="w-5 h-5 text-slate-400" />
              </h3>
            </div>
            <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
              {mockProperties.slice(2, 6).map((property) => (
                <div key={property.id} className="min-w-[280px] w-[280px]">
                  <PropertyCard property={property} variant="mini" />
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar Activity */}
        <div className="space-y-10">
          <section className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-8 space-y-8">
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Recent Activity</h3>
            <div className="space-y-8 relative">
              {/* Vertical line through items */}
              <div className="absolute top-4 bottom-4 left-6 w-0.5 bg-slate-50" />
              
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex gap-5 relative z-10">
                  <div className={`w-12 h-12 rounded-2xl shrink-0 flex items-center justify-center ${activity.color} shadow-sm`}>
                    <activity.icon className="w-5 h-5" />
                  </div>
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-700 leading-snug line-clamp-2">
                      {activity.text}
                    </p>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      {activity.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full rounded-2xl h-12 border-slate-100 font-bold hover:bg-slate-50 text-slate-500">
              See All Updates
            </Button>
          </section>

          {/* Trust Badge / CTA Overlay */}
          <section className="bg-primary p-8 rounded-[32px] text-white relative overflow-hidden group">
            <div className="relative z-10 space-y-4">
              <h4 className="text-xl font-black leading-tight">Protect Your Bookings</h4>
              <p className="text-slate-100/80 font-medium text-xs leading-relaxed">
                Always Use PropTech Shield for secure transactions and 100% refund guarantee.
              </p>
              <Button className="bg-white text-primary hover:bg-slate-50 rounded-xl font-black w-full shadow-lg">
                Learn More
              </Button>
            </div>
            <CheckCircle2 className="absolute -right-4 -bottom-4 w-32 h-32 opacity-10 -rotate-12 transition-transform group-hover:rotate-0" />
          </section>
        </div>
      </div>
    </div>
  )
}
