'use client'

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

interface Props {
  user: any
  homes: any[]
  homesCount: number
  roomsCount: number
  materialsCount: number
  totalValue: number
  recentMaterials: any[]
}

export default function DashboardClient({
  user, homes, homesCount, roomsCount, materialsCount, totalValue, recentMaterials
}: Props) {
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

  const formattedValue = totalValue > 0
    ? `$${Math.round(totalValue / 100).toLocaleString()}`
    : '$0'

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap');
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
        .feature-card.active { cursor: pointer; }
        .feature-card.active:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 48px rgba(0,0,0,0.3);
          border-color: rgba(61,184,90,0.3);
        }
        .feature-card.inactive { opacity: 0.6; cursor: default; }
        .card-shine {
          position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent);
        }
        .card-soon {
          position: absolute; top: 16px; right: 16px;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 20px; padding: 3px 10px;
          font-size: 10px; font-weight: 600;
          color: rgba(255,255,255,0.4); letter-spacing: 0.06em;
        }

        .home-card {
          background: #fff;
          border: 1.5px solid #e9edf2;
          border-radius: 16px;
          overflow: hidden;
          cursor: pointer;
          transition: border-color 0.15s, box-shadow 0.15s, transform 0.15s;
        }
        .home-card:hover {
          border-color: #3db85a;
          box-shadow: 0 6px 24px rgba(61,184,90,0.12);
          transform: translateY(-2px);
        }

        .stat-card {
          background: #fff;
          border: 1px solid #e9edf2;
          border-radius: 14px;
          padding: 22px 20px;
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .stat-icon {
          width: 44px; height: 44px; border-radius: 12px;
          background: #0D1B2A;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }

        .material-row {
          display: flex; align-items: center; gap: 14px;
          padding: 14px 16px;
          border-radius: 10px;
          border: 1px solid #f3f4f6;
          cursor: pointer;
          transition: background 0.12s, border-color 0.12s;
        }
        .material-row:hover { background: #f7f9fc; border-color: #e2e8f0; }

        .quick-link {
          display: flex; align-items: center;
          padding: 9px 18px; border-radius: 8px;
          border: 1.5px solid #e2e8f0; background: #fff;
          font-size: 13px; font-weight: 500; color: #374151;
          text-decoration: none; font-family: inherit;
          transition: border-color 0.15s, color 0.15s, background 0.15s;
          white-space: nowrap;
        }
        .quick-link:hover { border-color: #3db85a; color: #3db85a; background: #f0fdf4; }

        .sign-out-btn {
          padding: 8px 16px; border-radius: 8px;
          border: 1.5px solid #e2e8f0; background: #fff;
          font-size: 13px; font-weight: 500; cursor: pointer;
          color: #374151; font-family: inherit;
          transition: border-color 0.15s, color 0.15s;
        }
        .sign-out-btn:hover { border-color: #dc2626; color: #dc2626; }

        .section-header {
          display: flex; align-items: center;
          justify-content: space-between; margin-bottom: 20px;
        }
        .section-title {
          font-size: 17px; font-weight: 700; color: #1a1a2e;
        }
        .section-link {
          font-size: 13px; font-weight: 600; color: #3db85a;
          text-decoration: none;
        }
        .section-link:hover { color: #34a34f; }
      `}</style>

      <div style={{ minHeight: '100vh', background: '#f7f9fc', fontFamily: "'DM Sans', system-ui, sans-serif" }}>

        {/* Nav */}
        <nav style={{ background: '#fff', borderBottom: '1px solid #e9edf2', padding: '0 40px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
          <a href="/" style={{ textDecoration: 'none' }}>
            <img src={LOGO_URL} alt="homagio" style={{ height: '52px', width: 'auto' }} />
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
          <div style={{ marginBottom: '40px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <p style={{ fontSize: '13px', fontWeight: 600, color: '#3db85a', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>Dashboard</p>
              <h1 style={{ fontSize: '34px', fontWeight: 700, color: '#1a1a2e', letterSpacing: '-0.75px', marginBottom: '8px', lineHeight: 1.2 }}>
                Welcome back, {firstName}
              </h1>
              <p style={{ fontSize: '15px', color: '#6b7280', lineHeight: 1.6 }}>
                {isNewUser ? "You haven't added a home yet — let's get started." : `You have ${homesCount} home${homesCount !== 1 ? 's' : ''} cataloged.`}
              </p>
            </div>
            {!isNewUser && (
              <button
                onClick={() => window.location.href = '/homes/add'}
                style={{ background: '#0D1B2A', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '10px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#112236')}
                onMouseLeave={e => (e.currentTarget.style.background = '#0D1B2A')}
              >
                + Add Home
              </button>
            )}
          </div>

          {/* New user CTA */}
          {isNewUser && (
            <div style={{ background: '#0D1B2A', borderRadius: '20px', padding: '40px 48px', marginBottom: '40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '24px', flexWrap: 'wrap', border: '1px solid rgba(255,255,255,0.06)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(61,184,90,0.5), transparent)' }} />
              <div>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#3db85a', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '10px' }}>Get Started</div>
                <div style={{ fontSize: '24px', fontWeight: 700, color: '#fff', marginBottom: '8px', letterSpacing: '-0.5px' }}>Add your first home</div>
                <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.55)', maxWidth: '400px', lineHeight: 1.7 }}>Start building your home's digital record. Catalog every material, finish, and fixture.</div>
              </div>
              <button
                onClick={() => window.location.href = '/homes/add'}
                style={{ background: '#3db85a', color: '#fff', border: 'none', padding: '14px 32px', borderRadius: '10px', fontSize: '15px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0 }}
                onMouseEnter={e => (e.currentTarget.style.background = '#34a34f')}
                onMouseLeave={e => (e.currentTarget.style.background = '#3db85a')}
              >
                + Add My First Home
              </button>
            </div>
          )}

          {/* Stats bar */}
          {!isNewUser && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '40px' }}>
              {[
                { label: 'Homes', value: homesCount, svg: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 9.5L10 3l7 6.5V17a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" stroke="#3db85a" strokeWidth="1.5" fill="none"/><path d="M7 18v-5h6v5" stroke="#3db85a" strokeWidth="1.5" fill="none"/></svg> },
                { label: 'Rooms', value: roomsCount, svg: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="2" y="2" width="7" height="7" rx="1.5" stroke="#3db85a" strokeWidth="1.5" fill="none"/><rect x="11" y="2" width="7" height="7" rx="1.5" stroke="#3db85a" strokeWidth="1.5" fill="none"/><rect x="2" y="11" width="7" height="7" rx="1.5" stroke="#3db85a" strokeWidth="1.5" fill="none"/><rect x="11" y="11" width="7" height="7" rx="1.5" stroke="#3db85a" strokeWidth="1.5" fill="none"/></svg> },
                { label: 'Materials', value: materialsCount, svg: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="3" y="3" width="14" height="14" rx="2" stroke="#3db85a" strokeWidth="1.5" fill="none"/><path d="M3 8h14M8 8v9" stroke="#3db85a" strokeWidth="1.5"/></svg> },
                { label: 'Materials Value', value: formattedValue, svg: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="7.5" stroke="#3db85a" strokeWidth="1.5" fill="none"/><path d="M10 6v1.5M10 12.5V14M7.5 11.5c0 .83.67 1.5 1.5 1.5h2a1.5 1.5 0 000-3H9a1.5 1.5 0 010-3h2A1.5 1.5 0 0112.5 8.5" stroke="#3db85a" strokeWidth="1.5" strokeLinecap="round"/></svg> },
              ].map(stat => (
                <div key={stat.label} className="stat-card">
                  <div className="stat-icon">{stat.svg}</div>
                  <div>
                    <div style={{ fontSize: '22px', fontWeight: 700, color: '#1a1a2e', letterSpacing: '-0.5px' }}>{stat.value}</div>
                    <div style={{ fontSize: '12px', color: '#9ca3af', fontWeight: 500, marginTop: '2px' }}>{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* My Homes snapshot */}
          {!isNewUser && homes.length > 0 && (
            <div style={{ marginBottom: '40px' }}>
              <div className="section-header">
                <div className="section-title">My Homes</div>
                <a href="/dashboard/homes" className="section-link">View all →</a>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
                {homes.slice(0, 3).map(home => (
                  <div key={home.id} className="home-card" onClick={() => window.location.href = `/homes/${home.id}`}>
                    <div style={{ height: '140px', background: '#0D1B2A', overflow: 'hidden', position: 'relative' }}>
                      {home.photo_url
                        ? <img src={home.photo_url} alt={home.name || home.address} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                        : (
                          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" opacity="0.3">
                              <path d="M6 23L24 7l18 16V43a2 2 0 01-2 2H8a2 2 0 01-2-2V23z" stroke="#fff" strokeWidth="2" fill="none"/>
                              <path d="M18 45V33h12v12" stroke="#fff" strokeWidth="2" fill="none"/>
                            </svg>
                          </div>
                        )}
                      {home.is_public && (
                        <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(61,184,90,0.9)', borderRadius: '20px', padding: '2px 8px', fontSize: '10px', fontWeight: 600, color: '#fff' }}>PUBLIC</div>
                      )}
                    </div>
                    <div style={{ padding: '16px 18px' }}>
                      <div style={{ fontSize: '15px', fontWeight: 700, color: '#1a1a2e', marginBottom: '3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {home.name || home.address}
                      </div>
                      {home.name && <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{home.address}</div>}
                      <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '10px' }}>{home.city}, {home.state}</div>
                      {(home.bedrooms || home.bathrooms || home.square_feet) && (
                        <div style={{ display: 'flex', gap: '12px', paddingTop: '10px', borderTop: '1px solid #f3f4f6' }}>
                          {home.bedrooms && <span style={{ fontSize: '11px', color: '#6b7280' }}>{home.bedrooms} bed</span>}
                          {home.bathrooms && <span style={{ fontSize: '11px', color: '#6b7280' }}>{home.bathrooms} bath</span>}
                          {home.square_feet && <span style={{ fontSize: '11px', color: '#6b7280' }}>{home.square_feet.toLocaleString()} sqft</span>}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                <div
                  onClick={() => window.location.href = '/homes/add'}
                  style={{ background: '#fff', border: '2px dashed #e9edf2', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', minHeight: '220px', flexDirection: 'column', gap: '10px', transition: 'border-color 0.15s, background 0.15s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = '#3db85a'; (e.currentTarget as HTMLDivElement).style.background = '#f0fdf4' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = '#e9edf2'; (e.currentTarget as HTMLDivElement).style.background = '#fff' }}
                >
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', color: '#9ca3af' }}>+</div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#9ca3af' }}>Add Another Home</div>
                </div>
              </div>
            </div>
          )}

          {/* Feature cards */}
          <div style={{ marginBottom: '40px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '20px' }}>Platform Features</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
              {FEATURES.map(feature => (
                <div
                  key={feature.title}
                  className={`feature-card ${feature.active ? 'active' : 'inactive'}`}
                  onClick={() => feature.active && (window.location.href = feature.href)}
                >
                  <div className="card-shine" />
                  {!feature.active && <div className="card-soon">COMING SOON</div>}
                  <div style={{ position: 'relative', padding: '24px' }}>
                    <div style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '8px' }}>{feature.category}</div>
                    <div style={{ fontSize: '17px', fontWeight: 600, color: feature.active ? '#fff' : 'rgba(255,255,255,0.7)', marginBottom: '8px', letterSpacing: '-0.2px' }}>{feature.title}</div>
                    <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 }}>{feature.desc}</div>
                    {feature.cta && <div style={{ marginTop: '16px', fontSize: '13px', fontWeight: 600, color: '#3db85a' }}>{feature.cta}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Materials */}
          {recentMaterials.length > 0 && (
            <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e9edf2', padding: '28px', marginBottom: '40px' }}>
              <div className="section-header">
                <div className="section-title">Recently Added Materials</div>
                <a href="/dashboard/homes" className="section-link">View all →</a>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {recentMaterials.map(material => (
                  <div
                    key={material.id}
                    className="material-row"
                    onClick={() => window.location.href = `/homes/${material.home_id}/rooms/${material.room_id}/materials/${material.id}`}
                  >
                    <div style={{ width: '52px', height: '52px', borderRadius: '10px', overflow: 'hidden', flexShrink: 0, background: '#f0f6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {material.photo_url
                        ? <img src={material.photo_url} alt={material.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : (
                          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                            <rect x="2" y="2" width="18" height="18" rx="3" stroke="#006aff" strokeWidth="1.5" fill="none"/>
                            <path d="M2 9h18M9 9v11" stroke="#006aff" strokeWidth="1.5"/>
                          </svg>
                        )}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: '#1a1a2e', marginBottom: '2px' }}>{material.name}</div>
                      <div style={{ fontSize: '12px', color: '#9ca3af' }}>{[material.brand, material.color, material.finish].filter(Boolean).join(' · ') || 'No details added'}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
                      {material.cost > 0 && <div style={{ fontSize: '14px', fontWeight: 700, color: '#3db85a' }}>${(material.cost / 100).toLocaleString()}</div>}
                      <div style={{ fontSize: '16px', color: '#d1d5db' }}>›</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

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
