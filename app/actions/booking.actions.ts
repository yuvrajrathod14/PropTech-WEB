'use server'

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { refundBooking } from "@/lib/services/payment-service"

export async function createBooking(propertyId: string, amount: number) {
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

  const { data: booking, error } = await (supabase.from("bookings") as any)
    .insert({
      property_id: propertyId,
      buyer_id: user.id,
      amount,
      platform_fee: Math.round(amount * 0.02),
      total_amount: Math.round(amount * 1.02),
      status: "pending",
      razorpay_order_id: "", // Filled after order creation
    })
    .select()
    .single()

  if (error) throw error
  return booking
}

export async function updateBookingStatus(id: string, status: string, razorpayData: any) {
  const supabase = createClient()
  const { error } = await (supabase.from("bookings") as any)
    .update({
      status: status as any,
      razorpay_payment_id: razorpayData.razorpay_payment_id,
      razorpay_signature: razorpayData.razorpay_signature,
    })
    .eq("id", id)

  if (error) throw error
  revalidatePath("/bookings")
}

export async function processRefund(bookingId: string) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  try {
    const result = await refundBooking(bookingId, user.id)
    
    revalidatePath("/buyer/bookings")
    revalidatePath("/buyer/home")
    return { success: true, result }
  } catch (error: any) {
    console.error("Refund Action Error:", error)
    throw error
  }
}
