import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import PublicMaterialClient from './PublicMaterialClient'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: { homeId: string; roomId: string; materialId: string }
}

export default async function PublicMaterialPage({ params }: PageProps) {
  const supabase = await createClient()

  // Verify the home is public
  const { data: home } = await supabase
    .from('homes')
    .select('id, name, address, city, state, zip')
    .eq('id', params.homeId)
    .eq('is_public', true)
    .single()

  if (!home) notFound()

  const { data: room } = await supabase
    .from('rooms')
    .select('id, name, type')
    .eq('id', params.roomId)
    .eq('home_id', params.homeId)
    .single()

  if (!room) notFound()

  const { data: material } = await supabase
    .from('materials')
    .select('*')
    .eq('id', params.materialId)
    .eq('room_id', params.roomId)
    .single()

  if (!material) notFound()

  return (
    <PublicMaterialClient
      home={home}
      room={room}
      material={material}
    />
  )
}
