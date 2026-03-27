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

    // 1. Auth check
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { amount, currency = 'INR', propertyId, platformFee } = await req.json()

    if (!amount || !propertyId) {
      return NextResponse.json({ error: 'Amount and Property ID are required' }, { status: 400 })
    }

    if (amount <= 0) {
      return NextResponse.json({ error: 'Amount must be greater than 0' }, { status: 400 })
    }

    // 2. Validate property exists and is live
    const { data: property, error: propError } = await (supabase
      .from("properties") as any)
      .select("owner_id, status")
      .eq("id", propertyId)
      .single()

    if (propError || !property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 })
    }

    if (property.status !== 'live') {
      return NextResponse.json({ error: 'Property is not available for booking' }, { status: 400 })
    }

    // 3. Create Razorpay Order
    const options = {
      amount: Math.round(amount * 100), // convert to paisa
      currency,
      receipt: `rcpt_${Date.now()}`,
      payment_capture: 1
    }

    const order = await razorpay.orders.create(options)

    // 4. Create Pending Booking in Supabase
    const fee = platformFee || Math.round(amount * 0.02)
    const { data: booking, error: bookingError } = await (supabase.from('bookings') as any)
      .insert({
        property_id: propertyId,
        buyer_id: user.id,
        owner_id: property.owner_id,
        amount: amount,
        platform_fee: fee,
        total_amount: amount + fee,
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
