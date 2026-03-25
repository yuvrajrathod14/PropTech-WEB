'use server'

import { createAdminClient } from "@/lib/supabase/admin"
import { revalidatePath } from "next/cache"

export async function approveListing(id: string, adminId: string) {
  const admin = createAdminClient()
  
  const { error } = await admin
    .from("properties")
    .update({ status: "approved", rejection_reason: null })
    .eq("id", id)

  if (error) throw error

  await admin.from("admin_audit_logs").insert({
    admin_id: adminId,
    action: "approve_listing",
    entity_type: "property",
    entity_id: id,
    details: { timestamp: new Date().toISOString() },
  })

  revalidatePath("/admin/properties")
}

export async function rejectListing(id: string, reason: string, adminId: string) {
  const admin = createAdminClient()
  
  const { error } = await admin
    .from("properties")
    .update({ status: "rejected", rejection_reason: reason })
    .eq("id", id)

  if (error) throw error

  await admin.from("admin_audit_logs").insert({
    admin_id: adminId,
    action: "reject_listing",
    entity_type: "property",
    entity_id: id,
    details: { reason, timestamp: new Date().toISOString() },
  })

  revalidatePath("/admin/properties")
}

export async function blockUser(id: string, adminId: string) {
  const admin = createAdminClient()
  
  const { error } = await admin
    .from("profiles")
    .update({ is_blocked: true })
    .eq("id", id)

  if (error) throw error

  await admin.from("admin_audit_logs").insert({
    admin_id: adminId,
    action: "block_user",
    entity_type: "profile",
    entity_id: id,
    details: { timestamp: new Date().toISOString() },
  })

  revalidatePath("/admin/users")
}

export async function toggleFeatured(id: string, days: number) {
  const admin = createAdminClient()
  const endDate = new Date()
  endDate.setDate(endDate.getDate() + days)

  const { error } = await admin
    .from("properties")
    .update({ 
      is_featured: true, 
      feature_end_date: endDate.toISOString() 
    })
    .eq("id", id)

  if (error) throw error
  revalidatePath("/")
}
