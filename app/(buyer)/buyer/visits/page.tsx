"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { 
  Calendar, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Loader2,
  ChevronRight,
  Home
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export default function BuyerVisitsPage() {
  const supabase = createClient()
  const [visits, setVisits] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchVisits = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      try {
        const { data, error } = await (supabase.from("site_visits") as any)
          .select(`
            *,
            property:property_id (property_name, address, city, images)
          `)
          .eq("user_id", user.id)
          .order("preferred_date", { ascending: true })

        if (error) throw error
        setVisits(data || [])
      } catch (e) {
        console.error(e)
      } finally {
        setIsLoading(false)
      }
    }
    fetchVisits()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="pt-24 min-h-screen bg-slate-50/50 pb-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto space-y-10">
          
          <header className="space-y-4 text-center md:text-left">
            <h1 className="text-4xl font-black text-slate-900 italic tracking-tight uppercase">My Site Visits</h1>
            <p className="text-slate-500 font-bold italic">Track your scheduled property tours and requests.</p>
          </header>

          <div className="grid gap-6">
            {visits.length === 0 ? (
              <div className="bg-white rounded-[40px] p-20 text-center border border-slate-100 shadow-xl shadow-slate-200/50">
                <Calendar className="w-16 h-16 text-slate-100 mx-auto mb-6" />
                <h3 className="text-2xl font-black text-slate-900 italic tracking-tight">No Visits Scheduled</h3>
                <p className="text-slate-400 font-bold mt-2">When you request a visit on a property page, it will appear here.</p>
                <Button className="mt-8 rounded-2xl px-8 h-12 bg-primary font-black uppercase tracking-widest text-white shadow-lg shadow-primary/20">
                  Browse Properties
                </Button>
              </div>
            ) : (
              visits.map((visit) => (
                <Card key={visit.id} className="rounded-[40px] overflow-hidden border-none shadow-xl shadow-slate-200/50 bg-white group hover:scale-[1.01] transition-all duration-300">
                  <CardContent className="p-0 flex flex-col md:flex-row md:items-stretch">
                    
                    <div className="w-full md:w-64 h-48 md:h-auto overflow-hidden relative">
                      <img 
                        src={visit.property?.images?.[0] || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6"} 
                        alt={visit.property?.property_name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge className={cn(
                          "rounded-full px-3 py-1 font-black text-[9px] uppercase tracking-wider border-none shadow-lg",
                          visit.status === 'pending' ? "bg-amber-400 text-white" :
                          visit.status === 'confirmed' ? "bg-emerald-500 text-white" :
                          "bg-slate-400 text-white"
                        )}>
                          {visit.status}
                        </Badge>
                      </div>
                    </div>

                    <div className="p-8 flex-1 flex flex-col justify-between gap-6">
                      <div className="space-y-4">
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-tight italic">{visit.property?.property_name}</h3>
                        <div className="flex items-center text-slate-500 font-bold text-sm">
                          <MapPin className="w-4 h-4 mr-2 text-primary shrink-0" />
                          <span className="truncate">{visit.property?.address}, {visit.property?.city}</span>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-slate-50 pt-4">
                        <div className="flex flex-col gap-1">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Scheduled For</p>
                          <div className="flex items-center gap-2">
                             <Calendar className="w-5 h-5 text-primary" />
                             <p className="text-xl font-black text-slate-900 italic tracking-tight">
                                {new Date(visit.preferred_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                             </p>
                          </div>
                        </div>

                        {visit.status === 'confirmed' && (
                          <div className="flex items-center gap-2 text-emerald-500 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-100 w-fit">
                            <CheckCircle2 className="w-5 h-5" />
                            <span className="font-black text-[10px] uppercase tracking-widest leading-none">Owner Confirmed</span>
                          </div>
                        )}
                      </div>
                    </div>

                  </CardContent>
                </Card>
              ))
            )}
          </div>

        </div>
      </div>
    </div>
  )
}
