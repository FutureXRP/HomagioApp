'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

const MATERIAL_CATEGORIES = [
  'Flooring', 'Wall Paint', 'Tile', 'Countertops', 'Cabinets', 'Appliances',
  'Lighting', 'Plumbing Fixtures', 'Hardware', 'Windows', 'Doors', 'Trim & Molding',
  'Wallpaper', 'Ceiling', 'Insulation', 'HVAC', 'Electrical', 'Other'
]

const FINISHES = [
  'Matte', 'Satin', 'Semi-Gloss', 'Gloss', 'Eggshell', 'Flat',
  'Brushed', 'Polished', 'Honed', 'Textured', 'Natural', 'Other'
]

export default function AddMaterial({ params }: { params: { id: string; roomId: string } }) {
  const [name, setName] = useState('')
  const [brand, setBrand] = useState('')
  const [category, setCategory] = useState('')
  const [color, setColor] = useState('')
  const [finish, setFinish] = useState('')
  const [cost, setCost] = useState('')
  const [purchaseUrl, setPurchaseUrl] = useState('')
  const [affiliateUrl, setAffiliateUrl] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()

    const { data: { session } } = await supabase.auth.getSession()
    if (!session) { window.location.href = '/login'; return }

    const costInCents = cost ? Math.round(parseFloat(cost) * 100) : 0

    const { error: insertError } = await supabase.from('materials').insert({
      home_id: params.id,
      room_id: params.roomId,
      name: name.trim(),
      brand: brand.trim() || null,
      color: color.trim() || null,
      finish: finish || null,
      notes: notes.trim() || null,
      cost: costInCents,
      purchase_url: purchaseUrl.trim() || null,
      affiliate_url: affiliateUrl.trim() || null,
      ai_detected: false,
    })

    if (insertError) { setError(insertError.message); setLoading(false); return }
    window.location.href = `/homes/${params.id}/rooms/${params.roomId}`
  }

  return (
    <div style={{minHeight: '100vh', background: '#f8f8f8'}}>
      <nav style={{background: '#fff', borderBottom: '1px solid #e5e5e5', padding: '0 32px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
        <a href="/dashboard" style={{fontSize: '24px', fontWeight: 700, color: '#006aff', letterSpacing: '-1px', textDecoration: 'none'}}>hom<span style={{color: '#1a1a1a'}}>agio</span></a>
        <a href={`/homes/${params.id}/rooms/${params.roomId}`} style={{fontSize: '14px', color: '#666', textDecoration: 'none'}}>← Back to Room</a>
      </nav>

      <div style={{maxWidth: '600px', margin: '0 auto', padding: '48px 24px'}}>
        <div style={{marginBottom: '32px'}}>
          <h1 style={{fontSize: '28px', fontWeight: 700, color: '#1a1a1a', letterSpacing: '-0.5px'}}>Add a Material</h1>
          <p style={{fontSize: '15px', color: '#666', marginTop: '6px'}}>Catalog a material, finish, or fixture in this room.</p>
        </div>

        {error && <div style={{background: '#fff0f0', border: '1px solid #ffc0c0', color: '#cc0000', padding: '12px 16px', borderRadius: '8px', marginBottom: '24px', fontSize: '14px'}}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={{background: '#fff', borderRadius: '16px', border: '1px solid #e5e5e5', padding: '28px', marginBottom: '16px'}}>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px'}}>
              <label style={{fontSize: '14px', fontWeight: 600, color: '#1a1a1a'}}>📸 Photo</label>
              <span style={{fontSize: '11px', fontWeight: 600, color: '#fff', background: '#006aff', padding: '3px 10px', borderRadius: '20px'}}>COMING SOON</span>
            </div>
            <div style={{border: '2px dashed #e5e5e5', borderRadius: '10px', padding: '32px', textAlign: 'center', background: '#fafafa'}}>
              <div style={{fontSize: '32px', marginBottom: '8px'}}>📷</div>
              <div style={{fontSize: '14px', fontWeight: 500, color: '#aaa'}}>AI-powered photo detection</div>
              <div style={{fontSize: '12px', color: '#bbb', marginTop: '4px'}}>Upload a photo and our AI will identify the material automatically</div>
            </div>
          </div>

          <div style={{background: '#fff', borderRadius: '16px', border: '1px solid #e5e5e5', padding: '28px', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '20px'}}>
            <h3 style={{fontSize: '15px', fontWeight: 700, color: '#1a1a1a', margin: 0}}>Material Details</h3>
            <div>
              <label style={{display: 'block', fontSize: '14px', fontWeight: 600, color: '#1a1a1a', marginBottom: '8px'}}>Material Name <span style={{color: '#006aff'}}>*</span></label>
              <input type="text" required value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Hardwood Flooring, Quartz Countertop, Delta Faucet"
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
              <input type="text" value={brand} onChange={e => setBrand(e.target.value)} placeholder="e.g. Shaw, Kohler, Benjamin Moore"
                style={{width: '100%', padding: '10px 14px', border: '1.5px solid #e5e5e5', borderRadius: '8px', fontSize: '15px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box'}} />
            </div>
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px'}}>
              <div>
                <label style={{display: 'block', fontSize: '14px', fontWeight: 600, color: '#1a1a1a', marginBottom: '8px'}}>Color <span style={{fontSize: '12px', fontWeight: 400, color: '#888'}}>(optional)</span></label>
                <input type="text" value={color} onChange={e => setColor(e.target.value)} placeholder="e.g. White, Oak, Charcoal"
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
              <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="SKU, model number, where you bought it, installation notes..." rows={3}
                style={{width: '100%', padding: '10px 14px', border: '1.5px solid #e5e5e5', borderRadius: '8px', fontSize: '15px', outline: 'none', fontFamily: 'inherit', resize: 'vertical', boxSizing: 'border-box'}} />
            </div>
          </div>

          <div style={{background: '#fff', borderRadius: '16px', border: '1px solid #e5e5e5', padding: '28px', marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '20px'}}>
            <h3 style={{fontSize: '15px', fontWeight: 700, color: '#1a1a1a', margin: 0}}>Cost & Links</h3>
            <div>
              <label style={{display: 'block', fontSize: '14px', fontWeight: 600, color: '#1a1a1a', marginBottom: '8px'}}>Cost <span style={{fontSize: '12px', fontWeight: 400, color: '#888'}}>(optional)</span></label>
              <div style={{position: 'relative'}}>
                <span style={{position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '15px', color: '#888'}}>$</span>
                <input type="number" min="0" step="0.01" value={cost} onChange={e => setCost(e.target.value)} placeholder="0.00"
                  style={{width: '100%', padding: '10px 14px 10px 28px', border: '1.5px solid #e5e5e5', borderRadius: '8px', fontSize: '15px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box'}} />
              </div>
            </div>
            <div>
              <label style={{display: 'block', fontSize: '14px', fontWeight: 600, color: '#1a1a1a', marginBottom: '8px'}}>Purchase Link <span style={{fontSize: '12px', fontWeight: 400, color: '#888'}}>(optional)</span></label>
              <input type="url" value={purchaseUrl} onChange={e => setPurchaseUrl(e.target.value)} placeholder="https://www.homedepot.com/..."
                style={{width: '100%', padding: '10px 14px', border: '1.5px solid #e5e5e5', borderRadius: '8px', fontSize: '15px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box'}} />
            </div>
            <div>
              <label style={{display: 'block', fontSize: '14px', fontWeight: 600, color: '#1a1a1a', marginBottom: '8px'}}>Affiliate Link <span style={{fontSize: '12px', fontWeight: 400, color: '#888'}}>(optional)</span></label>
              <input type="url" value={affiliateUrl} onChange={e => setAffiliateUrl(e.target.value)} placeholder="https://..."
                style={{width: '100%', padding: '10px 14px', border: '1.5px solid #e5e5e5', borderRadius: '8px', fontSize: '15px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box'}} />
              <p style={{fontSize: '12px', color: '#888', marginTop: '6px'}}>Add your affiliate link to earn when others shop your home's materials</p>
            </div>
            <div style={{background: '#f0f6ff', border: '1px solid #cce0ff', borderRadius: '10px', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '12px'}}>
              <div style={{fontSize: '20px'}}>🔮</div>
              <div>
                <div style={{fontSize: '13px', fontWeight: 600, color: '#006aff'}}>Home Value Impact — Coming Soon</div>
                <div style={{fontSize: '12px', color: '#4a90d9', marginTop: '2px'}}>We'll show how this material affects your Homagio Estimate™</div>
              </div>
            </div>
          </div>

          <div style={{display: 'flex', gap: '12px'}}>
            <a href={`/homes/${params.id}/rooms/${params.roomId}`}
              style={{flex: 1, padding: '13px', borderRadius: '8px', border: '1.5px solid #e5e5e5', background: '#fff', fontSize: '15px', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', textAlign: 'center', color: '#444', textDecoration: 'none', display: 'block'}}>
              Cancel
            </a>
            <button type="submit" disabled={loading || !name.trim()}
              style={{flex: 2, padding: '13px', borderRadius: '8px', border: 'none', background: loading || !name.trim() ? '#ccc' : '#006aff', color: '#fff', fontSize: '15px', fontWeight: 600, cursor: loading || !name.trim() ? 'not-allowed' : 'pointer', fontFamily: 'inherit'}}>
              {loading ? 'Saving...' : 'Save Material'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
