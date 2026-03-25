"use client"

import { useParams } from "next/navigation"
import { motion } from "framer-motion"
import { 
  ArrowLeft, 
  Download, 
  MapPin, 
  Calendar, 
  IndianRupee, 
  FileText, 
  CheckCircle2,
  Clock,
  ExternalLink,
  Phone,
  MessageSquare
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { formatIndianPrice } from "@/lib/utils/formatPrice"
import Image from "next/image"
import Link from "next/link"

// Mock data for a single booking
const mockBooking = {
  id: "B-88392",
  propertyId: "1",
  propertyTitle: "Spacious 3BHK Apartment in Satellite",
  locality: "Satellite, Ahmedabad, Gujarat",
  coverImage: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=800",
  date: "12 Oct 2024",
  type: "Token Deposit",
  amount: 50000,
  status: "paid",
  paymentId: "pay_N8392XJD92",
  receiptId: "REC-99201",
  ownerName: "Rajesh Kumar",
  ownerPhone: "+91 98765 43210",
  amenities: ["Swimming Pool", "Gym", "Parking"],
  details: "This 3BHK apartment project is located in the premium area of Satellite. The booking amount of ₹50,000 serves as a token deposit to freeze the property for 7 days."
}

export default function BookingDetailPage() {
  const params = useParams()
  const bookingId = params.id as string

  // In real app, we would fetch booking details by ID
  const booking = mockBooking

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="flex items-center gap-4">
        <Link href="/buyer/bookings">
          <Button variant="ghost" size="icon" className="rounded-xl border border-slate-100">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Booking Details</h1>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{bookingId}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-8">
          <Card className="overflow-hidden border-none shadow-xl shadow-slate-200/50 rounded-[40px]">
            <div className="aspect-[16/9] relative">
              <Image 
                src={booking.coverImage} 
                alt={booking.propertyTitle}
                fill
                className="object-cover"
              />
              <div className="absolute top-6 right-6">
                <Badge className="bg-white/90 backdrop-blur-md text-emerald-600 font-black px-6 py-2 rounded-2xl border-none shadow-xl">
                  {booking.status.toUpperCase()}
                </Badge>
              </div>
            </div>
            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <h2 className="text-2xl font-black text-slate-900 leading-tight">
                  {booking.propertyTitle}
                </h2>
                <p className="text-slate-500 font-bold flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {booking.locality}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-50">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">Transaction ID</p>
                  <p className="text-sm font-bold text-slate-700 font-mono">{booking.paymentId}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">Receipt No</p>
                  <p className="text-sm font-bold text-slate-700 font-mono">{booking.receiptId}</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-8 border-none shadow-xl shadow-slate-200/50 rounded-[40px] space-y-6">
            <h3 className="text-xl font-black text-slate-900">Booking Summary</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-primary">
                    <IndianRupee className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Base Amount</p>
                    <p className="text-lg font-black text-slate-900">{formatIndianPrice(booking.amount)}</p>
                  </div>
                </div>
                <Badge variant="outline" className="border-emerald-100 bg-emerald-50 text-emerald-600 font-black">PAID</Badge>
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-primary">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Booking Date</p>
                    <p className="text-lg font-black text-slate-900">{booking.date}</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          <Card className="p-8 border-none shadow-xl shadow-slate-200/50 rounded-[40px] space-y-6">
            <h3 className="text-xl font-black text-slate-900">Actions</h3>
            <div className="space-y-3">
              <Button className="w-full h-14 rounded-2xl font-black bg-primary hover:bg-primary-dark gap-2 shadow-xl shadow-primary/20">
                <Download className="w-5 h-5" />
                Download Receipt
              </Button>
              <Link href={`/property/${booking.propertyId}`} className="block">
                <Button variant="outline" className="w-full h-14 rounded-2xl font-black border-slate-100 hover:bg-slate-50 gap-2">
                  <ExternalLink className="w-5 h-5" />
                  View Property
                </Button>
              </Link>
            </div>
          </Card>

          <Card className="p-8 border-none shadow-xl shadow-slate-200/50 rounded-[40px] space-y-6">
            <h3 className="text-xl font-black text-slate-900">Owner Info</h3>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 font-black text-xl">
                {booking.ownerName.charAt(0)}
              </div>
              <div>
                <p className="font-black text-slate-900">{booking.ownerName}</p>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Property Owner</p>
              </div>
            </div>
            <div className="flex gap-2">
              <a href={`tel:${booking.ownerPhone}`} className="flex-1">
                <Button variant="outline" className="w-full rounded-xl h-12 border-slate-100 gap-2 font-bold">
                  <Phone className="w-4 h-4" />
                  Call
                </Button>
              </a>
              <Link href={`/buyer/chat?owner=${booking.propertyId}`} className="flex-1">
                <Button variant="outline" className="w-full rounded-xl h-12 border-slate-100 gap-2 font-bold">
                  <MessageSquare className="w-4 h-4 text-primary" />
                  Chat
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
