'use server'

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function requestVisit(propertyId: string, date: string, timeSlot: string, notes: string) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data: property } = await supabase
    .from("properties")
    .select("owner_id")
    .eq("id", propertyId)
    .single()

  if (!property) throw new Error("Property not found")

  const { data: visit, error } = await supabase
    .from("site_visits")
    .insert({
      property_id: propertyId,
      buyer_id: user.id,
      owner_id: property.owner_id,
      visit_date: date,
      time_slot: timeSlot,
      notes,
      status: "pending",
    })
    .select()
    .single()

  if (error) throw error
  return visit
}

export async function confirmVisit(visitId: string) {
  const supabase = createClient()
  const { error } = await supabase
    .from("site_visits")
    .update({ status: "confirmed" })
    .eq("id", visitId)

  if (error) throw error
  revalidatePath("/site-visits")
}

export async function cancelVisit(visitId: string) {
  const supabase = createClient()
  const { error } = await supabase
    .from("site_visits")
    .update({ status: "cancelled" })
    .eq("id", visitId)

  if (error) throw error
  revalidatePath("/site-visits")
}
