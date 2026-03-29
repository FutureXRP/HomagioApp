'use client'

// HOMAGIO DESIGN SYSTEM
// Primary Blue:  #006aff
// Homagio Green: #3db85a
// Deep Navy:     #0D1B2A
// Navy Mid:      #112236
// Navy Light:    #1a3a5c

const LOGO_URL = 'https://res.cloudinary.com/dlb0guicc/image/upload/v1774805332/6_wln7y2.png'

const FEATURES = [
  {
    title: 'Catalogue My Home',
    desc: 'Add rooms, materials, and track every detail of your home.',
    href: '/dashboard/homes',
    category: 'My Homes',
    active: true,
    cta: 'Get started →',
  },
  {
    title: 'Explore Homes Near Me',
    desc: 'Discover how neighbors designed their homes and get inspired.',
    href: '/explore',
    category: 'Explore',
    active: true,
    cta: 'Explore now →',
  },
  {
    title: 'Find a Material',
    desc: 'Search homes by flooring, countertop, paint color, and more.',
    href: '#',
    category: 'Search',
    active: false,
  },
  {
    title: 'Identify a Material',
    desc: 'Upload a photo and our AI will tell you exactly what it is.',
    href: '#',
    category: 'AI Detection',
    active: false,
  },
  {
    title: 'Homagio Estimate™',
    desc: "See your home's estimated value and track it over time.",
    href: '#',
    category: 'Estimate',
    active: false,
  },
  {
    title: 'Find a Pro',
    desc: 'Connect with designers, builders, and realtors in your area.',
    href: '#',
    category: 'Pro Studio',
    active: false,
  },
]

