"use client"

import { motion } from "framer-motion"
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Phone, 
  Navigation, 
  CalendarPlus, 
  Star,
  CheckCircle2,
  Trash2,
  AlertCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"

const visits = [
  {
    id: "V-901",
    propertyTitle: "Luxury 4BHK Villa in Shela",
    locality: "Shela, Ahmedabad",
    coverImage: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800",
    date: "15 Jan 2025",
    time: "10:00 AM - 12:00 PM",
    ownerName: "Rajesh Kumar",
    ownerPhone: "9876543210",
    status: "confirmed",
    points: 4.5
  },
  {
    id: "V-902",
    propertyTitle: "2BHK Modern Flat near SG Highway",
    locality: "Satellite, Ahmedabad",
    coverImage: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=800",
    date: "18 Jan 2025",
    time: "04:00 PM - 05:30 PM",
    ownerName: "Sneha Patel",
    ownerPhone: "9988776655",
    status: "pending",
    points: 4.0
  },
  {
    id: "V-899",
    propertyTitle: "Compact 1BHK in Navrangpura",
    locality: "Ahmedabad",
    coverImage: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&q=80&w=800",
    date: "10 Jan 2025",
    time: "11:00 AM",
    ownerName: "Vijay Sharma",
    ownerPhone: "9000011111",
    status: "completed",
    points: 4.8
  }
]

const statusConfig = {
  confirmed: { label: "Confirmed", color: "bg-emerald-50 text-emerald-600 border-emerald-100", icon: CheckCircle2 },
  pending: { label: "Pending Approval", color: "bg-amber-50 text-amber-600 border-amber-100", icon: Clock },
  completed: { label: "Completed", color: "bg-slate-50 text-slate-500 border-slate-100", icon: CheckCircle2 },
  cancelled: { label: "Cancelled", color: "bg-red-50 text-red-600 border-red-100", icon: AlertCircle },
}

export default function VisitsPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">My Site Visits</h1>
        <p className="text-slate-500 font-medium">Track and manage your scheduled property viewings</p>
      </div>

      <Tabs defaultValue="upcoming" className="space-y-8">
        <TabsList className="bg-white p-1.5 rounded-2xl h-14 border border-slate-100 shadow-sm">
          <TabsTrigger value="upcoming" className="rounded-xl px-8 font-black text-sm data-[state=active]:bg-primary data-[state=active]:text-white transition-all">Upcoming</TabsTrigger>
          <TabsTrigger value="completed" className="rounded-xl px-8 font-black text-sm data-[state=active]:bg-primary data-[state=active]:text-white transition-all">Completed</TabsTrigger>
          <TabsTrigger value="cancelled" className="rounded-xl px-8 font-black text-sm data-[state=active]:bg-primary data-[state=active]:text-white transition-all">Cancelled</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-6">
          {visits.filter(v => v.status !== 'completed').map((visit) => (
            <VisitCard key={visit.id} visit={visit} />
          ))}
        </TabsContent>
        {/* Other tabs would filter the visits array */}
      </Tabs>
    </div>
  )
}

function VisitCard({ visit }: { visit: {
  id: string,
  propertyTitle: string,
  locality: string,
  coverImage: string,
  date: string,
  time: string,
  ownerName: string,
  ownerPhone: string,
  status: string,
  points: number
} }) {
  const status = statusConfig[visit.status as keyof typeof statusConfig]
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-[32px] border border-slate-100 hover:border-primary/20 transition-all hover:shadow-xl hover:shadow-slate-200/50"
    >
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left: Media & Basic Info */}
        <div className="flex flex-col sm:flex-row gap-6 lg:w-2/3">
          <div className="w-full sm:w-40 h-44 rounded-2xl overflow-hidden relative shrink-0 shadow-lg">
            <Image 
              src={visit.coverImage} 
              alt={visit.propertyTitle}
              fill
              className="object-cover"
            />
          </div>
          
          <div className="flex-1 space-y-4">
            <div className="space-y-1">
              <Badge variant="outline" className={`px-4 py-1.5 rounded-xl border-2 shrink-0 ${status.color} border-transparent mb-2`}>
                <status.icon className="w-3.5 h-3.5 mr-2" />
                <span className="font-black text-[10px] uppercase tracking-widest">{status.label}</span>
              </Badge>
              <h3 className="text-xl font-black text-slate-900 leading-tight">
                {visit.propertyTitle}
              </h3>
              <p className="text-sm font-bold text-slate-400 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                {visit.locality}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6 bg-slate-50 p-4 rounded-2xl border border-slate-100/50">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                  <Calendar className="w-3 h-3" /> Date
                </span>
                <p className="text-sm font-black text-slate-700">{visit.date}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                  <Clock className="w-3 h-3" /> Time Range
                </span>
                <p className="text-sm font-black text-slate-700">{visit.time}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Owner & Actions */}
        <div className="lg:w-1/3 flex flex-col justify-between py-1 gap-6 border-t lg:border-t-0 lg:border-l border-slate-50 lg:pl-8 pt-6 lg:pt-0">
          <div className="space-y-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Property Owner</span>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-primary font-black shadow-sm">
                {visit.ownerName[0]}
              </div>
              <div className="space-y-0.5">
                <p className="text-sm font-black text-slate-900">{visit.ownerName}</p>
                <div className="flex items-center gap-4">
                   {visit.status === 'confirmed' ? (
                     <p className="text-xs font-bold text-slate-400 flex items-center gap-1">
                       <Phone className="w-3 h-3" /> {visit.ownerPhone}
                     </p>
                   ) : (
                     <p className="text-[10px] font-black text-amber-500 uppercase tracking-tight">Phone visible after confirmation</p>
                   )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {visit.status === 'confirmed' && (
              <>
                <Button className="flex-1 rounded-xl h-12 px-6 font-black gap-2 shadow-lg shadow-primary/20">
                  <Navigation className="w-4 h-4" /> Directions
                </Button>
                <Button variant="outline" className="rounded-xl h-12 w-12 p-0 border-slate-100 hover:bg-slate-50 group">
                  <CalendarPlus className="w-5 h-5 text-slate-400 group-hover:text-primary transition-colors" />
                </Button>
              </>
            )}
            {visit.status === 'pending' && (
              <Button variant="outline" className="w-full rounded-xl h-12 px-6 font-bold border-red-100 text-red-500 hover:bg-red-50 gap-2">
                <Trash2 className="w-4 h-4" /> Cancel Request
              </Button>
            )}
            {visit.status === 'completed' && (
              <Button className="w-full rounded-xl h-12 px-6 font-black gap-2 bg-slate-900">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" /> Rate Experience
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
