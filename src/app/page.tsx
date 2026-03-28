export const dynamic = 'force-dynamic'

async function getPublicData() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      return { featuredHomes: [], homesCount: 0, roomsCount: 0, materialsCount: 0 }
    }

    const headers = {
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`,
      'Content-Type': 'application/json',
    }

    const [homesRes, allHomesRes, allRoomsRes, allMaterialsRes] = await Promise.allSettled([
      fetch(`${supabaseUrl}/rest/v1/homes?is_public=eq.true&photo_url=not.is.null&select=id,name,address,city,state,zip,bedrooms,bathrooms,square_feet,year_built,photo_url,value_estimate&order=created_at.desc&limit=3`, { headers, cache: 'no-store' }),
      fetch(`${supabaseUrl}/rest/v1/homes?select=id`, { headers, cache: 'no-store' }),
      fetch(`${supabaseUrl}/rest/v1/rooms?select=id`, { headers, cache: 'no-store' }),
      fetch(`${supabaseUrl}/rest/v1/materials?select=id`, { headers, cache: 'no-store' }),
    ])

    const featuredHomes = homesRes.status === 'fulfilled' && homesRes.value.ok ? await homesRes.value.json() : []
    const allHomes = allHomesRes.status === 'fulfilled' && allHomesRes.value.ok ? await allHomesRes.value.json() : []
    const allRooms = allRoomsRes.status === 'fulfilled' && allRoomsRes.value.ok ? await allRoomsRes.value.json() : []
    const allMaterials = allMaterialsRes.status === 'fulfilled' && allMaterialsRes.value.ok ? await allMaterialsRes.value.json() : []

    return {
      featuredHomes: Array.isArray(featuredHomes) ? featuredHomes : [],
      homesCount: Array.isArray(allHomes) ? allHomes.length : 0,
      roomsCount: Array.isArray(allRooms) ? allRooms.length : 0,
      materialsCount: Array.isArray(allMaterials) ? allMaterials.length : 0,
    }
  } catch (err) {
    console.error('Landing page data fetch error:', err)
    return { featuredHomes: [], homesCount: 0, roomsCount: 0, materialsCount: 0 }
  }
}

export default async function Home() {
  const { featuredHomes, homesCount, roomsCount, materialsCount } = await getPublicData()

  return (
    <main style={{fontFamily: '-apple-system, Helvetica Neue, Arial, sans-serif', background: '#fff', color: '#1a1a1a'}}>
      <style>{`
        .nav-link-item { padding: 8px 14px; border-radius: 8px; font-size: 14px; font-weight: 500; color: #444; text-decoration: none; transition: background 0.12s; }
        .nav-link-item:hover { background: #f5f5f5; color: #006aff; }
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .desktop-buttons { display: none !important; }
          .hamburger { display: flex !important; }
        }
        @media (min-width: 769px) {
          .hamburger { display: none !important; }
        }
      `}</style>

      {/* Nav */}
      <nav style={{position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: '#fff', borderBottom: '1px solid #e5e5e5', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px', height: '64px'}}>
        <a href="/" style={{fontSize: '26px', fontWeight: 700, color: '#006aff', letterSpacing: '-1px', textDecoration: 'none'}}>
          hom<span style={{color: '#1a1a1a'}}>agio</span>
        </a>
        <div className="desktop-nav" style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
          <a href="/signup" className="nav-link-item">Catalogue</a>
          <a href="/explore" className="nav-link-item">Explore</a>
          <a href="/faq" className="nav-link-item">FAQs</a>
          <a href="/about" className="nav-link-item">About Us</a>
          <a href="/contact" className="nav-link-item">Contact</a>
        </div>
        <div className="desktop-buttons" style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
          <a href="/login"><button style={{padding: '8px 18px', borderRadius: '8px', fontSize: '14px', fontWeight: 500, color: '#006aff', border: '1.5px solid #006aff', background: 'transparent', cursor: 'pointer'}}>Sign In</button></a>
          <a href="/signup"><button style={{padding: '8px 18px', borderRadius: '8px', fontSize: '14px', fontWeight: 600, color: '#fff', background: '#006aff', border: 'none', cursor: 'pointer'}}>Join Free</button></a>
        </div>
        <div className="hamburger" style={{display: 'none', alignItems: 'center', gap: '12px'}}>
          <a href="/login" style={{fontSize: '14px', color: '#006aff', textDecoration: 'none', fontWeight: 500}}>Sign In</a>
          <details style={{position: 'relative'}}>
            <summary style={{listStyle: 'none', cursor: 'pointer', padding: '8px', border: '1.5px solid #e5e5e5', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '4px', width: '36px', alignItems: 'center'}}>
              <span style={{display: 'block', width: '18px', height: '2px', background: '#444', borderRadius: '2px'}} />
              <span style={{display: 'block', width: '18px', height: '2px', background: '#444', borderRadius: '2px'}} />
              <span style={{display: 'block', width: '18px', height: '2px', background: '#444', borderRadius: '2px'}} />
            </summary>
            <div style={{position: 'absolute', right: 0, top: '48px', background: '#fff', border: '1px solid #e5e5e5', borderRadius: '12px', padding: '8px', minWidth: '200px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', gap: '2px'}}>
              <a href="/signup" style={{padding: '10px 14px', borderRadius: '8px', fontSize: '15px', fontWeight: 500, color: '#444', textDecoration: 'none', display: 'block'}}>Catalogue My Home</a>
              <a href="/explore" style={{padding: '10px 14px', borderRadius: '8px', fontSize: '15px', fontWeight: 500, color: '#444', textDecoration: 'none', display: 'block'}}>Explore</a>
              <a href="/faq" style={{padding: '10px 14px', borderRadius: '8px', fontSize: '15px', fontWeight: 500, color: '#444', textDecoration: 'none', display: 'block'}}>FAQs</a>
              <a href="/about" style={{padding: '10px 14px', borderRadius: '8px', fontSize: '15px', fontWeight: 500, color: '#444', textDecoration: 'none', display: 'block'}}>About Us</a>
              <a href="/contact" style={{padding: '10px 14px', borderRadius: '8px', fontSize: '15px', fontWeight: 500, color: '#444', textDecoration: 'none', display: 'block'}}>Contact</a>
              <div style={{height: '1px', background: '#f0f0f0', margin: '4px 0'}} />
              <a href="/signup" style={{padding: '10px 14px', borderRadius: '8px', fontSize: '15px', fontWeight: 700, color: '#006aff', textDecoration: 'none', display: 'block'}}>Join Free →</a>
            </div>
          </details>
        </div>
      </nav>

      {/* Hero */}
      <div style={{marginTop: '64px', minHeight: '580px', background: '#0D1B2A', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden'}}>
        <div style={{position: 'absolute', inset: 0, backgroundImage: 'url(https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&q=80)', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.4}} />
        <div style={{position: 'relative', zIndex: 2, textAlign: 'center', padding: '60px 24px', width: '100%', maxWidth: '760px'}}>
          <h1 style={{fontSize: '58px', fontWeight: 700, color: '#fff', lineHeight: 1.1, marginBottom: '10px', letterSpacing: '-1.5px'}}>
            Your home, fully understood.
          </h1>
          <p style={{fontSize: '17px', color: 'rgba(255,255,255,0.85)', marginBottom: '32px'}}>
            Catalog every detail. Track every dollar. Discover every possibility.
          </p>
          <div style={{background: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 32px rgba(0,0,0,0.25)', maxWidth: '680px', margin: '0 auto'}}>
            <div style={{display: 'flex', borderBottom: '1px solid #e8e8e8', padding: '0 8px', overflowX: 'auto'}}>
              {['Catalogue My Home', 'Explore Homes', 'Home Value', 'Pro Studio'].map((tab, i) => (
                <button key={tab} style={{padding: '14px 16px', fontSize: '14px', fontWeight: 500, color: i === 0 ? '#006aff' : '#555', border: 'none', background: 'transparent', cursor: 'pointer', borderBottom: i === 0 ? '3px solid #006aff' : '3px solid transparent', marginBottom: '-1px', whiteSpace: 'nowrap'}}>
                  {tab}
                </button>
              ))}
            </div>
            <div style={{display: 'flex', alignItems: 'center', padding: '12px 16px', gap: '10px'}}>
              <span style={{fontSize: '18px', color: '#bbb'}}>📍</span>
              <input type="text" placeholder="Enter your address, city, or ZIP code" style={{flex: 1, border: 'none', outline: 'none', fontSize: '16px', color: '#1a1a1a', fontFamily: 'inherit', minWidth: 0}} />
              <a href="/signup"><button style={{background: '#006aff', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '8px', fontSize: '15px', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap'}}>Get Started</button></a>
            </div>
          </div>
        </div>
      </div>

      {/* Quick links */}
      <div style={{display: 'flex', justifyContent: 'center', gap: '12px', padding: '32px 24px', flexWrap: 'wrap', borderBottom: '1px solid #f0f0f0'}}>
        {[
          {icon: '🏠', label: 'Catalogue My Home', href: '/signup'},
          {icon: '📸', label: 'AI Detection', href: '/signup'},
          {icon: '💰', label: 'Home Value', href: '/signup'},
          {icon: '🛒', label: 'Shop Materials', href: '/signup'},
          {icon: '🌍', label: 'Explore Nearby', href: '/explore'},
          {icon: '👷', label: 'Find a Pro', href: '/signup'},
        ].map(item => (
          <a key={item.label} href={item.href} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: '16px 20px', border: '1.5px solid #e5e5e5', borderRadius: '12px', cursor: 'pointer', minWidth: '110px', textDecoration: 'none'}}>
            <span style={{fontSize: '26px'}}>{item.icon}</span>
            <span style={{fontSize: '12px', fontWeight: 500, color: '#333', textAlign: 'center'}}>{item.label}</span>
          </a>
        ))}
      </div>

      {/* Featured Homes */}
      <div style={{padding: '56px 32px', maxWidth: '1200px', margin: '0 auto'}}>
        <div style={{display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '32px', flexWrap: 'wrap', gap: '12px'}}>
          <div>
            <h2 style={{fontSize: '28px', fontWeight: 700, letterSpacing: '-0.5px'}}>
              {featuredHomes.length > 0 ? 'Featured homes on Homagio' : 'Homes people are cataloging'}
            </h2>
            <p style={{fontSize: '15px', color: '#666', marginTop: '6px'}}>Real homes. Real materials. Real inspiration.</p>
          </div>
          <a href="/explore" style={{fontSize: '14px', color: '#006aff', fontWeight: 500, textDecoration: 'none'}}>View all →</a>
        </div>

        {featuredHomes.length > 0 ? (
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px'}}>
            {featuredHomes.map((home: any) => (
              <a key={home.id} href={`/explore/${home.id}`} style={{textDecoration: 'none', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e5e5e5', background: '#fff', display: 'block'}}>
                <div style={{position: 'relative', height: '220px', overflow: 'hidden', background: '#0D1B2A'}}>
                  {home.photo_url
                    ? <img src={home.photo_url} alt={home.name || home.address} style={{width: '100%', height: '100%', objectFit: 'cover', display: 'block'}} />
                    : <div style={{width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px', opacity: 0.4}}>🏠</div>}
                  <div style={{position: 'absolute', top: '12px', left: '12px', background: '#006aff', color: '#fff', fontSize: '11px', fontWeight: 600, padding: '4px 10px', borderRadius: '6px'}}>On Homagio</div>
                </div>
                <div style={{padding: '16px'}}>
                  <div style={{fontSize: '17px', fontWeight: 700, color: '#1a1a1a', marginBottom: '2px'}}>{home.name || home.address}</div>
                  {home.name && <div style={{fontSize: '13px', color: '#888', marginBottom: '4px'}}>{home.address}</div>}
                  <div style={{fontSize: '13px', color: '#888', marginBottom: '10px'}}>{home.city}, {home.state} {home.zip}</div>
                  <div style={{display: 'flex', gap: '12px', paddingTop: '10px', borderTop: '1px solid #f0f0f0', flexWrap: 'wrap'}}>
                    {home.bedrooms && <span style={{fontSize: '12px', color: '#555'}}>🛏️ {home.bedrooms} beds</span>}
                    {home.bathrooms && <span style={{fontSize: '12px', color: '#555'}}>🛁 {home.bathrooms} baths</span>}
                    {home.square_feet && <span style={{fontSize: '12px', color: '#555'}}>📐 {home.square_feet.toLocaleString()} sqft</span>}
                    {home.year_built && <span style={{fontSize: '12px', color: '#555'}}>📅 {home.year_built}</span>}
                  </div>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px'}}>
            {[
              {img: 'photo-1568605114967-8130f3a36994', addr: '2847 Elmwood Drive', city: 'Nashville, TN 37215', beds: 4, baths: 3, sqft: '2,840'},
              {img: 'photo-1570129477492-45c003edd2be', addr: '1140 Sycamore Lane', city: 'Franklin, TN 37064', beds: 3, baths: 2, sqft: '2,210'},
              {img: 'photo-1625602812206-5ec545ca1231', addr: '904 Riverside Blvd', city: 'Brentwood, TN 37027', beds: 5, baths: 4, sqft: '4,100'},
            ].map(home => (
              <div key={home.addr} style={{borderRadius: '12px', overflow: 'hidden', border: '1px solid #e5e5e5', background: '#fff'}}>
                <div style={{width: '100%', height: '220px', backgroundImage: `url(https://images.unsplash.com/${home.img}?w=600&q=75)`, backgroundSize: 'cover', backgroundPosition: 'center'}} />
                <div style={{padding: '16px'}}>
                  <div style={{fontSize: '17px', fontWeight: 700, marginBottom: '4px'}}>{home.addr}</div>
                  <div style={{fontSize: '13px', color: '#888', marginBottom: '10px'}}>{home.city}</div>
                  <div style={{display: 'flex', gap: '12px', paddingTop: '10px', borderTop: '1px solid #f0f0f0'}}>
                    <span style={{fontSize: '12px', color: '#555'}}>🛏️ {home.beds}</span>
                    <span style={{fontSize: '12px', color: '#555'}}>🛁 {home.baths}</span>
                    <span style={{fontSize: '12px', color: '#555'}}>📐 {home.sqft} sqft</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Stats */}
      <div style={{background: '#f8f8f8', borderTop: '1px solid #efefef', borderBottom: '1px solid #efefef', padding: '28px 32px'}}>
        <div style={{maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '48px', flexWrap: 'wrap'}}>
          {[
            {n: homesCount, l: 'Homes cataloged'},
            {n: roomsCount, l: 'Rooms tracked'},
            {n: materialsCount, l: 'Materials cataloged'},
            {n: '4.9★', l: 'User satisfaction'},
          ].map(stat => (
            <div key={stat.l} style={{textAlign: 'center'}}>
              <div style={{fontSize: '28px', fontWeight: 700}}>{stat.n}</div>
              <div style={{fontSize: '13px', color: '#888', marginTop: '2px'}}>{stat.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div style={{padding: '56px 32px', maxWidth: '1200px', margin: '0 auto'}}>
        <div style={{textAlign: 'center', marginBottom: '48px'}}>
          <h2 style={{fontSize: '32px', fontWeight: 700, letterSpacing: '-0.5px'}}>Everything your home needs, in one place</h2>
          <p style={{fontSize: '15px', color: '#666', marginTop: '8px'}}>From AI-powered material detection to renovation budgeting.</p>
        </div>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1px', border: '1px solid #e5e5e5', borderRadius: '12px', overflow: 'hidden', background: '#e5e5e5'}}>
          {[
            {icon: '📸', title: 'AI Material Detection', desc: 'Upload a photo. Our AI identifies materials, finishes, and fixtures instantly.'},
            {icon: '🏠', title: 'Home Catalog System', desc: 'Build a complete record of every surface, system, and upgrade in your home.'},
            {icon: '🛒', title: 'Smart Shopping Lists', desc: 'One click generates a shoppable list with direct purchase links for every material.'},
            {icon: '💰', title: 'Budget & ROI Tracker', desc: 'Track renovation costs against estimated home value increases.'},
            {icon: '🌍', title: 'Explore Nearby Homes', desc: 'Discover how neighbors designed their homes and get inspired by real materials.'},
            {icon: '🔮', title: 'Digital Twin Technology', desc: 'Create a living digital replica of your home — always up to date, always yours.'},
          ].map(feat => (
            <div key={feat.title} style={{background: '#fff', padding: '36px 28px'}}>
              <div style={{fontSize: '28px', marginBottom: '14px'}}>{feat.icon}</div>
              <div style={{fontSize: '17px', fontWeight: 600, marginBottom: '8px'}}>{feat.title}</div>
              <div style={{fontSize: '14px', color: '#666', lineHeight: 1.65}}>{feat.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{background: '#0D1B2A', padding: '80px 32px', textAlign: 'center'}}>
        <h2 style={{fontSize: '36px', fontWeight: 700, color: '#fff', letterSpacing: '-0.5px', marginBottom: '16px'}}>
          Start building your home's digital twin today.
        </h2>
        <p style={{fontSize: '16px', color: 'rgba(255,255,255,0.6)', marginBottom: '36px'}}>
          Join homeowners who finally understand every inch of where they live.
        </p>
        <div style={{display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap'}}>
          <a href="/signup"><button style={{background: '#006aff', color: '#fff', border: 'none', padding: '16px 40px', borderRadius: '8px', fontSize: '16px', fontWeight: 600, cursor: 'pointer'}}>Catalogue My Home — It's Free</button></a>
          <a href="/login"><button style={{background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', padding: '16px 40px', borderRadius: '8px', fontSize: '16px', fontWeight: 400, cursor: 'pointer'}}>Sign In</button></a>
        </div>
      </div>

      {/* Footer */}
      <div style={{background: '#fff', borderTop: '1px solid #e5e5e5', padding: '40px 32px'}}>
        <div style={{maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '24px'}}>
          <div style={{fontSize: '22px', fontWeight: 700, color: '#006aff', letterSpacing: '-0.5px'}}>
            hom<span style={{color: '#1a1a1a'}}>agio</span>
          </div>
          <div style={{display: 'flex', gap: '24px', flexWrap: 'wrap'}}>
            {[
              {label: 'Catalogue', href: '/signup'},
              {label: 'Explore', href: '/explore'},
              {label: 'FAQs', href: '/faq'},
              {label: 'About Us', href: '/about'},
              {label: 'Contact', href: '/contact'},
              {label: 'Privacy', href: '#'},
              {label: 'Terms', href: '#'},
            ].map(link => (
              <a key={link.label} href={link.href} style={{fontSize: '13px', color: '#666', textDecoration: 'none'}}>{link.label}</a>
            ))}
          </div>
          <div style={{fontSize: '12px', color: '#aaa'}}>© 2025 Homagio, Inc. All rights reserved.</div>
        </div>
      </div>
    </main>
  )
}