export default function DashboardClient({ user, homesCount }: { user: any, homesCount: number }) {
  const handleSignOut = async () => {
    const { createClient } = await import('@/lib/supabase/client')
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  const firstName = user?.user_metadata?.full_name
    ? user.user_metadata.full_name.split(' ')[0]
    : user?.email?.split('@')[0] || 'there'

  const initials = (user?.user_metadata?.full_name || user?.email || 'U')
    .split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()

  const isNewUser = homesCount === 0

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', system-ui, sans-serif; background: #f7f9fc; }

        .feature-card {
          background: #0D1B2A;
          border-radius: 16px;
          overflow: hidden;
          position: relative;
          min-height: 210px;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          border: 1px solid rgba(255,255,255,0.06);
          transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
        }
        .feature-card.active {
          cursor: pointer;
        }
        .feature-card.active:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 48px rgba(0,0,0,0.3);
          border-color: rgba(61,184,90,0.3);
        }
        .feature-card.inactive {
          opacity: 0.6;
          cursor: default;
        }
        .card-inner {
          position: relative;
          padding: 24px;
        }
        .card-category {
          font-size: 10px;
          font-weight: 700;
          color: rgba(255,255,255,0.35);
          text-transform: uppercase;
          letter-spacing: 0.12em;
          margin-bottom: 8px;
        }
        .card-title {
          font-size: 17px;
          font-weight: 600;
          color: #fff;
          margin-bottom: 8px;
          letter-spacing: -0.2px;
          line-height: 1.3;
        }
        .card-title.inactive {
          color: rgba(255,255,255,0.7);
        }
        .card-desc {
          font-size: 13px;
          color: rgba(255,255,255,0.45);
          line-height: 1.6;
        }
        .card-cta {
          display: inline-block;
          margin-top: 16px;
          font-size: 13px;
          font-weight: 600;
          color: #3db85a;
        }
        .card-soon {
          position: absolute;
          top: 16px;
          right: 16px;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 20px;
          padding: 3px 10px;
          font-size: 10px;
          font-weight: 600;
          color: rgba(255,255,255,0.4);
          letter-spacing: 0.06em;
        }
        .card-shine {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent);
        }
        .quick-link {
          display: flex;
          align-items: center;
          padding: 9px 18px;
          border-radius: 8px;
          border: 1.5px solid #e2e8f0;
          background: #fff;
          font-size: 13px;
          font-weight: 500;
          color: #374151;
          text-decoration: none;
          font-family: inherit;
          transition: border-color 0.15s, color 0.15s, background 0.15s;
          cursor: pointer;
          white-space: nowrap;
        }
        .quick-link:hover {
          border-color: #3db85a;
          color: #3db85a;
          background: #f0fdf4;
        }
        .sign-out-btn {
          padding: 8px 16px;
          border-radius: 8px;
          border: 1.5px solid #e2e8f0;
          background: #fff;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          color: #374151;
          font-family: inherit;
          transition: border-color 0.15s, color 0.15s;
        }
        .sign-out-btn:hover {
          border-color: #dc2626;
          color: #dc2626;
        }
      `}</style>

      <div style={{ minHeight: '100vh', background: '#f7f9fc', fontFamily: "'DM Sans', system-ui, sans-serif" }}>

        {/* Nav */}
        <nav style={{ background: '#fff', borderBottom: '1px solid #e9edf2', padding: '0 40px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
          <a href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
            <img src={LOGO_URL} alt="homagio" style={{ height: '38px', width: 'auto' }} />
          </a>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#0D1B2A', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, flexShrink: 0 }}>
                {initials}
              </div>
              <span style={{ fontSize: '14px', fontWeight: 500, color: '#1a1a2e' }}>
                {user?.user_metadata?.full_name || user?.email}
              </span>
            </div>
            <button onClick={handleSignOut} className="sign-out-btn">Sign Out</button>
          </div>
        </nav>

        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '52px 40px 80px' }}>

          {/* Header */}
          <div style={{ marginBottom: '48px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <p style={{ fontSize: '13px', fontWeight: 600, color: '#3db85a', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
                Dashboard
              </p>
              <h1 style={{ fontSize: '34px', fontWeight: 700, color: '#1a1a2e', letterSpacing: '-0.75px', marginBottom: '8px', lineHeight: 1.2 }}>
                Welcome back, {firstName}
              </h1>
              <p style={{ fontSize: '15px', color: '#6b7280', lineHeight: 1.6 }}>
                {isNewUser
                  ? "You haven't added a home yet — let's get started."
                  : `You have ${homesCount} home${homesCount !== 1 ? 's' : ''} cataloged.`}
              </p>
            </div>
            {!isNewUser && (
              <button
                onClick={() => window.location.href = '/homes/add'}
                style={{ background: '#0D1B2A', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '10px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.15s' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#112236')}
                onMouseLeave={e => (e.currentTarget.style.background = '#0D1B2A')}
              >
                + Add Home
              </button>
            )}
          </div>

          {/* New user CTA banner */}
          {isNewUser && (
            <div style={{ background: '#0D1B2A', borderRadius: '20px', padding: '40px 48px', marginBottom: '48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '24px', flexWrap: 'wrap', border: '1px solid rgba(255,255,255,0.06)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(61,184,90,0.5), transparent)' }} />
              <div>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#3db85a', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '10px' }}>Get Started</div>
                <div style={{ fontSize: '24px', fontWeight: 700, color: '#fff', marginBottom: '8px', letterSpacing: '-0.5px' }}>Add your first home</div>
                <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.55)', maxWidth: '400px', lineHeight: 1.7 }}>
                  Start building your home's digital record. Catalog every material, finish, and fixture — all in one place.
                </div>
              </div>
              <button
                onClick={() => window.location.href = '/homes/add'}
                style={{ background: '#3db85a', color: '#fff', border: 'none', padding: '14px 32px', borderRadius: '10px', fontSize: '15px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0, whiteSpace: 'nowrap' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#34a34f')}
                onMouseLeave={e => (e.currentTarget.style.background = '#3db85a')}
              >
                + Add My First Home
              </button>
            </div>
          )}

          {/* Feature cards */}
          <div style={{ marginBottom: '48px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '20px' }}>
              Platform Features
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
              {FEATURES.map(feature => (
                <div
                  key={feature.title}
                  className={`feature-card ${feature.active ? 'active' : 'inactive'}`}
                  onClick={() => feature.active && (window.location.href = feature.href)}
                >
                  <div className="card-shine" />
                  {!feature.active && <div className="card-soon">COMING SOON</div>}
                  <div className="card-inner">
                    <div className="card-category">{feature.category}</div>
                    <div className={`card-title ${!feature.active ? 'inactive' : ''}`}>{feature.title}</div>
                    <div className="card-desc">{feature.desc}</div>
                    {feature.cta && <div className="card-cta">{feature.cta}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick access */}
          <div style={{ background: '#fff', border: '1px solid #e9edf2', borderRadius: '14px', padding: '18px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>Quick Access</div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {[
                { label: 'My Homes', href: '/dashboard/homes' },
                { label: 'Explore', href: '/explore' },
                { label: 'Add Home', href: '/homes/add' },
                { label: 'Settings', href: '#' },
              ].map(item => (
                <a key={item.label} href={item.href} className="quick-link">{item.label}</a>
              ))}
            </div>
          </div>

        </div>
      </div>
    </>
  )
}
