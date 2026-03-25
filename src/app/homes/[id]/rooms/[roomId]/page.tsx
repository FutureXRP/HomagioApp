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

export default function RoomDetail({ params }: { params: { id: string; roomId: string } }) {
  const [room, setRoom] = useState<any>(null)
  const [materials, setMaterials] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const supabase = createClient()

    const fetchData = async () => {
      const { data: roomData, error: roomError } = await supabase
        .from('rooms').select('*').eq('id', params.roomId).single()

      if (roomError || !roomData) {
        setError('Room not found')
        setLoading(false)
        return
      }

      const { data: materialsData } = await supabase
        .from('materials')
        .select('*')
        .eq('room_id', params.roomId)
        .order('created_at', { ascending: false })

      setRoom(roomData)
      setMaterials(materialsData || [])
      setLoading(false)
    }

    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      // Session found — fetch data immediately
      if (session?.user) {
        await fetchData()
        return
      }
      // No session yet — do NOT redirect here.
      // Cookie may not have hydrated yet. Let onAuthStateChange handle it.
    }

    init()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        // Session resolved — fetch data
        await fetchData()
      } else if (event === 'SIGNED_OUT') {
        // Explicit sign out — safe to redirect
        window.location.href = '/login'
      } else if (event === 'INITIAL_SESSION' && !session) {
        // Auth fully resolved with no session — genuinely not logged in
        window.location.href = '/login'
      }
    })

    return () => subscription.unsubscribe()
  }, [params.roomId])

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
        <div style={{fontSize: '48px', marginBottom: '16px'}}>🚪</div>
        <div style={{fontSize: '18px', fontWeight: 700, color: '#1a1a2e', marginBottom: '8px'}}>{error}</div>
        <a href={`/homes/${params.id}`} style={{color: '#006aff', textDecoration: 'none', fontSize: '14px', fontWeight: 500}}>← Back to Home</a>
      </div>
    </div>
  )

  const icon = getRoomIcon(room.type)
  const totalCost = materials.reduce((sum, m) => sum + (m.cost || 0), 0)

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }
        body { font-family: system-ui, sans-serif; }
        .material-row {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 16px;
          border: 1px solid #f3f4f6;
          border-radius: 10px;
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
        .stat-card {
          background: #fff;
          border: 1px solid #e9edf2;
          border-radius: 14px;
          padding: 20px;
          text-align: center;
          box-shadow: 0 1px 4px rgba(0,0,0,0.04);
        }
      `}</style>

      <div style={{minHeight: '100vh', background: '#f7f9fc', fontFamily: 'system-ui, sans-serif'}}>

        {/* Nav */}
        <nav style={{background: '#fff', borderBottom: '1px solid #e9edf2', padding: '0 32px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100}}>
          <a href="/dashboard" style={{fontSize: '22px', fontWeight: 700, color: '#006aff', letterSpacing: '-0.5px', textDecoration: 'none'}}>
            hom<span style={{color: '#1a1a2e'}}>agio</span>
          </a>
          <div style={{display: 'flex', alignItems: 'center', gap: '20px'}}>
            <a href={`/homes/${params.id}`} style={{fontSize: '13px', color: '#6b7280', textDecoration: 'none', fontWeight: 500}}>← Back to Home</a>
            <button className="btn-primary" onClick={() => window.location.href = `/homes/${params.id}/rooms/${params.roomId}/materials/add`}>
              + Add Material
            </button>
          </div>
        </nav>

        <div style={{maxWidth: '1100px', margin: '0 auto', padding: '40px 32px'}}>

          {/* Room Hero Card */}
          <div style={{background: '#fff', borderRadius: '20px', border: '1px solid #e9edf2', overflow: 'hidden', marginBottom: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)'}}>
            <div style={{height: '8px', background: 'linear-gradient(90deg, #006aff 0%, #3b82f6 100%)'}} />
            <div style={{padding: '28px 32px'}}>
              <div style={{display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
                  <div style={{fontSize: '48px'}}>{icon}</div>
                  <div>
                    <h1 style={{fontSize: '24px', fontWeight: 700, color: '#1a1a2e', letterSpacing: '-0.5px'}}>{room.name}</h1>
                    <p style={{fontSize: '14px', color: '#6b7280', marginTop: '3px', textTransform: 'capitalize'}}>{room.type || 'Room'}</p>
                    {room.notes && <p style={{fontSize: '13px', color: '#6b7280', marginTop: '6px', maxWidth: '480px', lineHeight: 1.6}}>{room.notes}</p>}
                  </div>
                </div>
                <button className="btn-primary" onClick={() => window.location.href = `/homes/${params.id}/rooms/${params.roomId}/materials/add`}>
                  + Add Material
                </button>
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '24px'}}>
            <div className="stat-card">
              <div style={{fontSize: '22px', marginBottom: '8px'}}>📦</div>
              <div style={{fontSize: '22px', fontWeight: 700, color: '#1a1a2e'}}>{materials.length}</div>
              <div style={{fontSize: '12px', color: '#9ca3af', marginTop: '4px', fontWeight: 500}}>Materials</div>
            </div>
            <div className="stat-card">
              <div style={{fontSize: '22px', marginBottom: '8px'}}>💰</div>
              <div style={{fontSize: '22px', fontWeight: 700, color: '#1a1a2e'}}>
                {totalCost > 0 ? `$${Math.round(totalCost / 100).toLocaleString()}` : '$0'}
              </div>
              <div style={{fontSize: '12px', color: '#9ca3af', marginTop: '4px', fontWeight: 500}}>Total Cost</div>
            </div>
            <div className="stat-card">
              <div style={{fontSize: '22px', marginBottom: '8px'}}>📸</div>
              <div style={{fontSize: '22px', fontWeight: 700, color: '#1a1a2e'}}>0</div>
              <div style={{fontSize: '12px', color: '#9ca3af', marginTop: '4px', fontWeight: 500}}>Photos</div>
            </div>
          </div>

          {/* Materials List */}
          <div style={{background: '#fff', borderRadius: '16px', border: '1px solid #e9edf2', padding: '28px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)'}}>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px'}}>
              <div>
                <h2 style={{fontSize: '17px', fontWeight: 700, color: '#1a1a2e'}}>Materials</h2>
                <div style={{fontSize: '13px', color: '#9ca3af', marginTop: '2px'}}>{materials.length} item{materials.length !== 1 ? 's' : ''} cataloged</div>
              </div>
              {materials.length > 0 && (
                <button className="btn-outline" onClick={() => window.location.href = `/homes/${params.id}/rooms/${params.roomId}/materials/add`}>
                  + Add Material
                </button>
              )}
            </div>

            {materials.length === 0 ? (
              <div style={{textAlign: 'center', padding: '48px 32px', border: '2px dashed #e9edf2', borderRadius: '12px', background: '#fafbfc'}}>
                <div style={{fontSize: '36px', marginBottom: '12px'}}>📦</div>
                <div style={{fontSize: '16px', fontWeight: 700, color: '#1a1a2e', marginBottom: '6px'}}>No materials yet</div>
                <div style={{fontSize: '13px', color: '#9ca3af', marginBottom: '20px'}}>
                  Start cataloging the materials, finishes, and fixtures in this room.
                </div>
                <button className="btn-primary" onClick={() => window.location.href = `/homes/${params.id}/rooms/${params.roomId}/materials/add`}>
                  Add Your First Material
                </button>
              </div>
            ) : (
              <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
                {materials.map(material => (
                  <div key={material.id} className="material-row">
                    <div style={{width: '42px', height: '42px', background: '#f0f6ff', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0}}>
                      📦
                    </div>
                    <div style={{flex: 1, minWidth: 0}}>
                      <div style={{fontSize: '14px', fontWeight: 600, color: '#1a1a2e', marginBottom: '2px'}}>{material.name}</div>
                      <div style={{fontSize: '12px', color: '#9ca3af'}}>
                        {[material.brand, material.color, material.finish].filter(Boolean).join(' · ') || 'No details added'}
                      </div>
                      {material.purchase_url && (
                        <a href={material.purchase_url} target="_blank" rel="noopener noreferrer"
                          style={{fontSize: '12px', color: '#006aff', textDecoration: 'none', marginTop: '4px', display: 'inline-block', fontWeight: 500}}>
                          View product →
                        </a>
                      )}
                    </div>
                    {material.cost > 0 && (
                      <div style={{fontSize: '15px', fontWeight: 700, color: '#006aff', flexShrink: 0}}>
                        ${(material.cost / 100).toLocaleString()}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  )
}
