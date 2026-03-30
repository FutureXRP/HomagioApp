'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import Nav from '@/components/Nav'

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

function RoomIcon({ type }: { type: string }) {
  const t = (type || '').toLowerCase()
  const stroke = 'rgba(255,255,255,0.5)'
  if (t.includes('bedroom')) return <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect x="2" y="9" width="20" height="11" rx="2" stroke={stroke} strokeWidth="1.5" fill="none"/><path d="M2 14h20M7 14V9M17 14V9" stroke={stroke} strokeWidth="1.5"/></svg>
  if (t.includes('bathroom')) return <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M4 12h16v4a4 4 0 01-4 4H8a4 4 0 01-4-4v-4z" stroke={stroke} strokeWidth="1.5" fill="none"/><path d="M4 12V5a2 2 0 014 0v7" stroke={stroke} strokeWidth="1.5"/></svg>
  if (t.includes('kitchen')) return <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="14" rx="2" stroke={stroke} strokeWidth="1.5" fill="none"/><path d="M3 10h18M8 10v9M8 5v5" stroke={stroke} strokeWidth="1.5"/></svg>
  if (t.includes('exterior')) return <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M3 11L12 3l9 8v9a1 1 0 01-1 1H4a1 1 0 01-1-1v-9z" stroke={stroke} strokeWidth="1.5" fill="none"/><path d="M9 21v-6h6v6" stroke={stroke} strokeWidth="1.5" fill="none"/></svg>
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="2" stroke={stroke} strokeWidth="1.5" fill="none"/><path d="M3 9h18M9 9v12" stroke={stroke} strokeWidth="1.5"/></svg>
}

