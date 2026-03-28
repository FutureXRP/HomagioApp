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

export default function RoomDetailClient({ room, materials, homeId, roomId }: {
  room: any, materials: any[], homeId: string, roomId: string
}) {
  const totalCost = materials.reduce((sum, m) => sum + (m.cost || 0), 0)
  const icon = getRoomIcon(room.type)

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }
        body { font-family: system-ui, sans-serif; }
        .material-row { display: flex; align-items: center; gap: 14px; padding: 14px 16px; border: 1px solid #f3f4f6; border-radius: 10px; transition: background 0.12s; }
        .material-row:hover { background: #f9fafb; }
      `}</style>

      <div style={{minHeight: '100vh', background: '#f7f9fc', fontFamily: 'system-ui, sans-serif'}}>
        <nav style={{background: '#fff', borderBottom: '1px solid #e9edf2', padding: '0 32px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100}}>
          <a href="/dashboard" style={{fontSize: '22px', fontWeight: 700, color: '#006aff', letterSpacing: '-0.5px', textDecoration: 'none'}}>
            hom<span style={{color: '#1a1a2e'}}>agio</span>
          </a>
          <div style={{display: 'flex', alignItems: 'center', gap: '20px'}}>
            <a href={`/homes/${homeId}`} style={{fontSize: '13px', color: '#6b7280', textDecoration: 'none', fontWeight: 500}}>← Back to Home</a>
            <button onClick={() => window.location.href = `/homes/${homeId}/rooms/${roomId}/materials/add`}
              style={{background: '#006aff', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '9px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit'}}>
              + Add Material
            </button>
          </div>
        </nav>

        <div style={{maxWidth: '1100px', margin: '0 auto', padding: '40px 32px'}}>
          <div style={{background: '#fff', borderRadius: '20px', border: '1px solid #e9edf2', overflow: 'hidden', marginBottom: '24px'}}>
            <div style={{height: '8px', background: 'linear-gradient(90deg, #006aff 0%, #3b82f6 100%)'}} />
            <div style={{padding: '28px 32px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
                <div style={{fontSize: '48px'}}>{icon}</div>
                <div>
                  <h1 style={{fontSize: '24px', fontWeight: 700, color: '#1a1a2e', letterSpacing: '-0.5px'}}>{room.name}</h1>
                  <p style={{fontSize: '14px', color: '#6b7280', marginTop: '3px', textTransform: 'capitalize'}}>{room.type || 'Room'}</p>
                  {room.notes && <p style={{fontSize: '13px', color: '#6b7280', marginTop: '6px', maxWidth: '480px', lineHeight: 1.6}}>{room.notes}</p>}
                </div>
              </div>
              <button onClick={() => window.location.href = `/homes/${homeId}/rooms/${roomId}/materials/add`}
                style={{background: '#006aff', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '9px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit'}}>
                + Add Material
              </button>
            </div>
          </div>

          <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '24px'}}>
            {[
              {icon: '📦', label: 'Materials', value: materials.length},
              {icon: '💰', label: 'Total Cost', value: totalCost > 0 ? `$${Math.round(totalCost / 100).toLocaleString()}` : '$0'},
              {icon: '📸', label: 'Photos', value: '0'},
            ].map(stat => (
              <div key={stat.label} style={{background: '#fff', border: '1px solid #e9edf2', borderRadius: '14px', padding: '20px', textAlign: 'center'}}>
                <div style={{fontSize: '22px', marginBottom: '8px'}}>{stat.icon}</div>
                <div style={{fontSize: '22px', fontWeight: 700, color: '#1a1a2e'}}>{stat.value}</div>
                <div style={{fontSize: '12px', color: '#9ca3af', marginTop: '4px', fontWeight: 500}}>{stat.label}</div>
              </div>
            ))}
          </div>

          <div style={{background: '#fff', borderRadius: '16px', border: '1px solid #e9edf2', padding: '28px'}}>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px'}}>
              <div>
                <h2 style={{fontSize: '17px', fontWeight: 700, color: '#1a1a2e'}}>Materials</h2>
                <div style={{fontSize: '13px', color: '#9ca3af', marginTop: '2px'}}>{materials.length} item{materials.length !== 1 ? 's' : ''} cataloged</div>
              </div>
              {materials.length > 0 && (
                <button onClick={() => window.location.href = `/homes/${homeId}/rooms/${roomId}/materials/add`}
                  style={{background: 'transparent', color: '#006aff', border: '1.5px solid #006aff', padding: '8px 16px', borderRadius: '9px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit'}}>
                  + Add Material
                </button>
              )}
            </div>

            {materials.length === 0 ? (
              <div style={{textAlign: 'center', padding: '48px 32px', border: '2px dashed #e9edf2', borderRadius: '12px', background: '#fafbfc'}}>
                <div style={{fontSize: '36px', marginBottom: '12px'}}>📦</div>
                <div style={{fontSize: '16px', fontWeight: 700, color: '#1a1a2e', marginBottom: '6px'}}>No materials yet</div>
                <div style={{fontSize: '13px', color: '#9ca3af', marginBottom: '20px'}}>Start cataloging the materials in this room.</div>
                <button onClick={() => window.location.href = `/homes/${homeId}/rooms/${roomId}/materials/add`}
                  style={{background: '#006aff', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: '9px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit'}}>
                  Add Your First Material
                </button>
              </div>
            ) : (
              <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
                {materials.map(material => (
                  <div key={material.id} className="material-row">
                    <div style={{width: '42px', height: '42px', background: '#f0f6ff', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0}}>📦</div>
                    <div style={{flex: 1, minWidth: 0}}>
                      <div style={{fontSize: '14px', fontWeight: 600, color: '#1a1a2e', marginBottom: '2px'}}>{material.name}</div>
                      <div style={{fontSize: '12px', color: '#9ca3af'}}>{[material.brand, material.color, material.finish].filter(Boolean).join(' · ') || 'No details added'}</div>
                      {material.purchase_url && (
                        <a href={material.purchase_url} target="_blank" rel="noopener noreferrer"
                          style={{fontSize: '12px', color: '#006aff', textDecoration: 'none', marginTop: '4px', display: 'inline-block', fontWeight: 500}}>
                          View product →
                        </a>
                      )}
                    </div>
                    {material.cost > 0 && <div style={{fontSize: '15px', fontWeight: 700, color: '#006aff', flexShrink: 0}}>${(material.cost / 100).toLocaleString()}</div>}
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
