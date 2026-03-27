"use client"

import { Bell, Check, MessageSquare, Home, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/hooks/use-auth"
import { formatRelative } from "@/lib/utils/formatDate"
import Link from "next/link"

interface Notification {
  id: string
  type: string
  title: string
  message: string
  is_read: boolean
  created_at: string
}

const notificationIcons: Record<string, any> = {
  enquiry: MessageSquare,
  property: Home,
  visit: Calendar,
  default: Bell,
}

export function NotificationBell({ className }: { className?: string }) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    if (!user) return

    const supabase = createClient()

    // Fetch initial notifications
    const fetchNotifications = async () => {
      const { data } = await (supabase.from("notifications") as any)
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5)

      if (data) {
        setNotifications(data)
        setUnreadCount(data.filter((n: Notification) => !n.is_read).length)
      }
    }

    fetchNotifications()

    // Real-time subscription
    const channel = supabase
      .channel("notifications")
      .on(
        "postgres_changes" as any,
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${user.id}`,
        },
        (payload: any) => {
          setNotifications((prev) => [payload.new as Notification, ...prev].slice(0, 5))
          setUnreadCount((prev) => prev + 1)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user])

  const markAllRead = async () => {
    if (!user) return
    const supabase = createClient()
    await (supabase.from("notifications") as any)
      .update({ is_read: true })
      .eq("user_id", user.id)
      .eq("is_read", false)

    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })))
    setUnreadCount(0)
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn("rounded-xl relative text-slate-400 hover:bg-slate-50", className)}
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-black flex items-center justify-center border-2 border-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0 rounded-2xl shadow-2xl border-slate-100">
        <div className="flex items-center justify-between p-4 border-b border-slate-50">
          <h4 className="font-black text-slate-900 text-sm">Notifications</h4>
          {unreadCount > 0 && (
            <button onClick={markAllRead} className="text-xs font-bold text-primary hover:underline">
              Mark all read
            </button>
          )}
        </div>
        <div className="max-h-80 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="w-8 h-8 text-slate-200 mx-auto mb-2" />
              <p className="text-sm font-medium text-slate-400">No notifications yet</p>
            </div>
          ) : (
            notifications.map((n) => {
              const Icon = notificationIcons[n.type] || notificationIcons.default
              return (
                <div
                  key={n.id}
                  className={cn(
                    "flex gap-3 p-4 border-b border-slate-50 last:border-none hover:bg-slate-50 transition-colors",
                    !n.is_read && "bg-primary/5"
                  )}
                >
                  <div className={cn(
                    "w-9 h-9 rounded-xl flex items-center justify-center shrink-0",
                    !n.is_read ? "bg-primary/10 text-primary" : "bg-slate-100 text-slate-400"
                  )}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-900 truncate">{n.title}</p>
                    <p className="text-xs text-slate-500 line-clamp-2">{n.message}</p>
                    <p className="text-[10px] text-slate-400 mt-1">{formatRelative(n.created_at)}</p>
                  </div>
                  {!n.is_read && <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />}
                </div>
              )
            })
          )}
        </div>
        <div className="p-3 border-t border-slate-50">
          <Link href="/buyer/notifications" onClick={() => setIsOpen(false)}>
            <Button variant="ghost" className="w-full h-9 text-xs font-bold text-primary rounded-xl">
              View All Notifications
            </Button>
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  )
}
