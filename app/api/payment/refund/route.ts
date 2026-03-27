import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { refundBooking } from '@/lib/services/payment-service'

export async function POST(req: Request) {
  try {
    const supabase = createClient()
    
    // 1. Auth check
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { bookingId, reason } = await req.json()

    if (!bookingId) {
      return NextResponse.json({ error: 'Booking ID is required' }, { status: 400 })
    }

    // 2. Fetch booking to check authorization
    const { data: booking, error: fetchError } = await (supabase.from('bookings') as any)
      .select('buyer_id')
      .eq('id', bookingId)
      .single()

    if (fetchError || !booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    // 3. Check if user is the buyer OR an admin
    const { data: profile } = await (supabase
      .from('profiles') as any)
      .select('role')
      .eq('id', user.id)
      .single()

    const isAdmin = profile?.role === 'admin'
    const isBuyer = booking.buyer_id === user.id

    if (!isAdmin && !isBuyer) {
      return NextResponse.json({ error: 'Forbidden: You are not authorized to refund this booking' }, { status: 403 })
    }

    // 4. Process refund
    const result = await refundBooking(bookingId, booking.buyer_id)

    // 5. If admin-initiated, log to audit
    if (isAdmin) {
      await (supabase.from('admin_audit_log') as any).insert({
        admin_id: user.id,
        action: 'refund_booking',
        target_id: bookingId,
        details: { reason: reason || 'Admin initiated refund', amount: booking.amount }
      }).catch(() => {/* audit log failure is non-critical */})

      // Notify buyer
      await (supabase.from('notifications') as any).insert({
        user_id: booking.buyer_id,
        type: 'refund',
        title: 'Refund Initiated',
        message: `Your refund has been initiated by admin.${reason ? ` Reason: ${reason}` : ''}`,
      }).catch(() => {/* notification failure is non-critical */})
    }

    return NextResponse.json(result)
  } catch (error: any) {
    console.error('Refund API Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
