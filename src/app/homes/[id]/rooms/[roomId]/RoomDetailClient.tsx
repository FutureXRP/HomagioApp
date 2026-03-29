'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'

const LOGO_URL = 'https://res.cloudinary.com/dlb0guicc/image/upload/v1774805332/6_wln7y2.png'
const CLOUDINARY_CLOUD_NAME = 'dlb0guicc'
const CLOUDINARY_UPLOAD_PRESET = 'HomagioApp'

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

function RoomIcon({ type, size = 40 }: { type: string, size?: number }) {
  const t = (type || '').toLowerCase()
  const stroke = 'rgba(255,255,255,0.5)'
  const w = size, h = size
  if (t.includes('bedroom')) return <svg width={w} height={h} viewBox="0 0 40 40" fill="none"><rect x="4" y="18" width="32" height="18" rx="3" stroke={stroke} strokeWidth="1.5" fill="none"/><path d="M4 26h32M12 26V18M28 26V18" stroke={stroke} strokeWidth="1.5"/></svg>
  if (t.includes('bathroom')) return <svg width={w} height={h} viewBox="0 0 40 40" fill="none"><path d="M8 22h24v8a6 6 0 01-6 6H14a6 6 0 01-6-6v-8z" stroke={stroke} strokeWidth="1.5" fill="none"/><path d="M8 22V10a4 4 0 018 0v12" stroke={stroke} strokeWidth="1.5"/></svg>
  if (t.includes('kitchen')) return <svg width={w} height={h} viewBox="0 0 40 40" fill="none"><rect x="5" y="8" width="30" height="24" rx="3" stroke={stroke} strokeWidth="1.5" fill="none"/><path d="M5 18h30M14 18v14M14 8v10" stroke={stroke} strokeWidth="1.5"/></svg>
  if (t.includes('living')) return <svg width={w} height={h} viewBox="0 0 40 40" fill="none"><rect x="4" y="16" width="32" height="16" rx="3" stroke={stroke} strokeWidth="1.5" fill="none"/><path d="M4 24h32M10 32v4M30 32v4M4 20v-6a2 2 0 012-2h28a2 2 0 012 2v6" stroke={stroke} strokeWidth="1.5"/></svg>
  if (t.includes('garage')) return <svg width={w} height={h} viewBox="0 0 40 40" fill="none"><rect x="4" y="14" width="32" height="22" rx="2" stroke={stroke} strokeWidth="1.5" fill="none"/><path d="M4 22h32M12 22v14M20 22v14M28 22v14M7 14L20 5l13 9" stroke={stroke} strokeWidth="1.5"/></svg>
  if (t.includes('exterior')) return <svg width={w} height={h} viewBox="0 0 40 40" fill="none"><path d="M5 19L20 6l15 13v17a2 2 0 01-2 2H7a2 2 0 01-2-2V19z" stroke={stroke} strokeWidth="1.5" fill="none"/><path d="M15 38V28h10v10" stroke={stroke} strokeWidth="1.5" fill="none"/></svg>
  if (t.includes('office')) return <svg width={w} height={h} viewBox="0 0 40 40" fill="none"><rect x="8" y="6" width="24" height="20" rx="2" stroke={stroke} strokeWidth="1.5" fill="none"/><path d="M14 26v8M26 26v8M8 34h24" stroke={stroke} strokeWidth="1.5"/></svg>
  return <svg width={w} height={h} viewBox="0 0 40 40" fill="none"><rect x="4" y="4" width="32" height="32" rx="3" stroke={stroke} strokeWidth="1.5" fill="none"/><path d="M4 16h32M16 16v20" stroke={stroke} strokeWidth="1.5"/></svg>
}

