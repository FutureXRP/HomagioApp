'use client'

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

function RoomIcon({ type, size = 32 }: { type: string; size?: number }) {
  const t = (type || '').toLowerCase()
  const stroke = 'rgba(255,255,255,0.5)'
  if (t.includes('bedroom')) return <svg width={size} height={size} viewBox="0 0 32 32" fill="none"><rect x="3" y="14" width="26" height="14" rx="2" stroke={stroke} strokeWidth="1.5" fill="none"/><path d="M3 21h26M9 21v-7M23 21v-7" stroke={stroke} strokeWidth="1.5"/></svg>
  if (t.includes('bathroom')) return <svg width={size} height={size} viewBox="0 0 32 32" fill="none"><path d="M6 18h20v6a5 5 0 01-5 5H11a5 5 0 01-5-5v-6z" stroke={stroke} strokeWidth="1.5" fill="none"/><path d="M6 18V8a3 3 0 016 0v10" stroke={stroke} strokeWidth="1.5"/></svg>
  if (t.includes('kitchen')) return <svg width={size} height={size} viewBox="0 0 32 32" fill="none"><rect x="4" y="6" width="24" height="20" rx="2" stroke={stroke} strokeWidth="1.5" fill="none"/><path d="M4 14h24M11 14v12M11 6v8" stroke={stroke} strokeWidth="1.5"/></svg>
  if (t.includes('exterior')) return <svg width={size} height={size} viewBox="0 0 32 32" fill="none"><path d="M4 15L16 5l12 10v13a2 2 0 01-2 2H6a2 2 0 01-2-2V15z" stroke={stroke} strokeWidth="1.5" fill="none"/><path d="M12 30V22h8v8" stroke={stroke} strokeWidth="1.5" fill="none"/></svg>
  if (t.includes('garage')) return <svg width={size} height={size} viewBox="0 0 32 32" fill="none"><rect x="3" y="11" width="26" height="17" rx="2" stroke={stroke} strokeWidth="1.5" fill="none"/><path d="M3 18h26M9 18v10M16 18v10M23 18v10M6 11L16 4l10 7" stroke={stroke} strokeWidth="1.5"/></svg>
  return <svg width={size} height={size} viewBox="0 0 32 32" fill="none"><rect x="3" y="3" width="26" height="26" rx="2" stroke={stroke} strokeWidth="1.5" fill="none"/><path d="M3 13h26M13 13v16" stroke={stroke} strokeWidth="1.5"/></svg>
}

