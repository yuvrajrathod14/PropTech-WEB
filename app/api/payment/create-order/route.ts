import { NextResponse } from 'next/server'
import Razorpay from 'razorpay'
import { createClient } from '@/lib/supabase/server'

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export async function POST(req: Request) {
  try {
    const supabase = createClient()
    const { amount, currency = 'INR', propertyId, userId } = await req.json()

    if (!amount || !propertyId) {
      return NextResponse.json({ error: 'Amount and Property ID are required' }, { status: 400 })
    }

    // 1. Create Razorpay Order
    const options = {
      amount: Math.round(amount * 100), // convert to paisa
      currency,
      receipt: `rcpt_${Date.now()}`,
    }

    const order = await razorpay.orders.create(options)

    // 2. Create Pending Booking in Supabase
    const { data: booking, error: bookingError } = await (supabase.from('bookings') as any)
      .insert({
        property_id: propertyId,
        user_id: userId || (await supabase.auth.getUser()).data.user?.id,
        amount: amount,
        status: 'pending',
        razorpay_order_id: order.id
      })
      .select()
      .single()

    if (bookingError) throw bookingError

    return NextResponse.json({
      orderId: order.id,
      bookingId: booking.id,
      amount: order.amount
    })
  } catch (error: any) {
    console.error('Razorpay Order Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
