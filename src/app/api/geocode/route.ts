import { NextRequest, NextResponse } from 'next/server'

const MAPBOX_TOKEN = process.env.MAPBOX_TOKEN

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const query = searchParams.get('q')
  const mode = searchParams.get('mode') || 'geocode'

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
      url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encoded}.json?access_token=${MAPBOX_TOKEN}&autocomplete=true&country=US&types=address&limit=5`
    } else {
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
