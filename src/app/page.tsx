export default function Home() {
  return (
    <main style={{fontFamily: '-apple-system, Helvetica Neue, Arial, sans-serif', background: '#fff', color: '#1a1a1a'}}>

      <nav style={{position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: '#fff', borderBottom: '1px solid #e5e5e5', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px', height: '64px'}}>
        <div style={{fontSize: '26px', fontWeight: 700, color: '#006aff', letterSpacing: '-1px'}}>
          hom<span style={{color: '#1a1a1a'}}>agio</span>
        </div>
        <div style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
          {['Buy', 'Catalog', 'Explore', 'Sell', 'AI Tools', 'Pro Studio'].map(link => (
            <a key={link} href="#" style={{padding: '8px 14px', borderRadius: '8px', fontSize: '14px', fontWeight: 500, color: '#444', textDecoration: 'none'}}>{link}</a>
          ))}
        </div>
        <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
          <a href="/login"><button style={{padding: '8px 18px', borderRadius: '8px', fontSize: '14px', fontWeight: 500, color: '#006aff', border: '1.5px solid #006aff', background: 'transparent', cursor: 'pointer'}}>Sign In</button></a>
          <a href="/signup"><button style={{padding: '8px 18px', borderRadius: '8px', fontSize: '14px', fontWeight: 600, color: '#fff', background: '#006aff', border: 'none', cursor: 'pointer'}}>Join Free</button></a>
        </div>
      </nav>

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
            <div style={{display: 'flex', borderBottom: '1px solid #e8e8e8', padding: '0 8px'}}>
              {['Catalog My Home', 'Explore Homes', 'Home Value', 'Pro Studio'].map((tab, i) => (
                <button key={tab} style={{padding: '14px 20px', fontSize: '15px', fontWeight: 500, color: i === 0 ? '#006aff' : '#555', border: 'none', background: 'transparent', cursor: 'pointer', borderBottom: i === 0 ? '3px solid #006aff' : '3px solid transparent', marginBottom: '-1px'}}>
                  {tab}
                </button>
              ))}
            </div>
            <div style={{display: 'flex', alignItems: 'center', padding: '12px 16px', gap: '10px'}}>
              <span style={{fontSize: '18px', color: '#bbb'}}>📍</span>
              <input type="text" placeholder="Enter your address, city, or ZIP code" style={{flex: 1, border: 'none', outline: 'none', fontSize: '16px', color: '#1a1a1a', fontFamily: 'inherit'}} />
              <button style={{background: '#006aff', color: '#fff', border: 'none', padding: '12px 28px', borderRadius: '8px', fontSize: '15px', fontWeight: 600, cursor: 'pointer'}}>Search</button>
            </div>
          </div>
        </div>
      </div>

      <div style={{display: 'flex', justifyContent: 'center', gap: '12px', padding: '32px 24px', flexWrap: 'wrap', borderBottom: '1px solid #f0f0f0'}}>
        {[
          {icon: '🏠', label: 'Add My Home'},
          {icon: '📸', label: 'AI Detection'},
          {icon: '💰', label: 'Home Value'},
          {icon: '🛒', label: 'Shop Materials'},
          {icon: '🌍', label: 'Explore Nearby'},
          {icon: '👷', label: 'Find a Pro'},
        ].map(item => (
          <a key={item.label} href="#" style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: '16px 20px', border: '1.5px solid #e5e5e5', borderRadius: '12px', cursor: 'pointer', minWidth: '120px', textDecoration: 'none'}}>
            <span style={{fontSize: '26px'}}>{item.icon}</span>
            <span style={{fontSize: '13px', fontWeight: 500, color: '#333'}}>{item.label}</span>
          </a>
        ))}
      </div>

      <div style={{padding: '56px 32px', maxWidth: '1200px', margin: '0 auto'}}>
        <div style={{display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '32px'}}>
          <div>
            <h2 style={{fontSize: '28px', fontWeight: 700, letterSpacing: '-0.5px'}}>Homes people are cataloging near you</h2>
            <p style={{fontSize: '15px', color: '#666', marginTop: '6px'}}>Real homes. Real materials. Real inspiration.</p>
          </div>
          <a href="#" style={{fontSize: '14px', color: '#006aff', fontWeight: 500, textDecoration: 'none'}}>View all →</a>
        </div>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px'}}>
          {[
            {img: 'photo-1568605114967-8130f3a36994', price: '$648,000', est: '$641k–$655k', addr: '2847 Elmwood Drive', city: 'Nashville, TN 37215', beds: 4, baths: 3, sqft: '2,840', materials: 142},
            {img: 'photo-1570129477492-45c003edd2be', price: '$512,500', est: '$505k–$521k', addr: '1140 Sycamore Lane', city: 'Franklin, TN 37064', beds: 3, baths: 2, sqft: '2,210', materials: 89},
            {img: 'photo-1625602812206-5ec545ca1231', price: '$892,000', est: '$878k–$908k', addr: '904 Riverside Blvd', city: 'Brentwood, TN 37027', beds: 5, baths: 4, sqft: '4,100', materials: 218},
          ].map(home => (
            <div key={home.addr} style={{borderRadius: '12px', overflow: 'hidden', border: '1px solid #e5e5e5', background: '#fff', cursor: 'pointer'}}>
              <div style={{width: '100%', height: '200px', backgroundImage: `url(https://images.unsplash.com/${home.img}?w=600&q=75)`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative'}}>
                <div style={{position: 'absolute', top: '12px', left: '12px', background: '#006aff', color: '#fff', fontSize: '11px', fontWeight: 600, padding: '4px 10px', borderRadius: '6px'}}>AI Tagged</div>
                <div style={{position: 'absolute', top: '12px', right: '12px', background: '#fff', borderRadius: '50%', width: '34px', height: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', cursor: 'pointer'}}>♡</div>
              </div>
              <div style={{padding: '14px 16px'}}>
                <div style={{fontSize: '20px', fontWeight: 700}}>{home.price}</div>
                <div style={{fontSize: '12px', color: '#666', marginTop: '2px'}}>Homagio Estimate™: <span style={{color: '#006aff', fontWeight: 500}}>{home.est}</span></div>
                <div style={{fontSize: '14px', color: '#444', marginTop: '6px', fontWeight: 500}}>{home.addr}</div>
                <div style={{fontSize: '13px', color: '#888', marginTop: '2px'}}>{home.city}</div>
                <div style={{display: 'flex', gap: '12px', marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #f0f0f0'}}>
                  {[`${home.beds} bds`, `${home.baths} ba`, `${home.sqft} sqft`, `${home.materials} materials`].map(f => (
                    <span key={f} style={{fontSize: '13px', color: '#555'}}>{f}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{background: '#f8f8f8', borderTop: '1px solid #efefef', borderBottom: '1px solid #efefef', padding: '28px 32px'}}>
        <div style={{maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '48px', flexWrap: 'wrap'}}>
          {[
            {n: '2.4M+', l: 'Homes cataloged'},
            {n: '48M+', l: 'Materials tracked'},
            {n: '98%', l: 'AI detection accuracy'},
            {n: '$3.2B+', l: 'Renovation costs tracked'},
            {n: '4.9★', l: 'App store rating'},
          ].map(stat => (
            <div key={stat.l} style={{textAlign: 'center'}}>
              <div style={{fontSize: '28px', fontWeight: 700}}>{stat.n}</div>
              <div style={{fontSize: '13px', color: '#888', marginTop: '2px'}}>{stat.l}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{padding: '56px 32px', maxWidth: '1200px', margin: '0 auto'}}>
        <div style={{textAlign: 'center', marginBottom: '48px'}}>
          <h2 style={{fontSize: '32px', fontWeight: 700, letterSpacing: '-0.5px'}}>Everything your home needs, in one place</h2>
          <p style={{fontSize: '15px', color: '#666', marginTop: '8px'}}>From AI-powered material detection to renovation budgeting.</p>
        </div>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0', border: '1px solid #e5e5e5', borderRadius: '12px', overflow: 'hidden'}}>
          {[
            {icon: '📸', title: 'AI Material Detection', desc: 'Upload a photo. Our AI identifies materials, finishes, and fixtures instantly.'},
            {icon: '🏠', title: 'Home Catalog System', desc: 'Build a complete record of every surface, system, and upgrade in your home.'},
            {icon: '🛒', title: 'Smart Shopping Lists', desc: 'One click generates a shoppable list with direct purchase links for every material.'},
            {icon: '💰', title: 'Budget & ROI Tracker', desc: 'Track renovation costs against estimated home value increases.'},
            {icon: '🌍', title: 'Explore Nearby Homes', desc: 'Discover how neighbors designed their homes and get inspired by real materials.'},
            {icon: '🔮', title: 'Digital Twin Technology', desc: 'Create a living digital replica of your home — always up to date, always yours.'},
          ].map((feat, i) => (
            <div key={feat.title} style={{background: '#fff', padding: '40px 32px', borderRight: i % 3 !== 2 ? '1px solid #e5e5e5' : 'none', borderBottom: i < 3 ? '1px solid #e5e5e5' : 'none'}}>
              <div style={{fontSize: '28px', marginBottom: '14px'}}>{feat.icon}</div>
              <div style={{fontSize: '17px', fontWeight: 600, marginBottom: '8px'}}>{feat.title}</div>
              <div style={{fontSize: '14px', color: '#666', lineHeight: 1.65}}>{feat.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{background: '#0D1B2A', padding: '80px 32px', textAlign: 'center'}}>
        <h2 style={{fontSize: '36px', fontWeight: 700, color: '#fff', letterSpacing: '-0.5px', marginBottom: '16px'}}>
          Start building your home's digital twin today.
        </h2>
        <p style={{fontSize: '16px', color: 'rgba(255,255,255,0.6)', marginBottom: '36px'}}>
          Join thousands of homeowners who finally understand every inch of where they live.
        </p>
        <div style={{display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap'}}>
          <a href="/signup"><button style={{background: '#006aff', color: '#fff', border: 'none', padding: '16px 40px', borderRadius: '8px', fontSize: '16px', fontWeight: 600, cursor: 'pointer'}}>Catalog My Home — It's Free</button></a>
          <button style={{background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', padding: '16px 40px', borderRadius: '8px', fontSize: '16px', fontWeight: 400, cursor: 'pointer'}}>View Demo</button>
        </div>
      </div>

      <div style={{background: '#fff', borderTop: '1px solid #e5e5e5', padding: '40px 32px'}}>
        <div style={{maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '24px'}}>
          <div style={{fontSize: '22px', fontWeight: 700, color: '#006aff', letterSpacing: '-0.5px'}}>
            hom<span style={{color: '#1a1a1a'}}>agio</span>
          </div>
          <div style={{display: 'flex', gap: '32px', flexWrap: 'wrap'}}>
            {['Features', 'Pricing', 'For Pros', 'Blog', 'Privacy', 'Terms'].map(link => (
              <a key={link} href="#" style={{fontSize: '13px', color: '#666', textDecoration: 'none'}}>{link}</a>
            ))}
          </div>
          <div style={{fontSize: '12px', color: '#aaa'}}>© 2025 Homagio, Inc. All rights reserved.</div>
        </div>
      </div>

    </main>
  )
}
