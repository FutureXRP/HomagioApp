import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import MaterialDetailClient from './MaterialDetailClient'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: {
    id: string
    roomId: string
    materialId: string
  }
}

export default async function MaterialDetail({ params }: PageProps) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: material } = await supabase
    .from('materials')
    .select('*')
    .eq('id', params.materialId)
    .single()

  if (!material) notFound()

  return (
    <MaterialDetailClient
      material={material}
      homeId={params.id}
      roomId={params.roomId}
    />
  )
}
