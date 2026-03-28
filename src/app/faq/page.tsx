'use client'

import { useState } from 'react'

const FAQS = [
  {
    q: 'What is Homagio?',
    a: 'Homagio is a Home Intelligence Platform — your home\'s digital twin. It lets you catalog every material, finish, and fixture in your home, track renovation costs, and discover how other homeowners have designed their spaces.',
  },
  {
    q: 'Is Homagio free to use?',
    a: 'Yes — creating an account and cataloging your home is completely free. We plan to offer premium features in the future, but the core catalog experience will always have a free tier.',
  },
  {
    q: 'How do I add my home?',
    a: 'After signing up, click "Add My First Home" from your dashboard. You\'ll enter your address, home details, and upload a photo. We automatically create an Exterior room so you can start cataloging your roof, siding, and windows right away.',
  },
  {
    q: 'What can I catalog in my home?',
    a: 'Everything — flooring, paint colors, countertops, cabinets, appliances, fixtures, hardware, windows, doors, roofing, siding, and more. Each material can include a photo, brand, color, finish, cost, and a purchase link.',
  },
  {
    q: 'Can I make my home public?',
    a: 'Yes. Every home is private by default. You can toggle your home to "Public" from the home detail page, which makes it appear in the Explore section and on the landing page for others to browse and get inspired.',
  },
  {
    q: 'What is the Homagio Estimate™?',
    a: 'The Homagio Estimate™ is our upcoming home value estimate feature — similar to Zillow\'s Zestimate but powered by the actual materials and renovations you\'ve cataloged. It\'s coming soon.',
  },
  {
    q: 'How does AI material detection work?',
    a: 'AI material detection is coming soon. You\'ll be able to upload a photo of any room or material, and our AI will automatically identify what it is — including brand, color, finish, and where to buy it.',
  },
  {
    q: 'Is my data private and secure?',
    a: 'Yes. Your home data is private by default and only visible to you. We use Supabase with Row Level Security, which means your data can only be accessed by your account. We never sell your data.',
  },
  {
    q: 'Can I use Homagio as a designer or builder?',
    a: 'Pro Studio is coming soon — a dedicated experience for designers, builders, and realtors to manage client homes, showcase portfolios, and generate PDF spec sheets.',
  },
  {
    q: 'How do I contact support?',
    a: 'Use our Contact page or email us directly. We\'re a small team and respond to every message.',
  },
]

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div style={{minHeight: '100vh', background: '#f7f9fc', fontFamily: 'system-ui, sans-serif'}}>
      <nav style={{background: '#fff', borderBottom: '1px solid #e9edf2', padding: '0 32px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100}}>
        <a href="/" style={{fontSize: '22px', fontWeight: 700, color: '#006aff', letterSpacing: '-0.5px', textDecoration: 'none'}}>
          hom<span style={{color: '#1a1a2e'}}>agio</span>
        </a>
        <div style={{display: 'flex', gap: '16px', alignItems: 'center'}}>
          <a href="/explore" style={{fontSize: '13px', color: '#6b7280', textDecoration: 'none', fontWeight: 500}}>Explore</a>
          <a href="/about" style={{fontSize: '13px', color: '#6b7280', textDecoration: 'none', fontWeight: 500}}>About</a>
          <a href="/contact" style={{fontSize: '13px', color: '#6b7280', textDecoration: 'none', fontWeight: 500}}>Contact</a>
          <a href="/login" style={{fontSize: '13px', color: '#006aff', textDecoration: 'none', fontWeight: 600}}>Sign In</a>
          <a href="/signup" style={{background: '#006aff', color: '#fff', padding: '8px 18px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, textDecoration: 'none'}}>Join Free</a>
        </div>
      </nav>

      <div style={{maxWidth: '760px', margin: '0 auto', padding: '64px 32px'}}>
        <div style={{textAlign: 'center', marginBottom: '56px'}}>
          <h1 style={{fontSize: '40px', fontWeight: 700, color: '#1a1a2e', letterSpacing: '-1px', marginBottom: '12px'}}>Frequently Asked Questions</h1>
          <p style={{fontSize: '16px', color: '#6b7280'}}>Everything you need to know about Homagio.</p>
        </div>

        <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
          {FAQS.map((faq, i) => (
            <div key={i}
              style={{background: '#fff', borderRadius: '12px', border: '1px solid #e9edf2', overflow: 'hidden'}}>
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                style={{width: '100%', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', gap: '16px'}}>
                <span style={{fontSize: '15px', fontWeight: 600, color: '#1a1a2e'}}>{faq.q}</span>
                <span style={{fontSize: '20px', color: '#006aff', flexShrink: 0, transition: 'transform 0.2s', transform: openIndex === i ? 'rotate(45deg)' : 'none', lineHeight: 1}}>+</span>
              </button>
              {openIndex === i && (
                <div style={{padding: '0 24px 20px', fontSize: '15px', color: '#6b7280', lineHeight: 1.7, borderTop: '1px solid #f3f4f6'}}>
                  <div style={{paddingTop: '16px'}}>{faq.a}</div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={{marginTop: '56px', background: 'linear-gradient(135deg, #006aff 0%, #3b82f6 100%)', borderRadius: '20px', padding: '40px', textAlign: 'center'}}>
          <div style={{fontSize: '22px', fontWeight: 700, color: '#fff', marginBottom: '8px'}}>Still have questions?</div>
          <div style={{fontSize: '14px', color: 'rgba(255,255,255,0.8)', marginBottom: '20px'}}>We're happy to help. Reach out and we'll get back to you quickly.</div>
          <a href="/contact" style={{background: '#fff', color: '#006aff', padding: '12px 28px', borderRadius: '10px', fontSize: '14px', fontWeight: 700, textDecoration: 'none', display: 'inline-block'}}>Contact Us →</a>
        </div>
      </div>
    </div>
  )
}
