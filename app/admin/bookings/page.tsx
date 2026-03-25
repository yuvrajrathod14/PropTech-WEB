"use client"

import Link from "next/link"

import { useState } from "react"
import { 
  Search, 
  CreditCard, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Calendar,
  Filter,
  Download,
  AlertCircle,
  ArrowUpRight,
  Home,
  Users,
  Briefcase
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const mockBookings = [
  { id: "BK-1001", property: "Luxury Villa", type: "Sale", buyer: "Aryan Kumar", owner: "Rohan Shah", amount: "₹2.5 Cr", date: "26 Mar 2024", status: "Confirming" },
  { id: "BK-1002", property: "3 BHK Apartment", type: "Rent", buyer: "Rahul Mehta", owner: "Sonal Patel", amount: "₹45,000", date: "27 Mar 2024", status: "Paid" },
  { id: "BK-1003", property: "Commercial Plot", type: "Sale", buyer: "Anish Shah", owner: "Meera Varma", amount: "₹5.8 Cr", date: "28 Mar 2024", status: "Pending" },
  { id: "BK-1004", property: "Office Space", type: "Rent", buyer: "Priya Varma", owner: "Karan Shah", amount: "₹1.2 L", date: "29 Mar 2024", status: "Refunded" },
]

export default function AdminBookingsPage() {
  const [filter, setFilter] = useState("all")

  const getStatusColor = (status: string) => {
    switch (status) {
        case 'Paid': return 'bg-emerald-50 text-emerald-600 border-emerald-100'
        case 'Confirming': return 'bg-blue-50 text-blue-600 border-blue-100'
        case 'Pending': return 'bg-amber-50 text-amber-600 border-amber-100'
        case 'Refunded': return 'bg-red-50 text-red-600 border-red-100'
        default: return 'bg-slate-50 text-slate-600'
    }
  }

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight italic">Bookings</h1>
          <p className="text-slate-500 font-medium">Track all financial transactions and property bookings across the platform.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-12 rounded-2xl border-slate-100 bg-white font-bold gap-2">
            <Download className="w-4 h-4" /> Export Report
          </Button>
          <Button className="h-12 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-black px-6 shadow-xl shadow-amber-100 transition-all active:scale-95 italic text-sm">
            <AlertCircle className="w-4 h-4 mr-2" /> Pending Refunds (2)
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-none shadow-sm rounded-[32px] p-8 bg-white flex items-center justify-between group hover:shadow-xl transition-all">
              <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Transaction Value</p>
                  <h3 className="text-3xl font-black text-slate-900 tracking-tight italic">₹42.8 Cr</h3>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center"><CreditCard className="w-6 h-6" /></div>
          </Card>
          <Card className="border-none shadow-sm rounded-[32px] p-8 bg-white flex items-center justify-between group hover:shadow-xl transition-all">
              <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Commission Earned</p>
                  <h3 className="text-3xl font-black text-slate-900 tracking-tight italic">₹12.4 L</h3>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center"><Briefcase className="w-6 h-6" /></div>
          </Card>
          <Card className="border-none shadow-sm rounded-[32px] p-8 bg-white flex items-center justify-between group hover:shadow-xl transition-all">
              <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Bookings</p>
                  <h3 className="text-3xl font-black text-slate-900 tracking-tight italic">156</h3>
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

          {mockBookings.map((booking) => (
              <Card key={booking.id} className="border-none shadow-sm rounded-[24px] bg-white group overflow-hidden">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center p-6 lg:px-8">
                      <div className="col-span-1 font-black text-slate-300 text-xs italic tracking-tighter">{booking.id}</div>
                      
                      <div className="col-span-4 space-y-1">
                          <h4 className="text-base font-black text-slate-900 flex items-center gap-2">
                             <Home className="w-4 h-4 text-slate-300" />
                             {booking.property}
                             <Badge className="bg-slate-50 text-slate-400 border-none font-bold text-[8px] uppercase tracking-widest px-2">{booking.type}</Badge>
                          </h4>
                          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 italic">
                             <Users className="w-3 h-3" />
                             {booking.buyer} <span className="opacity-30">→</span> {booking.owner}
                          </div>
                      </div>

                      <div className="col-span-2">
                          <p className="text-sm font-black text-slate-900">{booking.amount}</p>
                      </div>

                      <div className="col-span-2 flex items-center gap-2 text-xs font-bold text-slate-500 italic">
                          <Clock className="w-3.5 h-3.5 text-slate-300" />
                          {booking.date}
                      </div>

                      <div className="col-span-2">
                          <Badge className={cn("rounded-full font-black text-[9px] uppercase tracking-widest px-3 border shadow-none", getStatusColor(booking.status))}>
                              {booking.status}
                          </Badge>
                      </div>

                      <div className="col-span-1 flex justify-end">
                          <Link href={`/admin/bookings/${booking.id}`}>
                              <Button variant="ghost" size="icon" className="rounded-xl group-hover:bg-slate-50">
                                  <ArrowUpRight className="w-5 h-5 text-slate-300 group-hover:text-primary transition-colors" />
                              </Button>
                          </Link>
                      </div>
                  </div>
              </Card>
          ))}
      </div>
    </div>
  )
}
