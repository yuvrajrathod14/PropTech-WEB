"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CheckCircle2, XCircle, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "sonner"

export function ListingReviewActions({
  propertyId,
  currentStatus,
  onStatusChange,
}: {
  propertyId: string
  currentStatus: string
  onStatusChange?: (newStatus: string) => void
}) {
  const { user } = useAuth()
  const [loading, setLoading] = useState<"approve" | "reject" | null>(null)
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [rejectionReason, setRejectionReason] = useState("")

  const handleApprove = async () => {
    setLoading("approve")
    const supabase = createClient()

    try {
      const { error } = await (supabase.from("properties") as any)
        .update({ status: "live", rejection_reason: null })
        .eq("id", propertyId)

      if (error) throw error

      // Log audit entry
      await (supabase.from("admin_audit_log") as any).insert({
        admin_id: user?.id,
        action: "approve_listing",
        target_id: propertyId,
        details: { status: "live" }
      }).catch(() => {})

      toast.success("Property approved and now live!")
      onStatusChange?.("live")
    } catch (error: any) {
      toast.error(error.message || "Failed to approve")
    } finally {
      setLoading(null)
    }
  }

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast.error("Please provide a reason for rejection")
      return
    }

    setLoading("reject")
    const supabase = createClient()

    try {
      const { error } = await (supabase.from("properties") as any)
        .update({ status: "rejected", rejection_reason: rejectionReason.trim() })
        .eq("id", propertyId)

      if (error) throw error

      // Log audit entry
      await (supabase.from("admin_audit_log") as any).insert({
        admin_id: user?.id,
        action: "reject_listing",
        target_id: propertyId,
        details: { reason: rejectionReason.trim() }
      }).catch(() => {})

      toast.success("Property rejected")
      setRejectDialogOpen(false)
      setRejectionReason("")
      onStatusChange?.("rejected")
    } catch (error: any) {
      toast.error(error.message || "Failed to reject")
    } finally {
      setLoading(null)
    }
  }

  if (currentStatus !== "pending") {
    return null
  }

  return (
    <>
      <div className="flex items-center gap-3">
        <Button
          onClick={handleApprove}
          disabled={loading !== null}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl h-10"
        >
          {loading === "approve" ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : (
            <CheckCircle2 className="w-4 h-4 mr-2" />
          )}
          Approve
        </Button>
        <Button
          onClick={() => setRejectDialogOpen(true)}
          disabled={loading !== null}
          variant="outline"
          className="border-red-200 text-red-600 hover:bg-red-50 font-bold rounded-xl h-10"
        >
          <XCircle className="w-4 h-4 mr-2" />
          Reject
        </Button>
      </div>

      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent className="rounded-2xl max-w-md">
          <DialogHeader>
            <DialogTitle className="font-black text-slate-900">Reject Listing</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                Rejection Reason *
              </Label>
              <Textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Please provide a clear reason for rejection (e.g., unclear photos, incorrect pricing, missing details)..."
                className="rounded-xl min-h-[120px] resize-none"
                maxLength={500}
              />
              <p className="text-xs text-slate-400 text-right">{rejectionReason.length}/500</p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setRejectDialogOpen(false)}
                className="flex-1 rounded-xl"
              >
                Cancel
              </Button>
              <Button
                onClick={handleReject}
                disabled={loading === "reject" || !rejectionReason.trim()}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl"
              >
                {loading === "reject" ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <XCircle className="w-4 h-4 mr-2" />
                )}
                Reject
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
