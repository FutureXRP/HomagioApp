'use client'

export const dynamic = 'force-dynamic'

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function LoadingPage() {
  useEffect(() => {
    const supabase = createClient()

    // Wait for the session to be confirmed stored in the browser,
    // then forward to dashboard. This page exists specifically to
    // give Supabase time to write cookies before Next.js prefetches
    // the dashboard — skipping this causes a race condition.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        window.location.replace('/dashboard')
      } else if (event === 'INITIAL_SESSION' && !session) {
        // No session at all — send back to login
        window.location.replace('/login')
      }
    })

    // Safety fallback — if nothing happens in 5 seconds, go to login
    const timeout = setTimeout(() => {
      window.location.replace('/login')
    }, 5000)

    return () => {
      subscription.unsubscribe()
      clearTimeout(timeout)
    }
  }, [])

  return (
    <div style={{minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f7f9fc', gap: '16px', fontFamily: 'system-ui, sans-serif'}}>
      <div style={{fontSize: '24px', fontWeight: 700, color: '#006aff', letterSpacing: '-0.5px'}}>
        hom<span style={{color: '#1a1a2e'}}>agio</span>
      </div>
      <div style={{width: '32px', height: '32px', border: '2.5px solid #e9edf2', borderTop: '2.5px solid #006aff', borderRadius: '50%', animation: 'spin 0.8s linear infinite'}} />
      <style>{`@keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}`}</style>
    </div>
  )
}
