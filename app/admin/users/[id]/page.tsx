"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Shield, ShieldOff, User, Mail, Phone, Calendar, Home, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { createClient } from "@/lib/supabase/client"

export default function AdminUserDetailPage() {
  const params = useParams()
  const router = useRouter()
  const supabase = createClient()
  const [profile, setProfile] = useState<any>(null)
  const [stats, setStats] = useState({ properties: 0, bookings: 0, enquiries: 0 })
  const [isLoading, setIsLoading] = useState(true)
  const [note, setNote] = useState("")
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    fetchUser()
  }, [params.id])

  async function fetchUser() {
    const [profileRes, propsRes, bookRes, enqRes] = await Promise.all([
      (supabase.from("profiles") as any).select("*").eq("id", params.id).single(),
      (supabase.from("properties") as any).select("id", { count: "exact", head: true }).eq("owner_id", params.id),
      (supabase.from("bookings") as any).select("id", { count: "exact", head: true }).eq("buyer_id", params.id),
      (supabase.from("enquiries") as any).select("id", { count: "exact", head: true }).eq("sender_id", params.id),
    ])
    setProfile(profileRes.data)
    setStats({ properties: propsRes.count || 0, bookings: bookRes.count || 0, enquiries: enqRes.count || 0 })
    setIsLoading(false)
  }

  async function handleBlock() {
    setUpdating(true)
    const newStatus = profile?.is_blocked ? false : true
    await (supabase.from("profiles") as any).update({ is_blocked: newStatus }).eq("id", params.id)
    setProfile((p: any) => ({ ...p, is_blocked: newStatus }))
    setUpdating(false)
  }

  if (isLoading) return <div className="h-96 bg-slate-100 animate-pulse rounded-[32px]" />
  if (!profile) return <div className="text-center py-32 text-slate-400 font-bold">User not found.</div>

  return (
    <div className="space-y-8 pb-20">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()} className="p-0 h-auto text-slate-400 font-bold gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Users
        </Button>
      </div>

      <div className="flex items-center gap-6">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black text-2xl">
          {(profile.full_name || "U")[0].toUpperCase()}
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">{profile.full_name || "Unknown User"}</h1>
          <p className="text-slate-500">{profile.email}</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant={profile.is_blocked ? "blocked" : "active"}>{profile.is_blocked ? "Blocked" : "Active"}</Badge>
          <Badge variant="draft" className="capitalize">{profile.role || "buyer"}</Badge>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { label: "Properties Listed", value: stats.properties, icon: Home },
          { label: "Bookings Made", value: stats.bookings, icon: Calendar },
          { label: "Enquiries Sent", value: stats.enquiries, icon: MessageSquare },
        ].map((s, i) => (
          <Card key={i} className="border-none shadow-sm rounded-[24px] p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <s.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900">{s.value}</p>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{s.label}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <Card className="border-none shadow-sm rounded-[24px]">
          <CardHeader><CardTitle className="font-black italic">Profile Info</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: "Full Name", value: profile.full_name, icon: User },
              { label: "Email", value: profile.email, icon: Mail },
              { label: "Phone", value: profile.phone || "Not set", icon: Phone },
              { label: "Member Since", value: new Date(profile.created_at).toLocaleDateString(), icon: Calendar },
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                  <f.icon className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{f.label}</p>
                  <p className="font-bold text-slate-900 text-sm">{f.value}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="border-none shadow-sm rounded-[24px]">
            <CardHeader><CardTitle className="font-black italic">Admin Actions</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <Textarea
                placeholder="Add an admin note about this user..."
                value={note}
                onChange={e => setNote(e.target.value)}
                className="rounded-xl border-slate-200 bg-slate-50 text-sm resize-none"
                rows={3}
              />
              <Button
                onClick={handleBlock}
                disabled={updating}
                className={`w-full h-12 rounded-2xl font-black gap-2 ${profile.is_blocked ? "bg-emerald-500 hover:bg-emerald-600 text-white" : "bg-red-500 hover:bg-red-600 text-white"}`}
              >
                {profile.is_blocked ? <><Shield className="w-4 h-4" /> Unblock User</> : <><ShieldOff className="w-4 h-4" /> Block User</>}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
