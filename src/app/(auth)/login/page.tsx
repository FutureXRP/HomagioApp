'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) { setError(error.message); setLoading(false); return }
      if (data.session) { window.location.href = '/dashboard' }
    } catch (err) {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: 'https://homagio-app.vercel.app/auth/callback' }
    })
  }

  const handleForgotPassword = async () => {
    if (!email) { setError('Enter your email address first'); return }
    const supabase = createClient()
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'https://homagio-app.vercel.app/reset-password'
    })
    alert('Password reset email sent!')
  }

  return (
    <div style={{minHeight: '100vh', background: '#f8f8f8', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px'}}>
      <div style={{background: '#fff', borderRadius: '16px', border: '1px solid #e5e5e5', padding: '40px', width: '100%', maxWidth: '420px'}}>
        <div style={{textAlign: 'center', marginBottom: '32px'}}>
          <a href="/" style={{textDecoration: 'none'}}>
            <div style={{fontSize: '28px', fontWeight: 700, color: '#006aff', letterSpacing: '-1px'}}>hom<span style={{color: '#1a1a1a'}}>agio</span></div>
          </a>
          <div style={{fontSize: '16px', fontWeight: 600, color: '#1a1a1a', marginTop: '8px'}}>Welcome back</div>
          <div style={{fontSize: '14px', color: '#888', marginTop: '4px'}}>Sign in to your account</div>
        </div>

        <button onClick={handleGoogleLogin} style={{width: '100%', padding: '12px', borderRadius: '8px', border: '1.5px solid #e5e5e5', background: '#fff', fontSize: '15px', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '20px'}}>
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"/>
            <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2.04a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z"/>
            <path fill="#FBBC05" d="M4.5 10.48A4.8 4.8 0 0 1 4.5 7.5V5.43H1.83a8 8 0 0 0 0 7.14z"/>
            <path fill="#EA4335" d="M8.98 3.58c1.32 0 2.5.45 3.44 1.35l2.54-2.54A8 8 0 0 0 1.83 5.43L4.5 7.5a4.77 4.77 0 0 1 4.48-3.92z"/>
          </svg>
          Continue with Google
        </button>

        <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px'}}>
          <div style={{flex: 1, height: '1px', background: '#e5e5e5'}} />
          <span style={{fontSize: '13px', color: '#888'}}>or</span>
          <div style={{flex: 1, height: '1px', background: '#e5e5e5'}} />
        </div>

        <form onSubmit={handleLogin}>
          <div style={{marginBottom: '16px'}}>
            <label style={{display: 'block', fontSize: '14px', fontWeight: 500, color: '#333', marginBottom: '6px'}}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required style={{width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1.5px solid #e5e5e5', fontSize: '15px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box'}} />
          </div>
          <div style={{marginBottom: '8px'}}>
            <label style={{display: 'block', fontSize: '14px', fontWeight: 500, color: '#333', marginBottom: '6px'}}>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Your password" required style={{width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1.5px solid #e5e5e5', fontSize: '15px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box'}} />
          </div>
          <div style={{textAlign: 'right', marginBottom: '24px'}}>
            <button type="button" onClick={handleForgotPassword} style={{background: 'none', border: 'none', color: '#006aff', fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit'}}>Forgot password?</button>
          </div>
          {error && <div style={{background: '#fee2e2', border: '1px solid #fecaca', borderRadius: '8px', padding: '10px 14px', fontSize: '14px', color: '#dc2626', marginBottom: '16px'}}>{error}</div>}
          <button type="submit" disabled={loading} style={{width: '100%', padding: '12px', borderRadius: '8px', background: loading ? '#93c5fd' : '#006aff', color: '#fff', border: 'none', fontSize: '15px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit'}}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div style={{textAlign: 'center', marginTop: '24px', fontSize: '14px', color: '#888'}}>
          Don't have an account?{' '}
          <a href="/signup" style={{color: '#006aff', fontWeight: 500, textDecoration: 'none'}}>Create one free</a>
        </div>
      </div>
    </div>
  )
}
