'use client'

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
        .room-card { background: #fff; border: 1.5px solid #e9edf2; border-radius: 12px; overflow: hidden; transition: border-color 0.15s, box-shadow 0.15s; }
        .room-card:hover { border-color: #006aff; box-shadow: 0 4px 16px rgba(0,106,255,0.1); }
        .material-row { display: flex; align-items: center; gap: 12px; padding: 12px 16px; border-bottom: 1px solid #f3f4f6; }
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

        {home.photo_url && (
          <div style={{height: '400px', overflow: 'hidden', position: 'relative'}}>
            <img src={home.photo_url} alt={home.name || home.address} style={{width: '100%', height: '100%', objectFit: 'cover', display: 'block'}} />
            <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)'}} />
            <div style={{position: 'absolute', bottom: '28px', left: '40px'}}>
              <h1 style={{fontSize: '32px', fontWeight: 700, color: '#fff', letterSpacing: '-0.5px', marginBottom: '4px'}}>
                {home.name || home.address}
              </h1>
              <div style={{fontSize: '15px', color: 'rgba(255,255,255,0.85)'}}>
                {home.city}, {home.state} {home.zip}
              </div>
            </div>
          </div>
        )}

        <div style={{maxWidth: '1100px', margin: '0 auto', padding: '40px 32px'}}>

          {!home.photo_url && (
            <div style={{background: '#fff', borderRadius: '20px', border: '1px solid #e9edf2', padding: '32px', marginBottom: '24px'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px'}}>
                <span style={{fontSize: '28px'}}>🏠</span>
                <h1 style={{fontSize: '26px', fontWeight: 700, color: '#1a1a2e'}}>{home.name || home.address}</h1>
              </div>
              <div style={{fontSize: '14px', color: '#6b7280', marginBottom: '14px'}}>{home.address}, {home.city}, {home.state} {home.zip}</div>
            </div>
          )}

          <div style={{background: '#fff', borderRadius: '16px', border: '1px solid #e9edf2', padding: '24px 28px', marginBottom: '24px'}}>
            <div style={{display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px'}}>
              {home.bedrooms && <span className="tag">🛏️ {home.bedrooms} beds</span>}
              {home.bathrooms && <span className="tag">🛁 {home.bathrooms} baths</span>}
              {home.square_feet && <span className="tag">📐 {home.square_feet.toLocaleString()} sqft</span>}
              {home.year_built && <span className="tag">📅 Built {home.year_built}</span>}
            </div>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px'}}>
              {[
                {icon: '🚪', label: 'Rooms', value: rooms.length},
                {icon: '📦', label: 'Materials', value: materials.length},
                {icon: '💰', label: 'Materials Value', value: totalValue > 0 ? `$${Math.round(totalValue / 100).toLocaleString()}` : '—'},
                {icon: '📸', label: 'Photos', value: totalPhotos},
              ].map(stat => (
                <div key={stat.label} style={{textAlign: 'center', padding: '16px', background: '#f7f9fc', borderRadius: '12px'}}>
                  <div style={{fontSize: '20px', marginBottom: '6px'}}>{stat.icon}</div>
                  <div style={{fontSize: '20px', fontWeight: 700, color: '#1a1a2e'}}>{stat.value}</div>
                  <div style={{fontSize: '11px', color: '#9ca3af', marginTop: '2px', fontWeight: 500}}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {rooms.length > 0 && (
            <div style={{marginBottom: '24px'}}>
              <h2 style={{fontSize: '20px', fontWeight: 700, color: '#1a1a2e', marginBottom: '16px'}}>Rooms</h2>
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px'}}>
                {rooms.map(room => {
                  const roomMaterials = materials.filter(m => m.room_id === room.id)
                  return (
                    <div key={room.id} className="room-card">
                      {room.photo_url ? (
                        <img src={room.photo_url} alt={room.name} style={{width: '100%', height: '160px', objectFit: 'cover', display: 'block'}} />
                      ) : (
                        <div style={{height: '80px', background: '#f0f6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px'}}>
                          {getRoomIcon(room.type)}
                        </div>
                      )}
                      <div style={{padding: '16px'}}>
                        <div style={{fontSize: '15px', fontWeight: 700, color: '#1a1a2e', marginBottom: '4px'}}>{room.name}</div>
                        <div style={{fontSize: '12px', color: '#9ca3af', marginBottom: '12px', textTransform: 'capitalize'}}>{room.type}</div>
                        {roomMaterials.length > 0 && (
                          <div>
                            <div style={{fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '8px'}}>Materials</div>
                            {roomMaterials.slice(0, 3).map(material => (
                              <div key={material.id} className="material-row">
                                <div style={{width: '36px', height: '36px', borderRadius: '6px', overflow: 'hidden', flexShrink: 0, background: '#f0f6ff', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                  {material.photo_url
                                    ? <img src={material.photo_url} alt={material.name} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                                    : <span style={{fontSize: '16px'}}>📦</span>}
                                </div>
                                <div style={{flex: 1, minWidth: 0}}>
                                  <div style={{fontSize: '13px', fontWeight: 600, color: '#1a1a2e', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>{material.name}</div>
                                  <div style={{fontSize: '11px', color: '#9ca3af'}}>{[material.brand, material.color].filter(Boolean).join(' · ') || 'No details'}</div>
                                </div>
                                {material.purchase_url && (
                                  <a href={material.purchase_url} target="_blank" rel="noopener noreferrer"
                                    style={{fontSize: '11px', color: '#006aff', textDecoration: 'none', fontWeight: 600, flexShrink: 0}}>
                                    Buy →
                                  </a>
                                )}
                              </div>
                            ))}
                            {roomMaterials.length > 3 && (
                              <div style={{fontSize: '12px', color: '#9ca3af', padding: '8px 16px'}}>+{roomMaterials.length - 3} more materials</div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          <div style={{background: 'linear-gradient(135deg, #006aff 0%, #3b82f6 100%)', borderRadius: '20px', padding: '36px 40px', textAlign: 'center'}}>
            <div style={{fontSize: '22px', fontWeight: 700, color: '#fff', marginBottom: '8px'}}>
              Inspired? Catalog your own home for free.
            </div>
            <div style={{fontSize: '14px', color: 'rgba(255,255,255,0.8)', marginBottom: '20px'}}>
              Track every material, finish, and fixture — just like this home.
            </div>
            <a href="/signup" style={{background: '#fff', color: '#006aff', padding: '13px 32px', borderRadius: '10px', fontSize: '15px', fontWeight: 700, textDecoration: 'none', display: 'inline-block'}}>
              Get Started Free →
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
