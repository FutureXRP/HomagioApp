'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function HomeDashboard({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [home, setHome] = useState<any>(null)
  const [rooms, setRooms] = useState<any[]>([])
  const [materials, setMaterials] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchHome = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/login'); return }

      const { data: homeData, error: homeError } = await supabase
        .from('homes')
        .select('*')
        .eq('id', params.id)
        .single()

      if (homeError || !homeData) {
        setError('Home not found')
        setLoading(false)
        return
      }

      const { data: roomsData } = await supabase
        .from('rooms')
        .select('*')
        .eq('home_id', params.id)
        .order('created_at', { ascending: true })

      const { data: materialsData } = await supabase
        .from('materials')
        .select('*')
        .eq('home_id', params.id)
        .order('created_at', { ascending: false })

      setHome(homeData)
      setRooms(roomsData || [])
      setMaterials(materialsData || [])
      setLoading(false)
    }

    fetchHome()
  }, [params.id, router])

  if (loading) {
    return (
      <div style={{minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f8f8'}}>
        <div style={{fontSize: '16px', color: '#888'}}>Loading your home...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f8f8'}}>
        <div style={{textAlign: 'center'}}>
          <div style={{fontSize: '48px', marginBottom: '16px'}}>🏚️</div>
          <div style={{fontSize: '18px', fontWeight: 600, marginBottom: '8px'}}>{error}</div>
          <a href="/dashboard" style={{color: '#006aff', textDecoration: 'none'}}>Back to dashboard</a>
        </div>
      </div>
    )
  }

  return (
    <div style={{minHeight: '100vh', background: '#f8f8f8'}}>

      {/* Nav */}
      <nav style={{background: '#fff', borderBottom: '1px solid #e5e5e5', padding: '0 32px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
        <a href="/dashboard" style={{fontSize: '24px', fontWeight: 700, color: '#006aff', letterSpacing: '-1px', textDecoration: 'none'}}>
          hom<span style={{color: '#1a1a1a'}}>agio</span>
        </a>
        <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
          <a href="/dashboard" style={{fontSize: '14px', color: '#666', textDecoration: 'none'}}>← My Homes</a>
        </div>
      </nav>

      <div style={{maxWidth: '1200px', margin: '0 auto', padding: '40px 32px'}}>

        {/* Home Header */}
        <div style={{background: '#fff', borderRadius: '16px', border: '1px solid #e5e5e5', padding: '32px', marginBottom: '24px'}}>
          <div style={{display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px'}}>
            <div>
              <h1 style={{fontSize: '28px', fontWeight: 700, color: '#1a1a1a', letterSpacing: '-0.5px'}}>
                {home.name || home.address}
              </h1>
              <p style={{fontSize: '15px', color: '#888', marginTop: '4px'}}>
                {home.address}, {home.city}, {home.state} {home.zip}
              </p>
              <div style={{display: 'flex', gap: '16px', marginTop: '12px', flexWrap: 'wrap'}}>
                {home.bedrooms && <span style={{fontSize: '13px', color: '#555'}}>{home.bedrooms} beds</span>}
                {home.bathrooms && <span style={{fontSize: '13px', color: '#555'}}>{home.bathrooms} baths</span>}
                {home.square_feet && <span style={{fontSize: '13px', color: '#555'}}>{home.square_feet.toLocaleString()} sqft</span>}
                {home.year_built && <span style={{fontSize: '13px', color: '#555'}}>Built {home.year_built}</span>}
              </div>
            </div>
            <button
              onClick={() => router.push(`/homes/${params.id}/rooms/add`)}
              style={{background: '#006aff', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit'}}
            >
              + Add Room
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px'}}>
          {[
            {icon: '🚪', label: 'Rooms', value: rooms.length},
            {icon: '📦', label: 'Materials', value: materials.length},
            {icon: '💰', label: 'Est. Value', value: home.value_estimate ? `$${(home.value_estimate/100).toLocaleString()}` : 'N/A'},
            {icon: '📸', label: 'Photos', value: '0'},
          ].map(stat => (
            <div key={stat.label} style={{background: '#fff', border: '1px solid #e5e5e5', borderRadius: '12px', padding: '20px', textAlign: 'center'}}>
              <div style={{fontSize: '24px', marginBottom: '8px'}}>{stat.icon}</div>
              <div style={{fontSize: '22px', fontWeight: 700, color: '#1a1a1a'}}>{stat.value}</div>
              <div style={{fontSize: '13px', color: '#888', marginTop: '4px'}}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Rooms Section */}
        <div style={{background: '#fff', borderRadius: '16px', border: '1px solid #e5e5e5', padding: '28px', marginBottom: '24px'}}>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px'}}>
            <h2 style={{fontSize: '18px', fontWeight: 700, color: '#1a1a1a'}}>Rooms</h2>
            <button
              onClick={() => router.push(`/homes/${params.id}/rooms/add`)}
              style={{background: 'transparent', color: '#006aff', border: '1.5px solid #006aff', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit'}}
            >
              + Add Room
            </button>
          </div>

          {rooms.length === 0 ? (
            <div style={{textAlign: 'center', padding: '40px', border: '2px dashed #e5e5e5', borderRadius: '12px'}}>
              <div style={{fontSize: '32px', marginBottom: '12px'}}>🚪</div>
              <div style={{fontSize: '15px', fontWeight: 600, color: '#1a1a1a', marginBottom: '6px'}}>No rooms yet</div>
              <div style={{fontSize: '13px', color: '#888', marginBottom: '16px'}}>Add rooms to start cataloging your materials</div>
              <button
                onClick={() => router.push(`/homes/${params.id}/rooms/add`)}
                style={{background: '#006aff', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit'}}
              >
                Add Your First Room
              </button>
            </div>
          ) : (
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px'}}>
              {rooms.map(room => (
                <div
                  key={room.id}
                  onClick={() => router.push(`/homes/${params.id}/rooms/${room.id}`)}
                  style={{padding: '16px', border: '1px solid #e5e5e5', borderRadius: '10px', cursor: 'pointer', background: '#fafafa'}}
                >
                  <div style={{fontSize: '20px', marginBottom: '8px'}}>🚪</div>
                  <div style={{fontSize: '14px', fontWeight: 600, color: '#1a1a1a'}}>{room.name}</div>
                  <div style={{fontSize: '12px', color: '#888', marginTop: '2px'}}>{room.type}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Materials */}
        <div style={{background: '#fff', borderRadius: '16px', border: '1px solid #e5e5e5', padding: '28px'}}>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px'}}>
            <h2 style={{fontSize: '18px', fontWeight: 700, color: '#1a1a1a'}}>Recent Materials</h2>
          </div>

          {materials.length === 0 ? (
            <div style={{textAlign: 'center', padding: '40px', border: '2px dashed #e5e5e5', borderRadius: '12px'}}>
              <div style={{fontSize: '32px', marginBottom: '12px'}}>📦</div>
              <div style={{fontSize: '15px', fontWeight: 600, color: '#1a1a1a', marginBottom: '6px'}}>No materials yet</div>
              <div style={{fontSize: '13px', color: '#888'}}>Add rooms first then start cataloging materials</div>
            </div>
          ) : (
            <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
              {materials.slice(0, 5).map(material => (
                <div key={material.id} style={{display: 'flex', alignItems: 'center', gap: '14px', padding: '12px', border: '1px solid #f0f0f0', borderRadius: '8px'}}>
                  <div style={{width: '40px', height: '40px', background: '#f0f6ff', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0}}>📦</div>
                  <div style={{flex: 1}}>
                    <div style={{fontSize: '14px', fontWeight: 500, color: '#1a1a1a'}}>{material.name}</div>
                    <div style={{fontSize: '12px', color: '#888', marginTop: '2px'}}>{material.brand || 'No brand'} · {material.color || 'No color'}</div>
                  </div>
                  {material.cost > 0 && (
                    <div style={{fontSize: '14px', fontWeight: 600, color: '#006aff'}}>${(material.cost/100).toLocaleString()}</div>
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
