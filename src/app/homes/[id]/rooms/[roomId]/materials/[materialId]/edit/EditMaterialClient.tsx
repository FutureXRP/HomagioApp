'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'

const CLOUDINARY_CLOUD_NAME = 'dlb0guicc'
const CLOUDINARY_UPLOAD_PRESET = 'HomagioApp'

const MATERIAL_CATEGORIES = [
  'Flooring', 'Wall Paint', 'Tile', 'Countertops', 'Cabinets', 'Appliances',
  'Lighting', 'Plumbing Fixtures', 'Hardware', 'Windows', 'Doors', 'Trim & Molding',
  'Wallpaper', 'Ceiling', 'Insulation', 'HVAC', 'Electrical', 'Other'
]

const FINISHES = [
  'Matte', 'Satin', 'Semi-Gloss', 'Gloss', 'Eggshell', 'Flat',
  'Brushed', 'Polished', 'Honed', 'Textured', 'Natural', 'Other'
]

export default function EditMaterialClient({ material, homeId, roomId }: {
  material: any, homeId: string, roomId: string
}) {
  const [name, setName] = useState(material.name || '')
  const [brand, setBrand] = useState(material.brand || '')
  const [category, setCategory] = useState(material.category || '')
  const [color, setColor] = useState(material.color || '')
  const [finish, setFinish] = useState(material.finish || '')
  const [cost, setCost] = useState(material.cost ? (material.cost / 100).toFixed(2) : '')
  const [purchaseUrl, setPurchaseUrl] = useState(material.purchase_url || '')
  const [affiliateUrl, setAffiliateUrl] = useState(material.affiliate_url || '')
  const [notes, setNotes] = useState(material.notes || '')
  const [photoUrl, setPhotoUrl] = useState(material.photo_url || '')
  const [photoUploading, setPhotoUploading] = useState(false)
  const [photoError, setPhotoError] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
      formData.append('folder', 'homagio/materials')

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: 'POST', body: formData }
      )
      if (!response.ok) throw new Error('Upload failed')
      const data = await response.json()
      setPhotoUrl(data.secure_url)
    } catch {
      setPhotoError('Upload failed. Please try again.')
    } finally {
      setPhotoUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()

    const costInCents = cost ? Math.round(parseFloat(cost) * 100) : 0

    const { error: updateError } = await supabase
      .from('materials')
      .update({
        name: name.trim(),
        brand: brand.trim() || null,
        category: category || null,
        color: color.trim() || null,
        finish: finish || null,
        notes: notes.trim() || null,
        cost: costInCents,
        purchase_url: purchaseUrl.trim() || null,
        affiliate_url: affiliateUrl.trim() || null,
        photo_url: photoUrl || null,
      })
      .eq('id', material.id)

    if (updateError) { setError(updateError.message); setLoading(false); return }
    window.location.href = `/homes/${homeId}/rooms/${roomId}/materials/${material.id}`
  }

  const handleDelete = async () => {
    const supabase = createClient()
    await supabase.from('materials').delete().eq('id', material.id)
    window.location.href = `/homes/${homeId}/rooms/${roomId}`
  }

  return (
    <div style={{minHeight: '100vh', background: '#f8f8f8'}}>
      <nav style={{background: '#fff', borderBottom: '1px solid #e5e5e5', padding: '0 32px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
        <a href="/dashboard" style={{fontSize: '24px', fontWeight: 700, color: '#006aff', letterSpacing: '-1px', textDecoration: 'none'}}>
          hom<span style={{color: '#1a1a1a'}}>agio</span>
        </a>
        <a href={`/homes/${homeId}/rooms/${roomId}/materials/${material.id}`} style={{fontSize: '14px', color: '#666', textDecoration: 'none'}}>
          ← Back to Material
        </a>
      </nav>

      <div style={{maxWidth: '600px', margin: '0 auto', padding: '48px 24px'}}>
        <div style={{marginBottom: '32px'}}>
          <h1 style={{fontSize: '28px', fontWeight: 700, color: '#1a1a1a', letterSpacing: '-0.5px'}}>Edit Material</h1>
          <p style={{fontSize: '15px', color: '#666', marginTop: '6px'}}>Update the details for {material.name}.</p>
        </div>

        {error && (
          <div style={{background: '#fff0f0', border: '1px solid #ffc0c0', color: '#cc0000', padding: '12px 16px', borderRadius: '8px', marginBottom: '24px', fontSize: '14px'}}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          {/* Photo */}
          <div style={{background: '#fff', borderRadius: '16px', border: '1px solid #e5e5e5', padding: '28px', marginBottom: '16px'}}>
            <label style={{fontSize: '14px', fontWeight: 600, color: '#1a1a1a', display: 'block', marginBottom: '12px'}}>
              📸 Material Photo <span style={{fontSize: '12px', fontWeight: 400, color: '#888'}}>(optional)</span>
            </label>

            {photoUrl ? (
              <div style={{position: 'relative'}}>
                <img src={photoUrl} alt="Material" style={{width: '100%', height: '220px', objectFit: 'cover', borderRadius: '10px', display: 'block'}} />
                <div style={{position: 'absolute', top: '10px', right: '10px', display: 'flex', gap: '8px'}}>
                  <button type="button" onClick={() => fileInputRef.current?.click()}
                    style={{background: 'rgba(0,0,0,0.6)', color: '#fff', border: 'none', borderRadius: '20px', padding: '5px 12px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', backdropFilter: 'blur(6px)'}}>
                    Change
                  </button>
                  <button type="button" onClick={() => { setPhotoUrl(''); if (fileInputRef.current) fileInputRef.current.value = '' }}
                    style={{background: 'rgba(220,38,38,0.8)', color: '#fff', border: 'none', borderRadius: '20px', padding: '5px 12px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', backdropFilter: 'blur(6px)'}}>
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                style={{border: '2px dashed #e5e5e5', borderRadius: '10px', padding: '36px', textAlign: 'center', background: '#fafafa', cursor: 'pointer'}}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = '#006aff'; (e.currentTarget as HTMLDivElement).style.background = '#f0f6ff' }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = '#e5e5e5'; (e.currentTarget as HTMLDivElement).style.background = '#fafafa' }}
              >
                {photoUploading ? (
                  <>
                    <div style={{width: '32px', height: '32px', border: '2.5px solid #e5e5e5', borderTop: '2.5px solid #006aff', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px'}} />
                    <style>{`@keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}`}</style>
                    <div style={{fontSize: '14px', color: '#888'}}>Uploading...</div>
                  </>
                ) : (
                  <>
                    <div style={{fontSize: '32px', marginBottom: '8px'}}>📷</div>
                    <div style={{fontSize: '14px', fontWeight: 600, color: '#444', marginBottom: '4px'}}>Click to upload a photo</div>
                    <div style={{fontSize: '12px', color: '#aaa'}}>JPG, PNG, WEBP up to 10MB</div>
                  </>
                )}
              </div>
            )}
            {photoError && <div style={{fontSize: '13px', color: '#cc0000', marginTop: '8px'}}>{photoError}</div>}
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoUpload} style={{display: 'none'}} />
          </div>

          {/* Material Details */}
          <div style={{background: '#fff', borderRadius: '16px', border: '1px solid #e5e5e5', padding: '28px', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '20px'}}>
            <h3 style={{fontSize: '15px', fontWeight: 700, color: '#1a1a1a', margin: 0}}>Material Details</h3>
            <div>
              <label style={{display: 'block', fontSize: '14px', fontWeight: 600, color: '#1a1a1a', marginBottom: '8px'}}>Material Name <span style={{color: '#006aff'}}>*</span></label>
              <input type="text" required value={name} onChange={e => setName(e.target.value)}
                style={{width: '100%', padding: '10px 14px', border: '1.5px solid #e5e5e5', borderRadius: '8px', fontSize: '15px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box'}} />
            </div>
            <div>
              <label style={{display: 'block', fontSize: '14px', fontWeight: 600, color: '#1a1a1a', marginBottom: '8px'}}>Category</label>
              <select value={category} onChange={e => setCategory(e.target.value)}
                style={{width: '100%', padding: '10px 14px', border: '1.5px solid #e5e5e5', borderRadius: '8px', fontSize: '15px', outline: 'none', fontFamily: 'inherit', background: '#fff', boxSizing: 'border-box'}}>
                <option value="">Select a category...</option>
                {MATERIAL_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={{display: 'block', fontSize: '14px', fontWeight: 600, color: '#1a1a1a', marginBottom: '8px'}}>Brand <span style={{fontSize: '12px', fontWeight: 400, color: '#888'}}>(optional)</span></label>
              <input type="text" value={brand} onChange={e => setBrand(e.target.value)}
                style={{width: '100%', padding: '10px 14px', border: '1.5px solid #e5e5e5', borderRadius: '8px', fontSize: '15px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box'}} />
            </div>
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px'}}>
              <div>
                <label style={{display: 'block', fontSize: '14px', fontWeight: 600, color: '#1a1a1a', marginBottom: '8px'}}>Color <span style={{fontSize: '12px', fontWeight: 400, color: '#888'}}>(optional)</span></label>
                <input type="text" value={color} onChange={e => setColor(e.target.value)}
                  style={{width: '100%', padding: '10px 14px', border: '1.5px solid #e5e5e5', borderRadius: '8px', fontSize: '15px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box'}} />
              </div>
              <div>
                <label style={{display: 'block', fontSize: '14px', fontWeight: 600, color: '#1a1a1a', marginBottom: '8px'}}>Finish <span style={{fontSize: '12px', fontWeight: 400, color: '#888'}}>(optional)</span></label>
                <select value={finish} onChange={e => setFinish(e.target.value)}
                  style={{width: '100%', padding: '10px 14px', border: '1.5px solid #e5e5e5', borderRadius: '8px', fontSize: '15px', outline: 'none', fontFamily: 'inherit', background: '#fff', boxSizing: 'border-box'}}>
                  <option value="">Select...</option>
                  {FINISHES.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label style={{display: 'block', fontSize: '14px', fontWeight: 600, color: '#1a1a1a', marginBottom: '8px'}}>Notes <span style={{fontSize: '12px', fontWeight: 400, color: '#888'}}>(optional)</span></label>
              <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3}
                style={{width: '100%', padding: '10px 14px', border: '1.5px solid #e5e5e5', borderRadius: '8px', fontSize: '15px', outline: 'none', fontFamily: 'inherit', resize: 'vertical', boxSizing: 'border-box'}} />
            </div>
          </div>

          {/* Cost & Links */}
          <div style={{background: '#fff', borderRadius: '16px', border: '1px solid #e5e5e5', padding: '28px', marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '20px'}}>
            <h3 style={{fontSize: '15px', fontWeight: 700, color: '#1a1a1a', margin: 0}}>Cost & Links</h3>
            <div>
              <label style={{display: 'block', fontSize: '14px', fontWeight: 600, color: '#1a1a1a', marginBottom: '8px'}}>Cost <span style={{fontSize: '12px', fontWeight: 400, color: '#888'}}>(optional)</span></label>
              <div style={{position: 'relative'}}>
                <span style={{position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '15px', color: '#888'}}>$</span>
                <input type="number" min="0" step="0.01" value={cost} onChange={e => setCost(e.target.value)}
                  style={{width: '100%', padding: '10px 14px 10px 28px', border: '1.5px solid #e5e5e5', borderRadius: '8px', fontSize: '15px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box'}} />
              </div>
            </div>
            <div>
              <label style={{display: 'block', fontSize: '14px', fontWeight: 600, color: '#1a1a1a', marginBottom: '8px'}}>Purchase Link <span style={{fontSize: '12px', fontWeight: 400, color: '#888'}}>(optional)</span></label>
              <input type="url" value={purchaseUrl} onChange={e => setPurchaseUrl(e.target.value)}
                style={{width: '100%', padding: '10px 14px', border: '1.5px solid #e5e5e5', borderRadius: '8px', fontSize: '15px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box'}} />
            </div>
            <div>
              <label style={{display: 'block', fontSize: '14px', fontWeight: 600, color: '#1a1a1a', marginBottom: '8px'}}>Affiliate Link <span style={{fontSize: '12px', fontWeight: 400, color: '#888'}}>(optional)</span></label>
              <input type="url" value={affiliateUrl} onChange={e => setAffiliateUrl(e.target.value)}
                style={{width: '100%', padding: '10px 14px', border: '1.5px solid #e5e5e5', borderRadius: '8px', fontSize: '15px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box'}} />
            </div>
          </div>

          {/* Save / Cancel */}
          <div style={{display: 'flex', gap: '12px', marginBottom: '16px'}}>
            <a href={`/homes/${homeId}/rooms/${roomId}/materials/${material.id}`}
              style={{flex: 1, padding: '13px', borderRadius: '8px', border: '1.5px solid #e5e5e5', background: '#fff', fontSize: '15px', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', textAlign: 'center', color: '#444', textDecoration: 'none', display: 'block'}}>
              Cancel
            </a>
            <button type="submit" disabled={loading || !name.trim() || photoUploading}
              style={{flex: 2, padding: '13px', borderRadius: '8px', border: 'none', background: loading || !name.trim() || photoUploading ? '#ccc' : '#006aff', color: '#fff', fontSize: '15px', fontWeight: 600, cursor: loading || !name.trim() || photoUploading ? 'not-allowed' : 'pointer', fontFamily: 'inherit'}}>
              {photoUploading ? 'Uploading photo...' : loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>

          {/* Delete */}
          {!showDeleteConfirm ? (
            <button type="button" onClick={() => setShowDeleteConfirm(true)}
              style={{width: '100%', padding: '13px', borderRadius: '8px', border: '1.5px solid #fecaca', background: '#fff', fontSize: '15px', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', color: '#dc2626'}}>
              Delete Material
            </button>
          ) : (
            <div style={{background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', padding: '20px', textAlign: 'center'}}>
              <div style={{fontSize: '14px', fontWeight: 600, color: '#dc2626', marginBottom: '4px'}}>Are you sure?</div>
              <div style={{fontSize: '13px', color: '#888', marginBottom: '16px'}}>This will permanently delete this material and cannot be undone.</div>
              <div style={{display: 'flex', gap: '10px'}}>
                <button type="button" onClick={() => setShowDeleteConfirm(false)}
                  style={{flex: 1, padding: '10px', borderRadius: '8px', border: '1.5px solid #e5e5e5', background: '#fff', fontSize: '14px', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', color: '#444'}}>
                  Cancel
                </button>
                <button type="button" onClick={handleDelete}
                  style={{flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: '#dc2626', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', color: '#fff'}}>
                  Yes, Delete
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
