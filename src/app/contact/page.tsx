'use client'

import { useState } from 'react'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // For now just show success — we'll wire up email later
    await new Promise(r => setTimeout(r, 800))
    setSubmitted(true)
    setLoading(false)
  }

  return (
    <div style={{minHeight: '100vh', background: '#f7f9fc', fontFamily: 'system-ui, sans-serif'}}>
      <nav style={{background: '#fff', borderBottom: '1px solid #e9edf2', padding: '0 32px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100}}>
        <a href="/" style={{fontSize: '22px', fontWeight: 700, color: '#006aff', letterSpacing: '-0.5px', textDecoration: 'none'}}>
          hom<span style={{color: '#1a1a2e'}}>agio</span>
        </a>
        <div style={{display: 'flex', gap: '16px', alignItems: 'center'}}>
          <a href="/explore" style={{fontSize: '13px', color: '#6b7280', textDecoration: 'none', fontWeight: 500}}>Explore</a>
          <a href="/faq" style={{fontSize: '13px', color: '#6b7280', textDecoration: 'none', fontWeight: 500}}>FAQs</a>
          <a href="/about" style={{fontSize: '13px', color: '#6b7280', textDecoration: 'none', fontWeight: 500}}>About</a>
          <a href="/login" style={{fontSize: '13px', color: '#006aff', textDecoration: 'none', fontWeight: 600}}>Sign In</a>
          <a href="/signup" style={{background: '#006aff', color: '#fff', padding: '8px 18px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, textDecoration: 'none'}}>Join Free</a>
        </div>
      </nav>

      <div style={{maxWidth: '640px', margin: '0 auto', padding: '64px 32px'}}>
        <div style={{textAlign: 'center', marginBottom: '48px'}}>
          <h1 style={{fontSize: '40px', fontWeight: 700, color: '#1a1a2e', letterSpacing: '-1px', marginBottom: '12px'}}>Get in Touch</h1>
          <p style={{fontSize: '16px', color: '#6b7280'}}>We'd love to hear from you. We respond to every message.</p>
        </div>

        {submitted ? (
          <div style={{background: '#fff', borderRadius: '20px', border: '1px solid #e9edf2', padding: '48px', textAlign: 'center'}}>
            <div style={{fontSize: '48px', marginBottom: '16px'}}>✅</div>
            <h2 style={{fontSize: '22px', fontWeight: 700, color: '#1a1a2e', marginBottom: '8px'}}>Message sent!</h2>
            <p style={{fontSize: '15px', color: '#6b7280', marginBottom: '24px'}}>Thanks for reaching out. We'll get back to you shortly.</p>
            <a href="/" style={{color: '#006aff', textDecoration: 'none', fontWeight: 600, fontSize: '14px'}}>← Back to Home</a>
          </div>
        ) : (
          <div style={{background: '#fff', borderRadius: '20px', border: '1px solid #e9edf2', padding: '40px'}}>
            <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px'}}>
                <div>
                  <label style={{display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px'}}>Name</label>
                  <input type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                    placeholder="Your name"
                    style={{width: '100%', padding: '10px 14px', border: '1.5px solid #e9edf2', borderRadius: '8px', fontSize: '15px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box'}} />
                </div>
                <div>
                  <label style={{display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px'}}>Email</label>
                  <input type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                    placeholder="you@example.com"
                    style={{width: '100%', padding: '10px 14px', border: '1.5px solid #e9edf2', borderRadius: '8px', fontSize: '15px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box'}} />
                </div>
              </div>
              <div>
                <label style={{display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px'}}>Subject</label>
                <select value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} required
                  style={{width: '100%', padding: '10px 14px', border: '1.5px solid #e9edf2', borderRadius: '8px', fontSize: '15px', outline: 'none', fontFamily: 'inherit', background: '#fff', boxSizing: 'border-box'}}>
                  <option value="">Select a topic...</option>
                  <option value="general">General Question</option>
                  <option value="support">Technical Support</option>
                  <option value="feature">Feature Request</option>
                  <option value="partnership">Partnership</option>
                  <option value="press">Press Inquiry</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label style={{display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px'}}>Message</label>
                <textarea required value={form.message} onChange={e => setForm({...form, message: e.target.value})}
                  placeholder="Tell us how we can help..." rows={6}
                  style={{width: '100%', padding: '10px 14px', border: '1.5px solid #e9edf2', borderRadius: '8px', fontSize: '15px', outline: 'none', fontFamily: 'inherit', resize: 'vertical', boxSizing: 'border-box'}} />
              </div>
              <button type="submit" disabled={loading}
                style={{background: loading ? '#93c5fd' : '#006aff', color: '#fff', border: 'none', padding: '14px', borderRadius: '10px', fontSize: '15px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit'}}>
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        )}

        <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginTop: '32px'}}>
          {[
            {icon: '📧', label: 'Email', value: 'hello@homagio.com'},
            {icon: '🌍', label: 'Explore', value: 'Browse public homes'},
            {icon: '❓', label: 'FAQs', value: 'Common questions'},
          ].map(item => (
            <div key={item.label} style={{background: '#fff', borderRadius: '12px', border: '1px solid #e9edf2', padding: '20px', textAlign: 'center'}}>
              <div style={{fontSize: '24px', marginBottom: '8px'}}>{item.icon}</div>
              <div style={{fontSize: '13px', fontWeight: 600, color: '#1a1a2e', marginBottom: '4px'}}>{item.label}</div>
              <div style={{fontSize: '12px', color: '#9ca3af'}}>{item.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
