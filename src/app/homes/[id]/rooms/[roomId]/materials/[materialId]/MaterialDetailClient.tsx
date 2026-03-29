'use client'

const LOGO_URL = 'https://res.cloudinary.com/dlb0guicc/image/upload/v1774805332/6_wln7y2.png'

export default function MaterialDetailClient({ material, homeId, roomId }: {
  material: any, homeId: string, roomId: string
}) {
  const cost = material.cost > 0 ? `$${(material.cost / 100).toLocaleString()}` : null

  const details = [
    { label: 'Category', value: material.category },
    { label: 'Brand', value: material.brand },
    { label: 'Color', value: material.color },
    { label: 'Finish', value: material.finish },
    { label: 'Cost', value: cost },
  ].filter(d => d.value)

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', system-ui, sans-serif; }
        .edit-btn {
          background: #fff; color: #374151;
          border: 1.5px solid #e9edf2;
          padding: 8px 18px; border-radius: 8px;
          font-size: 13px; font-weight: 600;
          cursor: pointer; font-family: inherit;
          transition: border-color 0.15s, color 0.15s;
          display: flex; align-items: center; gap: 6px;
        }
        .edit-btn:hover { border-color: #3db85a; color: #3db85a; }
        .detail-card {
          background: #f7f9fc;
          border-radius: 10px;
          padding: 14px 16px;
          border: 1px solid #f0f0f0;
        }
        .buy-btn {
          flex: 1; min-width: 160px;
          padding: 13px 20px; border-radius: 10px;
          font-size: 14px; font-weight: 600;
          text-decoration: none; text-align: center;
          display: block; transition: opacity 0.15s;
        }
        .buy-btn:hover { opacity: 0.88; }
      `}</style>

      <div style={{ minHeight: '100vh', background: '#f7f9fc', fontFamily: "'DM Sans', system-ui, sans-serif" }}>

        {/* Nav */}
        <nav style={{ background: '#fff', borderBottom: '1px solid #e9edf2', padding: '0 40px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
          <a href="/dashboard" style={{ textDecoration: 'none' }}>
            <img src={LOGO_URL} alt="homagio" style={{ height: '52px', width: 'auto' }} />
          </a>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <a href={`/homes/${homeId}/rooms/${roomId}`} style={{ fontSize: '13px', color: '#6b7280', textDecoration: 'none', fontWeight: 500 }}>
              ← Back to Room
            </a>
            <button
              className="edit-btn"
              onClick={() => window.location.href = `/homes/${homeId}/rooms/${roomId}/materials/${material.id}/edit`}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M9.5 1.5l3 3L4 13H1v-3L9.5 1.5z" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinejoin="round"/>
              </svg>
              Edit
            </button>
          </div>
        </nav>

        <div style={{ maxWidth: '720px', margin: '0 auto', padding: '40px 40px 80px' }}>

          {/* Photo */}
          {material.photo_url ? (
            <div style={{ borderRadius: '20px', overflow: 'hidden', marginBottom: '24px' }}>
              <img src={material.photo_url} alt={material.name} style={{ width: '100%', height: '380px', objectFit: 'cover', display: 'block' }} />
            </div>
          ) : (
            <div style={{ borderRadius: '20px', overflow: 'hidden', marginBottom: '24px', background: '#0D1B2A', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '12px', position: 'relative' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(61,184,90,0.4), transparent)' }} />
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" opacity="0.3">
                <rect x="4" y="8" width="32" height="26" rx="3" stroke="#fff" strokeWidth="1.5" fill="none"/>
                <circle cx="20" cy="21" r="6" stroke="#fff" strokeWidth="1.5" fill="none"/>
                <path d="M14 8l2-4h8l2 4" stroke="#fff" strokeWidth="1.5" strokeLinejoin="round"/>
              </svg>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.35)', fontWeight: 500 }}>No photo added</div>
            </div>
          )}

          {/* Main card */}
          <div style={{ background: '#fff', borderRadius: '20px', border: '1px solid #e9edf2', overflow: 'hidden', marginBottom: '16px' }}>
            <div style={{ height: '4px', background: 'linear-gradient(90deg, #3db85a 0%, #006aff 100%)' }} />
            <div style={{ padding: '28px 32px' }}>

              {/* Title + cost */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap', marginBottom: '24px' }}>
                <div>
                  <p style={{ fontSize: '12px', fontWeight: 600, color: '#3db85a', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>Material</p>
                  <h1 style={{ fontSize: '26px', fontWeight: 700, color: '#1a1a2e', letterSpacing: '-0.5px', marginBottom: '4px' }}>{material.name}</h1>
                  {material.brand && <div style={{ fontSize: '14px', color: '#6b7280' }}>by {material.brand}</div>}
                </div>
                {cost && (
                  <div style={{ textAlign: 'right', background: '#f7f9fc', padding: '14px 18px', borderRadius: '12px', border: '1px solid #f0f0f0' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>Cost</div>
                    <div style={{ fontSize: '30px', fontWeight: 700, color: '#3db85a', letterSpacing: '-1px' }}>{cost}</div>
                  </div>
                )}
              </div>

              {/* Detail chips */}
              {details.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '10px', marginBottom: material.notes ? '24px' : '0' }}>
                  {details.map(detail => (
                    <div key={detail.label} className="detail-card">
                      <div style={{ fontSize: '10px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '5px' }}>{detail.label}</div>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: '#1a1a2e' }}>{detail.value}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Notes */}
              {material.notes && (
                <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #f3f4f6' }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '10px' }}>Notes</div>
                  <div style={{ fontSize: '14px', color: '#374151', lineHeight: 1.7 }}>{material.notes}</div>
                </div>
              )}
            </div>
          </div>

          {/* Shop */}
          {(material.purchase_url || material.affiliate_url) && (
            <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e9edf2', padding: '24px 28px', marginBottom: '16px' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '14px' }}>Shop This Material</div>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {material.purchase_url && (
                  <a href={material.purchase_url} target="_blank" rel="noopener noreferrer"
                    className="buy-btn"
                    style={{ background: '#0D1B2A', color: '#fff' }}>
                    Buy This Material
                  </a>
                )}
                {material.affiliate_url && (
                  <a href={material.affiliate_url} target="_blank" rel="noopener noreferrer"
                    className="buy-btn"
                    style={{ background: '#3db85a', color: '#fff' }}>
                    Shop via Affiliate
                  </a>
                )}
              </div>
            </div>
          )}

          {/* AI card */}
          <div style={{ background: '#0D1B2A', borderRadius: '16px', padding: '22px 24px', display: 'flex', alignItems: 'center', gap: '18px', border: '1px solid rgba(255,255,255,0.06)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(61,184,90,0.4), transparent)' }} />
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(61,184,90,0.15)', border: '1px solid rgba(61,184,90,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <circle cx="11" cy="11" r="4" stroke="#3db85a" strokeWidth="1.5" fill="none"/>
                <path d="M11 2v2M11 18v2M2 11h2M18 11h2M4.22 4.22l1.42 1.42M16.36 16.36l1.42 1.42M4.22 17.78l1.42-1.42M16.36 5.64l1.42-1.42" stroke="#3db85a" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>AI Material Detection — Coming Soon</div>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.5 }}>Upload a photo and our AI will automatically identify the material, brand, color, and finish.</div>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}
