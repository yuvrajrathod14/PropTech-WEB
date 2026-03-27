"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Send, CheckCircle2, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export function EnquiryModal({
  open,
  onOpenChange,
  propertyId,
  propertyTitle,
  ownerId,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  propertyId: string
  propertyTitle: string
  ownerId: string
}) {
  const { user, profile } = useAuth()
  const router = useRouter()
  const [message, setMessage] = useState("")
  const [phone, setPhone] = useState(profile?.phone || "")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async () => {
    if (!user) {
      toast.error("Please login to send enquiry")
      return
    }

    if (!message.trim()) {
      toast.error("Please enter a message")
      return
    }

    setLoading(true)
    const supabase = createClient()

    try {
      // Check for existing enquiry
      const { data: existing } = await (supabase.from("enquiries") as any)
        .select("id")
        .eq("property_id", propertyId)
        .eq("sender_id", user.id)
        .maybeSingle()

      if (existing) {
        toast.info("You already sent an enquiry for this property")
        router.push(`/buyer/chat/${existing.id}`)
        onOpenChange(false)
        return
      }

      // Create new enquiry
      const { data: enquiry, error } = await (supabase.from("enquiries") as any)
        .insert({
          property_id: propertyId,
          sender_id: user.id,
          receiver_id: ownerId,
          message: message.trim(),
          phone: phone || null,
          status: "new",
        })
        .select()
        .single()

      if (error) throw error

      setSuccess(true)
      toast.success("Enquiry sent successfully!")

      // Auto-navigate to chat after 1.5s
      setTimeout(() => {
        onOpenChange(false)
        router.push(`/buyer/chat/${enquiry.id}`)
      }, 1500)
    } catch (error: any) {
      toast.error(error.message || "Failed to send enquiry")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-2xl max-w-md">
        {success ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">Enquiry Sent!</h3>
            <p className="text-sm text-slate-500">Redirecting to chat...</p>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="font-black text-slate-900 text-lg">Send Enquiry</DialogTitle>
              <p className="text-sm text-slate-500">About: {propertyTitle}</p>
            </DialogHeader>

            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Your Name</Label>
                <Input
                  value={profile?.full_name || ""}
                  disabled
                  className="rounded-xl bg-slate-50"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Phone Number</Label>
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Message *</Label>
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="I'm interested in this property. Please share more details..."
                  className="rounded-xl min-h-[100px] resize-none"
                  maxLength={500}
                />
                <p className="text-xs text-slate-400 text-right">{message.length}/500</p>
              </div>

              <Button
                onClick={handleSubmit}
                disabled={loading || !message.trim()}
                className="w-full h-12 rounded-2xl font-bold bg-primary hover:bg-primary/90"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" /> Send Enquiry
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
