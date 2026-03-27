'use server'

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function createDraft(data: any) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data: property, error } = await (supabase.from("properties") as any)
    .insert({
      owner_id: user.id,
      title: data.title || "Untitled Preview",
      price: data.price || 0,
      type: data.type || "buy",
      category: data.category || "Apartment",
      city: data.city || "Unknown",
      status: "draft",
    })
    .select()
    .single()

  if (error) throw error
  return property
}

export async function updateDraft(id: string, data: any) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { error } = await (supabase.from("properties") as any)
    .update(data)
    .eq("id", id)
    .eq("owner_id", user.id)

  if (error) throw error
  revalidatePath(`/property/${id}`)
}

export async function submitListing(id: string) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  // Verification logic could go here
  const { error } = await (supabase.from("properties") as any)
    .update({ status: "pending" })
    .eq("id", id)
    .eq("owner_id", user.id)

  if (error) throw error
  revalidatePath("/dashboard")
}

export async function deleteListing(id: string) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { error } = await (supabase.from("properties") as any)
    .delete()
    .eq("id", id)
    .eq("owner_id", user.id)

  if (error) throw error
  revalidatePath("/dashboard")
}

export async function incrementViewCount(propertyId: string) {
  const supabase = createClient()
  // RPC or simple update (RPC is better for atomicity)
  const { error } = await (supabase as any).rpc("increment_view_count", { property_id: propertyId })
  
  if (error) {
    // Fallback if RPC not defined
    const { data: p } = await (supabase.from("properties") as any).select("view_count").eq("id", propertyId).single()
    await (supabase.from("properties") as any).update({ view_count: ((p as any)?.view_count || 0) + 1 }).eq("id", propertyId)
  }
}
