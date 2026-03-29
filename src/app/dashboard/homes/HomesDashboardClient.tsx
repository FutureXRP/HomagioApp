'use client'

const LOGO_URL = 'https://res.cloudinary.com/dlb0guicc/image/upload/v1774805332/6_wln7y2.png'

function HomeCard({ home, onClick }: { home: any, onClick: () => void }) {
  const hasDetails = home.bedrooms || home.bathrooms || home.square_feet || home.year_built

  return (
    <div
      onClick={onClick}
      style={{ background: '#fff', border: '1.5px solid #e9edf2', borderRadius: '16px', overflow: 'hidden', cursor: 'pointer', transition: 'border-color 0.15s, box-shadow 0.15s, transform 0.15s', display: 'flex', flexDirection: 'column' }}
      onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = '#3db85a'; el.style.boxShadow = '0 6px 24px rgba(61,184,90,0.12)'; el.style.transform = 'translateY(-2px)' }}
      onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = '#e9edf2'; el.style.boxShadow = 'none'; el.style.transform = 'none' }}
    >
      {/* Photo */}
      <div style={{ height: '160px', background: '#0D1B2A', overflow: 'hidden', flexShrink: 0, position: 'relative' }}>
        {home.photo_url ? (
          <img src={home.photo_url} alt={home.name || home.address} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="52" height="52" viewBox="0 0 52 52" fill="none" opacity="0.25">
              <path d="M6 25L26 7l20 18V47a2 2 0 01-2 2H8a2 2 0 01-2-2V25z" stroke="#fff" strokeWidth="2" fill="none"/>
              <path d="M19 49V35h14v14" stroke="#fff" strokeWidth="2" fill="none"/>
            </svg>
          </div>
        )}
        {home.is_public && (
          <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(61,184,90,0.9)', borderRadius: '20px', padding: '3px 9px', fontSize: '10px', fontWeight: 700, color: '#fff', letterSpacing: '0.04em' }}>
            PUBLIC
          </div>
        )}
      </div>

      {/* Details */}
      <div style={{ padding: '18px 20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontSize: '15px', fontWeight: 700, color: '#1a1a2e', marginBottom: '3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {home.name || home.address}
        </div>
        {home.name && (
          <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {home.address}
          </div>
        )}
        <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: hasDetails ? '12px' : '0' }}>
          {home.city}, {home.state} {home.zip}
        </div>
        {hasDetails && (
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', paddingTop: '12px', borderTop: '1px solid #f3f4f6', marginTop: 'auto' }}>
            {home.bedrooms && <span style={{ fontSize: '11px', color: '#6b7280' }}>{home.bedrooms} bed</span>}
            {home.bathrooms && <span style={{ fontSize: '11px', color: '#6b7280' }}>{home.bathrooms} bath</span>}
            {home.square_feet && <span style={{ fontSize: '11px', color: '#6b7280' }}>{home.square_feet.toLocaleString()} sqft</span>}
            {home.year_built && <span style={{ fontSize: '11px', color: '#6b7280' }}>Built {home.year_built}</span>}
          </div>
        )}
      </div>
    </div>
  )
}

