'use client'

export const dynamic = 'force-dynamic'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function SignUp() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name }
      }
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    // Send welcome email
    try {
      await fetch('/api/send-welcome', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name }),
      })
    } catch (err) {
      // Don't block signup if email fails
      console.error('Welcome email failed:', err)
    }

    setMessage('Check your email to confirm your account!')
    setLoading(false)
  }

  const handleGoogleSignUp = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
  }

  return (
    <div style={{minHeight: '100vh', background: '#f8f8f8', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px'}}>
      <div style={{background: '#fff', borderRadius: '16px', border: '1px solid #e5e5e5', padding: '40px', width: '100%', maxWidth: '420px'}}>
        
        {/* Logo */}
        <div style={{textAlign: 'center', marginBottom: '32px'}}>
          <div style={{fontSize: '28px', fontWeight: 700, color: '#006aff', letterSpacing: '-1px'}}>
            hom<span style={{color: '#1a1a1a'}}>agio</span>
          </div>
          <div style={{fontSize: '16px', fontWeight: 600, color: '#1a1a1a', marginTop: '8px'}}>Create your account</div>
          <div style={{fontSize: '14px', color: '#888', marginTop: '4px'}}>Start cataloging your home today</div>
        </div>

        {/* Google Button */}
        <button
          onClick={handleGoogleSignUp}
          style={{width: '100%', padding: '12px', borderRadius: '8px', border: '1.5px solid #e5e5e5', background: '#fff', fontSize: '15px', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '20px'}}
        >
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"/>
            <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2.04a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z"/>
            <path fill="#FBBC05" d="M4.5 10.48A4.8 4.8 0 0 1 4.5 7.5V5.43H1.83a8 8 0 0 0 0 7.14z"/>
            <path fill="#EA4335" d="M8.98 3.58c1.32 0 2.5.45 3.44 1.35l2.54-2.54A8 8 0 0 0 1.83 5.43L4.5 7.5a4.77 4.77 0 0 1 4.48-3.92z"/>
          </svg>
          Continue with Google
        </button>

        {/* Divider */}
        <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px'}}>
          <div style={{flex: 1, height: '1px', background: '#e5e5e5'}} />
          <span style={{fontSize: '13px', color: '#888'}}>or</span>
          <div style={{flex: 1, height: '1px', background: '#e5e5e5'}} />
        </div>

        {/* Form */}
        <form onSubmit={handleSignUp}>
          <div style={{marginBottom: '16px'}}>
            <label style={{display: 'block', fontSize: '14px', fontWeight: 500, color: '#333', marginBottom: '6px'}}>Full Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="John Smith"
              required
              style={{width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1.5px solid #e5e5e5', fontSize: '15px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box'}}
            />
          </div>

          <div style={{marginBottom: '16px'}}>
            <label style={{display: 'block', fontSize: '14px', fontWeight: 500, color: '#333', marginBottom: '6px'}}>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              style={{width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1.5px solid #e5e5e5', fontSize: '15px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box'}}
            />
          </div>

          <div style={{marginBottom: '24px'}}>
            <label style={{display: 'block', fontSize: '14px', fontWeight: 500, color: '#333', marginBottom: '6px'}}>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Min 8 characters"
              required
              minLength={8}
              style={{width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1.5px solid #e5e5e5', fontSize: '15px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box'}}
            />
          </div>

          {error && (
            <div style={{background: '#fee2e2', border: '1px solid #fecaca', borderRadius: '8px', padding: '10px 14px', fontSize: '14px', color: '#dc2626', marginBottom: '16px'}}>
              {error}
            </div>
          )}

          {message && (
            <div style={{background: '#dcfce7', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '10px 14px', fontSize: '14px', color: '#16a34a', marginBottom: '16px'}}>
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{width: '100%', padding: '12px', borderRadius: '8px', background: loading ? '#93c5fd' : '#006aff', color: '#fff', border: 'none', fontSize: '15px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit'}}
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div style={{textAlign: 'center', marginTop: '24px', fontSize: '14px', color: '#888'}}>
          Already have an account?{' '}
          <a href="/login" style={{color: '#006aff', fontWeight: 500, textDecoration: 'none'}}>Sign in</a>
        </div>

      </div>
    </div>
  )
}
