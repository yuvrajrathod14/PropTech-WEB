"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { 
  Calendar, 
  MapPin, 
  User, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Loader2,
  ChevronRight,
  Phone
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { createNotification } from "@/lib/utils/notifications"
import { cn } from "@/lib/utils"

export default function OwnerVisitsPage() {
  const supabase = createClient()
  const [visits, setVisits] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      if (user) {
        fetchVisits(user.id)
      }
    }
    init()
  }, [])

  const fetchVisits = async (userId: string) => {
    setIsLoading(true)
    try {
      const { data, error } = await (supabase.from("site_visits") as any)
        .select(`
          *,
          property:property_id (property_name, address, city),
          buyer:user_id (full_name, email)
        `)
        .order("preferred_date", { ascending: true })

      if (error) throw error
      setVisits(data || [])
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }

  const updateStatus = async (visitId: string, status: string, buyerId: string, propertyName: string) => {
    try {
      const { error } = await (supabase.from("site_visits") as any)
        .update({ status })
        .eq("id", visitId)

      if (error) throw error

      setVisits((prev) => prev.map(v => v.id === visitId ? { ...v, status } : v))

      // Notify Buyer
      await createNotification({
        userId: buyerId,
        title: `Site Visit ${status.charAt(0).toUpperCase() + status.slice(1)}`,
        message: `Your visit request for ${propertyName} has been ${status}.`,
        type: 'visit',
        link: `/buyer/visits`
      })

    } catch (e) {
      console.error(e)
      alert("Failed to update status")
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="pt-24 min-h-screen bg-slate-50 pb-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto space-y-10">
          
          <header className="space-y-4">
            <h1 className="text-4xl font-black text-slate-900 italic tracking-tight uppercase">Site Visit Requests</h1>
            <p className="text-slate-500 font-bold italic">Manage and coordinate property tours for your listings.</p>
          </header>

          <div className="grid gap-6">
            {visits.length === 0 ? (
              <div className="bg-white rounded-[40px] p-20 text-center border border-slate-100 shadow-xl shadow-slate-200/50">
                <Calendar className="w-16 h-16 text-slate-100 mx-auto mb-6" />
                <h3 className="text-2xl font-black text-slate-900 italic tracking-tight">No Visit Requests</h3>
                <p className="text-slate-400 font-bold mt-2">When buyers request to see your property, they'll appear here.</p>
              </div>
            ) : (
              visits.map((visit) => (
                <Card key={visit.id} className="rounded-[40px] overflow-hidden border-none shadow-xl shadow-slate-200/50 bg-white group hover:scale-[1.01] transition-all duration-300">
                  <CardContent className="p-8 flex flex-col md:flex-row md:items-center justify-between gap-8">
                    
                    <div className="flex items-center gap-6">
                      <div className="w-20 h-20 rounded-[30px] bg-primary/5 flex items-center justify-center text-primary shrink-0 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                        <Calendar className="w-8 h-8" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <h3 className="text-xl font-black text-slate-900 tracking-tight">{visit.property?.property_name}</h3>
                          <Badge className={cn(
                            "rounded-full px-3 py-1 font-black text-[9px] uppercase tracking-wider border-none",
                            visit.status === 'pending' ? "bg-amber-100 text-amber-600" :
                            visit.status === 'confirmed' ? "bg-emerald-100 text-emerald-600" :
                            "bg-slate-100 text-slate-600"
                          )}>
                            {visit.status}
                          </Badge>
                        </div>
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center text-slate-500 font-bold text-sm">
                            <MapPin className="w-4 h-4 mr-2" />
                            {visit.property?.address}, {visit.property?.city}
                          </div>
                          <div className="flex items-center text-slate-900 font-black text-sm uppercase tracking-widest mt-1">
                            <User className="w-4 h-4 mr-2 text-primary" />
                            Buyer: {visit.buyer?.full_name}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col md:items-end gap-4 shrink-0">
                      <div className="text-right">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Preferred Date</p>
                        <p className="text-2xl font-black text-slate-900 italic tracking-tighter">
                          {new Date(visit.preferred_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      </div>

                      {visit.status === 'pending' && (
                        <div className="flex gap-3">
                           <Button 
                             onClick={() => updateStatus(visit.id, 'rejected', visit.user_id, visit.property?.property_name)}
                             variant="outline" 
                             className="rounded-2xl h-12 px-6 font-black text-xs uppercase tracking-widest border-slate-100 hover:bg-slate-50"
                           >
                             <XCircle className="w-4 h-4 mr-2 text-red-500" />
                             Reject
                           </Button>
                           <Button 
                             onClick={() => updateStatus(visit.id, 'confirmed', visit.user_id, visit.property?.property_name)}
                             className="rounded-2xl h-12 px-6 font-black text-xs uppercase tracking-widest bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20"
                           >
                              <CheckCircle2 className="w-4 h-4 mr-2" />
                              Confirm
                           </Button>
                        </div>
                      )}

                      {visit.status === 'confirmed' && (
                        <Button className="rounded-2xl h-12 px-6 font-black text-xs uppercase tracking-widest bg-slate-900 text-white shadow-xl">
                          <Phone className="w-4 h-4 mr-2" />
                          Call Buyer
                        </Button>
                      )}
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
