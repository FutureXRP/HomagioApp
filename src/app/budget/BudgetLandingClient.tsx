'use client'
import Nav from '@/components/Nav'

interface Home {
  id: string
  name: string
  address: string
  city: string
  state: string
  photo_url: string | null
}

export default function BudgetLandingClient({ homes }: { homes: Home[] }) {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', system-ui, sans-serif; background: #f7f9fc; }
        .home-card {
          background: #fff;
          border: 1.5px solid #e9edf2;
          border-radius: 16px;
          overflow: hidden;
          cursor: pointer;
          transition: border-color 0.15s, box-shadow 0.15s, transform 0.15s;
          text-decoration: none;
          display: block;
        }
        .home-card:hover {
          border-color: #3db85a;
          box-shadow: 0 6px 24px rgba(61,184,90,0.12);
          transform: translateY(-2px);
        }
      `}</style>

      <Nav variant="dashboard" />

      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '48px 24px' }}>

        {/* Header */}
        <div style={{ marginBottom: '40px' }}>
          <p style={{ fontSize: '13px', fontWeight: 600, color: '#3db85a', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>Budget Tracker</p>
          <h1 style={{ fontSize: '30px', fontWeight: 700, color: '#1a1a2e', letterSpacing: '-0.5px', marginBottom: '8px' }}>Which home?</h1>
          <p style={{ fontSize: '15px', color: '#6b7280' }}>Select a home to view its budget.</p>
        </div>

        {/* Home grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {homes.map(home => (
            <a
              key={home.id}
              href={`/homes/${home.id}/budget`}
              className="home-card"
            >
              {/* Photo */}
              <div style={{ height: '140px', background: '#0D1B2A', position: 'relative', overflow: 'hidden' }}>
                {home.photo_url ? (
                  <img
                    src={home.photo_url}
                    alt={home.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="rgba(61,184,90,0.5)" strokeWidth="1.5">
                      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/>
                      <path d="M9 21V12h6v9"/>
                    </svg>
                  </div>
                )}
                {/* Green accent bar */}
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #3db85a 0%, #006aff 100%)' }} />
              </div>

              {/* Info */}
              <div style={{ padding: '18px 20px' }}>
                <div style={{ fontSize: '16px', fontWeight: 600, color: '#1a1a2e', marginBottom: '4px' }}>{home.name}</div>
                <div style={{ fontSize: '13px', color: '#9ca3af' }}>{home.address}, {home.city}, {home.state}</div>
                <div style={{ marginTop: '14px', display: 'flex', alignItems: 'center', gap: '6px', color: '#3db85a', fontSize: '13px', fontWeight: 600 }}>
                  View Budget
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </div>
              </div>
            </a>
          ))}
        </div>

      </div>
    </>
  )
}