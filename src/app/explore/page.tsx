import { createClient } from '@/lib/supabase/server'
import ExploreClient from './ExploreClient'

export const dynamic = 'force-dynamic'

export default async function ExplorePage() {
  const supabase = await createClient()

  const { data: homes } = await supabase
    .from('homes')
    .select(`
      id, name, address, city, state, zip,
      bedrooms, bathrooms, square_feet, year_built,
      photo_url, value_estimate, lat, lng
    `)
    .eq('is_public', true)
    .order('created_at', { ascending: false })

  return (
    <ExploreClient
      homes={homes || []}
      mapboxToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN!}
    />
  )
}
