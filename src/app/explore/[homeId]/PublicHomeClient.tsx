'use client'

import { useState } from 'react'

const LOGO_URL = 'https://res.cloudinary.com/dlb0guicc/image/upload/v1774805332/6_wln7y2.png'

const ROOM_TYPE_COLORS: Record<string, string> = {
  bedroom: '#1a3a5c', bathroom: '#0f2d24', kitchen: '#2d1a00',
  living: '#1a1040', dining: '#2d1a1a', office: '#0a1f18',
  garage: '#1a1a2e', basement: '#112236', exterior: '#0D1B2A',
  laundry: '#1f1a2d', utility: '#1a2d1a', other: '#1a1a2e',
}

function getRoomColor(type: string) {
  if (!type) return '#1a1a2e'
  const key = type.toLowerCase()
  for (const k of Object.keys(ROOM_TYPE_COLORS)) {
    if (key.includes(k)) return ROOM_TYPE_COLORS[k]
  }
  return '#1a1a2e'
}

function MaterialRow({ material, homeId, roomId }: { material: any, homeId: string, roomId: string }) {
  const cost = material.cost > 0 ? `$${(material.cost / 100).toLocaleString()}` : null

  return (
    <a
      href={`/explore/${homeId}/rooms/${roomId}/materials/${material.id}`}
      style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 16px', borderRadius: '10px', border: '1.5px solid #e9edf2', background: '#fff', textDecoration: 'none', transition: 'border-color 0.15s, transform 0.15s', marginBottom: '8px' }}
      onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = '#3db85a'; (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-1px)' }}
      onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = '#e9edf2'; (e.currentTarget as HTMLAnchorElement).style.transform = 'none' }}
    >
      <div style={{ width: '52px', height: '52px', borderRadius: '10px', overflow: 'hidden', flexShrink: 0, background: '#0D1B2A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {material.photo_url
          ? <img src={material.photo_url} alt={material.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <svg width="20" height="20" viewBox="0 0 20 20" fill="none" opacity="0.35"><rect x="2" y="2" width="16" height="16" rx="2.5" stroke="#fff" strokeWidth="1.5" fill="none"/><path d="M2 8h16M8 8v10" stroke="#fff" strokeWidth="1.5"/></svg>
        }
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '14px', fontWeight: 600, color: '#1a1a2e', marginBottom: '2px' }}>{material.name}</div>
        <div style={{ fontSize: '12px', color: '#9ca3af' }}>{[material.brand, material.color, material.finish].filter(Boolean).join(' · ') || 'No details added'}</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
        {cost && <div style={{ fontSize: '14px', fontWeight: 700, color: '#3db85a' }}>{cost}</div>}
        <div style={{ fontSize: '16px', color: '#d1d5db' }}>›</div>
      </div>
    </a>
  )
}

