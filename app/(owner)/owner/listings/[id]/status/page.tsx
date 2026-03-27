"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Clock, CheckCircle2, XCircle, Eye, FileEdit, Zap, AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/client"

const STATUS_TIMELINE = [
  {
    status: "draft",
    label: "Draft",
    description: "Property saved but not submitted for review yet.",
    icon: FileEdit,
    color: "bg-slate-400",
  },
  {
    status: "pending",
    label: "Under Review",
    description: "Submitted to admin team. Usually reviewed within 24 hours.",
    icon: Clock,
    color: "bg-amber-400",
  },
  {
    status: "live",
    label: "Live",
    description: "Your listing is live and visible to all buyers.",
    icon: CheckCircle2,
    color: "bg-emerald-500",
  },
  {
    status: "rejected",
    label: "Rejected",
    description: "Listing was not approved. Update details and resubmit.",
    icon: XCircle,
    color: "bg-red-500",
  },
]

export default function OwnerListingStatusPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const supabase = createClient()

  const [currentStatus, setCurrentStatus] = useState<string>("draft")
  const [rejectionReason, setRejectionReason] = useState<string>("")
  const [propertyTitle, setPropertyTitle] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchStatus() {
      setIsLoading(true)
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) { router.push("/login"); return }

        const { data: prop, error } = await (supabase.from("properties") as any)
          .select("status, rejection_reason, title, owner_id")
          .eq("id", id)
          .single()

        if (error || !prop) { router.push("/owner/listings"); return }
        if (prop.owner_id !== user.id) { router.push("/owner/listings"); return }

        setCurrentStatus(prop.status || "draft")
        setRejectionReason(prop.rejection_reason || "")
        setPropertyTitle(prop.title || "")
      } catch (error) {
        console.error("Error fetching status:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchStatus()
  }, [id, supabase, router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    )
  }

  const currentIndex = STATUS_TIMELINE.findIndex(s => s.status === currentStatus)

  return (
    <div className="space-y-8 pb-20 max-w-2xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()} className="p-0 h-auto text-slate-400 font-bold gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Listing
        </Button>
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight italic">Listing Status</h1>
        <p className="text-slate-500 font-medium">Track the review progress of <span className="text-slate-900 font-bold">{propertyTitle}</span>.</p>
      </div>

      {/* Current Status Banner */}
      <div className={`p-6 rounded-[24px] flex items-center gap-4 ${
        currentStatus === "live" ? "bg-emerald-50 border border-emerald-100" :
        currentStatus === "pending" ? "bg-amber-50 border border-amber-100" :
        currentStatus === "rejected" ? "bg-red-50 border border-red-100" :
        "bg-slate-50 border border-slate-100"
      }`}>
        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white ${STATUS_TIMELINE[currentIndex]?.color || "bg-slate-400"}`}>
          {(() => { const Icon = STATUS_TIMELINE[currentIndex]?.icon || AlertCircle; return <Icon className="w-6 h-6" /> })()}
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Current Status</p>
          <p className="text-xl font-black text-slate-900">{STATUS_TIMELINE[currentIndex]?.label || "Unknown"}</p>
          <p className="text-sm text-slate-600 font-medium">
            {currentStatus === "rejected" && rejectionReason 
              ? rejectionReason 
              : STATUS_TIMELINE[currentIndex]?.description}
          </p>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative space-y-0">
        {STATUS_TIMELINE.filter(s => s.status !== "rejected" || currentStatus === "rejected").map((step, i) => {
          const stepIndex = STATUS_TIMELINE.indexOf(step)
          const isCompleted = stepIndex < currentIndex || (currentStatus === step.status)
          const isCurrent = step.status === currentStatus
          const Icon = step.icon

          return (
            <div key={step.status} className="flex items-start gap-4 relative pb-8 last:pb-0">
              {/* Connector line */}
              {i < STATUS_TIMELINE.filter(s => s.status !== "rejected" || currentStatus === "rejected").length - 1 && (
                <div className={`absolute left-5 top-10 w-0.5 h-full -mt-2 ${isCompleted && !isCurrent ? "bg-emerald-300" : "bg-slate-100"}`} />
              )}

              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 z-10 border-2 ${
                isCurrent ? `${step.color} text-white border-transparent` :
                isCompleted ? "bg-emerald-500 text-white border-transparent" :
                "bg-white border-slate-200 text-slate-300"
              }`}>
                <Icon className="w-4 h-4" />
              </div>

              <div className="flex-1 pt-1.5">
                <div className="flex items-center gap-3">
                  <p className={`font-black ${isCurrent ? "text-slate-900" : isCompleted ? "text-emerald-700" : "text-slate-300"}`}>
                    {step.label}
                  </p>
                  {isCurrent && <Badge variant={step.status as any}>Current</Badge>}
                </div>
                <p className={`text-sm mt-1 ${isCompleted ? "text-slate-500" : "text-slate-300"} font-medium`}>
                  {step.description}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Actions */}
      {currentStatus === "rejected" && (
        <div className="p-6 bg-red-50 rounded-[24px] border border-red-100 space-y-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <p className="font-black text-slate-900">Action Required</p>
          </div>
          <p className="text-sm text-slate-600 font-medium">Update your listing with better photos and accurate details, then resubmit for review.</p>
          <Button onClick={() => router.push(`/owner/listings/${id}/edit`)} className="h-12 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black gap-2">
            <FileEdit className="w-4 h-4" /> Edit & Resubmit
          </Button>
        </div>
      )}

      {currentStatus === "live" && (
        <div className="flex gap-3">
          <Button onClick={() => router.push(`/property/${id}`)} variant="outline" className="flex-1 h-12 rounded-2xl border-slate-200 font-black gap-2">
            <Eye className="w-4 h-4" /> View Public Listing
          </Button>
          <Button onClick={() => router.push(`/owner/listings/${id}/boost`)} className="flex-1 h-12 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black gap-2">
            <Zap className="w-4 h-4" /> Boost Listing
          </Button>
        </div>
      )}
    </div>
  )
}
