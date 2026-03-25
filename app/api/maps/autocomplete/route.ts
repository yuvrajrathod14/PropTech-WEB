import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const input = searchParams.get('input')
    const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY

    if (!key) {
      return NextResponse.json({ error: 'Maps API Key not configured' }, { status: 500 })
    }

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&key=${key}&components=country:in`
    )
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
