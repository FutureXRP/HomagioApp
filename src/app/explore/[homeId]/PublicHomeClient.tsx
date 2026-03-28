'use client'

import { useState } from 'react'

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

function MaterialCard({ material }: { material: any }) {
  const [expanded, setExpanded] = useState(false)
  const cost = material.cost > 0 ? `$${(material.cost / 100).toLocaleString()}` : null

  return (
    <div style={{border: '1px solid #e9edf2', borderRadius: '12px', overflow: 'hidden', marginBottom: '10px', background: '#fff'}}>
      <div onClick={() => setExpanded(!expanded)}
        style={{display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 16px', cursor: 'pointer', background: expanded ? '#f0f6ff' : '#fff', transition: 'background 0.12s'}}>
        <div style={{width: '52px', height: '52px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0, background: '#f0f6ff', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          {material.photo_url
            ? <img src={material.photo_url} alt={material.name} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
            : <span style={{fontSize: '22px'}}>📦</span>}
        </div>
        <div style={{flex: 1, minWidth: 0}}>
          <div style={{fontSize: '15px', fontWeight: 600, color: '#1a1a2e', marginBottom: '3px'}}>{material.name}</div>
          <div style={{fontSize: '12px', color: '#9ca3af'}}>{[material.brand, material.color, material.finish].filter(Boolean).join(' · ') || 'No details added'}</div>
        </div>
        <div style={{display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0}}>
          {cost && <div style={{fontSize: '15px', fontWeight: 700, color: '#006aff'}}>{cost}</div>}
          <div style={{fontSize: '18px', color: '#9ca3af', transition: 'transform 0.2s', transform: expanded ? 'rotate(90deg)' : 'none', lineHeight: 1}}>›</div>
        </div>
      </div>

      {expanded && (
        <div style={{borderTop: '1px solid #e9edf2'}}>
          {/* Full size photo — not cropped */}
          {material.photo_url && (
            <img
              src={material.photo_url}
              alt={material.name}
              style={{width: '100%', height: 'auto', display: 'block', maxHeight: '500px', objectFit: 'contain', background: '#f7f9fc'}}
            />
          )}

          <div style={{padding: '16px'}}>
            {/* Detail grid */}
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '10px', marginBottom: '16px'}}>
              {[
                {label: 'Brand', value: material.brand},
                {label: 'Color', value: material.color},
                {label: 'Finish', value: material.finish},
                {label: 'Category', value: material.category},
                {label: 'Cost', value: cost},
              ].filter(d => d.value).map(detail => (
                <div key={detail.label} style={{background: '#f7f9fc', borderRadius: '8px', padding: '10px 12px'}}>
                  <div style={{fontSize: '10px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '3px'}}>{detail.label}</div>
                  <div style={{fontSize: '13px', fontWeight: 600, color: '#1a1a2e'}}>{detail.value}</div>
                </div>
              ))}
            </div>

            {material.notes && (
              <div style={{fontSize: '13px', color: '#6b7280', lineHeight: 1.7, marginBottom: '16px', padding: '12px', background: '#f7f9fc', borderRadius: '8px'}}>
                {material.notes}
              </div>
            )}

            {(material.purchase_url || material.affiliate_url) && (
              <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap'}}>
                {material.purchase_url && (
                  <a href={material.purchase_url} target="_blank" rel="noopener noreferrer"
                    style={{flex: 1, minWidth: '140px', background: '#006aff', color: '#fff', padding: '12px 20px', borderRadius: '10px', fontSize: '14px', fontWeight: 600, textDecoration: 'none', textAlign: 'center', display: 'block'}}>
                    🛒 Buy This Material
                  </a>
                )}
                {material.affiliate_url && (
                  <a href={material.affiliate_url} target="_blank" rel="noopener noreferrer"
                    style={{flex: 1, minWidth: '140px', background: '#f0f6ff', color: '#006aff', padding: '12px 20px', borderRadius: '10px', fontSize: '14px', fontWeight: 600, textDecoration: 'none', textAlign: 'center', display: 'block', border: '1.5px solid #006aff'}}>
                    🔗 Affiliate Link
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function RoomCard({ room, materials }: { room: any, materials: any[] }) {
  const [expanded, setExpanded] = useState(false)
  const roomMaterials = materials.filter(m => m.room_id === room.id)

  return (
    <div style={{background: '#fff', border: '1.5px solid #e9edf2', borderRadius: '16px', overflow: 'hidden', marginBottom: '16px'}}>
      <div onClick={() => setExpanded(!expanded)} style={{cursor: 'pointer'}}>
        {/* Full size room photo — not cropped to fixed height */}
        {room.photo_url ? (
          <img
            src={room.photo_url}
            alt={room.name}
            style={{width: '100%', height: 'auto', display: 'block', maxHeight: '500px', objectFit: 'contain', background: '#0D1B2A'}}
          />
        ) : (
          <div style={{height: '80px', background: '#f0f6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px'}}>
            {getRoomIcon(room.type)}
          </div>
        )}
        <div style={{padding: '18px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
          <div>
            <div style={{fontSize: '17px', fontWeight: 700, color: '#1a1a2e', marginBottom: '3px'}}>{room.name}</div>
            <div style={{fontSize: '13px', color: '#9ca3af', textTransform: 'capitalize'}}>
              {room.type} · {roomMaterials.length} material{roomMaterials.length !== 1 ? 's' : ''} cataloged
            </div>
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
            <span style={{fontSize: '13px', color: '#006aff', fontWeight: 600}}>{expanded ? 'Hide' : 'View materials'}</span>
            <div style={{fontSize: '18px', color: '#006aff', transition: 'transform 0.2s', transform: expanded ? 'rotate(90deg)' : 'none', lineHeight: 1}}>›</div>
          </div>
        </div>
      </div>

      {expanded && (
        <div style={{borderTop: '1px solid #e9edf2', padding: '16px 20px'}}>
          {roomMaterials.length === 0 ? (
            <div style={{textAlign: 'center', padding: '24px', fontSize: '13px', color: '#9ca3af'}}>
              No materials cataloged in this room yet.
            </div>
          ) : (
            <>
              <div style={{fontSize: '12px', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px'}}>
                Materials in this room — click any to expand
              </div>
              {roomMaterials.map(material => (
                <MaterialCard key={material.id} material={material} />
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
        * { box-sizing: border-box; }
        body { font-family: system-ui, sans-serif; }
        .tag { display: inline-flex; align-items: center; gap: 4px; background: #f3f4f6; color: #374151; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 500; }
      `}</style>

      <div style={{minHeight: '100vh', background: '#f7f9fc', fontFamily: 'system-ui, sans-serif'}}>

        <nav style={{background: '#fff', borderBottom: '1px solid #e9edf2', padding: '0 32px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100}}>
          <a href="/" style={{fontSize: '22px', fontWeight: 700, color: '#006aff', letterSpacing: '-0.5px', textDecoration: 'none'}}>
            hom<span style={{color: '#1a1a2e'}}>agio</span>
          </a>
          <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
            <a href="/explore" style={{fontSize: '13px', color: '#6b7280', textDecoration: 'none', fontWeight: 500}}>← Explore</a>
            <a href="/signup" style={{background: '#006aff', color: '#fff', padding: '8px 18px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, textDecoration: 'none'}}>
              Catalog My Home Free
            </a>
          </div>
        </nav>

        {/* Hero photo — full size */}
        {home.photo_url && (
          <div style={{overflow: 'hidden', position: 'relative', background: '#0D1B2A'}}>
            <img
              src={home.photo_url}
              alt={home.name || home.address}
              style={{width: '100%', height: 'auto', maxHeight: '500px', objectFit: 'cover', display: 'block'}}
            />
            <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 60%)'}} />
            <div style={{position: 'absolute', bottom: '28px', left: '40px'}}>
              <h1 style={{fontSize: '32px', fontWeight: 700, color: '#fff', letterSpacing: '-0.5px', marginBottom: '4px'}}>
                {home.name || home.address}
              </h1>
              <div style={{fontSize: '15px', color: 'rgba(255,255,255,0.85)'}}>{home.city}, {home.state} {home.zip}</div>
            </div>
          </div>
        )}

        <div style={{maxWidth: '900px', margin: '0 auto', padding: '40px 32px'}}>

          {!home.photo_url && (
            <div style={{background: '#fff', borderRadius: '20px', border: '1px solid #e9edf2', padding: '32px', marginBottom: '24px'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px'}}>
                <span style={{fontSize: '28px'}}>🏠</span>
                <h1 style={{fontSize: '26px', fontWeight: 700, color: '#1a1a2e'}}>{home.name || home.address}</h1>
              </div>
              <div style={{fontSize: '14px', color: '#6b7280'}}>{home.address}, {home.city}, {home.state} {home.zip}</div>
            </div>
          )}

          <div style={{background: '#fff', borderRadius: '16px', border: '1px solid #e9edf2', padding: '24px 28px', marginBottom: '28px'}}>
            <div style={{display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px'}}>
              {home.bedrooms && <span className="tag">🛏️ {home.bedrooms} beds</span>}
              {home.bathrooms && <span className="tag">🛁 {home.bathrooms} baths</span>}
              {home.square_feet && <span className="tag">📐 {home.square_feet.toLocaleString()} sqft</span>}
              {home.year_built && <span className="tag">📅 Built {home.year_built}</span>}
            </div>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px'}}>
              {[
                {icon: '🚪', label: 'Rooms', value: rooms.length},
                {icon: '📦', label: 'Materials', value: materials.length},
                {icon: '💰', label: 'Value', value: totalValue > 0 ? `$${Math.round(totalValue / 100).toLocaleString()}` : '—'},
                {icon: '📸', label: 'Photos', value: totalPhotos},
              ].map(stat => (
                <div key={stat.label} style={{textAlign: 'center', padding: '14px', background: '#f7f9fc', borderRadius: '10px'}}>
                  <div style={{fontSize: '20px', marginBottom: '4px'}}>{stat.icon}</div>
                  <div style={{fontSize: '18px', fontWeight: 700, color: '#1a1a2e'}}>{stat.value}</div>
                  <div style={{fontSize: '11px', color: '#9ca3af', marginTop: '2px'}}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {rooms.length > 0 && (
            <div style={{marginBottom: '28px'}}>
              <h2 style={{fontSize: '20px', fontWeight: 700, color: '#1a1a2e', marginBottom: '6px'}}>Rooms & Materials</h2>
              <p style={{fontSize: '13px', color: '#9ca3af', marginBottom: '20px'}}>
                Click any room to see its full photo and materials. Click any material to see full details and buy links.
              </p>
              {rooms.map(room => (
                <RoomCard key={room.id} room={room} materials={materials} />
              ))}
            </div>
          )}

          <div style={{background: 'linear-gradient(135deg, #006aff 0%, #3b82f6 100%)', borderRadius: '20px', padding: '36px 40px', textAlign: 'center'}}>
            <div style={{fontSize: '22px', fontWeight: 700, color: '#fff', marginBottom: '8px'}}>Inspired? Catalog your own home for free.</div>
            <div style={{fontSize: '14px', color: 'rgba(255,255,255,0.8)', marginBottom: '20px'}}>Track every material, finish, and fixture — just like this home.</div>
            <a href="/signup" style={{background: '#fff', color: '#006aff', padding: '13px 32px', borderRadius: '10px', fontSize: '15px', fontWeight: 700, textDecoration: 'none', display: 'inline-block'}}>
              Get Started Free →
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
