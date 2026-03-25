'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

function HomeCard({ home, onClick }: { home: any, onClick: () => void }) {
  const hasDetails = home.bedrooms || home.bathrooms || home.square_feet
  const year = home.year_built ? `Est. ${home.year_built}` : null

  return (
    <div
      onClick={onClick}
      style={{background: '#fff', border: '1.5px solid #e9edf2', borderRadius: '16px', overflow: 'hidden', cursor: 'pointer', transition: 'border-color 0.15s, box-shadow 0.15s, transform 0.1s', display: 'flex', flexDirection: 'column'}}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLDivElement
        el.style.borderColor = '#006aff'
        el.style.boxShadow = '0 6px 24px rgba(0,106,255,0.12)'
        el.style.transform = 'translateY(-2px)'
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLDivElement
        el.style.borderColor = '#e9edf2'
        el.style.boxShadow = 'none'
        el.style.transform = 'none'
      }}
    >
      {/* Image placeholder with gradient */}
      <div style={{height: '148px', background: 'linear-gradient(135deg, #0D1B2A 0%, #1a3a5c 60%, #1e4b7a 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', flexShrink: 0}}>
        <span style={{fontSize: '52px', opacity: 0.6}}>🏠</span>
        {home.value_estimate && (
          <div style={{position: 'absolute', bottom: '12px', right: '12px', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)', color: '#fff', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 700}}>
            ${Math.round(home.value_estimate / 100).toLocaleString()}
          </div>
        )}
      </div>

      <div style={{padding: '18px 20px', flex: 1}}>
        <div style={{fontSize: '15px', fontWeight: 700, color: '#1a1a2e', marginBottom: '3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>
          {home.name || home.address}
        </div>
        {home.name && (
          <div style={{fontSize: '12px', color: '#9ca3af', marginBottom: '8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>
            {home.address}
          </div>
        )}
        <div style={{fontSize: '12px', color: '#6b7280', marginBottom: hasDetails ? '12px' : '0'}}>
          {home.city}, {home.state} {home.zip}
        </div>
        {hasDetails && (
          <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '8px', paddingTop: '12px', borderTop: '1px solid #f3f4f6'}}>
            {home.bedrooms && (
              <span style={{fontSize: '11px', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '3px'}}>
                🛏️ {home.bedrooms}
              </span>
            )}
            {home.bathrooms && (
              <span style={{fontSize: '11px', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '3px'}}>
                🛁 {home.bathrooms}
              </span>
            )}
            {home.square_feet && (
              <span style={{fontSize: '11px', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '3px'}}>
                📐 {home.square_feet.toLocaleString()} sqft
              </span>
            )}
            {year && (
              <span style={{fontSize: '11px', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '3px'}}>
                📅 {year}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default function HomesDashboard() {
  const [user, setUser] = useState<any>(null)
  const [homes, setHomes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()

    const loadHomes = async (userId: string) => {
      const { data: homesData, error: homesError } = await supabase
        .from('homes').select('*').eq('user_id', userId).order('created_at', { ascending: false })
      if (homesError) setError('Homes error: ' + homesError.message)
      setHomes(homesData || [])
      setLoading(false)
    }

    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) { setUser(session.user); await loadHomes(session.user.id); return }
      window.location.href = '/login'
    }

    init()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) { setUser(session.user); await loadHomes(session.user.id) }
      else if (event === 'SIGNED_OUT') { window.location.href = '/login' }
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) return (
    <div style={{minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f7f9fc', gap: '14px', fontFamily: "'DM Sans', system-ui, sans-serif"}}>
      <div style={{fontSize: '22px', fontWeight: 700, color: '#006aff', letterSpacing: '-0.5px'}}>hom<span style={{color: '#1a1a2e'}}>agio</span></div>
      <div style={{width: '32px', height: '32px', border: '2.5px solid #e9edf2', borderTop: '2.5px solid #006aff', borderRadius: '50%', animation: 'spin 0.8s linear infinite'}} />
      <style>{`@keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}`}</style>
    </div>
  )

  if (error) return (
    <div style={{minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f7f9fc', fontFamily: "'DM Sans', system-ui, sans-serif"}}>
      <div style={{textAlign: 'center', padding: '32px'}}>
        <div style={{fontSize: '14px', color: '#6b7280', marginBottom: '24px', fontFamily: 'monospace', background: '#f3f4f6', padding: '12px', borderRadius: '8px'}}>{error}</div>
        <a href="/dashboard" style={{color: '#006aff', textDecoration: 'none', fontSize: '14px', fontWeight: 500}}>← Back to Dashboard</a>
      </div>
    </div>
  )

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        body { font-family: 'DM Sans', system-ui, sans-serif; }
        .stat-card {
          background: #fff;
          border: 1px solid #e9edf2;
          border-radius: 14px;
          padding: 20px;
          text-align: center;
          box-shadow: 0 1px 4px rgba(0,0,0,0.04);
        }
      `}</style>

      <div style={{minHeight: '100vh', background: '#f7f9fc', fontFamily: "'DM Sans', system-ui, sans-serif"}}>

        {/* Nav */}
        <nav style={{background: '#fff', borderBottom: '1px solid #e9edf2', padding: '0 32px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100}}>
          <a href="/dashboard" style={{fontSize: '22px', fontWeight: 700, color: '#006aff', letterSpacing: '-0.5px', textDecoration: 'none'}}>
            hom<span style={{color: '#1a1a2e'}}>agio</span>
          </a>
          <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
            <a href="/dashboard" style={{fontSize: '13px', color: '#6b7280', textDecoration: 'none', fontWeight: 500}}>← Dashboard</a>
            <div style={{width: '1px', height: '20px', background: '#e9edf2'}} />
            <span style={{fontSize: '13px', color: '#374151', fontWeight: 500}}>{user?.user_metadata?.full_name || user?.email}</span>
          </div>
        </nav>

        <div style={{maxWidth: '1200px', margin: '0 auto', padding: '48px 32px'}}>

          {/* Page Header */}
          <div style={{display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '36px', flexWrap: 'wrap', gap: '16px'}}>
            <div>
              <h1 style={{fontSize: '26px', fontWeight: 700, color: '#1a1a2e', letterSpacing: '-0.5px', marginBottom: '4px'}}>My Homes</h1>
              <p style={{fontSize: '14px', color: '#6b7280'}}>
                {homes.length === 0
                  ? 'Add your first home to get started'
                  : `${homes.length} home${homes.length > 1 ? 's' : ''} cataloged`}
              </p>
            </div>
            <button
              onClick={() => window.location.href = '/homes/add'}
              style={{background: '#006aff', color: '#fff', border: 'none', padding: '11px 22px', borderRadius: '10px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.15s', display: 'flex', alignItems: 'center', gap: '6px'}}
            >
              + Add Home
            </button>
          </div>

          {/* Stats Row */}
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '36px'}}>
            {[
              {icon: '🏠', label: 'Homes', value: homes.length},
              {icon: '📦', label: 'Materials', value: '—'},
              {icon: '💰', label: 'Budget Tracked', value: '$0'},
              {icon: '📸', label: 'Photos', value: '0'},
            ].map(stat => (
              <div key={stat.label} className="stat-card">
                <div style={{fontSize: '24px', marginBottom: '8px'}}>{stat.icon}</div>
                <div style={{fontSize: '22px', fontWeight: 700, color: '#1a1a2e', letterSpacing: '-0.5px'}}>{stat.value}</div>
                <div style={{fontSize: '12px', color: '#9ca3af', marginTop: '4px', fontWeight: 500}}>{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Homes Grid or Empty State */}
          {homes.length === 0 ? (
            <div style={{background: '#fff', border: '2px dashed #e9edf2', borderRadius: '20px', padding: '72px 32px', textAlign: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.04)'}}>
              <div style={{fontSize: '52px', marginBottom: '16px'}}>🏠</div>
              <h2 style={{fontSize: '20px', fontWeight: 700, color: '#1a1a2e', marginBottom: '8px', letterSpacing: '-0.25px'}}>
                Add your first home
              </h2>
              <p style={{fontSize: '14px', color: '#6b7280', maxWidth: '380px', margin: '0 auto 28px', lineHeight: 1.7}}>
                Start building your home's digital twin. Catalog every material, track every dollar. We'll automatically create an Exterior room for roofing, siding & more.
              </p>
              <button
                onClick={() => window.location.href = '/homes/add'}
                style={{background: '#006aff', color: '#fff', border: 'none', padding: '13px 32px', borderRadius: '10px', fontSize: '15px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.15s'}}
              >
                + Add My First Home
              </button>
            </div>
          ) : (
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px'}}>
              {homes.map(home => (
                <HomeCard
                  key={home.id}
                  home={home}
                  onClick={() => window.location.href = `/homes/${home.id}`}
                />
              ))}
              {/* Add another tile */}
              <div
                onClick={() => window.location.href = '/homes/add'}
                style={{background: '#fff', border: '2px dashed #e9edf2', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', minHeight: '220px', flexDirection: 'column', gap: '10px', transition: 'border-color 0.15s, background 0.12s'}}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = '#006aff'; (e.currentTarget as HTMLDivElement).style.background = '#f0f6ff' }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = '#e9edf2'; (e.currentTarget as HTMLDivElement).style.background = '#fff' }}
              >
                <div style={{width: '44px', height: '44px', borderRadius: '50%', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', color: '#9ca3af'}}>+</div>
                <div style={{fontSize: '13px', fontWeight: 600, color: '#9ca3af'}}>Add Another Home</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
