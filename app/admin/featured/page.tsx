"use client"

import { useEffect, useState } from "react"
import { Star, StarOff, Search, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { EmptyState } from "@/components/ui/empty-state"
import { createClient } from "@/lib/supabase/client"
import { formatIndianPrice } from "@/lib/utils/formatPrice"
import { OptimizedImage } from "@/components/shared/optimized-image"

export default function AdminFeaturedPage() {
  const supabase = createClient()
  const [featured, setFeatured] = useState<any[]>([])
  const [all, setAll] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [tab, setTab] = useState<"featured" | "manage">("featured")

  useEffect(() => {
    async function fetch() {
      setIsLoading(true)
      const [featRes, allRes] = await Promise.all([
        (supabase.from("properties") as any).select("*").eq("is_featured", true).eq("status", "live").order("updated_at", { ascending: false }),
        (supabase.from("properties") as any).select("*").eq("status", "live").eq("is_featured", false).limit(20)
      ])
      setFeatured(featRes.data || [])
      setAll(allRes.data || [])
      setIsLoading(false)
    }
    fetch()
  }, [])

  async function toggleFeature(id: string, current: boolean) {
    await (supabase.from("properties") as any).update({ is_featured: !current }).eq("id", id)
    if (current) {
      setFeatured(prev => prev.filter(p => p.id !== id))
    } else {
      setAll(prev => prev.filter(p => p.id !== id))
    }
  }

  const filtered = (tab === "featured" ? featured : all).filter(p =>
    (p.title || "").toLowerCase().includes(search.toLowerCase()) ||
    (p.city || "").toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-8 pb-20">
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <Star className="w-6 h-6 text-amber-400 fill-amber-400" />
          <h1 className="text-4xl font-black text-slate-900 tracking-tight italic">Featured Listings</h1>
        </div>
        <p className="text-slate-500 font-medium">Manage which properties appear in the featured section on the homepage.</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex bg-slate-100 p-1 rounded-2xl gap-1">
          {(["featured", "manage"] as const).map(t => (
            <Button
              key={t}
              variant={tab === t ? "default" : "ghost"}
              onClick={() => setTab(t)}
              className={`rounded-xl px-6 h-10 font-black text-[10px] uppercase tracking-widest capitalize ${tab === t ? "bg-white text-primary shadow-sm" : "text-slate-500"}`}
            >
              {t === "featured" ? `Featured (${featured.length})` : "Add More"}
            </Button>
          ))}
        </div>
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search properties..." className="pl-9 h-10 rounded-xl bg-slate-50 border-none" />
        </div>
      </div>

      {isLoading ? (
        <div className="grid md:grid-cols-2 gap-4">{Array(4).fill(0).map((_, i) => <div key={i} className="h-36 bg-slate-100 animate-pulse rounded-[24px]" />)}</div>
      ) : filtered.length === 0 ? (
        <EmptyState title="No listings" description={tab === "featured" ? "No featured listings yet." : "No available listings to feature."} icon={Home} className="py-24 bg-white rounded-[32px]" />
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {filtered.map(property => (
            <Card key={property.id} className="border-none shadow-sm rounded-[24px] bg-white overflow-hidden flex items-center gap-4 p-4">
              <div className="relative w-20 h-20 rounded-2xl overflow-hidden shrink-0 bg-slate-100">
                <OptimizedImage src={property.images?.[0] || ""} alt="" fill className="object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-black text-slate-900 truncate">{property.title || "Untitled"}</p>
                <p className="text-xs text-slate-400 font-medium">{property.city}</p>
                <p className="text-primary font-black text-sm mt-1">{formatIndianPrice(property.price || 0)}</p>
              </div>
              <Button
                onClick={() => toggleFeature(property.id, tab === "featured")}
                size="sm"
                variant="outline"
                className={`rounded-xl shrink-0 font-black text-[10px] uppercase tracking-widest gap-1.5 ${tab === "featured" ? "border-red-200 text-red-500 hover:bg-red-50" : "border-amber-200 text-amber-600 hover:bg-amber-50"}`}
              >
                {tab === "featured" ? <><StarOff className="w-3.5 h-3.5" /> Remove</> : <><Star className="w-3.5 h-3.5" /> Feature</>}
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
