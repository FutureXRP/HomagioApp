import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import BudgetClient from './BudgetClient'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: { id: string }
}

export default async function BudgetPage({ params }: PageProps) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: home } = await supabase
    .from('homes')
    .select('*')
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single()

  if (!home) notFound()

  const { data: rooms } = await supabase
    .from('rooms')
    .select('id, name, type')
    .eq('home_id', params.id)
    .order('created_at', { ascending: true })

  const { data: budgetProjects } = await supabase
    .from('budget_projects')
    .select('*')
    .eq('home_id', params.id)
    .order('created_at', { ascending: true })

  const { data: budgets } = await supabase
    .from('budgets')
    .select('*')
    .eq('home_id', params.id)
    .order('created_at', { ascending: true })

  return (
    <BudgetClient
      home={home}
      rooms={rooms || []}
      budgetProjects={budgetProjects || []}
      budgets={budgets || []}
      homeId={params.id}
    />
  )
}