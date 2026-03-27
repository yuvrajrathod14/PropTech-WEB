'use server'

import { createAdminClient } from "@/lib/supabase/admin"
import { revalidatePath } from "next/cache"

export async function approveListing(id: string, adminId: string) {
  const admin = createAdminClient()
  
  const { error: propertyError } = await (admin.from("properties") as any)
    .update({ status: 'live', rejection_reason: null })
    .eq('id', id)

  if (propertyError) throw propertyError

  const { error: logError } = await (admin.from("admin_audit_log") as any)
    .insert({
      admin_id: adminId,
      action: 'APPROVE_PROPERTY',
      target_type: 'property',
      target_id: id,
      details: { timestamp: new Date().toISOString() }
    })

  revalidatePath("/admin/properties")
}

export async function rejectListing(id: string, reason: string, adminId: string) {
  const admin = createAdminClient()
  
  const { error: propertyError } = await (admin.from("properties") as any)
    .update({ status: 'rejected', rejection_reason: reason })
    .eq('id', id)

  if (propertyError) throw propertyError

  const { error: logError } = await (admin.from("admin_audit_log") as any)
    .insert({
      admin_id: adminId,
      action: 'REJECT_PROPERTY',
      target_type: 'property',
      target_id: id,
      details: { reason, timestamp: new Date().toISOString() }
    })

  revalidatePath("/admin/properties")
}

export async function blockUser(id: string, adminId: string) {
  const admin = createAdminClient()
  
  const { error: userError } = await (admin.from("profiles") as any)
    .update({ is_blocked: true })
    .eq('id', id)

  if (userError) throw userError

  const { error: logError } = await (admin.from("admin_audit_log") as any)
    .insert({
      admin_id: adminId,
      action: 'BLOCK_USER',
      target_type: 'profile',
      target_id: id,
      details: { timestamp: new Date().toISOString() }
    })

  revalidatePath("/admin/users")
}

export async function toggleFeatureProperty(id: string, featured: boolean, adminId: string) {
  const admin = createAdminClient()
  
  const { error: propertyError } = await (admin.from("properties") as any)
    .update({ 
      is_featured: featured,
      // Removed feature_end_date if it doesn't exist in DB
    })
    .eq('id', id)

  if (propertyError) throw propertyError

  const { error: logError } = await (admin.from("admin_audit_log") as any)
    .insert({
      admin_id: adminId,
      action: featured ? 'FEATURE_PROPERTY' : 'UNFEATURE_PROPERTY',
      target_type: 'property',
      target_id: id,
      details: { timestamp: new Date().toISOString() }
    })

  revalidatePath("/admin/properties")
  revalidatePath("/")
}
