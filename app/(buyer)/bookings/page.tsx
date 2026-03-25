"use client"

import { motion } from "framer-motion"
import { 
  ArrowRight, 
  Download, 
  CheckCircle2,
  Clock,
  XCircle,
  RotateCcw,
  MapPin
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatIndianPrice } from "@/lib/utils/formatPrice"
import Image from "next/image"
import Link from "next/link"

const bookings = [
  {
    id: "B-88392",
    propertyTitle: "Spacious 3BHK Apartment in Satellite",
    locality: "Ahmedabad, Gujarat",
    coverImage: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=800",
    date: "12 Oct 2024",
    type: "Token Deposit",
    amount: 50000,
    status: "paid",
    paymentId: "pay_N8392XJD92",
    isRefundable: true
  },
  {
    id: "B-88120",
    propertyTitle: "Modern Villa with Private Pool",
    locality: "Shela, Ahmedabad",
    coverImage: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800",
    date: "05 Oct 2024",
    type: "Rent Advance",
    amount: 125000,
    status: "pending",
    paymentId: "pay_pending_9329",
    isRefundable: false
  },
  {
    id: "B-87990",
    propertyTitle: "2BHK Flat near CEPT University",
    locality: "Navrangpura, Ahmedabad",
    coverImage: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&q=80&w=800",
    date: "20 Sep 2024",
    type: "Token Deposit",
    amount: 25000,
    status: "cancelled",
    paymentId: "pay_ref_O8291XD",
    isRefundable: false
  }
]

const statusConfig = {
  paid: { label: "Paid", color: "bg-emerald-50 text-emerald-600 border-emerald-100", icon: CheckCircle2 },
  pending: { label: "Pending", color: "bg-amber-50 text-amber-600 border-amber-100", icon: Clock },
  cancelled: { label: "Refunded", color: "bg-slate-50 text-slate-500 border-slate-100", icon: RotateCcw },
  failed: { label: "Failed", color: "bg-red-50 text-red-600 border-red-100", icon: XCircle },
}

export default function BookingsPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">My Bookings</h1>
        <p className="text-slate-500 font-medium">Manage your token deposits and rental payments</p>
      </div>

      <Tabs defaultValue="all" className="space-y-8">
        <TabsList className="bg-white p-1.5 rounded-2xl h-14 border border-slate-100 shadow-sm w-full md:w-auto">
          <TabsTrigger value="all" className="rounded-xl px-8 font-black text-sm data-[state=active]:bg-primary data-[state=active]:text-white transition-all">All</TabsTrigger>
          <TabsTrigger value="active" className="rounded-xl px-8 font-black text-sm data-[state=active]:bg-primary data-[state=active]:text-white transition-all">Active</TabsTrigger>
          <TabsTrigger value="completed" className="rounded-xl px-8 font-black text-sm data-[state=active]:bg-primary data-[state=active]:text-white transition-all">Completed</TabsTrigger>
          <TabsTrigger value="cancelled" className="rounded-xl px-8 font-black text-sm data-[state=active]:bg-primary data-[state=active]:text-white transition-all">Cancelled</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          {bookings.map((booking) => (
            <BookingCard key={booking.id} booking={booking} />
          ))}
        </TabsContent>
        {/* Other tabs would filter the bookings array */}
      </Tabs>
    </div>
  )
}

interface Booking {
  id: string
  propertyTitle: string
  locality: string
  coverImage: string
  date: string
  type: string
  amount: number
  status: string
  paymentId: string
  isRefundable: boolean
}

function BookingCard({ booking }: { booking: Booking }) {
  const status = statusConfig[booking.status as keyof typeof statusConfig]
  
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      whileInView={{ opacity: 1, scale: 1 }}
      className="bg-white p-6 rounded-[32px] border border-slate-100 hover:border-primary/20 transition-all hover:shadow-xl hover:shadow-slate-200/50 group"
    >
      <div className="flex flex-col md:flex-row gap-6">
        {/* Image */}
        <div className="w-full md:w-32 h-44 md:h-32 rounded-2xl overflow-hidden relative shrink-0">
          <Image 
            src={booking.coverImage} 
            alt={booking.propertyTitle}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
          <div className="space-y-1">
            <div className="flex items-start justify-between gap-4">
              <Link href={`/property/${booking.id}`} className="text-xl font-black text-slate-900 leading-tight hover:text-primary transition-colors line-clamp-1">
                {booking.propertyTitle}
              </Link>
              <Badge variant="outline" className={`px-4 py-1.5 rounded-xl border-2 shrink-0 ${status.color} border-transparent`}>
                <status.icon className="w-3.5 h-3.5 mr-2" />
                <span className="font-black text-[10px] uppercase tracking-widest">{status.label}</span>
              </Badge>
            </div>
            <p className="text-sm font-bold text-slate-400 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              {booking.locality}
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-6 border-t border-slate-50 mt-4">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Date</span>
              <p className="text-sm font-black text-slate-700">{booking.date}</p>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Type</span>
              <p className="text-sm font-black text-primary">{booking.type}</p>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Amount Paid</span>
              <p className="text-lg font-black text-slate-900">{formatIndianPrice(booking.amount)}</p>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Razorpay ID</span>
              <p className="text-xs font-bold text-slate-400 font-mono tracking-tighter truncate">{booking.paymentId}</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex md:flex-col gap-3 md:justify-center shrink-0">
          <Button className="flex-1 md:flex-none rounded-xl h-12 px-6 font-black gap-2">
            Details <ArrowRight className="w-4 h-4" />
          </Button>
          <Button variant="outline" className="flex-1 md:flex-none rounded-xl h-12 w-12 p-0 border-slate-100 hover:bg-slate-50">
            <Download className="w-4 h-4 text-slate-400" />
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