export default function RoomDetailClient({ room, materials, homeId, roomId }: {
  room: any, materials: any[], homeId: string, roomId: string
}) {
  const [roomPhoto, setRoomPhoto] = useState<string>(room.photo_url || '')
  const [photoUploading, setPhotoUploading] = useState(false)
  const [photoError, setPhotoError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const totalCost = materials.reduce((sum, m) => sum + (m.cost || 0), 0)
  const roomColor = getRoomColor(room.type)

  const handleRoomPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) { setPhotoError('Please select an image file'); return }
    if (file.size > 10 * 1024 * 1024) { setPhotoError('Image must be under 10MB'); return }
    setPhotoUploading(true)
    setPhotoError('')
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)
      formData.append('folder', 'homagio/rooms')
      const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, { method: 'POST', body: formData })
      if (!response.ok) throw new Error('Upload failed')
      const data = await response.json()
      const supabase = createClient()
      await supabase.from('rooms').update({ photo_url: data.secure_url }).eq('id', roomId)
      setRoomPhoto(data.secure_url)
    } catch {
      setPhotoError('Upload failed. Please try again.')
    } finally {
      setPhotoUploading(false)
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', system-ui, sans-serif; }
        .material-row {
          display: flex; align-items: center; gap: 14px;
          padding: 14px 16px; border-radius: 10px;
          border: 1px solid #f3f4f6;
          transition: background 0.12s, border-color 0.12s; cursor: pointer;
        }
        .material-row:hover { background: #f7f9fc; border-color: #e2e8f0; }
        .stat-card {
          background: #fff; border: 1px solid #e9edf2;
          border-radius: 14px; padding: 22px 20px;
          display: flex; align-items: center; gap: 16px;
        }
        .stat-icon {
          width: 44px; height: 44px; border-radius: 12px;
          background: #0D1B2A;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        @keyframes spin { 0%{transform:rotate(0deg)} 100%{transform:rotate(360deg)} }
      `}</style>

      <div style={{ minHeight: '100vh', background: '#f7f9fc', fontFamily: "'DM Sans', system-ui, sans-serif" }}>

        {/* Nav */}
        <nav style={{ background: '#fff', borderBottom: '1px solid #e9edf2', padding: '0 40px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
          <a href="/dashboard" style={{ textDecoration: 'none' }}>
            <img src={LOGO_URL} alt="homagio" style={{ height: '52px', width: 'auto' }} />
          </a>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <a href={`/homes/${homeId}`} style={{ fontSize: '13px', color: '#6b7280', textDecoration: 'none', fontWeight: 500 }}>← Back to Home</a>
            <button
              onClick={() => window.location.href = `/homes/${homeId}/rooms/${roomId}/materials/add`}
              style={{ background: '#0D1B2A', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '9px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#112236')}
              onMouseLeave={e => (e.currentTarget.style.background = '#0D1B2A')}
            >
              + Add Material
            </button>
          </div>
        </nav>

        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 40px 80px' }}>

          {/* Room Hero */}
          <div style={{ background: '#fff', borderRadius: '20px', border: '1px solid #e9edf2', overflow: 'hidden', marginBottom: '24px' }}>
            {roomPhoto ? (
              <div style={{ position: 'relative' }}>
                <img src={roomPhoto} alt={room.name} style={{ width: '100%', height: '320px', objectFit: 'cover', display: 'block' }} />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  style={{ position: 'absolute', bottom: '16px', right: '16px', background: 'rgba(0,0,0,0.6)', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', backdropFilter: 'blur(6px)' }}
                >
                  Change Photo
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                style={{ height: '200px', background: roomColor, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', gap: '12px', position: 'relative', overflow: 'hidden', transition: 'opacity 0.15s' }}
                onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.opacity = '0.85'}
                onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.opacity = '1'}
              >
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(61,184,90,0.4), transparent)' }} />
                {photoUploading ? (
                  <>
                    <div style={{ width: '32px', height: '32px', border: '2.5px solid rgba(255,255,255,0.2)', borderTop: '2.5px solid #3db85a', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                    <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)' }}>Uploading...</div>
                  </>
                ) : (
                  <>
                    <RoomIcon type={room.type} size={40} />
                    <div style={{ fontSize: '14px', fontWeight: 600, color: 'rgba(255,255,255,0.6)' }}>Add a room photo</div>
                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)' }}>Show the whole room at a glance</div>
                  </>
                )}
              </div>
            )}
            {photoError && <div style={{ padding: '8px 16px', fontSize: '13px', color: '#dc2626', background: '#fef2f2' }}>{photoError}</div>}
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleRoomPhotoUpload} style={{ display: 'none' }} />

            {/* Accent bar */}
            <div style={{ height: '4px', background: 'linear-gradient(90deg, #3db85a 0%, #006aff 100%)' }} />

            <div style={{ padding: '28px 32px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: roomColor, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1px solid rgba(255,255,255,0.06)' }}>
                  <RoomIcon type={room.type} size={28} />
                </div>
                <div>
                  <p style={{ fontSize: '12px', fontWeight: 600, color: '#3db85a', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px' }}>Room</p>
                  <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#1a1a2e', letterSpacing: '-0.5px', marginBottom: '4px' }}>{room.name}</h1>
                  <p style={{ fontSize: '13px', color: '#6b7280', textTransform: 'capitalize' }}>{room.type || 'Room'}</p>
                  {room.notes && <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '8px', maxWidth: '480px', lineHeight: 1.6 }}>{room.notes}</p>}
                </div>
              </div>
              <button
                onClick={() => window.location.href = `/homes/${homeId}/rooms/${roomId}/materials/add`}
                style={{ background: '#3db85a', color: '#fff', border: 'none', padding: '11px 22px', borderRadius: '9px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.15s' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#34a34f')}
                onMouseLeave={e => (e.currentTarget.style.background = '#3db85a')}
              >
                + Add Material
              </button>
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '24px' }}>
            {[
              {
                label: 'Materials', value: materials.length,
                svg: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="3" y="3" width="14" height="14" rx="2" stroke="#3db85a" strokeWidth="1.5" fill="none"/><path d="M3 8h14M8 8v9" stroke="#3db85a" strokeWidth="1.5"/></svg>
              },
              {
                label: 'Total Cost', value: totalCost > 0 ? `$${Math.round(totalCost / 100).toLocaleString()}` : '$0',
                svg: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="7.5" stroke="#3db85a" strokeWidth="1.5" fill="none"/><path d="M10 6v1.5M10 12.5V14M7.5 11.5c0 .83.67 1.5 1.5 1.5h2a1.5 1.5 0 000-3H9a1.5 1.5 0 010-3h2A1.5 1.5 0 0112.5 8.5" stroke="#3db85a" strokeWidth="1.5" strokeLinecap="round"/></svg>
              },
              {
                label: 'Photos', value: materials.filter(m => m.photo_url).length + (roomPhoto ? 1 : 0),
                svg: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="2" y="4" width="16" height="13" rx="2" stroke="#3db85a" strokeWidth="1.5" fill="none"/><circle cx="10" cy="10.5" r="3" stroke="#3db85a" strokeWidth="1.5" fill="none"/><path d="M7 4l1-2h4l1 2" stroke="#3db85a" strokeWidth="1.5" strokeLinejoin="round"/></svg>
              },
            ].map(stat => (
              <div key={stat.label} className="stat-card">
                <div className="stat-icon">{stat.svg}</div>
                <div>
                  <div style={{ fontSize: '24px', fontWeight: 700, color: '#1a1a2e', letterSpacing: '-0.5px' }}>{stat.value}</div>
                  <div style={{ fontSize: '12px', color: '#9ca3af', fontWeight: 500, marginTop: '2px' }}>{stat.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Materials */}
          <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e9edf2', padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div>
                <h2 style={{ fontSize: '17px', fontWeight: 700, color: '#1a1a2e' }}>Materials</h2>
                <div style={{ fontSize: '13px', color: '#9ca3af', marginTop: '2px' }}>
                  {materials.length} item{materials.length !== 1 ? 's' : ''} — click any to view details
                </div>
              </div>
              {materials.length > 0 && (
                <button
                  onClick={() => window.location.href = `/homes/${homeId}/rooms/${roomId}/materials/add`}
                  style={{ background: 'transparent', color: '#3db85a', border: '1.5px solid #3db85a', padding: '8px 16px', borderRadius: '9px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.15s, color 0.15s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#3db85a'; e.currentTarget.style.color = '#fff' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#3db85a' }}
                >
                  + Add Material
                </button>
              )}
            </div>

            {materials.length === 0 ? (
              <div style={{ background: '#0D1B2A', borderRadius: '12px', padding: '48px 32px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(61,184,90,0.4), transparent)' }} />
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px', opacity: 0.35 }}>
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none"><rect x="4" y="4" width="32" height="32" rx="4" stroke="#fff" strokeWidth="2" fill="none"/><path d="M4 16h32M16 16v20" stroke="#fff" strokeWidth="2"/></svg>
                </div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: '#fff', marginBottom: '6px' }}>No materials yet</div>
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', marginBottom: '20px' }}>Start cataloging the materials in this room.</div>
                <button
                  onClick={() => window.location.href = `/homes/${homeId}/rooms/${roomId}/materials/add`}
                  style={{ background: '#3db85a', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: '9px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#34a34f')}
                  onMouseLeave={e => (e.currentTarget.style.background = '#3db85a')}
                >
                  Add Your First Material
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {materials.map(material => (
                  <div
                    key={material.id}
                    className="material-row"
                    onClick={() => window.location.href = `/homes/${homeId}/rooms/${roomId}/materials/${material.id}`}
                  >
                    <div style={{ width: '56px', height: '56px', borderRadius: '10px', overflow: 'hidden', flexShrink: 0, background: '#0D1B2A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {material.photo_url
                        ? <img src={material.photo_url} alt={material.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : <svg width="20" height="20" viewBox="0 0 20 20" fill="none" opacity="0.4"><rect x="2" y="2" width="16" height="16" rx="2.5" stroke="#fff" strokeWidth="1.5" fill="none"/><path d="M2 8h16M8 8v10" stroke="#fff" strokeWidth="1.5"/></svg>
                      }
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: '#1a1a2e', marginBottom: '2px' }}>{material.name}</div>
                      <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                        {[material.brand, material.color, material.finish].filter(Boolean).join(' · ') || 'No details added'}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
                      {material.cost > 0 && (
                        <div style={{ fontSize: '14px', fontWeight: 700, color: '#3db85a' }}>
                          ${(material.cost / 100).toLocaleString()}
                        </div>
                      )}
                      <div style={{ fontSize: '16px', color: '#d1d5db' }}>›</div>
                    </div>
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
