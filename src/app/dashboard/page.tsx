import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import DashboardClient from './DashboardClient'

export const dynamic = 'force-dynamic'

export default async function Dashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { count } = await supabase
    .from('homes')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)

  return <DashboardClient user={user} homesCount={count ?? 0} />
}
