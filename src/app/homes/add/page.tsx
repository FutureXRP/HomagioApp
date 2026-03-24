'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function AddHome() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    year_built: '',
    square_feet: '',
    bedrooms: '',
    bathrooms: '',
  })

  const update = (field: string, value: string) => {
    setForm(prev => ({...prev, [field]: value}))
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError('')

    const { data: { session } } = await supabase.auth.getSession()
    if (!session) { router.push('/login'); return }

    const { data, error } = await supabase
      .from('homes')
      .insert({
        user_id: session.user.id,
        name: form.name || `${form.address}`,
        address: form.address,
        city: form.city,
        state: form.state,
        zip: form.zip,
        year_built: form.year_built ? parseInt(form.year_built) : null,
        square_feet: form.square_feet ? parseInt(form.square_feet) : null,
        bedrooms: form.bedrooms ? parseInt(form.bedrooms) : null,
        bathrooms: form.bathrooms ? parseInt(form.bathrooms) : null,
        is_public: false,
      })
      .select()
      .single()

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push(`/homes/${data.id}`)
    }
  }

  return (
    <div style={{minHeight: '100vh', background: '#f8f8f8'}}>

      {/* Nav */}
      <nav style={{background: '#fff', borderBottom: '1px solid #e5e5e5', padding: '0 32px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
        <a href="/dashboard" style={{fontSize: '24px', fontWeight: 700, color: '#006aff', letterSpacing: '-1px', textDecoration: 'none'}}>
          hom<span style={{color: '#1a1a1a'}}>agio</span>
        </a>
        <div style={{fontSize: '14px', color: '#888'}}>Step {step} of 2</div>
      </nav>

      <div style={{maxWidth: '600px', margin: '0 auto', padding: '48px 24px'}}>

        {/* Progress bar */}
        <div style={{height: '4px', background: '#e5e5e5', borderRadius: '2px', marginBottom: '40px'}}>
          <div style={{height: '100%', background: '#006aff', borderRadius: '2px', width: step === 1 ? '50%' : '100%', transition: 'width 0.3s'}} />
        </div>

        {step === 1 && (
          <div>
            <h1 style={{fontSize: '28px', fontWeight: 700, color: '#1a1a1a', marginBottom: '8px'}}>
              Tell us about your home
            </h1>
            <p style={{fontSize: '15px', color: '#888', marginBottom: '32px'}}>
              Start building your home's digital twin
            </p>

            <div style={{background: '#fff', borderRadius: '16px', border: '1px solid #e5e5e5', padding: '32px'}}>

              <div style={{marginBottom: '20px'}}>
                <label style={{display: 'block', fontSize: '14px', fontWeight: 500, color: '#333', marginBottom: '6px'}}>Home Nickname (optional)</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => update('name', e.target.value)}
                  placeholder="e.g. The Family Home, Beach House"
                  style={{width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1.5px solid #e5e5e5', fontSize: '15px', outline: 'none', fontFamily: 'inherit'}}
                />
              </div>

              <div style={{marginBottom: '20px'}}>
                <label style={{display: 'block', fontSize: '14px', fontWeight: 500, color: '#333', marginBottom: '6px'}}>Street Address *</label>
                <input
                  type="text"
                  value={form.address}
                  onChange={e => update('address', e.target.value)}
                  placeholder="123 Main Street"
                  required
                  style={{width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1.5px solid #e5e5e5', fontSize: '15px', outline: 'none', fontFamily: 'inherit'}}
                />
              </div>

              <div style={{display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '12px', marginBottom: '20px'}}>
                <div>
                  <label style={{display: 'block', fontSize: '14px', fontWeight: 500, color: '#333', marginBottom: '6px'}}>City *</label>
                  <input
                    type="text"
                    value={form.city}
                    onChange={e => update('city', e.target.value)}
                    placeholder="Nashville"
                    style={{width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1.5px solid #e5e5e5', fontSize: '15px', outline: 'none', fontFamily: 'inherit'}}
                  />
                </div>
                <div>
                  <label style={{display: 'block', fontSize: '14px', fontWeight: 500, color: '#333', marginBottom: '6px'}}>State *</label>
                  <input
                    type="text"
                    value={form.state}
                    onChange={e => update('state', e.target.value)}
                    placeholder="TN"
                    maxLength={2}
                    style={{width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1.5px solid #e5e5e5', fontSize: '15px', outline: 'none', fontFamily: 'inherit'}}
                  />
                </div>
                <div>
                  <label style={{display: 'block', fontSize: '14px', fontWeight: 500, color: '#333', marginBottom: '6px'}}>ZIP *</label>
                  <input
                    type="text"
                    value={form.zip}
                    onChange={e => update('zip', e.target.value)}
                    placeholder="37215"
                    style={{width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1.5px solid #e5e5e5', fontSize: '15px', outline: 'none', fontFamily: 'inherit'}}
                  />
                </div>
              </div>

              {error && (
                <div style={{background: '#fee2e2', border: '1px solid #fecaca', borderRadius: '8px', padding: '10px 14px', fontSize: '14px', color: '#dc2626', marginBottom: '16px'}}>
                  {error}
                </div>
              )}

              <button
                onClick={() => {
                  if (!form.address || !form.city || !form.state || !form.zip) {
                    setError('Please fill in all required fields')
                    return
                  }
                  setError('')
                  setStep(2)
                }}
                style={{width: '100%', padding: '12px', borderRadius: '8px', background: '#006aff', color: '#fff', border: 'none', fontSize: '15px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit'}}
              >
                Next Step →
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h1 style={{fontSize: '28px', fontWeight: 700, color: '#1a1a1a', marginBottom: '8px'}}>
              Home details
            </h1>
            <p style={{fontSize: '15px', color: '#888', marginBottom: '32px'}}>
              Help us understand your home better
            </p>

            <div style={{background: '#fff', borderRadius: '16px', border: '1px solid #e5e5e5', padding: '32px'}}>

              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px'}}>
                <div>
                  <label style={{display: 'block', fontSize: '14px', fontWeight: 500, color: '#333', marginBottom: '6px'}}>Bedrooms</label>
                  <input
                    type="number"
                    value={form.bedrooms}
                    onChange={e => update('bedrooms', e.target.value)}
                    placeholder="4"
                    style={{width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1.5px solid #e5e5e5', fontSize: '15px', outline: 'none', fontFamily: 'inherit'}}
                  />
                </div>
                <div>
                  <label style={{display: 'block', fontSize: '14px', fontWeight: 500, color: '#333', marginBottom: '6px'}}>Bathrooms</label>
                  <input
                    type="number"
                    value={form.bathrooms}
                    onChange={e => update('bathrooms', e.target.value)}
                    placeholder="3"
                    style={{width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1.5px solid #e5e5e5', fontSize: '15px', outline: 'none', fontFamily: 'inherit'}}
                  />
                </div>
              </div>

              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px'}}>
                <div>
                  <label style={{display: 'block', fontSize: '14px', fontWeight: 500, color: '#333', marginBottom: '6px'}}>Square Feet</label>
                  <input
                    type="number"
                    value={form.square_feet}
                    onChange={e => update('square_feet', e.target.value)}
                    placeholder="2400"
                    style={{width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1.5px solid #e5e5e5', fontSize: '15px', outline: 'none', fontFamily: 'inherit'}}
                  />
                </div>
                <div>
                  <label style={{display: 'block', fontSize: '14px', fontWeight: 500, color: '#333', marginBottom: '6px'}}>Year Built</label>
                  <input
                    type="number"
                    value={form.year_built}
                    onChange={e => update('year_built', e.target.value)}
                    placeholder="2005"
                    style={{width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1.5px solid #e5e5e5', fontSize: '15px', outline: 'none', fontFamily: 'inherit'}}
                  />
                </div>
              </div>

              {error && (
                <div style={{background: '#fee2e2', border: '1px solid #fecaca', borderRadius: '8px', padding: '10px 14px', fontSize: '14px', color: '#dc2626', marginBottom: '16px'}}>
                  {error}
                </div>
              )}

              <div style={{display: 'flex', gap: '12px'}}>
                <button
                  onClick={() => setStep(1)}
                  style={{flex: 1, padding: '12px', borderRadius: '8px', background: '#fff', color: '#444', border: '1.5px solid #e5e5e5', fontSize: '15px', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit'}}
                >
                  ← Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  style={{flex: 2, padding: '12px', borderRadius: '8px', background: loading ? '#93c5fd' : '#006aff', color: '#fff', border: 'none', fontSize: '15px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit'}}
                >
                  {loading ? 'Creating your home...' : 'Create My Home 🏠'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
