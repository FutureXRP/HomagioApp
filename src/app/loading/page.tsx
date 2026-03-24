'use client'

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function LoadingPage() {
  useEffect(() => {
    const supabase = createClient()
    let attempts = 0
    const maxAttempts = 20

    const checkSession = async () => {
      attempts++
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) { window.location.href = '/dashboard'; return }
      if (attempts >= maxAttempts) { window.location.href = '/login'; return }
      setTimeout(checkSession, 500)
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) { window.location.href = '/dashboard' }
    })

    checkSession()
    return () => subscription.unsubscribe()
  }, [])

  return (
    <div style={{minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f8f8f8', gap: '16px'}}>
      <div style={{fontSize: '32px', fontWeight: 700, color: '#006aff', letterSpacing: '-1px'}}>hom<span style={{color: '#1a1a1a'}}>agio</span></div>
      <div style={{width: '40px', height: '40px', border: '3px solid #e5e5e5', borderTop: '3px solid #006aff', borderRadius: '50%', animation: 'spin 0.8s linear infinite'}} />
      <div style={{fontSize: '14px', color: '#888'}}>Signing you in...</div>
      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
