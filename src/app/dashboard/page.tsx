'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

const FEATURES = [
  { icon: '🏠', title: 'Catalogue My Home', desc: 'Add rooms, materials, and track every detail of your home.', href: '/dashboard/homes', color: '#006aff' },
  { icon: '🌍', title: 'Explore Homes Near Me', desc: 'Discover how neighbors designed their homes and get inspired.', href: '#', color: '#0d9488', soon: true },
  { icon: '🔍', title: 'Find a Material or Finish', desc: 'Search homes by flooring, countertop, paint color, and more.', href: '#', color: '#7c3aed', soon: true },
  { icon: '📸', title: 'Identify a Material', desc: 'Upload a photo and our AI will tell you exactly what it is.', href: '#', color: '#d97706', soon: true },
  { icon: '💰', title: "Check My Home's Value", desc: 'See your Homagio Estimate™ and track value over time.', href: '#', color: '#059669', soon: true },
  { icon: '👷', title: 'Find a Pro', desc: 'Connect with designers, builders, and realtors in your area.', href: '#', color: '#dc2626', soon: true },
]

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) { setUser(session.user); setLoading(false); return }
      window.location.href = '/login'
    }

    init()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) { setUser(session.user); setLoading(false) }
      else if (event === 'SIGNED_OUT') { window.location.href = '/login' }
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  const firstName = user?.user_metadata?.full_name
    ? user.user_metadata.full_name.split(' ')[0]
    : user?.email?.split('@')[0] || 'there'

  if (loading) return (
    <div style={{minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f8f8f8', gap: '16px'}}>
      <div style={{fontSize: '28px', fontWeight: 700, color: '#006aff', letterSpacing: '-1px'}}>hom<span style={{color: '#1a1a1a'}}>agio</span></div>
      <div style={{width: '36px', height: '36px', border: '3px solid #e5e5e5', borderTop: '3px solid #006aff', borderRadius: '50%', animation: 'spin 0.8s linear infinite'}} />
      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
    </div>
  )

  return (
    <div style={{minHeight: '100vh', background: '#f8f8f8'}}>
      <nav style={{background: '#fff', borderBottom: '1px solid #e5e5e5', padding: '0 32px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
        <div style={{fontSize: '24px', fontWeight: 700, color: '#006aff', letterSpacing: '-1px'}}>hom<span style={{color: '#1a1a1a'}}>agio</span></div>
        <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
          <span style={{fontSize: '14px', color: '#666'}}>{user?.user_metadata?.full_name || user?.email}</span>
          <button onClick={handleSignOut} style={{padding: '8px 18px', borderRadius: '8px', border: '1.5px solid #e5e5e5', background: '#fff', fontSize: '14px', fontWeight: 500, cursor: 'pointer', color: '#444'}}>Sign Out</button>
        </div>
      </nav>

      <div style={{maxWidth: '1100px', margin: '0 auto', padding: '56px 32px'}}>
        <div style={{marginBottom: '48px', textAlign: 'center'}}>
          <h1 style={{fontSize: '36px', fontWeight: 700, color: '#1a1a1a', letterSpacing: '-1px', marginBottom: '8px'}}>Welcome back, {firstName}! 👋</h1>
          <p style={{fontSize: '17px', color: '#666'}}>What would you like to do today?</p>
        </div>

        <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '48px'}}>
          {FEATURES.map(feature => (
            <div key={feature.title} onClick={() => !feature.soon && (window.location.href = feature.href)}
              style={{background: '#fff', border: '1px solid #e5e5e5', borderRadius: '16px', padding: '28px', cursor: feature.soon ? 'default' : 'pointer', position: 'relative', opacity: feature.soon ? 0.75 : 1}}>
              {feature.soon && <div style={{position: 'absolute', top: '16px', right: '16px', background: '#f0f0f0', color: '#888', fontSize: '10px', fontWeight: 700, padding: '3px 8px', borderRadius: '20px'}}>COMING SOON</div>}
              <div style={{fontSize: '36px', marginBottom: '16px'}}>{feature.icon}</div>
              <div style={{fontSize: '16px', fontWeight: 700, color: '#1a1a1a', marginBottom: '6px'}}>{feature.title}</div>
              <div style={{fontSize: '13px', color: '#888', lineHeight: 1.6}}>{feature.desc}</div>
              {!feature.soon && <div style={{marginTop: '16px', fontSize: '13px', fontWeight: 600, color: feature.color}}>Get started →</div>}
            </div>
          ))}
        </div>

        <div style={{background: '#fff', border: '1px solid #e5e5e5', borderRadius: '16px', padding: '24px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-around', flexWrap: 'wrap', gap: '16px'}}>
          {[{icon: '🏠', label: 'My Homes', href: '/dashboard/homes'}, {icon: '🚪', label: 'My Rooms', href: '/dashboard/homes'}, {icon: '📦', label: 'My Materials', href: '/dashboard/homes'}, {icon: '⚙️', label: 'Settings', href: '#'}].map(item => (
            <a key={item.label} href={item.href} style={{display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 500, color: '#444', textDecoration: 'none', padding: '8px 16px', borderRadius: '8px', border: '1px solid #e5e5e5'}}>
              <span>{item.icon}</span><span>{item.label}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
