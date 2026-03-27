'use server'

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function sendEnquiry(propertyId: string, message: string, purpose: string) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  // 1. Get owner_id from property
  const { data: property } = await (supabase.from("properties") as any)
    .select("owner_id, title")
    .eq("id", propertyId)
    .single()

  if (!property) throw new Error("Property not found")

  // 2. Create entry in enquiries table (for lead tracking)
  // According to schema, enquiries has sender_id and message
  const { data: enquiry, error: enquiryError } = await (supabase.from("enquiries") as any)
    .insert({
      property_id: propertyId,
      sender_id: user.id,
      message: message,
      // Removed purpose, status if they don't exist in DB
    })
    .select()
    .single()

  if (enquiryError) throw enquiryError

  // 3. Get or Create Conversation
  let { data: conversation } = await (supabase.from("conversations") as any)
    .select("id")
    .eq("property_id", propertyId)
    .eq("buyer_id", user.id)
    .maybeSingle()

  if (!conversation) {
    const { data: newConv, error: convError } = await (supabase.from("conversations") as any)
      .insert({
        property_id: propertyId,
        buyer_id: user.id,
        owner_id: property.owner_id,
        last_message: message,
      })
      .select()
      .single()
    
    if (convError) throw convError
    conversation = newConv
  } else {
    // Update last message
    await (supabase.from("conversations") as any)
      .update({ last_message: message, updated_at: new Date().toISOString() })
      .eq("id", conversation.id)
  }

  // 4. Send message in conversation
  const { error: msgError } = await (supabase.from("messages") as any).insert({
    conversation_id: conversation.id,
    sender_id: user.id,
    content: message,
  })

  if (msgError) throw msgError

  revalidatePath("/enquiries")
  revalidatePath("/buyer/chat")
  revalidatePath("/owner/chat")
  
  return enquiry
}

export async function getOrCreateEnquiry(propertyId: string) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: existing } = await (supabase.from("enquiries") as any)
    .select("*")
    .eq("property_id", propertyId)
    .eq("sender_id", user.id)
    .maybeSingle()

  return existing
}