function RoomCard({ room, materials, homeId }: { room: any, materials: any[], homeId: string }) {
  const [expanded, setExpanded] = useState(false)
  const roomMaterials = materials.filter(m => m.room_id === room.id)
  const roomColor = getRoomColor(room.type)

  return (
    <div style={{ background: '#fff', border: '1.5px solid #e9edf2', borderRadius: '16px', overflow: 'hidden', marginBottom: '16px', transition: 'border-color 0.15s' }}
      onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.borderColor = '#3db85a'}
      onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.borderColor = '#e9edf2'}
    >
      <div onClick={() => setExpanded(!expanded)} style={{ cursor: 'pointer' }}>
        {room.photo_url ? (
          <img src={room.photo_url} alt={room.name} style={{ width: '100%', maxHeight: '320px', objectFit: 'cover', display: 'block' }} />
        ) : (
          <div style={{ height: '120px', background: roomColor, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(61,184,90,0.3), transparent)' }} />
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" opacity="0.4">
              <rect x="3" y="3" width="30" height="30" rx="3" stroke="#fff" strokeWidth="1.5" fill="none"/>
              <path d="M3 15h30M15 15v18" stroke="#fff" strokeWidth="1.5"/>
            </svg>
          </div>
        )}
        <div style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '17px', fontWeight: 700, color: '#1a1a2e', marginBottom: '3px' }}>{room.name}</div>
            <div style={{ fontSize: '13px', color: '#9ca3af', textTransform: 'capitalize' }}>
              {room.type} · {roomMaterials.length} material{roomMaterials.length !== 1 ? 's' : ''}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <a
              href={`/explore/${homeId}/rooms/${room.id}`}
              onClick={e => e.stopPropagation()}
              style={{ fontSize: '12px', color: '#3db85a', fontWeight: 600, textDecoration: 'none', border: '1.5px solid #3db85a', padding: '5px 12px', borderRadius: '8px', whiteSpace: 'nowrap' }}
            >
              View page →
            </a>
            <div style={{ fontSize: '18px', color: '#9ca3af', transition: 'transform 0.2s', transform: expanded ? 'rotate(90deg)' : 'none', lineHeight: 1 }}>›</div>
          </div>
        </div>
      </div>

      {expanded && (
        <div style={{ borderTop: '1px solid #e9edf2', padding: '16px 20px' }}>
          {roomMaterials.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '24px', fontSize: '13px', color: '#9ca3af' }}>
              No materials cataloged in this room yet.
            </div>
          ) : (
            <>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>
                Materials — click any for full details
              </div>
              {roomMaterials.map(material => (
                <MaterialRow key={material.id} material={material} homeId={homeId} roomId={room.id} />
              ))}
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default function PublicHomeClient({ home, rooms, materials }: {
  home: any, rooms: any[], materials: any[]
}) {
  const totalValue = materials.reduce((sum, m) => sum + (m.cost || 0), 0)
  const totalPhotos = materials.filter(m => m.photo_url).length + (home.photo_url ? 1 : 0) + rooms.filter(r => r.photo_url).length

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', system-ui, sans-serif; }
        .tag { display: inline-flex; align-items: center; background: #f3f4f6; color: #374151; padding: 5px 12px; border-radius: 20px; font-size: 12px; font-weight: 500; }
        .stat-card { background: #fff; border: 1px solid #e9edf2; border-radius: 14px; padding: 20px; display: flex; align-items: center; gap: 14px; }
        .stat-icon { width: 40px; height: 40px; border-radius: 10px; background: #0D1B2A; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
      `}</style>

      <div style={{ minHeight: '100vh', background: '#f7f9fc', fontFamily: "'DM Sans', system-ui, sans-serif" }}>

        {/* Nav */}
        <nav style={{ background: '#fff', borderBottom: '1px solid #e9edf2', padding: '0 40px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
          <a href="/" style={{ textDecoration: 'none' }}>
            <img src={LOGO_URL} alt="homagio" style={{ height: '52px', width: 'auto' }} />
          </a>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <a href="/explore" style={{ fontSize: '13px', color: '#6b7280', textDecoration: 'none', fontWeight: 500 }}>← Explore</a>
            <a href="/signup" style={{ background: '#3db85a', color: '#fff', padding: '9px 18px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}>
              Catalog My Home Free
            </a>
          </div>
        </nav>

        {/* Hero */}
        {home.photo_url && (
          <div style={{ overflow: 'hidden', position: 'relative', background: '#0D1B2A' }}>
            <img src={home.photo_url} alt={home.name || home.address} style={{ width: '100%', maxHeight: '500px', objectFit: 'cover', display: 'block' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 55%)' }} />
            <div style={{ position: 'absolute', bottom: '32px', left: '40px' }}>
              <p style={{ fontSize: '12px', fontWeight: 600, color: '#3db85a', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>On Homagio</p>
              <h1 style={{ fontSize: '36px', fontWeight: 700, color: '#fff', letterSpacing: '-0.75px', marginBottom: '4px' }}>{home.name || home.address}</h1>
              <div style={{ fontSize: '15px', color: 'rgba(255,255,255,0.7)' }}>{home.city}, {home.state} {home.zip}</div>
            </div>
          </div>
        )}

        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 40px 80px' }}>

          {!home.photo_url && (
            <div style={{ background: '#0D1B2A', borderRadius: '20px', padding: '40px', marginBottom: '28px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(61,184,90,0.5), transparent)' }} />
              <p style={{ fontSize: '12px', fontWeight: 600, color: '#3db85a', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>On Homagio</p>
              <h1 style={{ fontSize: '30px', fontWeight: 700, color: '#fff', letterSpacing: '-0.5px', marginBottom: '6px' }}>{home.name || home.address}</h1>
              <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)' }}>{home.address}, {home.city}, {home.state} {home.zip}</div>
            </div>
          )}

          {/* Tags + stats */}
          <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e9edf2', padding: '24px 28px', marginBottom: '28px' }}>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
              {home.bedrooms && <span className="tag">{home.bedrooms} beds</span>}
              {home.bathrooms && <span className="tag">{home.bathrooms} baths</span>}
              {home.square_feet && <span className="tag">{home.square_feet.toLocaleString()} sqft</span>}
              {home.year_built && <span className="tag">Built {home.year_built}</span>}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
              {[
                { label: 'Rooms', value: rooms.length, svg: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="6" height="6" rx="1" stroke="#3db85a" strokeWidth="1.2" fill="none"/><rect x="9" y="1" width="6" height="6" rx="1" stroke="#3db85a" strokeWidth="1.2" fill="none"/><rect x="1" y="9" width="6" height="6" rx="1" stroke="#3db85a" strokeWidth="1.2" fill="none"/><rect x="9" y="9" width="6" height="6" rx="1" stroke="#3db85a" strokeWidth="1.2" fill="none"/></svg> },
                { label: 'Materials', value: materials.length, svg: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2" y="2" width="12" height="12" rx="1.5" stroke="#3db85a" strokeWidth="1.2" fill="none"/><path d="M2 6.5h12M6.5 6.5v7.5" stroke="#3db85a" strokeWidth="1.2"/></svg> },
                { label: 'Value', value: totalValue > 0 ? `$${Math.round(totalValue / 100).toLocaleString()}` : '—', svg: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke="#3db85a" strokeWidth="1.2" fill="none"/><path d="M8 4.5v1.2M8 10.3V11.5M6 9.5c0 .7.55 1.2 1.2 1.2h1.6a1.2 1.2 0 000-2.4H7.2A1.2 1.2 0 015.2 7h2.6A1.2 1.2 0 019 8.2" stroke="#3db85a" strokeWidth="1.2" strokeLinecap="round"/></svg> },
                { label: 'Photos', value: totalPhotos, svg: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="3" width="14" height="11" rx="1.5" stroke="#3db85a" strokeWidth="1.2" fill="none"/><circle cx="8" cy="8.5" r="2.5" stroke="#3db85a" strokeWidth="1.2" fill="none"/><path d="M5.5 3l1-2h3l1 2" stroke="#3db85a" strokeWidth="1.2" strokeLinejoin="round"/></svg> },
              ].map(stat => (
                <div key={stat.label} className="stat-card">
                  <div className="stat-icon">{stat.svg}</div>
                  <div>
                    <div style={{ fontSize: '18px', fontWeight: 700, color: '#1a1a2e', letterSpacing: '-0.3px' }}>{stat.value}</div>
                    <div style={{ fontSize: '11px', color: '#9ca3af', fontWeight: 500, marginTop: '1px' }}>{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Rooms */}
          {rooms.length > 0 && (
            <div style={{ marginBottom: '40px' }}>
              <div style={{ marginBottom: '20px' }}>
                <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#1a1a2e', marginBottom: '4px' }}>Rooms & Materials</h2>
                <p style={{ fontSize: '13px', color: '#9ca3af' }}>Click a room to expand materials, or visit its full page.</p>
              </div>
              {rooms.map(room => (
                <RoomCard key={room.id} room={room} materials={materials} homeId={home.id} />
              ))}
            </div>
          )}

          {/* CTA */}
          <div style={{ background: '#0D1B2A', borderRadius: '20px', padding: '40px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(61,184,90,0.5), transparent)' }} />
            <p style={{ fontSize: '12px', fontWeight: 700, color: '#3db85a', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '12px' }}>Inspired?</p>
            <div style={{ fontSize: '22px', fontWeight: 700, color: '#fff', marginBottom: '8px', letterSpacing: '-0.3px' }}>Catalog your own home for free.</div>
            <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.45)', marginBottom: '24px', lineHeight: 1.6 }}>Track every material, finish, and fixture — just like this home.</div>
            <a href="/signup" style={{ background: '#3db85a', color: '#fff', padding: '13px 32px', borderRadius: '10px', fontSize: '15px', fontWeight: 700, textDecoration: 'none', display: 'inline-block' }}>
              Get Started Free →
            </a>
          </div>

        </div>
      </div>
    </>
  )
}
