import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(req: Request) {
  try {
    const supabase = createClient()

    // 1. Auth check — prevent API key exposure to unauthenticated users
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const input = searchParams.get('input') || searchParams.get('q')
    
    if (!input || input.trim().length === 0) {
      return NextResponse.json({ predictions: [] })
    }

    // Use server-only key, fallback to public key
    const key = process.env.GOOGLE_MAPS_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY

    if (!key) {
      return NextResponse.json({ error: 'Maps API Key not configured' }, { status: 500 })
    }

    const type = searchParams.get('type') || 'geocode'

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${key}&components=country:in&types=${type}`
    )
    const data = await response.json()

    // Return structured predictions
    const predictions = (data.predictions || []).map((p: any) => ({
      place_id: p.place_id,
      description: p.description,
      main_text: p.structured_formatting?.main_text || '',
      secondary_text: p.structured_formatting?.secondary_text || '',
    }))

    return NextResponse.json({ predictions })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
