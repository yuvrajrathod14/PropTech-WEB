import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  try {
    const supabase = createClient()

    // 1. Auth check
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      bookingId
    } = await req.json()

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !bookingId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // 2. Verify Signature using timingSafeEqual
    const body = razorpay_order_id + "|" + razorpay_payment_id
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest('hex')

    const isAuthentic = crypto.timingSafeEqual(
      Buffer.from(expectedSignature, 'hex'),
      Buffer.from(razorpay_signature, 'hex')
    )

    if (isAuthentic) {
      // 3. Update Booking Status
      const { data: booking, error: bookingUpdateError } = await (supabase.from('bookings') as any)
        .update({ 
          status: 'confirmed', 
          razorpay_payment_id,
          razorpay_signature,
        })
        .eq('id', bookingId)
        .select()
        .single()

      if (bookingUpdateError) throw bookingUpdateError

      // 4. Mark Property as Booked
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
    // Handle signature length mismatch gracefully
    if (error.code === 'ERR_CRYPTO_TIMING_SAFE_EQUAL_LENGTH') {
      return NextResponse.json({ verified: false, success: false, message: 'Invalid signature format' }, { status: 400 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
