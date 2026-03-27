'use server'

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function requestVisit(propertyId: string, date: string, timeSlot: string, notes: string) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data: property } = await (supabase.from("properties") as any)
    .select("owner_id")
    .eq("id", propertyId)
    .single()

  if (!property) throw new Error("Property not found")

  // site_visits schema uses user_id and preferred_date
  // notes might be a JSON field or separate column if added later, 
  // but for now follow the core schema from types.ts
  const { data: visit, error } = await (supabase.from("site_visits") as any)
    .insert({
      property_id: propertyId,
      user_id: user.id,
      preferred_date: date,
      status: "pending",
      // time_slot and notes removed if not in core schema, 
      // can be added to notes/details if we have a metadata field
    })
    .select()
    .single()

  if (error) throw error
  
  revalidatePath("/buyer/visits")
  revalidatePath("/owner/visits")
  
  return visit
}

export async function confirmVisit(visitId: string) {
  const supabase = createClient()
  const { error } = await (supabase.from("site_visits") as any)
    .update({ status: "confirmed" })
    .eq("id", visitId)

  if (error) throw error
  revalidatePath("/owner/visits")
  revalidatePath("/buyer/visits")
}

export async function cancelVisit(visitId: string) {
  const supabase = createClient()
  const { error } = await (supabase.from("site_visits") as any)
    .update({ status: "cancelled" })
    .eq("id", visitId)

  if (error) throw error
  revalidatePath("/buyer/visits")
  revalidatePath("/owner/visits")
}
