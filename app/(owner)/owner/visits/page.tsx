"use client"

import { useState } from "react"
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Phone, 
  User, 
  CheckCircle2, 
  XCircle, 
  ChevronRight, 
  Filter,
  MoreVertical,
  Video,
  Navigation
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

const mockVisits = [
  { id: "1", buyer: "Aryan Kumar", property: "Luxury Villa in Shela", date: "26 Mar 2024", time: "11:00 AM", status: "Upcoming", type: "In-Person" },
  { id: "2", buyer: "Rahul Mehta", property: "3 BHK Apartment, Science City", date: "26 Mar 2024", time: "04:30 PM", status: "Pending", type: "Video Call" },
  { id: "3", buyer: "Sonal Patel", property: "Commercial Plot, SG Highway", date: "25 Mar 2024", time: "10:00 AM", status: "Completed", type: "In-Person" },
  { id: "4", buyer: "Anish Shah", property: "Office in Prahlad Nagar", date: "24 Mar 2024", time: "02:00 PM", status: "Cancelled", type: "In-Person" },
]

export default function VisitsPage() {
  const [filter, setFilter] = useState("all")

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Upcoming': return 'bg-blue-50 text-blue-600 border-blue-100'
      case 'Pending': return 'bg-amber-50 text-amber-600 border-amber-100'
      case 'Completed': return 'bg-emerald-50 text-emerald-600 border-emerald-100'
      case 'Cancelled': return 'bg-red-50 text-red-600 border-red-100'
      default: return 'bg-slate-50 text-slate-600'
    }
  }

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight italic">Site Visits</h1>
          <p className="text-slate-500 font-medium">Keep track of scheduled property tours and virtual walkthroughs.</p>
        </div>
        <div className="flex gap-2 bg-slate-100 p-1.5 rounded-2xl">
            {["All", "Today", "Upcoming"].map((t) => (
                <Button 
                    key={t}
                    variant={filter === t.toLowerCase() ? "secondary" : "ghost"}
                    onClick={() => setFilter(t.toLowerCase())}
                    className={cn(
                        "rounded-xl px-6 h-10 font-black text-xs transition-all",
                        filter === t.toLowerCase() ? "bg-white text-primary shadow-sm" : "text-slate-500 hover:text-slate-900"
                    )}
                >
                    {t}
                </Button>
            ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left: Visits List */}
        <div className="lg:col-span-2 space-y-4">
            {mockVisits.map((visit) => (
                <Card key={visit.id} className="border-none shadow-sm rounded-[32px] overflow-hidden group hover:shadow-xl transition-all">
                    <div className="flex flex-col md:flex-row">
                        <div className="p-8 flex-1 space-y-6">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-4">
                                    <div className={cn(
                                        "w-14 h-14 rounded-2xl flex flex-col items-center justify-center border-2 shadow-sm",
                                        visit.status === 'Cancelled' ? "bg-slate-50 border-slate-100 text-slate-300" : "bg-white border-slate-50 text-primary"
                                    )}>
                                        <span className="text-[10px] font-black uppercase tracking-tighter leading-none">{visit.date.split(' ')[1]}</span>
                                        <span className="text-xl font-black">{visit.date.split(' ')[0]}</span>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-slate-900 tracking-tight">{visit.buyer}</h3>
                                        <p className="text-xs font-bold text-slate-400 flex items-center mt-1">
                                            <Clock className="w-3.5 h-3.5 mr-1.5" /> {visit.time}
                                        </p>
                                    </div>
                                </div>
                                <Badge className={cn("rounded-full font-black text-[9px] uppercase tracking-widest px-3 border shadow-none", getStatusColor(visit.status))}>
                                    {visit.status}
                                </Badge>
                            </div>

                            <div className="bg-slate-50/50 p-6 rounded-3xl border border-white space-y-3">
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-slate-300" />
                                    <span className="text-sm font-black text-slate-900">{visit.property}</span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-500 font-bold text-xs pl-6 italic">
                                    {visit.type === 'Video Call' ? <Video className="w-3.5 h-3.5" /> : <Navigation className="w-3.5 h-3.5" />}
                                    {visit.type} Scheduled
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <Button className="h-12 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl px-8 font-black shadow-xl shadow-slate-200 transition-all active:scale-95 flex-1 md:flex-none">
                                    Confirm Visit
                                </Button>
                                <Button variant="outline" className="h-12 rounded-2xl border-slate-100 font-bold px-6 gap-2">
                                    <Phone className="w-4 h-4 text-primary" /> Contact
                                </Button>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="rounded-xl h-12 w-12 hover:bg-slate-50">
                                            <MoreVertical className="w-5 h-5 text-slate-400" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-48 rounded-2xl p-2 bg-white/80 backdrop-blur-md">
                                        <DropdownMenuItem className="rounded-xl font-bold gap-2 px-3 py-2 cursor-pointer transition-colors focus:bg-slate-100">
                                            Reschedule
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="rounded-xl font-bold gap-2 px-3 py-2 text-red-500 cursor-pointer transition-colors focus:bg-red-50">
                                            Cancel Visit
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    </div>
                </Card>
            ))}
        </div>

        {/* Right: Summary & Stats */}
        <div className="space-y-6">
            <Card className="border-none shadow-sm rounded-[40px] p-8 bg-white space-y-8">
                <div className="space-y-2">
                    <h4 className="text-xl font-black text-slate-900 tracking-tight italic">Daily Summary</h4>
                    <p className="text-slate-500 text-xs font-medium">You have 2 visits scheduled for today.</p>
                </div>
                
                <div className="space-y-4">
                    <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center shadow-lg"><CalendarIcon className="w-5 h-5" /></div>
                            <div>
                                <p className="text-xs font-black text-slate-900">Total Scheduled</p>
                                <p className="text-[10px] font-bold text-slate-400 italic">This Month</p>
                            </div>
                        </div>
                        <span className="text-2xl font-black text-primary">24</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-lg"><CheckCircle2 className="w-5 h-5" /></div>
                            <div>
                                <p className="text-xs font-black text-slate-900">Completed</p>
                                <p className="text-[10px] font-bold text-slate-400 italic">This Month</p>
                            </div>
                        </div>
                        <span className="text-2xl font-black text-emerald-600">18</span>
                    </div>
                </div>

                <div className="pt-6 border-t border-slate-50 space-y-4">
                    <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Recent Activity</h5>
                    <div className="space-y-4">
                        {[1, 2].map(i => (
                            <div key={i} className="flex gap-3">
                                <div className="w-1 h-8 bg-slate-100 rounded-full shrink-0" />
                                <div className="space-y-0.5">
                                    <p className="text-xs font-bold text-slate-900 leading-tight">Aryan confirmed visit for Saturday</p>
                                    <p className="text-[10px] font-medium text-slate-400 italic">10 minutes ago</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Card>

            <div className="bg-slate-900 rounded-[40px] p-8 text-white space-y-6 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-bl-full" />
                <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-xl shadow-primary/20">
                    <Video className="w-6 h-6 text-white" />
                </div>
                <div className="space-y-2">
                    <h4 className="text-xl font-black italic tracking-tight">Try Virtual Tours?</h4>
                    <p className="text-slate-400 text-xs font-medium leading-relaxed">Save time by hosting initial walkthroughs via video call. Owners who offer virtual tours see <span className="text-white font-bold">2x more interest</span>.</p>
                </div>
                <Button className="w-full bg-white text-slate-900 hover:bg-slate-100 rounded-2xl font-black h-14 shadow-xl shadow-white/5 transition-all active:scale-95">
                    Setup Video Meeting
                </Button>
            </div>
        </div>
      </div>
    </div>
  )
}
