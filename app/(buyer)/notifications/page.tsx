"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Bell, 
  MessageSquare, 
  ShoppingBag, 
  Home as HomeIcon, 
  CheckCircle2, 
  Trash2,
  MoreHorizontal
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const notificationsData = [
  {
    id: 1,
    type: "enquiry",
    title: "New Message from Rajesh Kumar",
    body: "Is it possible to visit this Sunday morning for the Satellite apartment?",
    time: "2h ago",
    isUnread: true,
    icon: MessageSquare,
    color: "bg-blue-50 text-blue-500"
  },
  {
    id: 2,
    type: "booking",
    title: "Booking Confirmed!",
    body: "Your token deposit for 'Spacious 3BHK' has been successfully processed.",
    time: "5h ago",
    isUnread: true,
    icon: ShoppingBag,
    color: "bg-emerald-50 text-emerald-500"
  },
  {
    id: 3,
    type: "listing",
    title: "Price Drop Alert",
    body: "A property you wishlisted: 'Modern Villa in Shela' just dropped by ₹5 Lakh.",
    time: "1d ago",
    isUnread: false,
    icon: HomeIcon,
    color: "bg-amber-50 text-amber-500"
  },
  {
    id: 4,
    type: "system",
    title: "Account Verified",
    body: "Congratulations! Your account has been verified. You can now contact owners directly.",
    time: "3d ago",
    isUnread: false,
    icon: CheckCircle2,
    color: "bg-purple-50 text-purple-500"
  }
]

export default function NotificationsPage() {
  const [filter, setFilter] = useState("All")
  const [notifications, setNotifications] = useState(notificationsData)

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isUnread: false })))
  }

  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Notifications</h1>
          <p className="text-slate-500 font-medium">Stay updated with your property journey</p>
        </div>
        <Button 
          variant="outline" 
          onClick={markAllRead}
          className="rounded-2xl h-12 px-6 font-bold border-slate-100 hover:bg-slate-50 text-slate-500"
        >
          Mark all as read
        </Button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
        {["All", "Enquiries", "Bookings", "Listings", "System"].map((f) => (
          <Badge 
            key={f} 
            onClick={() => setFilter(f)}
            variant={filter === f ? "default" : "outline"} 
            className={cn(
               "px-6 py-2 rounded-xl cursor-pointer font-black text-[10px] uppercase tracking-widest border-2 transition-all shrink-0",
               filter === f ? "border-primary" : "border-slate-50 text-slate-400 hover:border-slate-200"
            )}
          >
            {f}
          </Badge>
        ))}
      </div>

      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden min-h-[500px]">
        {notifications.length > 0 ? (
          <div className="divide-y divide-slate-50">
            <AnimatePresence mode="popLayout">
              {notifications.map((n) => (
                <motion.div
                  key={n.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, x: -20 }}
                  className={cn(
                    "p-6 md:p-8 flex gap-6 group transition-all relative overflow-hidden",
                    n.isUnread ? "bg-primary/[0.02]" : "hover:bg-slate-50/50"
                  )}
                >
                  {n.isUnread && (
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary" />
                  )}
                  
                  <div className={cn(
                    "w-14 h-14 rounded-2xl shrink-0 flex items-center justify-center shadow-sm",
                    n.color
                  )}>
                    <n.icon className="w-6 h-6" />
                  </div>

                  <div className="flex-1 space-y-1.5 min-w-0">
                    <div className="flex items-center justify-between gap-4">
                      <h3 className={cn(
                        "text-[15px] tracking-tight truncate",
                        n.isUnread ? "font-black text-slate-900" : "font-bold text-slate-600"
                      )}>
                        {n.title}
                      </h3>
                      <span className="text-[10px] font-black text-slate-300 uppercase shrink-0 tracking-widest">{n.time}</span>
                    </div>
                    <p className="text-sm font-medium text-slate-500 leading-relaxed line-clamp-2 pr-10">
                      {n.body}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity absolute right-6 top-1/2 -translate-y-1/2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => deleteNotification(n.id)}
                      className="rounded-xl h-10 w-10 text-slate-300 hover:text-red-500 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="rounded-xl h-10 w-10 text-slate-300">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 px-6 text-center space-y-6">
            <div className="w-24 h-24 rounded-[32px] bg-slate-50 flex items-center justify-center border-2 border-dashed border-slate-200">
               <Bell className="w-10 h-10 text-slate-200" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-black text-slate-900 tracking-tight">You&apos;re all caught up! 🎉</h3>
              <p className="text-sm text-slate-500 font-medium">No new notifications at the moment. We&apos;ll alert you of any updates.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
