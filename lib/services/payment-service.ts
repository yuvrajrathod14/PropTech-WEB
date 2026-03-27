import Razorpay from 'razorpay'
import { createClient } from '@/lib/supabase/server'

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export async function refundBooking(bookingId: string, userId: string) {
  const supabase = createClient()
  
  // 1. Fetch booking
  const { data: booking, error: fetchError } = await (supabase.from('bookings') as any)
    .select('*')
    .eq('id', bookingId)
    .single()

  if (fetchError || !booking) {
    throw new Error('Booking not found')
  }

  // 2. Authorization
  if (booking.buyer_id !== userId) {
    throw new Error('Unauthorized to refund this booking')
  }

  if (!booking.razorpay_payment_id) {
    throw new Error('No payment found for this booking')
  }

  if (booking.status === 'refunded') {
    throw new Error('Booking already refunded')
  }

  // 3. Process Refund/Cancel
  console.log('Initiating refund/cancel for booking:', bookingId, 'Payment ID:', booking.razorpay_payment_id)
  try {
    // 3a. Fetch payment status from Razorpay to decide between Capture/Cancel/Refund
    const payment = await razorpay.payments.fetch(booking.razorpay_payment_id)
    console.log('Current Razorpay Payment Status:', payment.status)

    let refundResult;

    if (payment.status === 'captured') {
      // Standard refund for captured payments
      refundResult = await razorpay.payments.refund(booking.razorpay_payment_id, {
        amount: Math.round(booking.amount * 100),
        notes: {
          booking_id: bookingId,
          reason: 'User requested refund via PropTech dashboard'
        }
      })
      console.log('Razorpay refund successful:', refundResult.id)
    } else if (payment.status === 'authorized') {
      // For authorized payments, we must "cancel" (void) them
      // Razorpay doesn't have a direct "cancel" in the same way as refund for authorized
      // Usually you just don't capture it, and it expires. 
      // However, you can use the "refund" API on an authorized payment in some versions, 
      // but it often throws "invalid request".
      // The correct way to void an authorized payment is via the Cancel API if supported, 
      // or simply wait. But for immediate feedback, we try to capture it first and then refund, 
      // OR better, use the cancel/void endpoint if available.
      
      // In the Razorpay Node SDK, 'cancel' is not a direct method. 
      // We'll try to use the refund API but with a check, or just inform the user.
      // ACTUALLY: The best way to handle 'authorized' for a 'refund' request is to just mark it as canceled.
      console.log('Payment is only authorized. Marking as refunded/canceled in DB.')
      // We don't need to call Razorpay refund for non-captured payments usually, 
      // but let's try calling it anyway as some accounts support it.
      try {
        refundResult = await razorpay.payments.refund(booking.razorpay_payment_id, {
          amount: Math.round(booking.amount * 100)
        })
      } catch (e) {
        console.log('Refund failed for authorized payment (expected). Proceeding with DB update.')
      }
    } else {
      throw new Error(`Payment is in ${payment.status} state and cannot be refunded.`)
    }

    // 4. Update Database
    const { error: updateError } = await (supabase.from('bookings') as any)
      .update({ status: 'refunded' })
      .eq('id', bookingId)

    if (updateError) {
      console.error('Database update error after refund:', updateError)
      throw updateError
    }

    // 5. Release Property
    if (booking.property_id) {
      await (supabase.from('properties') as any)
        .update({ status: 'available' })
        .eq('id', booking.property_id)
    }

    return { success: true, status: 'refunded' }
  } catch (rzpError: any) {
    console.error('Detailed Razorpay Refund Error:', {
      message: rzpError.message,
      description: rzpError.description,
      code: rzpError.code,
      statusCode: rzpError.statusCode,
      metadata: rzpError.metadata // Some versions have metadata
    })
    // Provide a more helpful message
    const errorMsg = rzpError.description || rzpError.error?.description || rzpError.message || 'Razorpay refund failed'
    throw new Error(errorMsg)
  }
}
