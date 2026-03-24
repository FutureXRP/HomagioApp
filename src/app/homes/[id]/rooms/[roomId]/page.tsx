'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

const ROOM_TYPES = [
  'Living Room', 'Kitchen', 'Master Bedroom', 'Bedroom', 'Master Bathroom',
  'Bathroom', 'Half Bathroom', 'Dining Room', 'Office', 'Laundry Room',
  'Garage', 'Basement', 'Attic', 'Mudroom', 'Pantry', 'Hallway', 'Other'
]

export default function AddRoom({ params }: { params: { id: string } }) {
  const [name, setName] = useState('')
  const [type, setType] = useState('')
  const [floor, setFloor] = useState('')
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

    const { error: insertError } = await supabase.from('rooms').insert({
      home_id: params.id,
      name: name.trim(),
      type: type || name.trim(),
      floor: floor ? parseInt(floor) : null,
      notes: notes.trim() || null,
    })

    if (insertError) { setError(insertError.message); setLoading(false); return }
    window.location.href = `/homes/${params.id}`
  }

  return (
    <div style={{minHeight: '100vh', background: '#f8f8f8'}}>
      <nav style={{background: '#fff', borderBottom: '1px solid #e5e5e5', padding: '0 32px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
        <a href="/dashboard" style={{fontSize: '24px', fontWeight: 700, color: '#006aff', letterSpacing: '-1px', textDecoration: 'none'}}>hom<span style={{color: '#1a1a1a'}}>agio</span></a>
        <a href={`/homes/${params.id}`} style={{fontSize: '14px', color: '#666', textDecoration: 'none'}}>← Back to Home</a>
      </nav>

      <div style={{maxWidth: '560px', margin: '0 auto', padding: '48px 24px'}}>
        <div style={{marginBottom: '32px'}}>
          <h1 style={{fontSize: '28px', fontWeight: 700, color: '#1a1a1a', letterSpacing: '-0.5px'}}>Add a Room</h1>
          <p style={{fontSize: '15px', color: '#666', marginTop: '6px'}}>Give your room a name and type to start cataloging materials.</p>
        </div>

        {error && <div style={{background: '#fff0f0', border: '1px solid #ffc0c0', color: '#cc0000', padding: '12px 16px', borderRadius: '8px', marginBottom: '24px', fontSize: '14px'}}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={{background: '#fff', borderRadius: '16px', border: '1px solid #e5e5e5', padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px'}}>
            <div>
              <label style={{display: 'block', fontSize: '14px', fontWeight: 600, color: '#1a1a1a', marginBottom: '8px'}}>Room Name <span style={{color: '#006aff'}}>*</span></label>
              <input type="text" required value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Master Bedroom, Kitchen, Guest Bath"
                style={{width: '100%', padding: '10px 14px', border: '1.5px solid #e5e5e5', borderRadius: '8px', fontSize: '15px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box'}} />
            </div>
            <div>
              <label style={{display: 'block', fontSize: '14px', fontWeight: 600, color: '#1a1a1a', marginBottom: '8px'}}>Room Type</label>
              <select value={type} onChange={e => setType(e.target.value)}
                style={{width: '100%', padding: '10px 14px', border: '1.5px solid #e5e5e5', borderRadius: '8px', fontSize: '15px', outline: 'none', fontFamily: 'inherit', background: '#fff', boxSizing: 'border-box'}}>
                <option value="">Select a type...</option>
                {ROOM_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label style={{display: 'block', fontSize: '14px', fontWeight: 600, color: '#1a1a1a', marginBottom: '8px'}}>Floor</label>
              <select value={floor} onChange={e => setFloor(e.target.value)}
                style={{width: '100%', padding: '10px 14px', border: '1.5px solid #e5e5e5', borderRadius: '8px', fontSize: '15px', outline: 'none', fontFamily: 'inherit', background: '#fff', boxSizing: 'border-box'}}>
                <option value="">Select floor...</option>
                <option value="-1">Basement</option>
                <option value="1">1st Floor</option>
                <option value="2">2nd Floor</option>
                <option value="3">3rd Floor</option>
                <option value="4">4th Floor+</option>
              </select>
            </div>
            <div>
              <label style={{display: 'block', fontSize: '14px', fontWeight: 600, color: '#1a1a1a', marginBottom: '8px'}}>Notes <span style={{fontSize: '12px', fontWeight: 400, color: '#888'}}>(optional)</span></label>
              <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Any notes about this room..." rows={3}
                style={{width: '100%', padding: '10px 14px', border: '1.5px solid #e5e5e5', borderRadius: '8px', fontSize: '15px', outline: 'none', fontFamily: 'inherit', resize: 'vertical', boxSizing: 'border-box'}} />
            </div>
          </div>

          <div style={{display: 'flex', gap: '12px', marginTop: '24px'}}>
            <a href={`/homes/${params.id}`} style={{flex: 1, padding: '13px', borderRadius: '8px', border: '1.5px solid #e5e5e5', background: '#fff', fontSize: '15px', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', textAlign: 'center', color: '#444', textDecoration: 'none', display: 'block'}}>Cancel</a>
            <button type="submit" disabled={loading || !name.trim()}
              style={{flex: 2, padding: '13px', borderRadius: '8px', border: 'none', background: loading || !name.trim() ? '#ccc' : '#006aff', color: '#fff', fontSize: '15px', fontWeight: 600, cursor: loading || !name.trim() ? 'not-allowed' : 'pointer', fontFamily: 'inherit'}}>
              {loading ? 'Adding Room...' : 'Add Room'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
