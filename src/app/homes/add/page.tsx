'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

const STEPS = ['Address', 'Details']

export default function AddHome() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: '', address: '', city: '', state: '', zip: '',
    year_built: '', square_feet: '', bedrooms: '', bathrooms: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()

    const { data: { session } } = await supabase.auth.getSession()
    if (!session) { window.location.href = '/login'; return }

    const { data, error: insertError } = await supabase.from('homes').insert({
      user_id: session.user.id,
      name: form.name.trim() || null,
      address: form.address.trim(),
      city: form.city.trim(),
      state: form.state.trim(),
      zip: form.zip.trim(),
      year_built: form.year_built ? parseInt(form.year_built) : null,
      square_feet: form.square_feet ? parseInt(form.square_feet) : null,
      bedrooms: form.bedrooms ? parseInt(form.bedrooms) : null,
      bathrooms: form.bathrooms ? parseFloat(form.bathrooms) : null,
    }).select().single()

    if (insertError) { setError(insertError.message); setLoading(false); return }

    // Auto-create Exterior room
    await supabase.from('rooms').insert({
      home_id: data.id,
      name: 'Exterior',
      type: 'exterior',
      notes: 'Roofing, siding, windows, garage, driveway, and other exterior materials.',
    })

    window.location.href = `/homes/${data.id}`
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', system-ui, sans-serif; }
        .input-field {
          width: 100%;
          padding: 11px 14px;
          border: 1.5px solid #e2e8f0;
          border-radius: 10px;
          font-size: 15px;
          font-family: inherit;
          color: #1a1a2e;
          background: #fff;
          transition: border-color 0.15s, box-shadow 0.15s;
          outline: none;
        }
        .input-field:focus {
          border-color: #006aff;
          box-shadow: 0 0 0 3px rgba(0,106,255,0.1);
        }
        .input-field::placeholder { color: #aab; }
        .label {
          display: block;
          font-size: 13px;
          font-weight: 600;
          color: #374151;
          margin-bottom: 6px;
          letter-spacing: 0.01em;
        }
        .optional {
          font-size: 11px;
          font-weight: 400;
          color: #9ca3af;
          margin-left: 4px;
        }
        .btn-primary {
          background: #006aff;
          color: #fff;
          border: none;
          padding: 13px 24px;
          border-radius: 10px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          font-family: inherit;
          transition: background 0.15s, transform 0.1s;
          letter-spacing: 0.01em;
        }
        .btn-primary:hover:not(:disabled) { background: #0057d4; }
        .btn-primary:active:not(:disabled) { transform: scale(0.99); }
        .btn-primary:disabled { background: #c0d4f5; cursor: not-allowed; }
        .btn-secondary {
          background: #fff;
          color: #374151;
          border: 1.5px solid #e2e8f0;
          padding: 13px 24px;
          border-radius: 10px;
          font-size: 15px;
          font-weight: 500;
          cursor: pointer;
          font-family: inherit;
          transition: border-color 0.15s, background 0.15s;
        }
        .btn-secondary:hover { background: #f9fafb; border-color: #d1d5db; }
      `}</style>

      <div style={{minHeight: '100vh', background: '#f7f9fc', fontFamily: "'DM Sans', system-ui, sans-serif"}}>

        {/* Nav */}
        <nav style={{background: '#fff', borderBottom: '1px solid #e9edf2', padding: '0 32px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100}}>
          <a href="/dashboard" style={{fontSize: '22px', fontWeight: 700, color: '#006aff', letterSpacing: '-0.5px', textDecoration: 'none'}}>
            hom<span style={{color: '#1a1a2e'}}>agio</span>
          </a>
          <a href="/dashboard/homes" style={{fontSize: '13px', color: '#6b7280', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 500}}>
            ← Back to My Homes
          </a>
        </nav>

        <div style={{maxWidth: '520px', margin: '0 auto', padding: '52px 24px 80px'}}>

          {/* Header */}
          <div style={{marginBottom: '36px'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px'}}>
              <span style={{fontSize: '28px'}}>🏠</span>
              <h1 style={{fontSize: '26px', fontWeight: 700, color: '#1a1a2e', letterSpacing: '-0.5px'}}>Add a Home</h1>
            </div>
            <p style={{fontSize: '14px', color: '#6b7280', lineHeight: 1.6}}>
              We'll automatically create an <strong style={{color: '#374151'}}>Exterior</strong> room to catalog your roof, siding, windows, and more.
            </p>
          </div>

          {/* Step Indicator */}
          <div style={{display: 'flex', alignItems: 'center', gap: '0', marginBottom: '32px'}}>
            {STEPS.map((s, i) => {
              const num = i + 1
              const isActive = step === num
              const isDone = step > num
              return (
                <div key={s} style={{display: 'flex', alignItems: 'center', flex: i < STEPS.length - 1 ? 1 : 'none'}}>
                  <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                    <div style={{
                      width: '28px', height: '28px', borderRadius: '50%',
                      background: isDone ? '#006aff' : isActive ? '#006aff' : '#e9edf2',
                      color: isDone || isActive ? '#fff' : '#9ca3af',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '12px', fontWeight: 700, flexShrink: 0,
                      transition: 'background 0.2s',
                    }}>
                      {isDone ? '✓' : num}
                    </div>
                    <span style={{fontSize: '13px', fontWeight: isActive ? 600 : 400, color: isActive ? '#1a1a2e' : isDone ? '#6b7280' : '#9ca3af'}}>
                      {s}
                    </span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div style={{flex: 1, height: '1.5px', background: step > num ? '#006aff' : '#e9edf2', margin: '0 12px', transition: 'background 0.2s'}} />
                  )}
                </div>
              )
            })}
          </div>

          {/* Error */}
          {error && (
            <div style={{background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '12px 16px', borderRadius: '10px', marginBottom: '24px', fontSize: '14px', display: 'flex', gap: '8px', alignItems: 'flex-start'}}>
              <span>⚠️</span><span>{error}</span>
            </div>
          )}

          {/* Form Card */}
          <div style={{background: '#fff', borderRadius: '16px', border: '1px solid #e9edf2', padding: '32px', marginBottom: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)'}}>
            <form onSubmit={step === 1 ? (e) => { e.preventDefault(); setStep(2) } : handleSubmit}>

              {step === 1 ? (
                <div style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
                  <div style={{paddingBottom: '16px', borderBottom: '1px solid #f3f4f6'}}>
                    <div style={{fontSize: '13px', fontWeight: 700, color: '#006aff', textTransform: 'uppercase', letterSpacing: '0.08em'}}>Step 1 of 2</div>
                    <div style={{fontSize: '17px', fontWeight: 700, color: '#1a1a2e', marginTop: '4px'}}>Home Address</div>
                  </div>

                  <div>
                    <label className="label">Home Nickname <span className="optional">(optional)</span></label>
                    <input className="input-field" type="text" name="name" value={form.name} onChange={handleChange} placeholder="e.g. The Blair House" />
                  </div>
                  <div>
                    <label className="label">Street Address <span style={{color: '#ef4444'}}>*</span></label>
                    <input className="input-field" type="text" name="address" value={form.address} onChange={handleChange} placeholder="123 Main St" required />
                  </div>
                  <div>
                    <label className="label">City <span style={{color: '#ef4444'}}>*</span></label>
                    <input className="input-field" type="text" name="city" value={form.city} onChange={handleChange} placeholder="Nashville" required />
                  </div>
                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: '14px'}}>
                    <div>
                      <label className="label">State <span style={{color: '#ef4444'}}>*</span></label>
                      <input className="input-field" type="text" name="state" value={form.state} onChange={handleChange} placeholder="TN" required maxLength={2} style={{textTransform: 'uppercase'}} />
                    </div>
                    <div>
                      <label className="label">ZIP Code <span style={{color: '#ef4444'}}>*</span></label>
                      <input className="input-field" type="text" name="zip" value={form.zip} onChange={handleChange} placeholder="37215" required />
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
                  <div style={{paddingBottom: '16px', borderBottom: '1px solid #f3f4f6'}}>
                    <div style={{fontSize: '13px', fontWeight: 700, color: '#006aff', textTransform: 'uppercase', letterSpacing: '0.08em'}}>Step 2 of 2</div>
                    <div style={{fontSize: '17px', fontWeight: 700, color: '#1a1a2e', marginTop: '4px'}}>Home Details</div>
                    <div style={{fontSize: '13px', color: '#9ca3af', marginTop: '4px'}}>All fields optional — add what you know</div>
                  </div>

                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px'}}>
                    <div>
                      <label className="label">Year Built <span className="optional">(optional)</span></label>
                      <input className="input-field" type="number" name="year_built" value={form.year_built} onChange={handleChange} placeholder="1995" />
                    </div>
                    <div>
                      <label className="label">Square Feet <span className="optional">(optional)</span></label>
                      <input className="input-field" type="number" name="square_feet" value={form.square_feet} onChange={handleChange} placeholder="2,400" />
                    </div>
                    <div>
                      <label className="label">Bedrooms <span className="optional">(optional)</span></label>
                      <input className="input-field" type="number" name="bedrooms" value={form.bedrooms} onChange={handleChange} placeholder="4" />
                    </div>
                    <div>
                      <label className="label">Bathrooms <span className="optional">(optional)</span></label>
                      <input className="input-field" type="number" name="bathrooms" value={form.bathrooms} onChange={handleChange} placeholder="2.5" step="0.5" />
                    </div>
                  </div>

                  {/* Exterior info callout */}
                  <div style={{background: '#f0f6ff', border: '1px solid #bfdbfe', borderRadius: '10px', padding: '14px 16px', display: 'flex', gap: '10px', alignItems: 'flex-start'}}>
                    <span style={{fontSize: '18px', flexShrink: 0}}>🏡</span>
                    <div>
                      <div style={{fontSize: '13px', fontWeight: 600, color: '#1e40af', marginBottom: '2px'}}>Exterior room auto-created</div>
                      <div style={{fontSize: '12px', color: '#3b82f6', lineHeight: 1.5}}>We'll add an Exterior room so you can immediately catalog roofing, siding, windows, paint, and more.</div>
                    </div>
                  </div>
                </div>
              )}

              <div style={{display: 'flex', gap: '10px', marginTop: '28px'}}>
                {step === 1 ? (
                  <a href="/dashboard/homes" className="btn-secondary" style={{flex: 1, textAlign: 'center', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    Cancel
                  </a>
                ) : (
                  <button type="button" className="btn-secondary" onClick={() => setStep(1)} style={{flex: 1}}>
                    ← Back
                  </button>
                )}
                <button type="submit" className="btn-primary" disabled={loading} style={{flex: 2}}>
                  {step === 1 ? 'Continue →' : loading ? 'Creating home...' : 'Create Home'}
                </button>
              </div>
            </form>
          </div>

          <p style={{fontSize: '12px', color: '#9ca3af', textAlign: 'center'}}>
            Your home data is private by default. You control what's shared.
          </p>
        </div>
      </div>
    </>
  )
}
