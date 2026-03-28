export default function AboutPage() {
  return (
    <div style={{minHeight: '100vh', background: '#f7f9fc', fontFamily: 'system-ui, sans-serif'}}>
      <nav style={{background: '#fff', borderBottom: '1px solid #e9edf2', padding: '0 32px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100}}>
        <a href="/" style={{fontSize: '22px', fontWeight: 700, color: '#006aff', letterSpacing: '-0.5px', textDecoration: 'none'}}>
          hom<span style={{color: '#1a1a2e'}}>agio</span>
        </a>
        <div style={{display: 'flex', gap: '16px', alignItems: 'center'}}>
          <a href="/explore" style={{fontSize: '13px', color: '#6b7280', textDecoration: 'none', fontWeight: 500}}>Explore</a>
          <a href="/faq" style={{fontSize: '13px', color: '#6b7280', textDecoration: 'none', fontWeight: 500}}>FAQs</a>
          <a href="/contact" style={{fontSize: '13px', color: '#6b7280', textDecoration: 'none', fontWeight: 500}}>Contact</a>
          <a href="/login" style={{fontSize: '13px', color: '#006aff', textDecoration: 'none', fontWeight: 600}}>Sign In</a>
          <a href="/signup" style={{background: '#006aff', color: '#fff', padding: '8px 18px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, textDecoration: 'none'}}>Join Free</a>
        </div>
      </nav>

      {/* Hero */}
      <div style={{background: '#0D1B2A', padding: '80px 32px', textAlign: 'center'}}>
        <h1 style={{fontSize: '48px', fontWeight: 700, color: '#fff', letterSpacing: '-1px', marginBottom: '16px'}}>
          Built for homeowners,<br />by homeowners.
        </h1>
        <p style={{fontSize: '18px', color: 'rgba(255,255,255,0.7)', maxWidth: '600px', margin: '0 auto', lineHeight: 1.7}}>
          Homagio was born out of a simple frustration — after building a home, there was no good way to remember what went into it.
        </p>
      </div>

      <div style={{maxWidth: '800px', margin: '0 auto', padding: '64px 32px'}}>

        {/* Story */}
        <div style={{background: '#fff', borderRadius: '20px', border: '1px solid #e9edf2', padding: '40px', marginBottom: '24px'}}>
          <h2 style={{fontSize: '24px', fontWeight: 700, color: '#1a1a2e', marginBottom: '16px', letterSpacing: '-0.5px'}}>The Story</h2>
          <p style={{fontSize: '15px', color: '#6b7280', lineHeight: 1.8, marginBottom: '16px'}}>
            When we built The Blair House in Tulsa, Oklahoma in 2023, we documented everything — every material, every finish, every fixture. But that documentation lived in emails, spreadsheets, texts with contractors, and photos buried in a camera roll.
          </p>
          <p style={{fontSize: '15px', color: '#6b7280', lineHeight: 1.8, marginBottom: '16px'}}>
            When a friend asked what flooring we used in the kitchen, we couldn't find it. When we needed to match the exterior paint for a repair, it took hours to track down. When we wanted to share our home's story, there was no good way to do it.
          </p>
          <p style={{fontSize: '15px', color: '#6b7280', lineHeight: 1.8}}>
            Homagio is the solution we wished existed. A single place where every detail of your home lives — organized, searchable, shareable, and always accessible.
          </p>
        </div>

        {/* Mission */}
        <div style={{background: '#fff', borderRadius: '20px', border: '1px solid #e9edf2', padding: '40px', marginBottom: '24px'}}>
          <h2 style={{fontSize: '24px', fontWeight: 700, color: '#1a1a2e', marginBottom: '16px', letterSpacing: '-0.5px'}}>Our Mission</h2>
          <p style={{fontSize: '15px', color: '#6b7280', lineHeight: 1.8, marginBottom: '16px'}}>
            Every home has a story. We're building the platform that lets homeowners tell that story — and lets the world get inspired by it.
          </p>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px', marginTop: '24px'}}>
            {[
              {icon: '🏠', title: 'Know your home', desc: 'Every material, finish, and fixture — always at your fingertips.'},
              {icon: '💰', title: 'Track your investment', desc: 'Know exactly what you\'ve spent and how it affects your home\'s value.'},
              {icon: '🌍', title: 'Share your story', desc: 'Let others discover and be inspired by what you\'ve built.'},
              {icon: '🛒', title: 'Shop with confidence', desc: 'Find exactly what you need with direct purchase links to every material.'},
            ].map(item => (
              <div key={item.title} style={{background: '#f7f9fc', borderRadius: '12px', padding: '20px'}}>
                <div style={{fontSize: '24px', marginBottom: '8px'}}>{item.icon}</div>
                <div style={{fontSize: '14px', fontWeight: 700, color: '#1a1a2e', marginBottom: '6px'}}>{item.title}</div>
                <div style={{fontSize: '13px', color: '#6b7280', lineHeight: 1.6}}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* What's coming */}
        <div style={{background: '#fff', borderRadius: '20px', border: '1px solid #e9edf2', padding: '40px', marginBottom: '40px'}}>
          <h2 style={{fontSize: '24px', fontWeight: 700, color: '#1a1a2e', marginBottom: '16px', letterSpacing: '-0.5px'}}>What's Coming</h2>
          <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
            {[
              {icon: '🤖', label: 'AI Material Detection', desc: 'Upload a photo — our AI identifies the material automatically.'},
              {icon: '💎', label: 'Homagio Estimate™', desc: 'A home value estimate powered by your actual materials and renovations.'},
              {icon: '👷', label: 'Pro Studio', desc: 'A dedicated workspace for designers, builders, and realtors.'},
              {icon: '📱', label: 'Mobile App', desc: 'Catalog your home from anywhere with our iOS and Android apps.'},
            ].map(item => (
              <div key={item.label} style={{display: 'flex', gap: '14px', padding: '16px', background: '#f7f9fc', borderRadius: '10px', alignItems: 'flex-start'}}>
                <span style={{fontSize: '22px', flexShrink: 0}}>{item.icon}</span>
                <div>
                  <div style={{fontSize: '14px', fontWeight: 700, color: '#1a1a2e', marginBottom: '3px'}}>{item.label}</div>
                  <div style={{fontSize: '13px', color: '#6b7280'}}>{item.desc}</div>
                </div>
                <span style={{marginLeft: 'auto', fontSize: '11px', fontWeight: 700, color: '#9ca3af', background: '#e9edf2', padding: '3px 8px', borderRadius: '20px', flexShrink: 0}}>COMING SOON</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{background: 'linear-gradient(135deg, #006aff 0%, #3b82f6 100%)', borderRadius: '20px', padding: '40px', textAlign: 'center'}}>
          <div style={{fontSize: '22px', fontWeight: 700, color: '#fff', marginBottom: '8px'}}>Ready to catalog your home?</div>
          <div style={{fontSize: '14px', color: 'rgba(255,255,255,0.8)', marginBottom: '20px'}}>It's free and takes less than 5 minutes to get started.</div>
          <a href="/signup" style={{background: '#fff', color: '#006aff', padding: '13px 32px', borderRadius: '10px', fontSize: '15px', fontWeight: 700, textDecoration: 'none', display: 'inline-block'}}>
            Get Started Free →
          </a>
        </div>
      </div>
    </div>
  )
}
