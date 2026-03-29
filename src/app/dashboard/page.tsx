import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import DashboardClient from './DashboardClient'

export const dynamic = 'force-dynamic'

export default async function Dashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Fetch homes
  const { data: homes } = await supabase
    .from('homes')
    .select('id, name, address, city, state, zip, bedrooms, bathrooms, square_feet, year_built, photo_url, is_public')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  // Fetch stats
  const { count: roomsCount } = await supabase
    .from('rooms')
    .select('*', { count: 'exact', head: true })
    .in('home_id', (homes || []).map(h => h.id))

  const { data: materials } = await supabase
    .from('materials')
    .select('id, name, brand, color, finish, cost, photo_url, room_id, home_id, created_at')
    .in('home_id', (homes || []).map(h => h.id))
    .order('created_at', { ascending: false })
    .limit(50)

  const totalValue = (materials || []).reduce((sum, m) => sum + (m.cost || 0), 0)
  const recentMaterials = (materials || []).slice(0, 4)

  return (
    <DashboardClient
      user={user}
      homes={homes || []}
      homesCount={homes?.length ?? 0}
      roomsCount={roomsCount ?? 0}
      materialsCount={materials?.length ?? 0}
      totalValue={totalValue}
      recentMaterials={recentMaterials}
    />
  )
}
