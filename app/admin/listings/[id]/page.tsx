"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, CheckCircle2, XCircle, MapPin, BedDouble, Bath, Maximize, Eye, Calendar, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import { formatIndianPrice } from "@/lib/utils/formatPrice"
import { OptimizedImage } from "@/components/shared/optimized-image"

export default function AdminListingDetailPage() {
  const params = useParams()
  const router = useRouter()
  const supabase = createClient()
  const [listing, setListing] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    fetchListing()
  }, [params.id])

  async function fetchListing() {
    const { data } = await (supabase.from("properties") as any)
      .select("*, profiles:owner_id(full_name, email, phone)")
      .eq("id", params.id)
      .single()
    setListing(data)
    setIsLoading(false)
  }

  async function handleAction(status: string) {
    setUpdating(true)
    const { data: { user } } = await supabase.auth.getUser()
    await (supabase.from("properties") as any).update({ status }).eq("id", params.id)
    if (user) {
      await (supabase.from("admin_audit_log") as any).insert({
        admin_id: user.id,
        action: status === "live" ? "approve" : "reject",
        property_id: params.id,
        details: `Admin ${status === "live" ? "approved" : "rejected"} listing`
      })
    }
    setUpdating(false)
    router.push("/admin/listings")
  }

  if (isLoading) return <div className="h-96 bg-slate-100 animate-pulse rounded-[32px]" />
  if (!listing) return <div className="text-center py-32 text-slate-400 font-bold">Listing not found.</div>

  return (
    <div className="space-y-8 pb-20">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()} className="p-0 h-auto text-slate-400 font-bold gap-2">
          <ArrowLeft className="w-4 h-4" /> Back
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight italic">{listing.title}</h1>
          <p className="text-slate-500 font-medium text-sm">Review this listing before approving or rejecting.</p>
        </div>
        <Badge variant={(listing.status || "draft") as any}>{listing.status || "Draft"}</Badge>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Gallery */}
          <div className="grid grid-cols-2 gap-3">
            {(listing.images || []).slice(0, 4).map((img: string, i: number) => (
              <div key={i} className={`relative rounded-2xl overflow-hidden bg-slate-100 ${i === 0 ? "col-span-2 aspect-video" : "aspect-square"}`}>
                <OptimizedImage src={img} alt="" fill className="object-cover" />
              </div>
            ))}
            {(!listing.images || listing.images.length === 0) && (
              <div className="col-span-2 aspect-video bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 font-bold">No photos uploaded</div>
            )}
          </div>

          {/* Details */}
          <Card className="border-none shadow-sm rounded-[24px]">
            <CardHeader><CardTitle className="font-black italic">Property Details</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-slate-600"><MapPin className="w-4 h-4 text-primary" />{listing.address}, {listing.locality}, {listing.city}</div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Type</p><p className="font-black text-slate-900">{listing.type || "N/A"}</p></div>
                <div className="space-y-1"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Beds</p><p className="font-black text-slate-900">{listing.beds || "N/A"}</p></div>
                <div className="space-y-1"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Baths</p><p className="font-black text-slate-900">{listing.baths || "N/A"}</p></div>
                <div className="space-y-1"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Area</p><p className="font-black text-slate-900">{listing.area ? `${listing.area} sq.ft` : "N/A"}</p></div>
                <div className="space-y-1"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Price</p><p className="font-black text-primary">{formatIndianPrice(listing.price || 0)}</p></div>
                <div className="space-y-1"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</p><p className="font-black text-slate-900">{listing.category || "N/A"}</p></div>
              </div>
              {listing.description && (
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Description</p>
                  <p className="text-slate-600 font-medium text-sm leading-relaxed">{listing.description}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right sidebar */}
        <div className="space-y-6">
          <Card className="border-none shadow-sm rounded-[24px]">
            <CardHeader><CardTitle className="font-black italic flex items-center gap-2"><User className="w-4 h-4" />Owner</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              <p className="font-black text-slate-900">{listing.profiles?.full_name || "Unknown"}</p>
              <p className="text-sm text-slate-500">{listing.profiles?.email}</p>
              {listing.profiles?.phone && <p className="text-sm text-slate-500">{listing.profiles.phone}</p>}
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm rounded-[24px]">
            <CardHeader><CardTitle className="font-black italic flex items-center gap-2"><Calendar className="w-4 h-4" />Timeline</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm"><span className="text-slate-500 font-medium">Submitted</span><span className="font-bold">{new Date(listing.created_at).toLocaleDateString()}</span></div>
              <div className="flex justify-between text-sm"><span className="text-slate-500 font-medium">Updated</span><span className="font-bold">{new Date(listing.updated_at).toLocaleDateString()}</span></div>
            </CardContent>
          </Card>

          {listing.status === "pending" && (
            <div className="space-y-3">
              <Button onClick={() => handleAction("live")} disabled={updating} className="w-full h-12 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-2xl gap-2">
                <CheckCircle2 className="w-4 h-4" /> Approve Listing
              </Button>
              <Button onClick={() => handleAction("rejected")} disabled={updating} variant="outline" className="w-full h-12 border-red-200 text-red-600 hover:bg-red-50 font-black rounded-2xl gap-2">
                <XCircle className="w-4 h-4" /> Reject Listing
              </Button>
            </div>
          )}

          <Button asChild variant="outline" className="w-full h-12 rounded-2xl border-slate-200 font-black gap-2">
            <Link href={`/property/${listing.id}`} target="_blank">
              <Eye className="w-4 h-4" /> Preview Public Page
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
