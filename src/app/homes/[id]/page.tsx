'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

const ROOM_ICONS: Record<string, string> = {
  bedroom: '🛏️', bathroom: '🛁', kitchen: '🍳', living: '🛋️',
  dining: '🍽️', office: '💼', garage: '🚗', basement: '🏗️',
  exterior: '🏡', laundry: '👕', utility: '🔧', other: '🚪',
}

function getRoomIcon(type: string) {
  if (!type) return '🚪'
  const key = type.toLowerCase()
  for (const k of Object.keys(ROOM_ICONS)) {
    if (key.includes(k)) return ROOM_ICONS[k]
  }
  return '🚪'
}

function StatCard({ icon, label, value, accent }: { icon: string, label: string, value: string | number, accent?: boolean }) {
  return (
    <div style={{background: accent ? '#006aff' : '#fff', border: `1px solid ${accent ? '#006aff' : '#e9edf2'}`, borderRadius: '14px', padding: '22px 20px', textAlign: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.04)'}}>
      <div style={{fontSize: '22px', marginBottom: '8px'}}>{icon}</div>
      <div style={{fontSize: '24px', fontWeight: 700, color: accent ? '#fff' : '#1a1a2e', letterSpacing: '-0.5px'}}>{value}</div>
      <div style={{fontSize: '12px', color: accent ? 'rgba(255,255,255,0.75)' : '#9ca3af', marginTop: '4px', fontWeight: 500}}>{label}</div>
    </div>
  )
}

export default function HomeDashboard({ params }: { params: { id: string } }) {
  const [home, setHome] = useState<any>(null)
  const [rooms, setRooms] = useState<any[]>([])
  const [materials, setMaterials] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const supabase = createClient()

    const fetchData = async (homeId: string) => {
      const { data: homeData, error: homeError } = await supabase
        .from('homes').select('*').eq('id', homeId).single()

      if (homeError || !homeData) {
        setError('Home not found')
        setLoading(false)
        return
      }

      const { data: roomsData } = await supabase
        .from('rooms').select('*').eq('home_id', homeId).order('created_at', { ascending: true })

      const { data: materialsData } = await supabase
        .from('materials').select('*').eq('home_id', homeId).order('created_at', { ascending: false })

      setHome(homeData)
      setRooms(roomsData || [])
      setMaterials(materialsData || [])
      setLoading(false)
    }

    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      // Session found — fetch data immediately
      if (session?.user) {
        await fetchData(params.id)
        return
      }
      // No session yet — do NOT redirect here.
      // Cookie may not have hydrated yet. Let onAuthStateChange handle it.
    }

    init()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        // Session resolved — fetch data if not already loaded
        await fetchData(params.id)
      } else if (event === 'SIGNED_OUT') {
        // Explicit sign out — safe to redirect
        window.location.href = '/login'
      } else if (event === 'INITIAL_SESSION' && !session) {
        // Auth fully resolved with no session — genuinely not logged in
        window.location.href = '/login'
      }
    })

    return () => subscription.unsubscribe()
  }, [params.id])

  if (loading) return (
    <div style={{minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f7f9fc', gap: '14px', fontFamily: 'system-ui, sans-serif'}}>
      <div style={{fontSize: '22px', fontWeight: 700, color: '#006aff', letterSpacing: '-0.5px'}}>hom<span style={{color: '#1a1a2e'}}>agio</span></div>
      <div style={{width: '32px', height: '32px', border: '2.5px solid #e9edf2', borderTop: '2.5px solid #006aff', borderRadius: '50%', animation: 'spin 0.8s linear infinite'}} />
      <style>{`@keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}`}</style>
    </div>
  )

  if (error) return (
    <div style={{minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f7f9fc', fontFamily: 'system-ui, sans-serif'}}>
      <div style={{textAlign: 'center'}}>
        <div style={{fontSize: '52px', marginBottom: '16px'}}>🏚️</div>
        <div style={{fontSize: '18px', fontWeight: 700, color: '#1a1a2e', marginBottom: '8px'}}>{error}</div>
        <a href="/dashboard/homes" style={{color: '#006aff', textDecoration: 'none', fontSize: '14px', fontWeight: 500}}>← Back to My Homes</a>
      </div>
    </div>
  )

  const totalMaterialValue = materials.reduce((sum, m) => sum + (m.cost || 0), 0)

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }
        body { font-family: system-ui, sans-serif; }
        .room-card {
          padding: 18px;
          border: 1.5px solid #e9edf2;
          border-radius: 12px;
          cursor: pointer;
          background: #fff;
          transition: border-color 0.15s, box-shadow 0.15s, transform 0.1s;
        }
        .room-card:hover {
          border-color: #006aff;
          box-shadow: 0 4px 16px rgba(0,106,255,0.1);
          transform: translateY(-1px);
        }
        .material-row {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 16px;
          border-radius: 10px;
          border: 1px solid #f3f4f6;
          transition: background 0.12s;
        }
        .material-row:hover { background: #f9fafb; }
        .btn-primary {
          background: #006aff;
          color: #fff;
          border: none;
          padding: 10px 20px;
          border-radius: 9px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          font-family: inherit;
          transition: background 0.15s;
          white-space: nowrap;
        }
        .btn-primary:hover { background: #0057d4; }
        .btn-outline {
          background: transparent;
          color: #006aff;
          border: 1.5px solid #006aff;
          padding: 8px 16px;
          border-radius: 9px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          font-family: inherit;
          transition: background 0.12s;
        }
        .btn-outline:hover { background: #f0f6ff; }
        .tag {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: #f3f4f6;
          color: #374151;
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
        }
      `}</style>

      <div style={{minHeight: '100vh', background: '#f7f9fc', fontFamily: 'system-ui, sans-serif'}}>

        {/* Nav */}
        <nav style={{background: '#fff', borderBottom: '1px solid #e9edf2', padding: '0 32px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100}}>
          <a href="/dashboard" style={{fontSize: '22px', fontWeight: 700, color: '#006aff', letterSpacing: '-0.5px', textDecoration: 'none'}}>
            hom<span style={{color: '#1a1a2e'}}>agio</span>
          </a>
          <div style={{display: 'flex', alignItems: 'center', gap: '20px'}}>
            <a href="/dashboard/homes" style={{fontSize: '13px', color: '#6b7280', textDecoration: 'none', fontWeight: 500}}>← My Homes</a>
            <button className="btn-primary" onClick={() => window.location.href = `/homes/${params.id}/rooms/add`}>
              + Add Room
            </button>
          </div>
        </nav>

        <div style={{maxWidth: '1180px', margin: '0 auto', padding: '40px 32px'}}>

          {/* Hero Card */}
          <div style={{background: '#fff', borderRadius: '20px', border: '1px solid #e9edf2', overflow: 'hidden', marginBottom: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)'}}>
            <div style={{height: '8px', background: 'linear-gradient(90deg, #006aff 0%, #3b82f6 100%)'}} />
            <div style={{padding: '32px'}}>
              <div style={{display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px'}}>
                <div>
                  <div style={{display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px'}}>
                    <span style={{fontSize: '28px'}}>🏠</span>
                    <h1 style={{fontSize: '26px', fontWeight: 700, color: '#1a1a2e', letterSpacing: '-0.5px'}}>
                      {home.name || home.address}
                    </h1>
                  </div>
                  <div style={{fontSize: '14px', color: '#6b7280', marginBottom: '14px'}}>
                    {home.address}, {home.city}, {home.state} {home.zip}
                  </div>
                  <div style={{display: 'flex', gap: '8px', flexWrap: 'wrap'}}>
                    {home.bedrooms && <span className="tag">🛏️ {home.bedrooms} beds</span>}
                    {home.bathrooms && <span className="tag">🛁 {home.bathrooms} baths</span>}
                    {home.square_feet && <span className="tag">📐 {home.square_feet.toLocaleString()} sqft</span>}
                    {home.year_built && <span className="tag">📅 Built {home.year_built}</span>}
                  </div>
                </div>
                <div style={{textAlign: 'right'}}>
                  <div style={{fontSize: '12px', color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px'}}>Homagio Estimate™</div>
                  <div style={{fontSize: '28px', fontWeight: 700, color: '#1a1a2e', letterSpacing: '-1px'}}>
                    {home.value_estimate ? `$${Math.round(home.value_estimate / 100).toLocaleString()}` : '—'}
                  </div>
                  <div style={{fontSize: '12px', color: '#9ca3af', marginTop: '2px'}}>Coming soon</div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '28px'}}>
            <StatCard icon="🚪" label="Rooms" value={rooms.length} />
            <StatCard icon="📦" label="Materials" value={materials.length} />
            <StatCard icon="💰" label="Materials Value" value={totalMaterialValue > 0 ? `$${Math.round(totalMaterialValue / 100).toLocaleString()}` : '$0'} />
            <StatCard icon="📸" label="Photos" value="0" />
          </div>

          {/* Rooms Section */}
          <div style={{background: '#fff', borderRadius: '16px', border: '1px solid #e9edf2', padding: '28px', marginBottom: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)'}}>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '22px'}}>
              <div>
                <h2 style={{fontSize: '17px', fontWeight: 700, color: '#1a1a2e'}}>Rooms</h2>
                <div style={{fontSize: '13px', color: '#9ca3af', marginTop: '2px'}}>{rooms.length} room{rooms.length !== 1 ? 's' : ''} cataloged</div>
              </div>
              <button className="btn-outline" onClick={() => window.location.href = `/homes/${params.id}/rooms/add`}>
                + Add Room
              </button>
            </div>

            {rooms.length === 0 ? (
              <div style={{textAlign: 'center', padding: '48px 32px', border: '2px dashed #e9edf2', borderRadius: '12px', background: '#fafbfc'}}>
                <div style={{fontSize: '36px', marginBottom: '12px'}}>🚪</div>
                <div style={{fontSize: '16px', fontWeight: 700, color: '#1a1a2e', marginBottom: '6px'}}>No rooms yet</div>
                <div style={{fontSize: '13px', color: '#9ca3af', marginBottom: '20px'}}>Add rooms to start cataloging your materials, finishes, and fixtures.</div>
                <button className="btn-primary" onClick={() => window.location.href = `/homes/${params.id}/rooms/add`}>
                  Add Your First Room
                </button>
              </div>
            ) : (
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: '12px'}}>
                {rooms.map(room => (
                  <div key={room.id} className="room-card"
                    onClick={() => window.location.href = `/homes/${params.id}/rooms/${room.id}`}>
                    <div style={{fontSize: '26px', marginBottom: '10px'}}>{getRoomIcon(room.type)}</div>
                    <div style={{fontSize: '14px', fontWeight: 700, color: '#1a1a2e', marginBottom: '3px'}}>{room.name}</div>
                    <div style={{fontSize: '12px', color: '#9ca3af', textTransform: 'capitalize'}}>{room.type || 'Room'}</div>
                  </div>
                ))}
                <div
                  onClick={() => window.location.href = `/homes/${params.id}/rooms/add`}
                  style={{padding: '18px', border: '2px dashed #e9edf2', borderRadius: '12px', cursor: 'pointer', background: '#fafbfc', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '6px', minHeight: '100px', transition: 'border-color 0.15s, background 0.12s'}}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = '#006aff'; (e.currentTarget as HTMLDivElement).style.background = '#f0f6ff' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = '#e9edf2'; (e.currentTarget as HTMLDivElement).style.background = '#fafbfc' }}
                >
                  <div style={{fontSize: '22px', color: '#9ca3af'}}>+</div>
                  <div style={{fontSize: '12px', color: '#9ca3af', fontWeight: 500}}>Add Room</div>
                </div>
              </div>
            )}
          </div>

          {/* Recent Materials */}
          <div style={{background: '#fff', borderRadius: '16px', border: '1px solid #e9edf2', padding: '28px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)'}}>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px'}}>
              <div>
                <h2 style={{fontSize: '17px', fontWeight: 700, color: '#1a1a2e'}}>Recent Materials</h2>
                <div style={{fontSize: '13px', color: '#9ca3af', marginTop: '2px'}}>{materials.length} total · showing latest 5</div>
              </div>
            </div>

            {materials.length === 0 ? (
              <div style={{textAlign: 'center', padding: '40px 32px', border: '2px dashed #e9edf2', borderRadius: '12px', background: '#fafbfc'}}>
                <div style={{fontSize: '36px', marginBottom: '12px'}}>📦</div>
                <div style={{fontSize: '16px', fontWeight: 700, color: '#1a1a2e', marginBottom: '6px'}}>No materials yet</div>
                <div style={{fontSize: '13px', color: '#9ca3af'}}>Open a room to start cataloging materials, finishes, and fixtures.</div>
              </div>
            ) : (
              <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
                {materials.slice(0, 5).map(material => (
                  <div key={material.id} className="material-row">
                    <div style={{width: '42px', height: '42px', background: '#f0f6ff', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0}}>
                      📦
                    </div>
                    <div style={{flex: 1, minWidth: 0}}>
                      <div style={{fontSize: '14px', fontWeight: 600, color: '#1a1a2e', marginBottom: '2px'}}>{material.name}</div>
                      <div style={{fontSize: '12px', color: '#9ca3af'}}>
                        {[material.brand, material.color, material.finish].filter(Boolean).join(' · ') || 'No details added'}
                      </div>
                    </div>
                    {material.cost > 0 && (
                      <div style={{fontSize: '15px', fontWeight: 700, color: '#006aff', flexShrink: 0}}>
                        ${(material.cost / 100).toLocaleString()}
                      </div>
                    )}
                  </div>
                ))}
                {materials.length > 5 && (
                  <div style={{textAlign: 'center', padding: '12px', fontSize: '13px', color: '#9ca3af'}}>
                    +{materials.length - 5} more materials across all rooms
                  </div>
                )}
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  )
}
