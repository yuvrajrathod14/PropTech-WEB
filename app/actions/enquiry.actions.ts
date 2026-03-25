'use server'

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function sendEnquiry(propertyId: string, message: string, purpose: string) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  // Get owner_id
  const { data: property } = await supabase
    .from("properties")
    .select("owner_id")
    .eq("id", propertyId)
    .single()

  if (!property) throw new Error("Property not found")

  // Create enquiry
  const { data: enquiry, error } = await supabase
    .from("enquiries")
    .insert({
      property_id: propertyId,
      buyer_id: user.id,
      owner_id: property.owner_id,
      purpose: purpose as any,
      status: "open",
    })
    .select()
    .single()

  if (error) throw error

  // Send first message
  await supabase.from("chat_messages").insert({
    enquiry_id: enquiry.id,
    sender_id: user.id,
    message,
  })

  revalidatePath("/enquiries")
  return enquiry
}

export async function getOrCreateEnquiry(propertyId: string) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: existing } = await supabase
    .from("enquiries")
    .select("*")
    .eq("property_id", propertyId)
    .eq("buyer_id", user.id)
    .single()

  return existing
}
