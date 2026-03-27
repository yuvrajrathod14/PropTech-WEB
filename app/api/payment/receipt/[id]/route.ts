import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient()

    // 1. Auth check
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 2. Fetch booking with joins
    const { data: booking, error } = await (supabase.from('bookings') as any)
      .select(`
        *,
        property:property_id (
          title,
          locality,
          city,
          type,
          owner_id
        )
      `)
      .eq('id', params.id)
      .single()

    if (error || !booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    // 3. Authorization: must be buyer of this booking OR admin
    const { data: profile } = await (supabase
      .from('profiles') as any)
      .select('role, full_name, email, phone')
      .eq('id', user.id)
      .single()

    const isAdmin = profile?.role === 'admin'
    const isBuyer = booking.buyer_id === user.id

    if (!isAdmin && !isBuyer) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // 4. Fetch buyer profile if admin is viewing
    let buyerProfile = profile
    if (isAdmin && !isBuyer) {
      const { data: bp } = await (supabase
        .from('profiles') as any)
        .select('full_name, email, phone')
        .eq('id', booking.buyer_id)
        .single()
      buyerProfile = bp
    }

    // 5. Fetch owner profile
    const { data: ownerProfile } = await (supabase
      .from('profiles') as any)
      .select('full_name')
      .eq('id', booking.property?.owner_id)
      .single()

    // 6. Return formatted receipt
    return NextResponse.json({
      receipt: {
        receipt_id: `PROPTECH-${booking.id.slice(0, 8).toUpperCase()}`,
        booking_id: booking.id,
        date: booking.created_at,
        status: booking.status,
        
        property: {
          title: booking.property?.title || 'N/A',
          locality: booking.property?.locality || '',
          city: booking.property?.city || '',
          type: booking.property?.type || '',
        },
        
        buyer: {
          name: buyerProfile?.full_name || 'N/A',
          email: buyerProfile?.email || '',
          phone: buyerProfile?.phone || '',
        },
        
        owner: {
          name: ownerProfile?.full_name || 'N/A',
        },
        
        payment: {
          token_amount: booking.amount || 0,
          platform_fee: booking.platform_fee || 0,
          total_amount: booking.total_amount || (booking.amount + (booking.platform_fee || 0)),
          razorpay_payment_id: booking.razorpay_payment_id || '',
          razorpay_order_id: booking.razorpay_order_id || '',
        }
      }
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
