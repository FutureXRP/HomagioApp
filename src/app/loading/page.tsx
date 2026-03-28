import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function LoadingPage() {
  // Middleware now handles all auth checks.
  // This page just forwards to dashboard.
  redirect('/dashboard')
}
