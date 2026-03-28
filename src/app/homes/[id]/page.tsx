import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import HomeDetailClient from './HomeDetailClient'

export const dynamic = 'force-dynamic'

export default async function HomeDashboard({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: home } = await supabase
    .from('homes').select('*').eq('id', params.id).single()

  if (!home) notFound()

  const { data: rooms } = await supabase
    .from('rooms').select('*').eq('home_id', params.id).order('created_at', { ascending: true })

  const { data: materials } = await supabase
    .from('materials').select('*').eq('home_id', params.id).order('created_at', { ascending: false })

  return (
    <HomeDetailClient
      home={home}
      rooms={rooms || []}
      materials={materials || []}
      homeId={params.id}
    />
  )
}
