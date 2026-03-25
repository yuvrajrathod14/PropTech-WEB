import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const location = searchParams.get('location') // lat,lng
    const type = searchParams.get('type') || 'transit_station'
    const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY

    if (!key) {
      return NextResponse.json({ error: 'Maps API Key not configured' }, { status: 500 })
    }

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location}&radius=1500&type=${type}&key=${key}`
    )
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
