'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    try {
      const res = await fetch('/api/send-contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Something went wrong');
      }

      setStatus('success');
    } catch (err: any) {
      setStatus('error');
      setErrorMsg(err.message || 'Failed to send. Please try again.');
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fff', fontFamily: 'sans-serif' }}>
      {/* Nav */}
      <nav style={{ borderBottom: '1px solid #eee', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <span style={{ fontSize: '20px', fontWeight: 700, color: '#006aff' }}>hom</span>
          <span style={{ fontSize: '20px', fontWeight: 700, color: '#111' }}>agio</span>
        </Link>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <Link href="/explore" style={{ color: '#444', textDecoration: 'none', fontSize: '14px' }}>Explore</Link>
          <Link href="/faq" style={{ color: '#444', textDecoration: 'none', fontSize: '14px' }}>FAQs</Link>
          <Link href="/about" style={{ color: '#444', textDecoration: 'none', fontSize: '14px' }}>About Us</Link>
          <Link href="/contact" style={{ color: '#006aff', textDecoration: 'none', fontSize: '14px', fontWeight: 600 }}>Contact</Link>
        </div>
      </nav>

      {/* Content */}
      <div style={{ maxWidth: '560px', margin: '0 auto', padding: '64px 24px' }}>
        {status === 'success' ? (
          <div style={{ textAlign: 'center', padding: '48px 0' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>✉️</div>
            <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#111', marginBottom: '12px' }}>Message sent!</h1>
            <p style={{ color: '#666', lineHeight: 1.6, marginBottom: '32px' }}>
              Thanks for reaching out. We'll get back to you within 1–2 business days. Check your inbox — we sent you a confirmation too.
            </p>
            <Link href="/" style={{ display: 'inline-block', background: '#006aff', color: 'white', textDecoration: 'none', padding: '12px 28px', borderRadius: '6px', fontWeight: 600, fontSize: '15px' }}>
              Back to Home
            </Link>
          </div>
        ) : (
          <>
            <h1 style={{ fontSize: '32px', fontWeight: 700, color: '#111', marginBottom: '8px' }}>Contact Us</h1>
            <p style={{ color: '#666', marginBottom: '40px', lineHeight: 1.6 }}>
              Have a question, feedback, or just want to say hi? We'd love to hear from you.
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#111', marginBottom: '6px' }}>Name</label>
                <input
                  name="name"
                  type="text"
                  required
                  placeholder="Your name"
                  value={formData.name}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '15px', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#111', marginBottom: '6px' }}>Email</label>
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '15px', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#111', marginBottom: '6px' }}>Subject</label>
                <select
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '15px', boxSizing: 'border-box', backgroundColor: '#fff' }}
                >
                  <option value="">Select a subject...</option>
                  <option value="General Question">General Question</option>
                  <option value="Feature Request">Feature Request</option>
                  <option value="Bug Report">Bug Report</option>
                  <option value="Partnership">Partnership</option>
                  <option value="Press Inquiry">Press Inquiry</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#111', marginBottom: '6px' }}>Message</label>
                <textarea
                  name="message"
                  required
                  placeholder="Tell us what's on your mind..."
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '15px', boxSizing: 'border-box', resize: 'vertical' }}
                />
              </div>

              {status === 'error' && (
                <div style={{ background: '#fff0f0', border: '1px solid #ffcccc', borderRadius: '6px', padding: '12px 16px', color: '#cc0000', fontSize: '14px' }}>
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={status === 'loading'}
                style={{
                  background: status === 'loading' ? '#99c2ff' : '#006aff',
                  color: 'white',
                  border: 'none',
                  padding: '13px 24px',
                  borderRadius: '6px',
                  fontSize: '15px',
                  fontWeight: 600,
                  cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                  transition: 'background 0.2s',
                }}
              >
                {status === 'loading' ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
