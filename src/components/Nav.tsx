'use client'

import { useState } from 'react'
import Logo from './Logo'

interface NavProps {
  variant?: 'public' | 'dashboard'
  user?: any
  rightContent?: React.ReactNode
}

const PUBLIC_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Catalogue', href: '/dashboard' },
  { label: 'Explore', href: '/explore' },
  { label: 'FAQs', href: '/faq' },
  { label: 'About Us', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

const DASHBOARD_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Catalogue', href: '/dashboard/homes' },
  { label: 'Budget', href: '/dashboard/homes' },
  { label: 'Pro Studio', href: '/pro' },
  { label: 'Explore', href: '/explore' },
  { label: 'FAQs', href: '/faq' },
  { label: 'About Us', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

export default function Nav({ variant = 'public', user, rightContent }: NavProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleSignOut = async () => {
    const { createClient } = await import('@/lib/supabase/client')
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  const initials = user
    ? (user?.user_metadata?.full_name || user?.email || 'U')
        .split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
    : null

  const links = variant === 'dashboard' ? DASHBOARD_LINKS : PUBLIC_LINKS

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&display=swap');
        .nav-link { padding: 7px 12px; border-radius: 8px; font-size: 14px; font-weight: 500; color: #444; text-decoration: none; transition: background 0.12s, color 0.12s; font-family: 'DM Sans', system-ui, sans-serif; white-space: nowrap; }
        .nav-link:hover { background: #f5f5f5; color: #3db85a; }
        .nav-link.budget { color: #0D1B2A; font-weight: 600; }
        .nav-link.budget:hover { background: #f0fdf4; color: #3db85a; }
        .nav-link.pro { color: #0D1B2A; font-weight: 600; }
        .nav-link.pro:hover { background: #f0fdf4; color: #3db85a; }
        .nav-btn-outline { padding: 8px 18px; border-radius: 8px; font-size: 14px; font-weight: 500; color: #0D1B2A; border: 1.5px solid #0D1B2A; background: transparent; cursor: pointer; font-family: 'DM Sans', system-ui, sans-serif; text-decoration: none; display: inline-block; transition: border-color 0.15s, color 0.15s; }
        .nav-btn-outline:hover { border-color: #3db85a; color: #3db85a; }
        .nav-btn-solid { padding: 8px 18px; border-radius: 8px; font-size: 14px; font-weight: 600; color: #fff; background: #0D1B2A; border: none; cursor: pointer; font-family: 'DM Sans', system-ui, sans-serif; text-decoration: none; display: inline-block; transition: background 0.15s; }
        .nav-btn-solid:hover { background: #112236; }
        .sign-out-btn { padding: 8px 16px; border-radius: 8px; border: 1.5px solid #e2e8f0; background: #fff; font-size: 13px; font-weight: 500; cursor: pointer; color: #374151; font-family: 'DM Sans', system-ui, sans-serif; transition: border-color 0.15s, color 0.15s; }
        .sign-out-btn:hover { border-color: #dc2626; color: #dc2626; }
        .mobile-menu-link { padding: 12px 16px; border-radius: 8px; font-size: 15px; font-weight: 500; color: #374151; text-decoration: none; display: block; transition: background 0.12s, color 0.12s; font-family: 'DM Sans', system-ui, sans-serif; }
        .mobile-menu-link:hover { background: #f7f9fc; color: #3db85a; }
        @media (max-width: 900px) { .nav-desktop { display: none !important; } .nav-mobile-toggle { display: flex !important; } }
        @media (min-width: 901px) { .nav-mobile-toggle { display: none !important; } }
      `}</style>

      <nav style={{ background: '#fff', borderBottom: '1px solid #e9edf2', padding: '0 40px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 200, fontFamily: "'DM Sans', system-ui, sans-serif" }}>
        <Logo size={22} />

        {/* Desktop links */}
        <div className="nav-desktop" style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
          {links.map(link => (
            <a key={link.label} href={link.href}
              className={`nav-link${link.label === 'Budget' ? ' budget' : ''}${link.label === 'Pro Studio' ? ' pro' : ''}`}>
              {link.label}
            </a>
          ))}
        </div>

        {/* Right side */}
        <div className="nav-desktop" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {rightContent ? rightContent : user ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#0D1B2A', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, flexShrink: 0 }}>
                  {initials}
                </div>
                <span style={{ fontSize: '13px', fontWeight: 500, color: '#374151' }}>
                  {user?.user_metadata?.full_name?.split(' ')[0] || user?.email?.split('@')[0]}
                </span>
              </div>
              <button onClick={handleSignOut} className="sign-out-btn">Sign Out</button>
            </>
          ) : (
            <>
              <a href="/login" className="nav-btn-outline">Sign In</a>
              <a href="/signup" className="nav-btn-solid">Join Free</a>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <div className="nav-mobile-toggle" style={{ display: 'none', alignItems: 'center', gap: '12px' }}>
          {!user && <a href="/login" style={{ fontSize: '14px', color: '#0D1B2A', textDecoration: 'none', fontWeight: 500 }}>Sign In</a>}
          <button onClick={() => setMobileOpen(!mobileOpen)}
            style={{ background: 'none', border: '1.5px solid #e9edf2', borderRadius: '8px', padding: '7px', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center', width: '36px' }}>
            <span style={{ display: 'block', width: '16px', height: '2px', background: '#444', borderRadius: '2px' }} />
            <span style={{ display: 'block', width: '16px', height: '2px', background: '#444', borderRadius: '2px' }} />
            <span style={{ display: 'block', width: '16px', height: '2px', background: '#444', borderRadius: '2px' }} />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div style={{ position: 'fixed', top: '64px', left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.4)', zIndex: 199 }} onClick={() => setMobileOpen(false)}>
          <div style={{ background: '#fff', padding: '12px', display: 'flex', flexDirection: 'column', gap: '2px', borderBottom: '1px solid #e9edf2' }} onClick={e => e.stopPropagation()}>
            {links.map(link => (
              <a key={link.label} href={link.href} className="mobile-menu-link">{link.label}</a>
            ))}
            <div style={{ height: '1px', background: '#f0f0f0', margin: '8px 0' }} />
            {user ? (
              <button onClick={handleSignOut} className="mobile-menu-link" style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', color: '#dc2626' }}>Sign Out</button>
            ) : (
              <>
                <a href="/login" className="mobile-menu-link">Sign In</a>
                <a href="/signup" className="mobile-menu-link" style={{ color: '#3db85a', fontWeight: 700 }}>Join Free →</a>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
