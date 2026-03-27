import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const SUPPORTED_TYPES = ['school', 'hospital', 'subway_station', 'shopping_mall', 'transit_station', 'restaurant', 'bank', 'pharmacy']

export async function GET(req: Request) {
  try {
    const supabase = createClient()

    // 1. Auth check
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const location = searchParams.get('location') // lat,lng
    const lat = searchParams.get('lat')
    const lng = searchParams.get('lng')
    const type = searchParams.get('type') || 'transit_station'

    // Support both location=lat,lng and separate lat/lng params
    const locationStr = location || (lat && lng ? `${lat},${lng}` : null)

    if (!locationStr) {
      return NextResponse.json({ error: 'Location parameter is required (lat,lng)' }, { status: 400 })
    }

    // Use server-only key, fallback to public key
    const key = process.env.GOOGLE_MAPS_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY

    if (!key) {
      return NextResponse.json({ error: 'Maps API Key not configured' }, { status: 500 })
    }

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${encodeURIComponent(locationStr)}&radius=1500&type=${encodeURIComponent(type)}&key=${key}`
    )
    const data = await response.json()

    // Return top 5 results with structured data
    const results = (data.results || []).slice(0, 5).map((place: any) => ({
      name: place.name,
      rating: place.rating || null,
      vicinity: place.vicinity || '',
      distance_m: null, // Google doesn't return distance directly in nearby search
    }))

    return NextResponse.json({ results, type })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
