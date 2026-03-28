'use client'

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
        * { box-sizing: border-box; }
        body { font-family: system-ui, sans-serif; }
      `}</style>

      <div style={{minHeight: '100vh', background: '#f7f9fc', fontFamily: 'system-ui, sans-serif'}}>
        <nav style={{background: '#fff', borderBottom: '1px solid #e9edf2', padding: '0 32px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100}}>
          <a href="/dashboard" style={{fontSize: '22px', fontWeight: 700, color: '#006aff', letterSpacing: '-0.5px', textDecoration: 'none'}}>
            hom<span style={{color: '#1a1a2e'}}>agio</span>
          </a>
          <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
            <a href={`/homes/${homeId}/rooms/${roomId}`} style={{fontSize: '13px', color: '#6b7280', textDecoration: 'none', fontWeight: 500}}>
              ← Back to Room
            </a>
            <button
              onClick={() => window.location.href = `/homes/${homeId}/rooms/${roomId}/materials/${material.id}/edit`}
              style={{background: '#f7f9fc', color: '#374151', border: '1.5px solid #e9edf2', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit'}}>
              ✏️ Edit
            </button>
          </div>
        </nav>

        <div style={{maxWidth: '720px', margin: '0 auto', padding: '40px 32px'}}>

          {material.photo_url && (
            <div style={{borderRadius: '20px', overflow: 'hidden', marginBottom: '24px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)'}}>
              <img src={material.photo_url} alt={material.name} style={{width: '100%', height: '360px', objectFit: 'cover', display: 'block'}} />
            </div>
          )}

          <div style={{background: '#fff', borderRadius: '20px', border: '1px solid #e9edf2', overflow: 'hidden', marginBottom: '16px'}}>
            <div style={{height: '6px', background: 'linear-gradient(90deg, #006aff 0%, #3b82f6 100%)'}} />
            <div style={{padding: '28px 32px'}}>
              <div style={{display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap', marginBottom: '24px'}}>
                <div>
                  <h1 style={{fontSize: '24px', fontWeight: 700, color: '#1a1a2e', letterSpacing: '-0.5px', marginBottom: '4px'}}>{material.name}</h1>
                  {material.brand && <div style={{fontSize: '14px', color: '#6b7280'}}>by {material.brand}</div>}
                </div>
                {cost && (
                  <div style={{textAlign: 'right'}}>
                    <div style={{fontSize: '12px', color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '2px'}}>Cost</div>
                    <div style={{fontSize: '28px', fontWeight: 700, color: '#006aff', letterSpacing: '-1px'}}>{cost}</div>
                  </div>
                )}
              </div>

              {details.length > 0 && (
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '12px', marginBottom: material.notes ? '24px' : '0'}}>
                  {details.map(detail => (
                    <div key={detail.label} style={{background: '#f7f9fc', borderRadius: '10px', padding: '14px 16px'}}>
                      <div style={{fontSize: '11px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px'}}>{detail.label}</div>
                      <div style={{fontSize: '14px', fontWeight: 600, color: '#1a1a2e'}}>{detail.value}</div>
                    </div>
                  ))}
                </div>
              )}

              {material.notes && (
                <div style={{marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #f3f4f6'}}>
                  <div style={{fontSize: '12px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px'}}>Notes</div>
                  <div style={{fontSize: '14px', color: '#374151', lineHeight: 1.7}}>{material.notes}</div>
                </div>
              )}
            </div>
          </div>

          {(material.purchase_url || material.affiliate_url) && (
            <div style={{background: '#fff', borderRadius: '16px', border: '1px solid #e9edf2', padding: '24px 28px', marginBottom: '16px'}}>
              <div style={{fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '14px'}}>Shop This Material</div>
              <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap'}}>
                {material.purchase_url && (
                  <a href={material.purchase_url} target="_blank" rel="noopener noreferrer"
                    style={{flex: 1, minWidth: '160px', background: '#006aff', color: '#fff', padding: '12px 20px', borderRadius: '10px', fontSize: '14px', fontWeight: 600, textDecoration: 'none', textAlign: 'center', display: 'block'}}>
                    🛒 Buy This Material
                  </a>
                )}
                {material.affiliate_url && (
                  <a href={material.affiliate_url} target="_blank" rel="noopener noreferrer"
                    style={{flex: 1, minWidth: '160px', background: '#f0f6ff', color: '#006aff', padding: '12px 20px', borderRadius: '10px', fontSize: '14px', fontWeight: 600, textDecoration: 'none', textAlign: 'center', display: 'block', border: '1.5px solid #006aff'}}>
                    🔗 Affiliate Link
                  </a>
                )}
              </div>
            </div>
          )}

          <div style={{background: '#f0f6ff', border: '1px solid #bfdbfe', borderRadius: '16px', padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '14px'}}>
            <div style={{fontSize: '28px'}}>🤖</div>
            <div>
              <div style={{fontSize: '14px', fontWeight: 700, color: '#1e40af', marginBottom: '3px'}}>AI Material Detection — Coming Soon</div>
              <div style={{fontSize: '13px', color: '#3b82f6', lineHeight: 1.5}}>Upload a photo and our AI will automatically identify the material, brand, color, and finish.</div>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}
