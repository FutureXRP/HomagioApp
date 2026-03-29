import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import PublicRoomClient from './PublicRoomClient'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: { homeId: string; roomId: string }
}

export default async function PublicRoomPage({ params }: PageProps) {
  const supabase = await createClient()

  // Verify the home is public
  const { data: home } = await supabase
    .from('homes')
    .select('id, name, address, city, state, zip, photo_url')
    .eq('id', params.homeId)
    .eq('is_public', true)
    .single()

  if (!home) notFound()

  const { data: room } = await supabase
    .from('rooms')
    .select('*')
    .eq('id', params.roomId)
    .eq('home_id', params.homeId)
    .single()

  if (!room) notFound()

  const { data: materials } = await supabase
    .from('materials')
    .select('*')
    .eq('room_id', params.roomId)
    .order('created_at', { ascending: false })

  return (
    <PublicRoomClient
      home={home}
      room={room}
      materials={materials || []}
    />
  )
}
