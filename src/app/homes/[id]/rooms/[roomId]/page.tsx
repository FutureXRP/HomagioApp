'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

const ROOM_ICONS: Record<string, string> = {
  'Living Room': '🛋️', 'Kitchen': '🍳', 'Master Bedroom': '🛏️',
  'Bedroom': '🛏️', 'Master Bathroom': '🚿', 'Bathroom': '🚿',
  'Half Bathroom': '🚽', 'Dining Room': '🍽️', 'Office': '💻',
  'Laundry Room': '🧺', 'Garage': '🚗', 'Basement': '🏚️',
  'Attic': '📦', 'Mudroom': '👟', 'Pantry': '🥫', 'Hallway': '🚪',
}

export default function RoomDetail({ params }: { params: { id: string; roomId: string } }) {
  const [room, setRoom] = useState<any>(null)
  const [materials, setMaterials] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchRoom = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { window.location.href = '/login'; return }

      const { data: roomData, error: roomError } = await supabase
        .from('rooms')
        .select('*')
        .eq('id', params.roomId)
        .single()

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

    fetchRoom()
  }, [params.roomId])

  if (loading) {
    return (
      <div style={{minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f8f8'}}>
        <div style={{fontSize: '16px', color: '#888'}}>Loading room...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f8f8'}}>
        <div style={{textAlign: 'center'}}>
          <div style={{fontSize: '48px', marginBottom: '16px'}}>🚪</div>
          <div style={{fontSize: '18px', fontWeight: 600, marginBottom: '8px'}}>{error}</div>
          <a href={`/homes/${params.id}`} style={{color: '#006aff', textDecoration: 'none'}}>← Back to Home</a>
        </div>
      </div>
    )
  }

  const icon = ROOM_ICONS[room.type] || '🚪'

  return (
    <div style={{minHeight: '100vh', background: '#f8f8f8'}}>
      <nav style={{background: '#fff', borderBottom: '1px solid #e5e5e5', padding: '0 32px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
        <a href="/dashboard" style={{fontSize: '24px', fontWeight: 700, color: '#006aff', letterSpacing: '-1px', textDecoration: 'none'}}>
          hom<span style={{color: '#1a1a1a'}}>agio</span>
        </a>
        <a href={`/homes/${params.id}`} style={{fontSize: '14px', color: '#666', textDecoration: 'none'}}>← Back to Home</a>
      </nav>

      <div style={{maxWidth: '1200px', margin: '0 auto', padding: '40px 32px'}}>

        {/* Room Header */}
        <div style={{background: '#fff', borderRadius: '16px', border: '1px solid #e5e5e5', padding: '32px', marginBottom: '24px'}}>
          <div style={{display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
              <div style={{fontSize: '48px'}}>{icon}</div>
              <div>
                <h1 style={{fontSize: '28px', fontWeight: 700, color: '#1a1a1a', letterSpacing: '-0.5px'}}>{room.name}</h1>
                <p style={{fontSize: '15px', color: '#888', marginTop: '4px'}}>
                  {room.type}{room.floor ? ` · ${room.floor === -1 ? 'Basement' : `${room.floor === 1 ? '1st' : room.floor === 2 ? '2nd' : room.floor === 3 ? '3rd' : `${room.floor}th`} Floor`}` : ''}
                </p>
                {room.notes && <p style={{fontSize: '14px', color: '#666', marginTop: '8px'}}>{room.notes}</p>}
              </div>
            </div>
            <button
              onClick={() => window.location.href = `/homes/${params.id}/rooms/${params.roomId}/materials/add`}
              style={{background: '#006aff', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit'}}
            >
              + Add Material
            </button>
          </div>
        </div>

        {/* Stats */}
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px'}}>
          {[
            {icon: '📦', label: 'Materials', value: materials.length},
            {icon: '💰', label: 'Total Cost', value: materials.reduce((sum, m) => sum + (m.cost || 0), 0) > 0 ? `$${(materials.reduce((sum, m) => sum + (m.cost || 0), 0) / 100).toLocaleString()}` : '$0'},
            {icon: '📸', label: 'Photos', value: '0'},
          ].map(stat => (
            <div key={stat.label} style={{background: '#fff', border: '1px solid #e5e5e5', borderRadius: '12px', padding: '20px', textAlign: 'center'}}>
              <div style={{fontSize: '24px', marginBottom: '8px'}}>{stat.icon}</div>
              <div style={{fontSize: '22px', fontWeight: 700, color: '#1a1a1a'}}>{stat.value}</div>
              <div style={{fontSize: '13px', color: '#888', marginTop: '4px'}}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Materials */}
        <div style={{background: '#fff', borderRadius: '16px', border: '1px solid #e5e5e5', padding: '28px'}}>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px'}}>
            <h2 style={{fontSize: '18px', fontWeight: 700, color: '#1a1a1a'}}>Materials</h2>
            <button
              onClick={() => window.location.href = `/homes/${params.id}/rooms/${params.roomId}/materials/add`}
              style={{background: 'transparent', color: '#006aff', border: '1.5px solid #006aff', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit'}}
            >
              + Add Material
            </button>
          </div>

          {materials.length === 0 ? (
            <div style={{textAlign: 'center', padding: '40px', border: '2px dashed #e5e5e5', borderRadius: '12px'}}>
              <div style={{fontSize: '32px', marginBottom: '12px'}}>📦</div>
              <div style={{fontSize: '15px', fontWeight: 600, color: '#1a1a1a', marginBottom: '6px'}}>No materials yet</div>
              <div style={{fontSize: '13px', color: '#888', marginBottom: '16px'}}>Start cataloging the materials in this room</div>
              <button
                onClick={() => window.location.href = `/homes/${params.id}/rooms/${params.roomId}/materials/add`}
                style={{background: '#006aff', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit'}}
              >
                Add Your First Material
              </button>
            </div>
          ) : (
            <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
              {materials.map(material => (
                <div key={material.id} style={{display: 'flex', alignItems: 'center', gap: '14px', padding: '14px', border: '1px solid #f0f0f0', borderRadius: '10px'}}>
                  <div style={{width: '44px', height: '44px', background: '#f0f6ff', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0}}>📦</div>
                  <div style={{flex: 1}}>
                    <div style={{fontSize: '14px', fontWeight: 600, color: '#1a1a1a'}}>{material.name}</div>
                    <div style={{fontSize: '12px', color: '#888', marginTop: '2px'}}>
                      {[material.brand, material.color, material.finish].filter(Boolean).join(' · ') || 'No details'}
                    </div>
                  </div>
                  {material.cost > 0 && (
                    <div style={{fontSize: '14px', fontWeight: 600, color: '#006aff', flexShrink: 0}}>${(material.cost/100).toLocaleString()}</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
