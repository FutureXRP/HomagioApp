'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'

const CLOUDINARY_CLOUD_NAME = 'dlb0guicc'
const CLOUDINARY_UPLOAD_PRESET = 'HomagioApp'

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

export default function HomeDetailClient({ home, rooms, materials, homeId }: {
  home: any, rooms: any[], materials: any[], homeId: string
}) {
  const [homePhoto, setHomePhoto] = useState<string>(home.photo_url || '')
  const [photoUploading, setPhotoUploading] = useState(false)
  const [photoError, setPhotoError] = useState('')
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

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: 'POST', body: formData }
      )
      if (!response.ok) throw new Error('Upload failed')
      const data = await response.json()

      const supabase = createClient()
      await supabase.from('homes').update({ photo_url: data.secure_url }).eq('id', homeId)
      setHomePhoto(data.secure_url)
    } catch {
      setPhotoError('Upload failed. Please try again.')
    } finally {
      setPhotoUploading(false)
    }
  }

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }
        body { font-family: system-ui, sans-serif; }
        .room-card { padding: 18px; border: 1.5px solid #e9edf2; border-radius: 12px; cursor: pointer; background: #fff; transition: border-color 0.15s, box-shadow 0.15s, transform 0.1s; }
        .room-card:hover { border-color: #006aff; box-shadow: 0 4px 16px rgba(0,106,255,0.1); transform: translateY(-1px); }
        .material-row { display: flex; align-items: center; gap: 14px; padding: 14px 16px; border-radius: 10px; border: 1px solid #f3f4f6; transition: background 0.12s; cursor: pointer; }
        .material-row:hover { background: #f9fafb; }
        .tag { display: inline-flex; align-items: center; gap: 4px; background: #f3f4f6; color: #374151; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 500; }
        @keyframes spin { 0%{transform:rotate(0deg)} 100%{transform:rotate(360deg)} }
      `}</style>

      <div style={{minHeight: '100vh', background: '#f7f9fc', fontFamily: 'system-ui, sans-serif'}}>
        <nav style={{background: '#fff', borderBottom: '1px solid #e9edf2', padding: '0 32px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100}}>
          <a href="/dashboard" style={{fontSize: '22px', fontWeight: 700, color: '#006aff', letterSpacing: '-0.5px', textDecoration: 'none'}}>
            hom<span style={{color: '#1a1a2e'}}>agio</span>
          </a>
          <div style={{display: 'flex', alignItems: 'center', gap: '20px'}}>
            <a href="/dashboard/homes" style={{fontSize: '13px', color: '#6b7280', textDecoration: 'none', fontWeight: 500}}>← My Homes</a>
            <button onClick={() => window.location.href = `/homes/${homeId}/rooms/add`}
              style={{background: '#006aff', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '9px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit'}}>
              + Add Room
            </button>
          </div>
        </nav>

        <div style={{maxWidth: '1180px', margin: '0 auto', padding: '40px 32px'}}>

          {/* Home Hero Card with photo */}
          <div style={{background: '#fff', borderRadius: '20px', border: '1px solid #e9edf2', overflow: 'hidden', marginBottom: '24px'}}>
            {homePhoto ? (
              <div style={{position: 'relative'}}>
                <img src={homePhoto} alt={home.name || home.address} style={{width: '100%', height: '300px', objectFit: 'cover', display: 'block'}} />
                <button onClick={() => fileInputRef.current?.click()}
                  style={{position: 'absolute', bottom: '16px', right: '16px', background: 'rgba(0,0,0,0.6)', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', backdropFilter: 'blur(6px)'}}>
                  Change Photo
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                style={{height: '180px', background: 'linear-gradient(135deg, #f0f6ff, #e8f0fe)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', gap: '10px'}}
                onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = 'linear-gradient(135deg, #e0edff, #d8e8ff)'}
                onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = 'linear-gradient(135deg, #f0f6ff, #e8f0fe)'}
              >
                {photoUploading ? (
                  <>
                    <div style={{width: '32px', height: '32px', border: '2.5px solid #bfdbfe', borderTop: '2.5px solid #006aff', borderRadius: '50%', animation: 'spin 0.8s linear infinite'}} />
                    <div style={{fontSize: '14px', color: '#6b7280'}}>Uploading...</div>
                  </>
                ) : (
                  <>
                    <div style={{fontSize: '32px'}}>📷</div>
                    <div style={{fontSize: '14px', fontWeight: 600, color: '#374151'}}>Add a home photo</div>
                    <div style={{fontSize: '12px', color: '#9ca3af'}}>Show the exterior of your home</div>
                  </>
                )}
              </div>
            )}
            {photoError && <div style={{padding: '8px 16px', fontSize: '13px', color: '#dc2626', background: '#fef2f2'}}>{photoError}</div>}
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleHomePhotoUpload} style={{display: 'none'}} />

            <div style={{height: '8px', background: 'linear-gradient(90deg, #006aff 0%, #3b82f6 100%)'}} />
            <div style={{padding: '32px'}}>
              <div style={{display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px'}}>
                <div>
                  <div style={{display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px'}}>
                    <span style={{fontSize: '28px'}}>🏠</span>
                    <h1 style={{fontSize: '26px', fontWeight: 700, color: '#1a1a2e', letterSpacing: '-0.5px'}}>{home.name || home.address}</h1>
                  </div>
                  <div style={{fontSize: '14px', color: '#6b7280', marginBottom: '14px'}}>{home.address}, {home.city}, {home.state} {home.zip}</div>
                  <div style={{display: 'flex', gap: '8px', flexWrap: 'wrap'}}>
                    {home.bedrooms && <span className="tag">🛏️ {home.bedrooms} beds</span>}
                    {home.bathrooms && <span className="tag">🛁 {home.bathrooms} baths</span>}
                    {home.square_feet && <span className="tag">📐 {home.square_feet.toLocaleString()} sqft</span>}
                    {home.year_built && <span className="tag">📅 Built {home.year_built}</span>}
                  </div>
                </div>
                <div style={{textAlign: 'right'}}>
                  <div style={{fontSize: '12px', color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px'}}>Homagio Estimate™</div>
                  <div style={{fontSize: '28px', fontWeight: 700, color: '#1a1a2e', letterSpacing: '-1px'}}>—</div>
                  <div style={{fontSize: '12px', color: '#9ca3af', marginTop: '2px'}}>Coming soon</div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '28px'}}>
            {[
              {icon: '🚪', label: 'Rooms', value: rooms.length},
              {icon: '📦', label: 'Materials', value: materials.length},
              {icon: '💰', label: 'Materials Value', value: totalMaterialValue > 0 ? `$${Math.round(totalMaterialValue / 100).toLocaleString()}` : '$0'},
              {icon: '📸', label: 'Photos', value: totalPhotos},
            ].map(stat => (
              <div key={stat.label} style={{background: '#fff', border: '1px solid #e9edf2', borderRadius: '14px', padding: '22px 20px', textAlign: 'center'}}>
                <div style={{fontSize: '22px', marginBottom: '8px'}}>{stat.icon}</div>
                <div style={{fontSize: '24px', fontWeight: 700, color: '#1a1a2e'}}>{stat.value}</div>
                <div style={{fontSize: '12px', color: '#9ca3af', marginTop: '4px', fontWeight: 500}}>{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Rooms */}
          <div style={{background: '#fff', borderRadius: '16px', border: '1px solid #e9edf2', padding: '28px', marginBottom: '24px'}}>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '22px'}}>
              <div>
                <h2 style={{fontSize: '17px', fontWeight: 700, color: '#1a1a2e'}}>Rooms</h2>
                <div style={{fontSize: '13px', color: '#9ca3af', marginTop: '2px'}}>{rooms.length} room{rooms.length !== 1 ? 's' : ''} cataloged</div>
              </div>
              <button onClick={() => window.location.href = `/homes/${homeId}/rooms/add`}
                style={{background: 'transparent', color: '#006aff', border: '1.5px solid #006aff', padding: '8px 16px', borderRadius: '9px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit'}}>
                + Add Room
              </button>
            </div>

            {rooms.length === 0 ? (
              <div style={{textAlign: 'center', padding: '48px 32px', border: '2px dashed #e9edf2', borderRadius: '12px', background: '#fafbfc'}}>
                <div style={{fontSize: '36px', marginBottom: '12px'}}>🚪</div>
                <div style={{fontSize: '16px', fontWeight: 700, color: '#1a1a2e', marginBottom: '6px'}}>No rooms yet</div>
                <div style={{fontSize: '13px', color: '#9ca3af', marginBottom: '20px'}}>Add rooms to start cataloging your materials.</div>
                <button onClick={() => window.location.href = `/homes/${homeId}/rooms/add`}
                  style={{background: '#006aff', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: '9px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit'}}>
                  Add Your First Room
                </button>
              </div>
            ) : (
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: '12px'}}>
                {rooms.map(room => (
                  <div key={room.id} className="room-card" onClick={() => window.location.href = `/homes/${homeId}/rooms/${room.id}`}>
                    {room.photo_url ? (
                      <img src={room.photo_url} alt={room.name} style={{width: '100%', height: '80px', objectFit: 'cover', borderRadius: '8px', marginBottom: '10px', display: 'block'}} />
                    ) : (
                      <div style={{fontSize: '26px', marginBottom: '10px'}}>{getRoomIcon(room.type)}</div>
                    )}
                    <div style={{fontSize: '14px', fontWeight: 700, color: '#1a1a2e', marginBottom: '3px'}}>{room.name}</div>
                    <div style={{fontSize: '12px', color: '#9ca3af', textTransform: 'capitalize'}}>{room.type || 'Room'}</div>
                  </div>
                ))}
                <div onClick={() => window.location.href = `/homes/${homeId}/rooms/add`}
                  style={{padding: '18px', border: '2px dashed #e9edf2', borderRadius: '12px', cursor: 'pointer', background: '#fafbfc', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '6px', minHeight: '100px'}}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = '#006aff'; (e.currentTarget as HTMLDivElement).style.background = '#f0f6ff' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = '#e9edf2'; (e.currentTarget as HTMLDivElement).style.background = '#fafbfc' }}
                >
                  <div style={{fontSize: '22px', color: '#9ca3af'}}>+</div>
                  <div style={{fontSize: '12px', color: '#9ca3af', fontWeight: 500}}>Add Room</div>
                </div>
              </div>
            )}
          </div>

          {/* Recent Materials */}
          <div style={{background: '#fff', borderRadius: '16px', border: '1px solid #e9edf2', padding: '28px'}}>
            <h2 style={{fontSize: '17px', fontWeight: 700, color: '#1a1a2e', marginBottom: '20px'}}>Recent Materials</h2>
            {materials.length === 0 ? (
              <div style={{textAlign: 'center', padding: '40px 32px', border: '2px dashed #e9edf2', borderRadius: '12px', background: '#fafbfc'}}>
                <div style={{fontSize: '36px', marginBottom: '12px'}}>📦</div>
                <div style={{fontSize: '16px', fontWeight: 700, color: '#1a1a2e', marginBottom: '6px'}}>No materials yet</div>
                <div style={{fontSize: '13px', color: '#9ca3af'}}>Open a room to start cataloging materials.</div>
              </div>
            ) : (
              <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
                {materials.slice(0, 5).map(material => (
                  <div key={material.id} className="material-row"
                    onClick={() => window.location.href = `/homes/${homeId}/rooms/${material.room_id}/materials/${material.id}`}>
                    <div style={{width: '52px', height: '52px', borderRadius: '10px', overflow: 'hidden', flexShrink: 0, background: '#f0f6ff', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                      {material.photo_url
                        ? <img src={material.photo_url} alt={material.name} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                        : <span style={{fontSize: '22px'}}>📦</span>}
                    </div>
                    <div style={{flex: 1, minWidth: 0}}>
                      <div style={{fontSize: '14px', fontWeight: 600, color: '#1a1a2e', marginBottom: '2px'}}>{material.name}</div>
                      <div style={{fontSize: '12px', color: '#9ca3af'}}>{[material.brand, material.color, material.finish].filter(Boolean).join(' · ') || 'No details added'}</div>
                    </div>
                    <div style={{display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0}}>
                      {material.cost > 0 && <div style={{fontSize: '15px', fontWeight: 700, color: '#006aff'}}>${(material.cost / 100).toLocaleString()}</div>}
                      <div style={{fontSize: '16px', color: '#d1d5db'}}>›</div>
                    </div>
                  </div>
                ))}
                {materials.length > 5 && (
                  <div style={{textAlign: 'center', padding: '12px', fontSize: '13px', color: '#9ca3af'}}>
                    +{materials.length - 5} more materials across all rooms
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
