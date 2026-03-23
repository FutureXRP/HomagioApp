'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/dashboard')
    }
  }

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/dashboard` }
    })
  }

  const handleForgotPassword = async () => {
    if (!email) { setError('Enter your email address first'); return }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    })
    if (error) { setError(error.message) } else { alert('Password reset email sent!') }
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
          <svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"/><path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2.04a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z"/><path fill="#FBBC05" d="M4.5 10.48A4.8 4.8 0 0 1 4.5 7.5V5.43H1.83a8 8 0 0 0 0 7.14z"/><path fill="#EA4335" d="M8.98 3.58c1.32 0 2.5.45 3.44 1.35l2.54-2.54A8 8 0 0 0 1.83 5.43L4.5 7.5a4.77 4.77 0 0 1 4.48-3.92z"/></svg>
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
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required style={{width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1.5px solid #e5e5e5', fontSize: '15px', outline: 'none', fontFamily: 'inherit'}} />
          </div>
          <div style={{marginBottom: '8px'}}>
            <label style={{display: 'block', fontSize: '14px', fontWeight: 500, color: '#333', marginBottom: '6px'}}>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Your password" required style={{width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1.5px solid #e5e5e5', fontSize: '15px', outline: 'none', fontFamily: 'inherit'}} />
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
}          </a>
        ))}
      </div>

      {/* FEATURED HOMES */}
      <div style={{padding: '56px 32px', maxWidth: '1200px', margin: '0 auto'}}>
        <div style={{display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '32px'}}>
          <div>
            <h2 style={{fontSize: '28px', fontWeight: 700, letterSpacing: '-0.5px'}}>Homes people are cataloging near you</h2>
            <p style={{fontSize: '15px', color: '#666', marginTop: '6px'}}>Real homes. Real materials. Real inspiration.</p>
          </div>
          <a href="#" style={{fontSize: '14px', color: '#006aff', fontWeight: 500, textDecoration: 'none'}}>View all →</a>
        </div>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px'}}>
          {[
            {img: 'photo-1568605114967-8130f3a36994', price: '$648,000', est: '$641k–$655k', addr: '2847 Elmwood Drive', city: 'Nashville, TN 37215', beds: 4, baths: 3, sqft: '2,840', materials: 142},
            {img: 'photo-1570129477492-45c003edd2be', price: '$512,500', est: '$505k–$521k', addr: '1140 Sycamore Lane', city: 'Franklin, TN 37064', beds: 3, baths: 2, sqft: '2,210', materials: 89},
            {img: 'photo-1625602812206-5ec545ca1231', price: '$892,000', est: '$878k–$908k', addr: '904 Riverside Blvd', city: 'Brentwood, TN 37027', beds: 5, baths: 4, sqft: '4,100', materials: 218},
          ].map(home => (
            <div key={home.addr} style={{borderRadius: '12px', overflow: 'hidden', border: '1px solid #e5e5e5', background: '#fff', cursor: 'pointer'}}>
              <div style={{width: '100%', height: '200px', backgroundImage: `url(https://images.unsplash.com/${home.img}?w=600&q=75)`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative'}}>
                <div style={{position: 'absolute', top: '12px', left: '12px', background: '#006aff', color: '#fff', fontSize: '11px', fontWeight: 600, padding: '4px 10px', borderRadius: '6px'}}>AI Tagged</div>
                <div style={{position: 'absolute', top: '12px', right: '12px', background: '#fff', borderRadius: '50%', width: '34px', height: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', cursor: 'pointer'}}>♡</div>
              </div>
              <div style={{padding: '14px 16px'}}>
                <div style={{fontSize: '20px', fontWeight: 700}}>{home.price}</div>
                <div style={{fontSize: '12px', color: '#666', marginTop: '2px'}}>Homagio Estimate™: <span style={{color: '#006aff', fontWeight: 500}}>{home.est}</span></div>
                <div style={{fontSize: '14px', color: '#444', marginTop: '6px', fontWeight: 500}}>{home.addr}</div>
                <div style={{fontSize: '13px', color: '#888', marginTop: '2px'}}>{home.city}</div>
                <div style={{display: 'flex', gap: '12px', marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #f0f0f0'}}>
                  {[`${home.beds} bds`, `${home.baths} ba`, `${home.sqft} sqft`, `${home.materials} materials`].map(f => (
                    <span key={f} style={{fontSize: '13px', color: '#555'}}>{f}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* TRUST STATS */}
      <div style={{background: '#f8f8f8', borderTop: '1px solid #efefef', borderBottom: '1px solid #efefef', padding: '28px 32px'}}>
        <div style={{maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '48px', flexWrap: 'wrap'}}>
          {[
            {n: '2.4M+', l: 'Homes cataloged'},
            {n: '48M+', l: 'Materials tracked'},
            {n: '98%', l: 'AI detection accuracy'},
            {n: '$3.2B+', l: 'Renovation costs tracked'},
            {n: '4.9★', l: 'App store rating'},
          ].map(stat => (
            <div key={stat.l} style={{textAlign: 'center'}}>
              <div style={{fontSize: '28px', fontWeight: 700}}>{stat.n}</div>
              <div style={{fontSize: '13px', color: '#888', marginTop: '2px'}}>{stat.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* FEATURES */}
      <div style={{padding: '56px 32px', maxWidth: '1200px', margin: '0 auto'}}>
        <div style={{textAlign: 'center', marginBottom: '48px'}}>
          <h2 style={{fontSize: '32px', fontWeight: 700, letterSpacing: '-0.5px'}}>Everything your home needs, in one place</h2>
          <p style={{fontSize: '15px', color: '#666', marginTop: '8px'}}>From AI-powered material detection to renovation budgeting.</p>
        </div>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0', border: '1px solid #e5e5e5', borderRadius: '12px', overflow: 'hidden'}}>
          {[
            {icon: '📸', title: 'AI Material Detection', desc: 'Upload a photo. Our AI identifies materials, finishes, and fixtures instantly.'},
            {icon: '🏠', title: 'Home Catalog System', desc: 'Build a complete record of every surface, system, and upgrade in your home.'},
            {icon: '🛒', title: 'Smart Shopping Lists', desc: 'One click generates a shoppable list with direct purchase links for every material.'},
            {icon: '💰', title: 'Budget & ROI Tracker', desc: 'Track renovation costs against estimated home value increases.'},
            {icon: '🌍', title: 'Explore Nearby Homes', desc: 'Discover how neighbors designed their homes and get inspired by real materials.'},
            {icon: '🔮', title: 'Digital Twin Technology', desc: 'Create a living digital replica of your home — always up to date, always yours.'},
          ].map((feat, i) => (
            <div key={feat.title} style={{background: '#fff', padding: '40px 32px', borderRight: i % 3 !== 2 ? '1px solid #e5e5e5' : 'none', borderBottom: i < 3 ? '1px solid #e5e5e5' : 'none'}}>
              <div style={{fontSize: '28px', marginBottom: '14px'}}>{feat.icon}</div>
              <div style={{fontSize: '17px', fontWeight: 600, marginBottom: '8px'}}>{feat.title}</div>
              <div style={{fontSize: '14px', color: '#666', lineHeight: 1.65}}>{feat.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* FINAL CTA */}
      <div style={{background: '#0D1B2A', padding: '80px 32px', textAlign: 'center'}}>
        <h2 style={{fontSize: '36px', fontWeight: 700, color: '#fff', letterSpacing: '-0.5px', marginBottom: '16px'}}>
          Start building your home's digital twin today.
        </h2>
        <p style={{fontSize: '16px', color: 'rgba(255,255,255,0.6)', marginBottom: '36px'}}>
          Join thousands of homeowners who finally understand every inch of where they live.
        </p>
        <div style={{display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap'}}>
          <button style={{background: '#006aff', color: '#fff', border: 'none', padding: '16px 40px', borderRadius: '8px', fontSize: '16px', fontWeight: 600, cursor: 'pointer'}}>
            Catalog My Home — It's Free
          </button>
          <button style={{background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', padding: '16px 40px', borderRadius: '8px', fontSize: '16px', fontWeight: 400, cursor: 'pointer'}}>
            View Demo
          </button>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{background: '#fff', borderTop: '1px solid #e5e5e5', padding: '40px 32px'}}>
        <div style={{maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '24px'}}>
          <div style={{fontSize: '22px', fontWeight: 700, color: '#006aff', letterSpacing: '-0.5px'}}>
            hom<span style={{color: '#1a1a1a'}}>agio</span>
          </div>
          <div style={{display: 'flex', gap: '32px', flexWrap: 'wrap'}}>
            {['Features', 'Pricing', 'For Pros', 'Blog', 'Privacy', 'Terms'].map(link => (
              <a key={link} href="#" style={{fontSize: '13px', color: '#666', textDecoration: 'none'}}>{link}</a>
            ))}
          </div>
          <div style={{fontSize: '12px', color: '#aaa'}}>© 2025 Homagio, Inc. All rights reserved.</div>
        </div>
      </div>

    </main>
  )
}
