"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Clock, CheckCircle2, XCircle, Eye, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { EmptyState } from "@/components/ui/empty-state"
import { createClient } from "@/lib/supabase/client"
import { formatIndianPrice } from "@/lib/utils/formatPrice"
import { OptimizedImage } from "@/components/shared/optimized-image"

export default function AdminPendingListingsPage() {
  const supabase = createClient()
  const [listings, setListings] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchPending()
  }, [])

  async function fetchPending() {
    setIsLoading(true)
    const { data, error } = await (supabase.from("properties") as any)
      .select("*, profiles:owner_id(full_name, email)")
      .eq("status", "pending")
      .order("created_at", { ascending: true }) // oldest first for fair audit
    if (!error) setListings(data || [])
    setIsLoading(false)
  }

  async function handleAction(id: string, status: "live" | "rejected") {
    await (supabase.from("properties") as any).update({ status }).eq("id", id)
    setListings(prev => prev.filter(l => l.id !== id))
  }

  return (
    <div className="space-y-8 pb-20">
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-amber-400 animate-pulse" />
          <h1 className="text-4xl font-black text-slate-900 tracking-tight italic">Audit Queue</h1>
        </div>
        <p className="text-slate-500 font-medium">
          Review pending listings — oldest submissions first. {listings.length} awaiting review.
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array(3).fill(0).map((_, i) => (
            <div key={i} className="h-32 bg-slate-100 animate-pulse rounded-[24px]" />
          ))}
        </div>
      ) : listings.length === 0 ? (
        <EmptyState
          title="All Clear!"
          description="No pending listings to review. Everything is up to date."
          icon={CheckCircle2}
          className="py-32 bg-white rounded-[32px]"
        />
      ) : (
        <div className="space-y-4">
          {listings.map((listing, i) => (
            <Card key={listing.id} className="border-none shadow-sm rounded-[24px] bg-white p-6">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className="relative w-20 h-20 rounded-2xl overflow-hidden shrink-0 bg-slate-100">
                  <OptimizedImage
                    src={listing.images?.[0] || ""}
                    alt={listing.title || ""}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-1 left-1 w-5 h-5 rounded-full bg-amber-500 text-white text-[9px] font-black flex items-center justify-center">
                    {i + 1}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-black text-slate-900 text-lg truncate">{listing.title || "Untitled"}</h3>
                  <p className="text-sm text-slate-500 font-medium">{listing.profiles?.full_name} · {listing.city}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-primary font-black">{formatIndianPrice(listing.price || 0)}</span>
                    <Badge variant="pending">Pending</Badge>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(listing.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button asChild variant="outline" size="sm" className="rounded-xl border-slate-200 font-black text-[10px] uppercase tracking-widest gap-2">
                    <Link href={`/property/${listing.id}`} target="_blank">
                      <Eye className="w-3.5 h-3.5" /> Preview
                    </Link>
                  </Button>
                  <Button
                    onClick={() => handleAction(listing.id, "live")}
                    size="sm"
                    className="rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-[10px] uppercase tracking-widest gap-2"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                  </Button>
                  <Button
                    onClick={() => handleAction(listing.id, "rejected")}
                    size="sm"
                    variant="outline"
                    className="rounded-xl border-red-200 text-red-600 hover:bg-red-50 font-black text-[10px] uppercase tracking-widest gap-2"
                  >
                    <XCircle className="w-3.5 h-3.5" /> Reject
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
