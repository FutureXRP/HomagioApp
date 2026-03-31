import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import BudgetLandingClient from './BudgetLandingClient'

export const dynamic = 'force-dynamic'

export default async function BudgetPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: homes } = await supabase
    .from('homes')
    .select('id, name, address, city, state, photo_url')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  // No homes — send to add home
  if (!homes || homes.length === 0) {
    redirect('/homes/add')
  }

  // Exactly one home — go straight to its budget
  if (homes.length === 1) {
    redirect(`/homes/${homes[0].id}/budget`)
  }

  // Multiple homes — show picker
  return <BudgetLandingClient homes={homes} />
}