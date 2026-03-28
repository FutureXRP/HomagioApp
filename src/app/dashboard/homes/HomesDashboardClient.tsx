'use client'

function HomeCard({ home, onClick }: { home: any, onClick: () => void }) {
  const hasDetails = home.bedrooms || home.bathrooms || home.square_feet

  return (
    <div onClick={onClick}
      style={{background: '#fff', border: '1.5px solid #e9edf2', borderRadius: '16px', overflow: 'hidden', cursor: 'pointer', transition: 'border-color 0.15s, box-shadow 0.15s, transform 0.1s', display: 'flex', flexDirection: 'column'}}
      onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = '#006aff'; el.style.boxShadow = '0 6px 24px rgba(0,106,255,0.12)'; el.style.transform = 'translateY(-2px)' }}
      onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = '#e9edf2'; el.style.boxShadow = 'none'; el.style.transform = 'none' }}
    >
      <div style={{height: '148px', background: 'linear-gradient(135deg, #0D1B2A 0%, #1a3a5c 60%, #1e4b7a 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
        <span style={{fontSize: '52px', opacity: 0.6}}>🏠</span>
      </div>
      <div style={{padding: '18px 20px', flex: 1}}>
        <div style={{fontSize: '15px', fontWeight: 700, color: '#1a1a2e', marginBottom: '3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>
          {home.name || home.address}
        </div>
        {home.name && (
          <div style={{fontSize: '12px', color: '#9ca3af', marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>{home.address}</div>
        )}
        <div style={{fontSize: '12px', color: '#6b7280', marginBottom: hasDetails ? '12px' : '0'}}>
          {home.city}, {home.state} {home.zip}
        </div>
        {hasDetails && (
          <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap', paddingTop: '12px', borderTop: '1px solid #f3f4f6'}}>
            {home.bedrooms && <span style={{fontSize: '11px', color: '#6b7280'}}>🛏️ {home.bedrooms}</span>}
            {home.bathrooms && <span style={{fontSize: '11px', color: '#6b7280'}}>🛁 {home.bathrooms}</span>}
            {home.square_feet && <span style={{fontSize: '11px', color: '#6b7280'}}>📐 {home.square_feet.toLocaleString()} sqft</span>}
            {home.year_built && <span style={{fontSize: '11px', color: '#6b7280'}}>📅 {home.year_built}</span>}
          </div>
        )}
      </div>
    </div>
  )
}

export default function HomesDashboardClient({ homes }: { homes: any[] }) {
  return (
    <>
      <style>{`* { box-sizing: border-box; }`}</style>
      <div style={{minHeight: '100vh', background: '#f7f9fc', fontFamily: 'system-ui, sans-serif'}}>
        <nav style={{background: '#fff', borderBottom: '1px solid #e9edf2', padding: '0 32px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100}}>
          <a href="/dashboard" style={{fontSize: '22px', fontWeight: 700, color: '#006aff', letterSpacing: '-0.5px', textDecoration: 'none'}}>
            hom<span style={{color: '#1a1a2e'}}>agio</span>
          </a>
          <a href="/dashboard" style={{fontSize: '13px', color: '#6b7280', textDecoration: 'none', fontWeight: 500}}>← Dashboard</a>
        </nav>

        <div style={{maxWidth: '1200px', margin: '0 auto', padding: '48px 32px'}}>
          <div style={{display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '36px', flexWrap: 'wrap', gap: '16px'}}>
            <div>
              <h1 style={{fontSize: '26px', fontWeight: 700, color: '#1a1a2e', letterSpacing: '-0.5px', marginBottom: '4px'}}>My Homes</h1>
              <p style={{fontSize: '14px', color: '#6b7280'}}>
                {homes.length === 0 ? 'Add your first home to get started' : `${homes.length} home${homes.length > 1 ? 's' : ''} cataloged`}
              </p>
            </div>
            <button onClick={() => window.location.href = '/homes/add'}
              style={{background: '#006aff', color: '#fff', border: 'none', padding: '11px 22px', borderRadius: '10px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit'}}>
              + Add Home
            </button>
          </div>

          <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '36px'}}>
            {[
              {icon: '🏠', label: 'Homes', value: homes.length},
              {icon: '📦', label: 'Materials', value: '—'},
              {icon: '💰', label: 'Budget Tracked', value: '$0'},
              {icon: '📸', label: 'Photos', value: '0'},
            ].map(stat => (
              <div key={stat.label} style={{background: '#fff', border: '1px solid #e9edf2', borderRadius: '14px', padding: '20px', textAlign: 'center'}}>
                <div style={{fontSize: '24px', marginBottom: '8px'}}>{stat.icon}</div>
                <div style={{fontSize: '22px', fontWeight: 700, color: '#1a1a2e'}}>{stat.value}</div>
                <div style={{fontSize: '12px', color: '#9ca3af', marginTop: '4px', fontWeight: 500}}>{stat.label}</div>
              </div>
            ))}
          </div>

          {homes.length === 0 ? (
            <div style={{background: '#fff', border: '2px dashed #e9edf2', borderRadius: '20px', padding: '72px 32px', textAlign: 'center'}}>
              <div style={{fontSize: '52px', marginBottom: '16px'}}>🏠</div>
              <h2 style={{fontSize: '20px', fontWeight: 700, color: '#1a1a2e', marginBottom: '8px'}}>Add your first home</h2>
              <p style={{fontSize: '14px', color: '#6b7280', maxWidth: '380px', margin: '0 auto 28px', lineHeight: 1.7}}>
                Start building your home's digital twin. Catalog every material, track every dollar.
              </p>
              <button onClick={() => window.location.href = '/homes/add'}
                style={{background: '#006aff', color: '#fff', border: 'none', padding: '13px 32px', borderRadius: '10px', fontSize: '15px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit'}}>
                + Add My First Home
              </button>
            </div>
          ) : (
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px'}}>
              {homes.map(home => (
                <HomeCard key={home.id} home={home} onClick={() => window.location.href = `/homes/${home.id}`} />
              ))}
              <div onClick={() => window.location.href = '/homes/add'}
                style={{background: '#fff', border: '2px dashed #e9edf2', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', minHeight: '220px', flexDirection: 'column', gap: '10px'}}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = '#006aff'; (e.currentTarget as HTMLDivElement).style.background = '#f0f6ff' }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = '#e9edf2'; (e.currentTarget as HTMLDivElement).style.background = '#fff' }}
              >
                <div style={{width: '44px', height: '44px', borderRadius: '50%', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', color: '#9ca3af'}}>+</div>
                <div style={{fontSize: '13px', fontWeight: 600, color: '#9ca3af'}}>Add Another Home</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
