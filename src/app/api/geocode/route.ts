import { NextRequest, NextResponse } from 'next/server'

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const query = searchParams.get('q')
  const mode = searchParams.get('mode') || 'geocode' // 'geocode' or 'suggest'

  if (!query) {
    return NextResponse.json({ error: 'Missing query' }, { status: 400 })
  }

  if (!MAPBOX_TOKEN) {
    return NextResponse.json({ error: 'Mapbox token not configured' }, { status: 500 })
  }

  try {
    const encoded = encodeURIComponent(query)

    let url = ''
    if (mode === 'suggest') {
      // Autosuggest — returns address suggestions as user types
      url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encoded}.json?access_token=${MAPBOX_TOKEN}&autocomplete=true&country=US&types=address&limit=5`
    } else {
      // Full geocode — returns lat/lng for a complete address
      url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encoded}.json?access_token=${MAPBOX_TOKEN}&limit=1&country=US&types=address`
    }

    const res = await fetch(url)
    if (!res.ok) {
      return NextResponse.json({ error: 'Mapbox API error' }, { status: res.status })
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch (err) {
    console.error('Geocode API error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
