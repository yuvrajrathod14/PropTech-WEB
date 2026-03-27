'use server'

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function sendMessage(conversationId: string, content: string, mediaUrl?: string) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { error } = await (supabase.from("messages") as any).insert({
    conversation_id: conversationId,
    sender_id: user.id,
    content,
    // media_url removed if not in schema, content is the main field
  })

  if (error) throw error
  
  // Update conversation timestamp and last message
  await (supabase.from("conversations") as any)
    .update({ 
      last_message: content,
      updated_at: new Date().toISOString() 
    })
    .eq("id", conversationId)
  
  revalidatePath(`/buyer/chat`)
  revalidatePath(`/owner/chat`)
}

export async function markRead(conversationId: string) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  await (supabase.from("messages") as any)
    .update({ is_read: true })
    .eq("conversation_id", conversationId)
    .neq("sender_id", user.id)
    .eq("is_read", false)
}