export default function HomeDetailClient({ home, rooms, materials, homeId }: {
  home: any, rooms: any[], materials: any[], homeId: string
}) {
  const [homePhoto, setHomePhoto] = useState<string>(home.photo_url || '')
  const [photoUploading, setPhotoUploading] = useState(false)
  const [photoError, setPhotoError] = useState('')
  const [isPublic, setIsPublic] = useState<boolean>(home.is_public || false)
  const [toggleLoading, setToggleLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const totalMaterialValue = materials.reduce((sum, m) => sum + (m.cost || 0), 0)
  const totalPhotos = materials.filter(m => m.photo_url).length + (homePhoto ? 1 : 0)

  const handleHomePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
      formData.append('folder', 'homagio/homes')
      const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, { method: 'POST', body: formData })
      if (!response.ok) throw new Error('Upload failed')
      const data = await response.json()
      const supabase = createClient()
      await supabase.from('homes').update({ photo_url: data.secure_url }).eq('id', homeId)
      setHomePhoto(data.secure_url)
    } catch { setPhotoError('Upload failed. Please try again.') }
    finally { setPhotoUploading(false) }
  }

  const handleTogglePublic = async () => {
    setToggleLoading(true)
    const supabase = createClient()
    const newValue = !isPublic
    await supabase.from('homes').update({ is_public: newValue }).eq('id', homeId)
    setIsPublic(newValue)
    setToggleLoading(false)
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', system-ui, sans-serif; }
        .room-card { border-radius: 14px; cursor: pointer; overflow: hidden; border: 1.5px solid rgba(255,255,255,0.08); transition: transform 0.15s, box-shadow 0.15s, border-color 0.15s; display: flex; flex-direction: column; }
        .room-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.2); border-color: rgba(61,184,90,0.4); }
        .material-row { display: flex; align-items: center; gap: 14px; padding: 14px 16px; border-radius: 10px; border: 1px solid #f3f4f6; transition: background 0.12s, border-color 0.12s; cursor: pointer; }
        .material-row:hover { background: #f7f9fc; border-color: #e2e8f0; }
        .tag { display: inline-flex; align-items: center; gap: 6px; background: #f3f4f6; color: #374151; padding: 5px 12px; border-radius: 20px; font-size: 12px; font-weight: 500; }
        .stat-card { background: #fff; border: 1px solid #e9edf2; border-radius: 14px; padding: 22px 20px; display: flex; align-items: center; gap: 16px; }
        .stat-icon { width: 44px; height: 44px; border-radius: 12px; background: #0D1B2A; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        @keyframes spin { 0%{transform:rotate(0deg)} 100%{transform:rotate(360deg)} }
        .toggle-track { width: 44px; height: 24px; border-radius: 12px; cursor: pointer; border: none; transition: background 0.2s; position: relative; flex-shrink: 0; }
        .toggle-thumb { position: absolute; top: 3px; width: 18px; height: 18px; background: #fff; border-radius: 50%; transition: left 0.2s; box-shadow: 0 1px 3px rgba(0,0,0,0.2); }
        .add-room-card { border-radius: 14px; cursor: pointer; border: 2px dashed #e2e8f0; background: #fafbfc; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; min-height: 120px; transition: border-color 0.15s, background 0.15s; }
        .add-room-card:hover { border-color: #3db85a; background: #f0fdf4; }
      `}</style>

      <div style={{ minHeight: '100vh', background: '#f7f9fc', fontFamily: "'DM Sans', system-ui, sans-serif" }}>
        <Nav variant="dashboard" rightContent={
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <a href="/dashboard/homes" style={{ fontSize: '13px', color: '#6b7280', textDecoration: 'none', fontWeight: 500 }}>← My Homes</a>
            <button onClick={() => window.location.href = `/homes/${homeId}/rooms/add`}
              style={{ background: '#0D1B2A', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '9px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#112236')}
              onMouseLeave={e => (e.currentTarget.style.background = '#0D1B2A')}
            >+ Add Room</button>
          </div>
        } />

        <div style={{ maxWidth: '1180px', margin: '0 auto', padding: '40px 40px 80px' }}>

          {/* Home Hero */}
          <div style={{ background: '#fff', borderRadius: '20px', border: '1px solid #e9edf2', overflow: 'hidden', marginBottom: '24px' }}>
            {homePhoto ? (
              <div style={{ position: 'relative' }}>
                <img src={homePhoto} alt={home.name || home.address} style={{ width: '100%', height: '320px', objectFit: 'cover', display: 'block' }} />
                <button onClick={() => fileInputRef.current?.click()}
                  style={{ position: 'absolute', bottom: '16px', right: '16px', background: 'rgba(0,0,0,0.6)', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                  Change Photo
                </button>
              </div>
            ) : (
              <div onClick={() => fileInputRef.current?.click()}
                style={{ height: '200px', background: '#0D1B2A', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', gap: '12px', position: 'relative', overflow: 'hidden' }}
                onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.opacity = '0.85'}
                onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.opacity = '1'}
              >
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(61,184,90,0.4), transparent)' }} />
                {photoUploading
                  ? <div style={{ width: '32px', height: '32px', border: '2.5px solid rgba(255,255,255,0.2)', borderTop: '2.5px solid #3db85a', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                  : <><svg width="36" height="36" viewBox="0 0 36 36" fill="none" opacity="0.4"><path d="M4 26V14l6-6h16l6 6v12a2 2 0 01-2 2H6a2 2 0 01-2-2z" stroke="#fff" strokeWidth="1.5" fill="none"/><circle cx="18" cy="20" r="4" stroke="#fff" strokeWidth="1.5" fill="none"/></svg><div style={{ fontSize: '14px', fontWeight: 600, color: 'rgba(255,255,255,0.6)' }}>Add a home photo</div></>}
              </div>
            )}
            {photoError && <div style={{ padding: '8px 16px', fontSize: '13px', color: '#dc2626', background: '#fef2f2' }}>{photoError}</div>}
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleHomePhotoUpload} style={{ display: 'none' }} />
            <div style={{ height: '4px', background: 'linear-gradient(90deg, #3db85a 0%, #006aff 100%)' }} />
            <div style={{ padding: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <p style={{ fontSize: '12px', fontWeight: 600, color: '#3db85a', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>Home Profile</p>
                  <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#1a1a2e', letterSpacing: '-0.5px', marginBottom: '6px' }}>{home.name || home.address}</h1>
                  <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '16px' }}>{home.address}, {home.city}, {home.state} {home.zip}</div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {home.bedrooms && <span className="tag">{home.bedrooms} beds</span>}
                    {home.bathrooms && <span className="tag">{home.bathrooms} baths</span>}
                    {home.square_feet && <span className="tag">{home.square_feet.toLocaleString()} sqft</span>}
                    {home.year_built && <span className="tag">Built {home.year_built}</span>}
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#f7f9fc', padding: '12px 16px', borderRadius: '12px', border: '1px solid #e9edf2' }}>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>{isPublic ? 'Public' : 'Private'}</div>
                      <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '2px' }}>{isPublic ? 'Visible on Explore' : 'Only you can see this'}</div>
                    </div>
                    <button className="toggle-track" onClick={handleTogglePublic} disabled={toggleLoading}
                      style={{ background: isPublic ? '#3db85a' : '#d1d5db', opacity: toggleLoading ? 0.6 : 1 } as any}>
                      <div className="toggle-thumb" style={{ left: isPublic ? '23px' : '3px' }} />
                    </button>
                  </div>
                  <div style={{ textAlign: 'right', background: '#f7f9fc', padding: '12px 16px', borderRadius: '12px', border: '1px solid #e9edf2' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>Homagio Estimate™</div>
                    <div style={{ fontSize: '26px', fontWeight: 700, color: '#1a1a2e', letterSpacing: '-1px' }}>—</div>
                    <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '2px' }}>Coming soon</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '28px' }}>
            {[
              { label: 'Rooms', value: rooms.length, svg: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="2" y="2" width="7" height="7" rx="1.5" stroke="#3db85a" strokeWidth="1.5" fill="none"/><rect x="11" y="2" width="7" height="7" rx="1.5" stroke="#3db85a" strokeWidth="1.5" fill="none"/><rect x="2" y="11" width="7" height="7" rx="1.5" stroke="#3db85a" strokeWidth="1.5" fill="none"/><rect x="11" y="11" width="7" height="7" rx="1.5" stroke="#3db85a" strokeWidth="1.5" fill="none"/></svg> },
              { label: 'Materials', value: materials.length, svg: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="3" y="3" width="14" height="14" rx="2" stroke="#3db85a" strokeWidth="1.5" fill="none"/><path d="M3 8h14M8 8v9" stroke="#3db85a" strokeWidth="1.5"/></svg> },
              { label: 'Materials Value', value: totalMaterialValue > 0 ? `$${Math.round(totalMaterialValue / 100).toLocaleString()}` : '$0', svg: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="7.5" stroke="#3db85a" strokeWidth="1.5" fill="none"/><path d="M10 6v1.5M10 12.5V14M7.5 11.5c0 .83.67 1.5 1.5 1.5h2a1.5 1.5 0 000-3H9a1.5 1.5 0 010-3h2A1.5 1.5 0 0112.5 8.5" stroke="#3db85a" strokeWidth="1.5" strokeLinecap="round"/></svg> },
              { label: 'Photos', value: totalPhotos, svg: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="2" y="4" width="16" height="13" rx="2" stroke="#3db85a" strokeWidth="1.5" fill="none"/><circle cx="10" cy="10.5" r="3" stroke="#3db85a" strokeWidth="1.5" fill="none"/><path d="M7 4l1-2h4l1 2" stroke="#3db85a" strokeWidth="1.5" strokeLinejoin="round"/></svg> },
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

          {/* Rooms */}
          <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e9edf2', padding: '28px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '22px' }}>
              <div>
                <h2 style={{ fontSize: '17px', fontWeight: 700, color: '#1a1a2e' }}>Rooms</h2>
                <div style={{ fontSize: '13px', color: '#9ca3af', marginTop: '2px' }}>{rooms.length} room{rooms.length !== 1 ? 's' : ''} cataloged</div>
              </div>
              <button onClick={() => window.location.href = `/homes/${homeId}/rooms/add`}
                style={{ background: 'transparent', color: '#3db85a', border: '1.5px solid #3db85a', padding: '8px 16px', borderRadius: '9px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#3db85a'; e.currentTarget.style.color = '#fff' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#3db85a' }}
              >+ Add Room</button>
            </div>
            {rooms.length === 0 ? (
              <div style={{ background: '#0D1B2A', borderRadius: '12px', padding: '48px 32px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(61,184,90,0.4), transparent)' }} />
                <div style={{ fontSize: '16px', fontWeight: 700, color: '#fff', marginBottom: '6px' }}>No rooms yet</div>
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', marginBottom: '20px' }}>Add rooms to start cataloging your materials.</div>
                <button onClick={() => window.location.href = `/homes/${homeId}/rooms/add`}
                  style={{ background: '#3db85a', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: '9px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                  Add Your First Room
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '12px' }}>
                {rooms.map(room => (
                  <div key={room.id} className="room-card" onClick={() => window.location.href = `/homes/${homeId}/rooms/${room.id}`}
                    style={{ background: getRoomColor(room.type) }}>
                    {room.photo_url
                      ? <img src={room.photo_url} alt={room.name} style={{ width: '100%', height: '90px', objectFit: 'cover', display: 'block', flexShrink: 0 }} />
                      : <div style={{ height: '90px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><RoomIcon type={room.type} /></div>}
                    <div style={{ padding: '12px 14px' }}>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff', marginBottom: '2px' }}>{room.name}</div>
                      <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)', textTransform: 'capitalize' }}>{room.type || 'Room'}</div>
                    </div>
                  </div>
                ))}
                <div className="add-room-card" onClick={() => window.location.href = `/homes/${homeId}/rooms/add`}>
                  <div style={{ fontSize: '22px', color: '#9ca3af' }}>+</div>
                  <div style={{ fontSize: '12px', color: '#9ca3af', fontWeight: 500 }}>Add Room</div>
                </div>
              </div>
            )}
          </div>

          {/* Recent Materials */}
          <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e9edf2', padding: '28px' }}>
            <h2 style={{ fontSize: '17px', fontWeight: 700, color: '#1a1a2e', marginBottom: '20px' }}>Recent Materials</h2>
            {materials.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 32px', border: '2px dashed #e9edf2', borderRadius: '12px', background: '#fafbfc' }}>
                <div style={{ fontSize: '16px', fontWeight: 700, color: '#1a1a2e', marginBottom: '6px' }}>No materials yet</div>
                <div style={{ fontSize: '13px', color: '#9ca3af' }}>Open a room to start cataloging materials.</div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {materials.slice(0, 5).map(material => (
                  <div key={material.id} className="material-row"
                    onClick={() => window.location.href = `/homes/${homeId}/rooms/${material.room_id}/materials/${material.id}`}>
                    <div style={{ width: '52px', height: '52px', borderRadius: '10px', overflow: 'hidden', flexShrink: 0, background: '#0D1B2A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {material.photo_url ? <img src={material.photo_url} alt={material.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <svg width="20" height="20" viewBox="0 0 20 20" fill="none" opacity="0.4"><rect x="2" y="2" width="16" height="16" rx="2.5" stroke="#fff" strokeWidth="1.5" fill="none"/><path d="M2 8h16M8 8v10" stroke="#fff" strokeWidth="1.5"/></svg>}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: '#1a1a2e', marginBottom: '2px' }}>{material.name}</div>
                      <div style={{ fontSize: '12px', color: '#9ca3af' }}>{[material.brand, material.color, material.finish].filter(Boolean).join(' · ') || 'No details added'}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
                      {material.cost > 0 && <div style={{ fontSize: '14px', fontWeight: 700, color: '#3db85a' }}>${(material.cost / 100).toLocaleString()}</div>}
                      <div style={{ fontSize: '16px', color: '#d1d5db' }}>›</div>
                    </div>
                  </div>
                ))}
                {materials.length > 5 && <div style={{ textAlign: 'center', padding: '12px', fontSize: '13px', color: '#9ca3af' }}>+{materials.length - 5} more materials across all rooms</div>}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
