import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import PublicHomeClient from './PublicHomeClient'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: { homeId: string }
}

export default async function PublicHomePage({ params }: PageProps) {
  const supabase = await createClient()

  const { data: home } = await supabase
    .from('homes')
    .select('*')
    .eq('id', params.homeId)
    .eq('is_public', true)
    .single()

  if (!home) notFound()

  const { data: rooms } = await supabase
    .from('rooms')
    .select('*')
    .eq('home_id', params.homeId)
    .order('created_at', { ascending: true })

  const { data: materials } = await supabase
    .from('materials')
    .select('*')
    .eq('home_id', params.homeId)
    .order('created_at', { ascending: false })

  return (
    <PublicHomeClient
      home={home}
      rooms={rooms || []}
      materials={materials || []}
    />
  )
}
