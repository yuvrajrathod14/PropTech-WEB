'use server'

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function sendMessage(enquiryId: string, message: string, mediaUrl?: string) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { error } = await supabase.from("chat_messages").insert({
    enquiry_id: enquiryId,
    sender_id: user.id,
    message,
    media_url: mediaUrl || null,
  })

  if (error) throw error
  
  // Update enquiry timestamp
  await supabase.from("enquiries").update({ updated_at: new Date().toISOString() }).eq("id", enquiryId)
  
  revalidatePath(`/chat/${enquiryId}`)
}

export async function markRead(enquiryId: string) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  await supabase
    .from("chat_messages")
    .update({ is_read: true })
    .eq("enquiry_id", enquiryId)
    .neq("sender_id", user.id)
    .eq("is_read", false)
}
