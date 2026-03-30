'use client'

import Nav from '@/components/Nav'

export default function PublicMaterialClient({ home, room, material }: { home: any, room: any, material: any }) {
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
        .buy-btn { flex: 1; min-width: 150px; padding: 14px 20px; border-radius: 10px; font-size: 14px; font-weight: 600; text-decoration: none; text-align: center; display: block; transition: opacity 0.15s; }
        .buy-btn:hover { opacity: 0.88; }
        .detail-card { background: #f7f9fc; border-radius: 10px; padding: 14px 16px; border: 1px solid #f0f0f0; }
      `}</style>

      <div style={{ minHeight: '100vh', background: '#f7f9fc', fontFamily: "'DM Sans', system-ui, sans-serif" }}>
        <Nav rightContent={
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <a href={`/explore/${home.id}/rooms/${room.id}`} style={{ fontSize: '13px', color: '#6b7280', textDecoration: 'none', fontWeight: 500 }}>← {room.name}</a>
            <a href="/signup" style={{ background: '#3db85a', color: '#fff', padding: '9px 18px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}>Catalog My Home Free</a>
          </div>
        } />

        <div style={{ maxWidth: '720px', margin: '0 auto', padding: '40px 40px 80px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '32px', fontSize: '13px', color: '#9ca3af', flexWrap: 'wrap' }}>
            <a href="/explore" style={{ color: '#9ca3af', textDecoration: 'none' }}>Explore</a>
            <span>›</span>
            <a href={`/explore/${home.id}`} style={{ color: '#9ca3af', textDecoration: 'none' }}>{home.name || home.address}</a>
            <span>›</span>
            <a href={`/explore/${home.id}/rooms/${room.id}`} style={{ color: '#9ca3af', textDecoration: 'none' }}>{room.name}</a>
            <span>›</span>
            <span style={{ color: '#1a1a2e', fontWeight: 500 }}>{material.name}</span>
          </div>

          {material.photo_url ? (
            <div style={{ borderRadius: '20px', overflow: 'hidden', marginBottom: '24px' }}>
              <img src={material.photo_url} alt={material.name} style={{ width: '100%', maxHeight: '420px', objectFit: 'cover', display: 'block' }} />
            </div>
          ) : (
            <div style={{ borderRadius: '20px', overflow: 'hidden', marginBottom: '24px', background: '#0D1B2A', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '12px', position: 'relative' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(61,184,90,0.4), transparent)' }} />
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" opacity="0.3"><rect x="4" y="8" width="32" height="26" rx="3" stroke="#fff" strokeWidth="1.5" fill="none"/><circle cx="20" cy="21" r="6" stroke="#fff" strokeWidth="1.5" fill="none"/><path d="M14 8l2-4h8l2 4" stroke="#fff" strokeWidth="1.5" strokeLinejoin="round"/></svg>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.35)', fontWeight: 500 }}>No photo added</div>
            </div>
          )}

          <div style={{ background: '#fff', borderRadius: '20px', border: '1px solid #e9edf2', overflow: 'hidden', marginBottom: '16px' }}>
            <div style={{ height: '4px', background: 'linear-gradient(90deg, #3db85a 0%, #006aff 100%)' }} />
            <div style={{ padding: '28px 32px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap', marginBottom: '24px' }}>
                <div>
                  <p style={{ fontSize: '12px', fontWeight: 600, color: '#3db85a', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>{home.name || home.address} · {room.name}</p>
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
              {details.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '10px', marginBottom: material.notes ? '24px' : '0' }}>
                  {details.map(detail => (
                    <div key={detail.label} className="detail-card">
                      <div style={{ fontSize: '10px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '5px' }}>{detail.label}</div>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: '#1a1a2e' }}>{detail.value}</div>
                    </div>
                  ))}
                </div>
              )}
              {material.notes && (
                <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #f3f4f6' }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '10px' }}>Notes</div>
                  <div style={{ fontSize: '14px', color: '#374151', lineHeight: 1.7 }}>{material.notes}</div>
                </div>
              )}
            </div>
          </div>

          {(material.purchase_url || material.affiliate_url) && (
            <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e9edf2', padding: '24px 28px', marginBottom: '16px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '14px' }}>Shop This Material</div>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {material.purchase_url && <a href={material.purchase_url} target="_blank" rel="noopener noreferrer" className="buy-btn" style={{ background: '#0D1B2A', color: '#fff' }}>Buy This Material</a>}
                {material.affiliate_url && <a href={material.affiliate_url} target="_blank" rel="noopener noreferrer" className="buy-btn" style={{ background: '#3db85a', color: '#fff' }}>Shop via Affiliate</a>}
              </div>
            </div>
          )}

          <div style={{ background: '#0D1B2A', borderRadius: '20px', padding: '36px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(61,184,90,0.5), transparent)' }} />
            <p style={{ fontSize: '12px', fontWeight: 700, color: '#3db85a', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '12px' }}>Love this material?</p>
            <div style={{ fontSize: '20px', fontWeight: 700, color: '#fff', marginBottom: '8px', letterSpacing: '-0.3px' }}>Track materials in your own home.</div>
            <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.45)', marginBottom: '24px', lineHeight: 1.6 }}>Catalog every finish, fixture, and upgrade — it's free.</div>
            <a href="/signup" style={{ background: '#3db85a', color: '#fff', padding: '13px 32px', borderRadius: '10px', fontSize: '15px', fontWeight: 700, textDecoration: 'none', display: 'inline-block' }}>Get Started Free →</a>
          </div>
        </div>
      </div>
    </>
  )
}
