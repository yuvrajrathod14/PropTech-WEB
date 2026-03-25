import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  try {
    const supabase = createClient()
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      bookingId
    } = await req.json()

    // 1. Verify Signature
    const body = razorpay_order_id + "|" + razorpay_payment_id
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest('hex')

    const isAuthentic = expectedSignature === razorpay_signature

    if (isAuthentic) {
      // 2. Update Booking Status
      const { data: booking, error: bookingUpdateError } = await (supabase.from('bookings') as any)
        .update({ 
          status: 'confirmed', 
          razorpay_payment_id,
          updated_at: new Date().toISOString()
        })
        .eq('id', bookingId)
        .select()
        .single()

      if (bookingUpdateError) throw bookingUpdateError

      // 3. Mark Property as Booked
      if (booking?.property_id) {
        await (supabase.from('properties') as any)
          .update({ status: 'booked' })
          .eq('id', booking.property_id)
      }

      return NextResponse.json({ 
        verified: true, 
        success: true, 
        bookingId: booking.id,
        message: 'Payment verified and property booked' 
      })
    } else {
      // Mark booking as failed
      if (bookingId) {
        await (supabase.from('bookings') as any)
          .update({ status: 'failed' })
          .eq('id', bookingId)
      }
      return NextResponse.json({ verified: false, success: false, message: 'Payment verification failed' }, { status: 400 })
    }
  } catch (error: any) {
    console.error('Verification Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