export default function HomesDashboardClient({ homes }: { homes: any[] }) {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', system-ui, sans-serif; }
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
        .add-home-card {
          background: #fff;
          border: 2px dashed #e9edf2;
          border-radius: 16px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; min-height: 240px;
          flex-direction: column; gap: 10px;
          transition: border-color 0.15s, background 0.15s;
        }
        .add-home-card:hover {
          border-color: #3db85a;
          background: #f0fdf4;
        }
        .add-home-card:hover .add-icon {
          background: #3db85a;
          color: #fff;
        }
        .add-icon {
          width: 44px; height: 44px; border-radius: 50%;
          background: #f3f4f6;
          display: flex; align-items: center; justify-content: center;
          font-size: 20px; color: #9ca3af;
          transition: background 0.15s, color 0.15s;
        }
      `}</style>

      <div style={{ minHeight: '100vh', background: '#f7f9fc', fontFamily: "'DM Sans', system-ui, sans-serif" }}>

        {/* Nav */}
        <nav style={{ background: '#fff', borderBottom: '1px solid #e9edf2', padding: '0 40px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
          <a href="/dashboard" style={{ textDecoration: 'none' }}>
            <img src={LOGO_URL} alt="homagio" style={{ height: '52px', width: 'auto' }} />
          </a>
          <a href="/dashboard" style={{ fontSize: '13px', color: '#6b7280', textDecoration: 'none', fontWeight: 500 }}>← Dashboard</a>
        </nav>

        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '52px 40px 80px' }}>

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '40px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <p style={{ fontSize: '13px', fontWeight: 600, color: '#3db85a', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>My Portfolio</p>
              <h1 style={{ fontSize: '32px', fontWeight: 700, color: '#1a1a2e', letterSpacing: '-0.75px', marginBottom: '6px' }}>My Homes</h1>
              <p style={{ fontSize: '14px', color: '#6b7280' }}>
                {homes.length === 0 ? 'Add your first home to get started' : `${homes.length} home${homes.length > 1 ? 's' : ''} cataloged`}
              </p>
            </div>
            <button
              onClick={() => window.location.href = '/homes/add'}
              style={{ background: '#0D1B2A', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '10px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#112236')}
              onMouseLeave={e => (e.currentTarget.style.background = '#0D1B2A')}
            >
              + Add Home
            </button>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '40px' }}>
            {[
              {
                label: 'Homes', value: homes.length,
                svg: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 9.5L10 3l7 6.5V17a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" stroke="#3db85a" strokeWidth="1.5" fill="none"/><path d="M7 18v-5h6v5" stroke="#3db85a" strokeWidth="1.5" fill="none"/></svg>
              },
              {
                label: 'Public Homes', value: homes.filter(h => h.is_public).length,
                svg: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="7.5" stroke="#3db85a" strokeWidth="1.5" fill="none"/><path d="M10 2.5c0 0-3 3-3 7.5s3 7.5 3 7.5M10 2.5c0 0 3 3 3 7.5s-3 7.5-3 7.5M2.5 10h15" stroke="#3db85a" strokeWidth="1.5"/></svg>
              },
              {
                label: 'Total Sq Ft', value: homes.reduce((sum, h) => sum + (h.square_feet || 0), 0).toLocaleString() || '—',
                svg: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="2.5" y="2.5" width="15" height="15" rx="1.5" stroke="#3db85a" strokeWidth="1.5" fill="none"/><path d="M6 14l3-3 2 2 3-4" stroke="#3db85a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              },
              {
                label: 'Cities', value: Array.from(new Set(homes.map(h => h.city).filter(Boolean))).length || '—',
                svg: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 2a5 5 0 015 5c0 3.5-5 11-5 11S5 10.5 5 7a5 5 0 015-5z" stroke="#3db85a" strokeWidth="1.5" fill="none"/><circle cx="10" cy="7" r="1.5" stroke="#3db85a" strokeWidth="1.5" fill="none"/></svg>
              },
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

          {/* Homes grid */}
          {homes.length === 0 ? (
            <div style={{ background: '#0D1B2A', borderRadius: '20px', padding: '80px 32px', textAlign: 'center', position: 'relative', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(61,184,90,0.5), transparent)' }} />
              <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center' }}>
                <svg width="56" height="56" viewBox="0 0 56 56" fill="none" opacity="0.4">
                  <path d="M7 27L28 8l21 19V50a2 2 0 01-2 2H9a2 2 0 01-2-2V27z" stroke="#fff" strokeWidth="2" fill="none"/>
                  <path d="M21 52V38h14v14" stroke="#fff" strokeWidth="2" fill="none"/>
                </svg>
              </div>
              <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#fff', marginBottom: '10px', letterSpacing: '-0.5px' }}>Add your first home</h2>
              <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', maxWidth: '360px', margin: '0 auto 32px', lineHeight: 1.7 }}>
                Start building your home's digital record. Catalog every material, track every dollar.
              </p>
              <button
                onClick={() => window.location.href = '/homes/add'}
                style={{ background: '#3db85a', color: '#fff', border: 'none', padding: '14px 36px', borderRadius: '10px', fontSize: '15px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#34a34f')}
                onMouseLeave={e => (e.currentTarget.style.background = '#3db85a')}
              >
                + Add My First Home
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
              {homes.map(home => (
                <HomeCard key={home.id} home={home} onClick={() => window.location.href = `/homes/${home.id}`} />
              ))}
              <div className="add-home-card" onClick={() => window.location.href = '/homes/add'}>
                <div className="add-icon">+</div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#9ca3af' }}>Add Another Home</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
