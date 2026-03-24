'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function HomesDashboard() {
  const [user, setUser] = useState<any>(null)
  const [homes, setHomes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser()

        if (userError) { setError('Auth error: ' + userError.message); setLoading(false); return }
        if (!user) { window.location.href = '/login'; return }

        setUser(user)

        const { data: homesData, error: homesError } = await supabase
          .from('homes')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        if (homesError) setError('Homes error: ' + homesError.message)

        setHomes(homesData || [])
        setLoading(false)
      } catch (err: any) {
        setError('Unexpected error: ' + err.message)
        setLoading(false)
      }
    }

    fetchData()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          setUser(session.user)
          const { data: homesData } = await supabase
            .from('homes')
            .select('*')
            .eq('user_id', session.user.id)
            .order('created_at', { ascending: false })
          setHomes(homesData || [])
          setLoading(false)
        }
        if (event === 'SIGNED_OUT') {
          window.location.href = '/login'
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div style={{minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f8f8'}}>
        <div style={{fontSize: '16px', color: '#888'}}>Loading your homes...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f8f8'}}>
        <div style={{textAlign: 'center', padding: '32px'}}>
          <div style={{fontSize: '48px', marginBottom: '16px'}}>⚠️</div>
          <div style={{fontSize: '16px', fontWeight: 600, marginBottom: '8px', color: '#e00'}}>Something went wrong</div>
          <div style={{fontSize: '14px', color: '#666', marginBottom: '24px', fontFamily: 'monospace', background: '#f0f0f0', padding: '12px', borderRadius: '8px'}}>{error}</div>
          <a href="/dashboard" style={{color: '#006aff', textDecoration: 'none', fontSize: '15px'}}>← Back to Dashboard</a>
        </div>
      </div>
    )
  }

  return (
    <div style={{minHeight: '100vh', background: '#f8f8f8'}}>
      <nav style={{background: '#fff', borderBottom: '1px solid #e5e5e5', padding: '0 32px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
        <a href="/dashboard" style={{fontSize: '24px', fontWeight: 700, color: '#006aff', letterSpacing: '-1px', textDecoration: 'none'}}>
          hom<span style={{color: '#1a1a1a'}}>agio</span>
        </a>
        <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
          <a href="/dashboard" style={{fontSize: '14px', color: '#666', textDecoration: 'none'}}>← Dashboard</a>
          <span style={{fontSize: '14px', color: '#666'}}>{user?.user_metadata?.full_name || user?.email}</span>
        </div>
      </nav>

      <div style={{maxWidth: '1200px', margin: '0 auto', padding: '48px 32px'}}>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', flexWrap: 'wrap', gap: '16px'}}>
          <div>
            <h1 style={{fontSize: '28px', fontWeight: 700, color: '#1a1a1a', letterSpacing: '-0.5px'}}>My Homes</h1>
            <p style={{fontSize: '15px', color: '#666', marginTop: '4px'}}>
              {homes.length === 0 ? 'Add your first home to get started' : `${homes.length} home${homes.length > 1 ? 's' : ''} cataloged`}
            </p>
          </div>
          <button
            onClick={() => window.location.href = '/homes/add'}
            style={{background: '#006aff', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '8px', fontSize: '15px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit'}}
          >
            + Add Home
          </button>
        </div>

        <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px'}}>
          {[
            {icon: '🏠', label: 'Homes', value: homes.length},
            {icon: '📦', label: 'Materials', value: '0'},
            {icon: '💰', label: 'Budget Tracked', value: '$0'},
            {icon: '📸', label: 'Photos', value: '0'},
          ].map(stat => (
            <div key={stat.label} style={{background: '#fff', border: '1px solid #e5e5e5', borderRadius: '12px', padding: '20px', textAlign: 'center'}}>
              <div style={{fontSize: '28px', marginBottom: '8px'}}>{stat.icon}</div>
              <div style={{fontSize: '24px', fontWeight: 700, color: '#1a1a1a'}}>{stat.value}</div>
              <div style={{fontSize: '13px', color: '#888', marginTop: '4px'}}>{stat.label}</div>
            </div>
          ))}
        </div>

        {homes.length === 0 ? (
          <div style={{background: '#fff', border: '2px dashed #e5e5e5', borderRadius: '16px', padding: '64px 32px', textAlign: 'center'}}>
            <div style={{fontSize: '48px', marginBottom: '16px'}}>🏠</div>
            <h2 style={{fontSize: '22px', fontWeight: 700, color: '#1a1a1a', marginBottom: '8px'}}>Add your first home</h2>
            <p style={{fontSize: '15px', color: '#666', maxWidth: '400px', margin: '0 auto 28px'}}>
              Start building your home's digital twin. Catalog every material, track every dollar.
            </p>
            <button
              onClick={() => window.location.href = '/homes/add'}
              style={{background: '#006aff', color: '#fff', border: 'none', padding: '14px 32px', borderRadius: '8px', fontSize: '15px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit'}}
            >
              + Add My First Home
            </button>
          </div>
        ) : (
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px'}}>
            {homes.map(home => (
              <div
                key={home.id}
                onClick={() => window.location.href = `/homes/${home.id}`}
                style={{background: '#fff', border: '1px solid #e5e5e5', borderRadius: '16px', overflow: 'hidden', cursor: 'pointer'}}
              >
                <div style={{height: '140px', background: 'linear-gradient(135deg, #0D1B2A, #1a3a5c)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px'}}>
                  🏠
                </div>
                <div style={{padding: '20px'}}>
                  <div style={{fontSize: '16px', fontWeight: 700, color: '#1a1a1a', marginBottom: '4px'}}>{home.name || home.address}</div>
                  <div style={{fontSize: '13px', color: '#888', marginBottom: '12px'}}>{home.city}, {home.state} {home.zip}</div>
                  <div style={{display: 'flex', gap: '12px'}}>
                    {home.bedrooms && <span style={{fontSize: '12px', color: '#555'}}>{home.bedrooms} beds</span>}
                    {home.bathrooms && <span style={{fontSize: '12px', color: '#555'}}>{home.bathrooms} baths</span>}
                    {home.square_feet && <span style={{fontSize: '12px', color: '#555'}}>{home.square_feet.toLocaleString()} sqft</span>}
                  </div>
                </div>
              </div>
            ))}
            <div
              onClick={() => window.location.href = '/homes/add'}
              style={{background: '#fff', border: '2px dashed #e5e5e5', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', minHeight: '220px', flexDirection: 'column', gap: '12px'}}
            >
              <div style={{fontSize: '32px'}}>+</div>
              <div style={{fontSize: '14px', fontWeight: 500, color: '#888'}}>Add Another Home</div>
            </div>
          </div>
        )}

        <div style={{marginTop: '32px'}}>
          <h3 style={{fontSize: '18px', fontWeight: 600, marginBottom: '16px', color: '#1a1a1a'}}>Quick Actions</h3>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px'}}>
            {[
              {icon: '📸', title: 'Upload Photos', desc: 'AI detects your materials'},
              {icon: '🛒', title: 'Shopping List', desc: 'Shop your home\'s materials'},
              {icon: '💰', title: 'Budget Tracker', desc: 'Track renovation costs'},
            ].map(action => (
              <div key={action.title} style={{background: '#fff', border: '1px solid #e5e5e5', borderRadius: '12px', padding: '24px', cursor: 'pointer'}}>
                <div style={{fontSize: '28px', marginBottom: '12px'}}>{action.icon}</div>
                <div style={{fontSize: '15px', fontWeight: 600, color: '#1a1a1a', marginBottom: '4px'}}>{action.title}</div>
                <div style={{fontSize: '13px', color: '#888'}}>{action.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
