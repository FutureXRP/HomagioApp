import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import RoomDetailClient from './RoomDetailClient'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: { id: string; roomId: string }
}

export default async function RoomDetail({ params }: PageProps) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: room } = await supabase
    .from('rooms').select('*').eq('id', params.roomId).single()

  if (!room) notFound()

  const { data: materials } = await supabase
    .from('materials')
    .select('*')
    .eq('room_id', params.roomId)
    .order('created_at', { ascending: false })

  return (
    <RoomDetailClient
      room={room}
      materials={materials || []}
      homeId={params.id}
      roomId={params.roomId}
    />
  )
}
