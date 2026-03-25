import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
// import { renderToStream } from '@react-pdf/renderer'
// Note: PDF generation often requires a component. 
// For now, I'll return the booking data formatted for receipt.

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient()
    const { data: booking, error } = await supabase
      .from('bookings')
      .select(`
        *,
        property:properties (title),
        buyer:profiles!bookings_buyer_id_fkey (full_name, email),
        owner:profiles!bookings_owner_id_fkey (full_name)
      `)
      .eq('id', params.id)
      .single()

    if (error || !booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    // In a real app, we'd render the PDF component to a stream here.
    // return new Response(stream, { headers: { 'Content-Type': 'application/pdf' } })
    
    return NextResponse.json({ 
      receipt_id: booking.id,
      amount: booking.amount,
      status: booking.status,
      property: booking.property?.title,
      buyer: booking.buyer?.full_name,
      date: booking.created_at
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
