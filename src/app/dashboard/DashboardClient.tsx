'use client'

const FEATURES = [
  { icon: '🏠', title: 'Catalogue My Home', desc: 'Add rooms, materials, and track every detail of your home.', href: '/dashboard/homes', color: '#006aff', bgColor: '#f0f6ff', active: true },
  { icon: '🌍', title: 'Explore Homes Near Me', desc: 'Discover how neighbors designed their homes and get inspired.', href: '#', color: '#0d9488', bgColor: '#f0fdfa', soon: true },
  { icon: '🔍', title: 'Find a Material', desc: 'Search homes by flooring, countertop, paint color, and more.', href: '#', color: '#7c3aed', bgColor: '#faf5ff', soon: true },
  { icon: '📸', title: 'Identify a Material', desc: 'Upload a photo and our AI will tell you exactly what it is.', href: '#', color: '#d97706', bgColor: '#fffbeb', soon: true },
  { icon: '💰', title: 'Homagio Estimate™', desc: "See your home's estimated value and track it over time.", href: '#', color: '#059669', bgColor: '#f0fdf4', soon: true },
  { icon: '👷', title: 'Find a Pro', desc: 'Connect with designers, builders, and realtors in your area.', href: '#', color: '#dc2626', bgColor: '#fef2f2', soon: true },
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

  const isNewUser = homesCount === 0

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }
        body { font-family: system-ui, sans-serif; }
        .feature-card { background: #fff; border: 1.5px solid #e9edf2; border-radius: 16px; padding: 28px; cursor: pointer; position: relative; transition: border-color 0.15s, box-shadow 0.15s, transform 0.1s; }
        .feature-card.active:hover { border-color: #006aff; box-shadow: 0 6px 24px rgba(0,106,255,0.12); transform: translateY(-2px); }
        .feature-card.disabled { opacity: 0.65; cursor: default; }
        .nav-link { font-size: 13px; color: #374151; text-decoration: none; padding: 7px 14px; border-radius: 8px; border: 1px solid #e9edf2; font-weight: 500; display: flex; align-items: center; gap: 6px; transition: background 0.12s; }
        .nav-link:hover { background: #f7f9fc; }
      `}</style>

      <div style={{minHeight: '100vh', background: '#f7f9fc', fontFamily: 'system-ui, sans-serif'}}>
        <nav style={{background: '#fff', borderBottom: '1px solid #e9edf2', padding: '0 32px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100}}>
          <div style={{fontSize: '22px', fontWeight: 700, color: '#006aff', letterSpacing: '-0.5px'}}>
            hom<span style={{color: '#1a1a2e'}}>agio</span>
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
            <div style={{fontSize: '13px', color: '#6b7280', padding: '0 8px', display: 'flex', alignItems: 'center', gap: '6px'}}>
              <div style={{width: '28px', height: '28px', borderRadius: '50%', background: '#006aff', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700}}>
                {firstName.charAt(0).toUpperCase()}
              </div>
              <span style={{fontWeight: 500}}>{user?.user_metadata?.full_name || user?.email}</span>
            </div>
            <button onClick={handleSignOut} style={{padding: '7px 14px', borderRadius: '8px', border: '1.5px solid #e9edf2', background: '#fff', fontSize: '13px', fontWeight: 500, cursor: 'pointer', color: '#374151', fontFamily: 'inherit'}}>
              Sign Out
            </button>
          </div>
        </nav>

        <div style={{maxWidth: '1100px', margin: '0 auto', padding: '52px 32px'}}>
          <div style={{marginBottom: '44px'}}>
            <h1 style={{fontSize: '32px', fontWeight: 700, color: '#1a1a2e', letterSpacing: '-0.75px', marginBottom: '6px'}}>
              Welcome back, {firstName}! 👋
            </h1>
            <p style={{fontSize: '15px', color: '#6b7280'}}>
              {isNewUser ? "You haven't added a home yet. Let's get started." : `You have ${homesCount} home${homesCount !== 1 ? 's' : ''} cataloged. What would you like to do today?`}
            </p>
          </div>

          {isNewUser && (
            <div style={{background: 'linear-gradient(135deg, #006aff 0%, #3b82f6 100%)', borderRadius: '20px', padding: '36px 40px', marginBottom: '40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '24px', flexWrap: 'wrap'}}>
              <div>
                <div style={{fontSize: '22px', fontWeight: 700, color: '#fff', marginBottom: '6px'}}>Add your first home</div>
                <div style={{fontSize: '14px', color: 'rgba(255,255,255,0.8)', maxWidth: '420px', lineHeight: 1.6}}>
                  Start building your home's digital twin. Catalog every material, finish, and fixture.
                </div>
              </div>
              <button onClick={() => window.location.href = '/homes/add'}
                style={{background: '#fff', color: '#006aff', border: 'none', padding: '13px 28px', borderRadius: '10px', fontSize: '15px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0}}>
                + Add My First Home
              </button>
            </div>
          )}

          <div style={{marginBottom: '44px'}}>
            <div style={{fontSize: '12px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px'}}>Platform Features</div>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px'}}>
              {FEATURES.map(feature => (
                <div key={feature.title}
                  className={`feature-card ${feature.active ? 'active' : 'disabled'}`}
                  onClick={() => feature.active && (window.location.href = feature.href)}>
                  {feature.soon && (
                    <div style={{position: 'absolute', top: '16px', right: '16px', background: '#f3f4f6', color: '#9ca3af', fontSize: '10px', fontWeight: 700, padding: '3px 8px', borderRadius: '20px'}}>
                      COMING SOON
                    </div>
                  )}
                  <div style={{width: '44px', height: '44px', borderRadius: '12px', background: feature.bgColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', marginBottom: '14px'}}>
                    {feature.icon}
                  </div>
                  <div style={{fontSize: '15px', fontWeight: 700, color: '#1a1a2e', marginBottom: '6px'}}>{feature.title}</div>
                  <div style={{fontSize: '13px', color: '#6b7280', lineHeight: 1.6}}>{feature.desc}</div>
                  {feature.active && <div style={{marginTop: '14px', fontSize: '13px', fontWeight: 600, color: feature.color}}>Get started →</div>}
                </div>
              ))}
            </div>
          </div>

          <div style={{background: '#fff', border: '1px solid #e9edf2', borderRadius: '14px', padding: '20px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px'}}>
            <div style={{fontSize: '13px', fontWeight: 600, color: '#374151'}}>Quick Access</div>
            <div style={{display: 'flex', gap: '8px', flexWrap: 'wrap'}}>
              {[
                {icon: '🏠', label: 'My Homes', href: '/dashboard/homes'},
                {icon: '🚪', label: 'My Rooms', href: '/dashboard/homes'},
                {icon: '📦', label: 'My Materials', href: '/dashboard/homes'},
                {icon: '⚙️', label: 'Settings', href: '#'},
              ].map(item => (
                <a key={item.label} href={item.href} className="nav-link">
                  <span>{item.icon}</span><span>{item.label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
