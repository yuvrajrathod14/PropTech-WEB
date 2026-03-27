"use client"

import { useState, useMemo } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, MapPin, CheckCircle2, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "sonner"
import { format, addDays, isSameDay } from "date-fns"

const TIME_SLOTS = [
  "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
  "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM",
]

export function VisitModal({
  open,
  onOpenChange,
  propertyId,
  propertyTitle,
  propertyAddress,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  propertyId: string
  propertyTitle: string
  propertyAddress?: string
}) {
  const { user } = useAuth()
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  // Generate next 14 days
  const dates = useMemo(() => {
    const today = new Date()
    return Array.from({ length: 14 }, (_, i) => addDays(today, i + 1))
  }, [])

  const handleSubmit = async () => {
    if (!user) {
      toast.error("Please login to schedule a visit")
      return
    }
    if (!selectedDate || !selectedTime) {
      toast.error("Please select a date and time")
      return
    }

    setLoading(true)
    const supabase = createClient()

    try {
      const { error } = await (supabase.from("site_visits") as any).insert({
        property_id: propertyId,
        visitor_id: user.id,
        visit_date: format(selectedDate, "yyyy-MM-dd"),
        visit_time: selectedTime,
        status: "pending",
      })

      if (error) throw error

      setSuccess(true)
      toast.success("Visit scheduled successfully!")

      setTimeout(() => {
        onOpenChange(false)
        setSuccess(false)
        setSelectedDate(null)
        setSelectedTime(null)
      }, 2000)
    } catch (error: any) {
      toast.error(error.message || "Failed to schedule visit")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-2xl max-w-lg">
        {success ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">Visit Scheduled!</h3>
            <p className="text-sm text-slate-500">
              {selectedDate && format(selectedDate, "EEEE, d MMMM")} at {selectedTime}
            </p>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="font-black text-slate-900 text-lg">Schedule Site Visit</DialogTitle>
              <p className="text-sm text-slate-500 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                {propertyTitle}{propertyAddress && ` • ${propertyAddress}`}
              </p>
            </DialogHeader>

            <div className="space-y-6 pt-4">
              {/* Date Selection */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  <h4 className="text-sm font-bold text-slate-900">Select Date</h4>
                </div>
                <div className="grid grid-cols-7 gap-2">
                  {dates.map((date) => (
                    <button
                      key={date.toISOString()}
                      onClick={() => setSelectedDate(date)}
                      className={cn(
                        "flex flex-col items-center p-2 rounded-xl text-center transition-all border-2",
                        selectedDate && isSameDay(selectedDate, date)
                          ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                          : "border-transparent hover:bg-slate-50 hover:border-slate-100"
                      )}
                    >
                      <span className="text-[9px] font-bold uppercase opacity-60">
                        {format(date, "EEE")}
                      </span>
                      <span className="text-sm font-black">{format(date, "d")}</span>
                      <span className="text-[8px] font-medium opacity-50">
                        {format(date, "MMM")}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Selection */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  <h4 className="text-sm font-bold text-slate-900">Select Time</h4>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {TIME_SLOTS.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={cn(
                        "px-3 py-2.5 rounded-xl text-xs font-bold transition-all border-2",
                        selectedTime === time
                          ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                          : "border-slate-100 hover:border-primary/30 hover:bg-primary/5 text-slate-600"
                      )}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              <Button
                onClick={handleSubmit}
                disabled={loading || !selectedDate || !selectedTime}
                className="w-full h-12 rounded-2xl font-bold bg-primary hover:bg-primary/90"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Calendar className="w-4 h-4 mr-2" /> Confirm Visit
                  </>
                )}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
