'use client'

import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function LoadingPage() {
  useEffect(() => {
    let attempts = 0
    const maxAttempts = 20 // try for up to 10 seconds

    const checkSession = async () => {
      attempts++
      const { data: { session } } = await supabase.auth.getSession()

      if (session?.user) {
        // Session ready — go to dashboard
        window.location.href = '/dashboard'
        return
      }

      if (attempts >= maxAttempts) {
        // Gave up — send to login
        window.location.href = '/login'
        return
      }

      // Try again in 500ms
      setTimeout(checkSession, 500)
    }

    // Also listen for auth state change
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          window.location.href = '/dashboard'
        }
      }
    )

    // Start checking
    checkSession()

    return () => subscription.unsubscribe()
  }, [])

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f8f8f8',
      gap: '16px'
    }}>
      <div style={{fontSize: '32px', fontWeight: 700, color: '#006aff', letterSpacing: '-1px'}}>
        hom<span style={{color: '#1a1a1a'}}>agio</span>
      </div>
      <div style={{
        width: '40px',
        height: '40px',
        border: '3px solid #e5e5e5',
        borderTop: '3px solid #006aff',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite'
      }} />
      <div style={{fontSize: '14px', color: '#888'}}>Signing you in...</div>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
