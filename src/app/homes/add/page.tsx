'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

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
    window.location.href = `/homes/${data.id}`
  }

  return (
    <div style={{minHeight: '100vh', background: '#f8f8f8'}}>
      <nav style={{background: '#fff', borderBottom: '1px solid #e5e5e5', padding: '0 32px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
        <a href="/dashboard" style={{fontSize: '24px', fontWeight: 700, color: '#006aff', letterSpacing: '-1px', textDecoration: 'none'}}>hom<span style={{color: '#1a1a1a'}}>agio</span></a>
        <a href="/dashboard/homes" style={{fontSize: '14px', color: '#666', textDecoration: 'none'}}>← Back</a>
      </nav>

      <div style={{maxWidth: '560px', margin: '0 auto', padding: '48px 24px'}}>
        <div style={{marginBottom: '32px'}}>
          <h1 style={{fontSize: '28px', fontWeight: 700, color: '#1a1a1a', letterSpacing: '-0.5px'}}>Add a Home</h1>
          <p style={{fontSize: '15px', color: '#666', marginTop: '6px'}}>Tell us about your home to get started.</p>
        </div>

        {error && <div style={{background: '#fff0f0', border: '1px solid #ffc0c0', color: '#cc0000', padding: '12px 16px', borderRadius: '8px', marginBottom: '24px', fontSize: '14px'}}>{error}</div>}

        <form onSubmit={step === 1 ? (e) => { e.preventDefault(); setStep(2) } : handleSubmit}>
          <div style={{background: '#fff', borderRadius: '16px', border: '1px solid #e5e5e5', padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '24px'}}>
            {step === 1 ? (
              <>
                <h3 style={{fontSize: '15px', fontWeight: 700, color: '#1a1a1a', margin: 0}}>Home Address</h3>
                {[
                  {label: 'Home Name (optional)', name: 'name', placeholder: 'e.g. The Blair House', required: false},
                  {label: 'Street Address', name: 'address', placeholder: '123 Main St', required: true},
                  {label: 'City', name: 'city', placeholder: 'Nashville', required: true},
                ].map(field => (
                  <div key={field.name}>
                    <label style={{display: 'block', fontSize: '14px', fontWeight: 600, color: '#1a1a1a', marginBottom: '8px'}}>{field.label}</label>
                    <input type="text" name={field.name} value={(form as any)[field.name]} onChange={handleChange} placeholder={field.placeholder} required={field.required}
                      style={{width: '100%', padding: '10px 14px', border: '1.5px solid #e5e5e5', borderRadius: '8px', fontSize: '15px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box'}} />
                  </div>
                ))}
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px'}}>
                  <div>
                    <label style={{display: 'block', fontSize: '14px', fontWeight: 600, color: '#1a1a1a', marginBottom: '8px'}}>State</label>
                    <input type="text" name="state" value={form.state} onChange={handleChange} placeholder="TN" required maxLength={2}
                      style={{width: '100%', padding: '10px 14px', border: '1.5px solid #e5e5e5', borderRadius: '8px', fontSize: '15px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box'}} />
                  </div>
                  <div>
                    <label style={{display: 'block', fontSize: '14px', fontWeight: 600, color: '#1a1a1a', marginBottom: '8px'}}>ZIP Code</label>
                    <input type="text" name="zip" value={form.zip} onChange={handleChange} placeholder="37215" required
                      style={{width: '100%', padding: '10px 14px', border: '1.5px solid #e5e5e5', borderRadius: '8px', fontSize: '15px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box'}} />
                  </div>
                </div>
              </>
            ) : (
              <>
                <h3 style={{fontSize: '15px', fontWeight: 700, color: '#1a1a1a', margin: 0}}>Home Details</h3>
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px'}}>
                  {[
                    {label: 'Year Built', name: 'year_built', placeholder: '1995'},
                    {label: 'Square Feet', name: 'square_feet', placeholder: '2400'},
                    {label: 'Bedrooms', name: 'bedrooms', placeholder: '4'},
                    {label: 'Bathrooms', name: 'bathrooms', placeholder: '2.5'},
                  ].map(field => (
                    <div key={field.name}>
                      <label style={{display: 'block', fontSize: '14px', fontWeight: 600, color: '#1a1a1a', marginBottom: '8px'}}>{field.label} <span style={{fontSize: '12px', fontWeight: 400, color: '#888'}}>(optional)</span></label>
                      <input type="number" name={field.name} value={(form as any)[field.name]} onChange={handleChange} placeholder={field.placeholder}
                        style={{width: '100%', padding: '10px 14px', border: '1.5px solid #e5e5e5', borderRadius: '8px', fontSize: '15px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box'}} />
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          <div style={{display: 'flex', gap: '12px'}}>
            {step === 2 && (
              <button type="button" onClick={() => setStep(1)}
                style={{flex: 1, padding: '13px', borderRadius: '8px', border: '1.5px solid #e5e5e5', background: '#fff', fontSize: '15px', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', color: '#444'}}>
                Back
              </button>
            )}
            {step === 1 && (
              <a href="/dashboard/homes" style={{flex: 1, padding: '13px', borderRadius: '8px', border: '1.5px solid #e5e5e5', background: '#fff', fontSize: '15px', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', textAlign: 'center', color: '#444', textDecoration: 'none', display: 'block'}}>Cancel</a>
            )}
            <button type="submit" disabled={loading}
              style={{flex: 2, padding: '13px', borderRadius: '8px', border: 'none', background: loading ? '#ccc' : '#006aff', color: '#fff', fontSize: '15px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit'}}>
              {step === 1 ? 'Next →' : loading ? 'Saving...' : 'Add Home'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