export default function PublicRoomClient({ home, room, materials }: {
  home: any, room: any, materials: any[]
}) {
  const totalCost = materials.reduce((sum, m) => sum + (m.cost || 0), 0)
  const roomColor = getRoomColor(room.type)

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', system-ui, sans-serif; }
        .material-row {
          display: flex; align-items: center; gap: 14px;
          padding: 14px 16px; border-radius: 12px;
          border: 1.5px solid #e9edf2; background: #fff;
          cursor: pointer; text-decoration: none;
          transition: border-color 0.15s, box-shadow 0.15s, transform 0.15s;
        }
        .material-row:hover {
          border-color: #3db85a;
          box-shadow: 0 4px 16px rgba(61,184,90,0.1);
          transform: translateY(-1px);
        }
        .stat-card {
          background: #fff; border: 1px solid #e9edf2;
          border-radius: 14px; padding: 20px;
          display: flex; align-items: center; gap: 14px;
        }
        .stat-icon {
          width: 40px; height: 40px; border-radius: 10px;
          background: #0D1B2A;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
      `}</style>

      <div style={{ minHeight: '100vh', background: '#f7f9fc', fontFamily: "'DM Sans', system-ui, sans-serif" }}>

        {/* Nav */}
        <nav style={{ background: '#fff', borderBottom: '1px solid #e9edf2', padding: '0 40px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
          <a href="/" style={{ textDecoration: 'none' }}>
            <img src={LOGO_URL} alt="homagio" style={{ height: '52px', width: 'auto' }} />
          </a>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <a href={`/explore/${home.id}`} style={{ fontSize: '13px', color: '#6b7280', textDecoration: 'none', fontWeight: 500 }}>← {home.name || home.address}</a>
            <a href="/signup" style={{ background: '#3db85a', color: '#fff', padding: '9px 18px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}>
              Catalog My Home Free
            </a>
          </div>
        </nav>

        {/* Room hero */}
        {room.photo_url ? (
          <div style={{ position: 'relative', background: '#0D1B2A', overflow: 'hidden' }}>
            <img src={room.photo_url} alt={room.name} style={{ width: '100%', maxHeight: '480px', objectFit: 'cover', display: 'block' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%)' }} />
            <div style={{ position: 'absolute', bottom: '28px', left: '40px' }}>
              <p style={{ fontSize: '12px', fontWeight: 600, color: '#3db85a', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px' }}>{home.name || home.address}</p>
              <h1 style={{ fontSize: '34px', fontWeight: 700, color: '#fff', letterSpacing: '-0.5px' }}>{room.name}</h1>
              <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', marginTop: '4px', textTransform: 'capitalize' }}>{room.type}</p>
            </div>
          </div>
        ) : (
          <div style={{ height: '240px', background: roomColor, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(61,184,90,0.4), transparent)' }} />
            <RoomIcon type={room.type} size={48} />
            <div>
              <p style={{ fontSize: '12px', fontWeight: 600, color: '#3db85a', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px', textAlign: 'center' }}>{home.name || home.address}</p>
              <h1 style={{ fontSize: '32px', fontWeight: 700, color: '#fff', letterSpacing: '-0.5px', textAlign: 'center' }}>{room.name}</h1>
            </div>
          </div>
        )}

        <div style={{ maxWidth: '860px', margin: '0 auto', padding: '40px 40px 80px' }}>

          {/* Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '32px', fontSize: '13px', color: '#9ca3af' }}>
            <a href="/explore" style={{ color: '#9ca3af', textDecoration: 'none' }}>Explore</a>
            <span>›</span>
            <a href={`/explore/${home.id}`} style={{ color: '#9ca3af', textDecoration: 'none' }}>{home.name || home.address}</a>
            <span>›</span>
            <span style={{ color: '#1a1a2e', fontWeight: 500 }}>{room.name}</span>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '32px' }}>
            {[
              { label: 'Materials', value: materials.length, svg: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="2" y="2" width="14" height="14" rx="2" stroke="#3db85a" strokeWidth="1.5" fill="none"/><path d="M2 7h14M7 7v9" stroke="#3db85a" strokeWidth="1.5"/></svg> },
              { label: 'Total Cost', value: totalCost > 0 ? `$${Math.round(totalCost / 100).toLocaleString()}` : '—', svg: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7" stroke="#3db85a" strokeWidth="1.5" fill="none"/><path d="M9 5v1.5M9 11.5V13M6.5 10.5c0 .83.67 1.5 1.5 1.5h2a1.5 1.5 0 000-3H8a1.5 1.5 0 010-3h2A1.5 1.5 0 0111.5 7" stroke="#3db85a" strokeWidth="1.5" strokeLinecap="round"/></svg> },
              { label: 'Photos', value: materials.filter(m => m.photo_url).length + (room.photo_url ? 1 : 0), svg: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="1.5" y="3.5" width="15" height="12" rx="2" stroke="#3db85a" strokeWidth="1.5" fill="none"/><circle cx="9" cy="9.5" r="2.5" stroke="#3db85a" strokeWidth="1.5" fill="none"/><path d="M6.5 3.5l1-2h3l1 2" stroke="#3db85a" strokeWidth="1.5" strokeLinejoin="round"/></svg> },
            ].map(stat => (
              <div key={stat.label} className="stat-card">
                <div className="stat-icon">{stat.svg}</div>
                <div>
                  <div style={{ fontSize: '22px', fontWeight: 700, color: '#1a1a2e', letterSpacing: '-0.5px' }}>{stat.value}</div>
                  <div style={{ fontSize: '12px', color: '#9ca3af', fontWeight: 500, marginTop: '2px' }}>{stat.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Notes */}
          {room.notes && (
            <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #e9edf2', padding: '20px 24px', marginBottom: '28px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>About this room</div>
              <div style={{ fontSize: '14px', color: '#374151', lineHeight: 1.7 }}>{room.notes}</div>
            </div>
          )}

          {/* Materials */}
          <div style={{ marginBottom: '40px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1a1a2e' }}>Materials</h2>
                <p style={{ fontSize: '13px', color: '#9ca3af', marginTop: '3px' }}>{materials.length} item{materials.length !== 1 ? 's' : ''} cataloged in this room</p>
              </div>
            </div>

            {materials.length === 0 ? (
              <div style={{ background: '#0D1B2A', borderRadius: '16px', padding: '48px 32px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(61,184,90,0.4), transparent)' }} />
                <div style={{ fontSize: '16px', fontWeight: 600, color: 'rgba(255,255,255,0.6)', marginBottom: '6px' }}>No materials cataloged yet</div>
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.35)' }}>The homeowner hasn't added materials to this room.</div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {materials.map(material => {
                  const cost = material.cost > 0 ? `$${(material.cost / 100).toLocaleString()}` : null
                  return (
                    <a
                      key={material.id}
                      href={`/explore/${home.id}/rooms/${room.id}/materials/${material.id}`}
                      className="material-row"
                    >
                      <div style={{ width: '56px', height: '56px', borderRadius: '10px', overflow: 'hidden', flexShrink: 0, background: '#0D1B2A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {material.photo_url
                          ? <img src={material.photo_url} alt={material.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          : <svg width="20" height="20" viewBox="0 0 20 20" fill="none" opacity="0.35"><rect x="2" y="2" width="16" height="16" rx="2.5" stroke="#fff" strokeWidth="1.5" fill="none"/><path d="M2 8h16M8 8v10" stroke="#fff" strokeWidth="1.5"/></svg>
                        }
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '15px', fontWeight: 600, color: '#1a1a2e', marginBottom: '3px' }}>{material.name}</div>
                        <div style={{ fontSize: '12px', color: '#9ca3af' }}>{[material.brand, material.color, material.finish].filter(Boolean).join(' · ') || 'No details added'}</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                        {cost && <div style={{ fontSize: '15px', fontWeight: 700, color: '#3db85a' }}>{cost}</div>}
                        <div style={{ fontSize: '18px', color: '#d1d5db' }}>›</div>
                      </div>
                    </a>
                  )
                })}
              </div>
            )}
          </div>

          {/* CTA */}
          <div style={{ background: '#0D1B2A', borderRadius: '20px', padding: '40px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(61,184,90,0.5), transparent)' }} />
            <p style={{ fontSize: '12px', fontWeight: 700, color: '#3db85a', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '12px' }}>Inspired?</p>
            <div style={{ fontSize: '22px', fontWeight: 700, color: '#fff', marginBottom: '8px', letterSpacing: '-0.3px' }}>Catalog your own home for free.</div>
            <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', marginBottom: '24px', lineHeight: 1.6 }}>Track every material, finish, and fixture — just like this room.</div>
            <a href="/signup" style={{ background: '#3db85a', color: '#fff', padding: '13px 32px', borderRadius: '10px', fontSize: '15px', fontWeight: 700, textDecoration: 'none', display: 'inline-block' }}>
              Get Started Free →
            </a>
          </div>

        </div>
      </div>
    </>
  )
}
