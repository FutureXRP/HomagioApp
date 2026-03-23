'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [homes, setHomes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/login'); return }
      setUser(session.user)
      const { data: homesData } = await supabase
        .from('homes')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
      setHomes(homesData || [])
      setLoading(false)
    }
    fetchData()
  }, [router])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div style={{minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f8f8'}}>
        <div style={{fontSize: '16px', color: '#888'}}>Loading your homes...</div>
      </div>
    )
  }

  return (
    <div style={{minHeight: '100vh', background: '#f8f8f8'}}>

      <nav style={{background: '#fff', borderBottom: '1px solid #e5e5e5', padding: '0 32px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
        <div style={{fontSize: '24px', fontWeight: 700, color: '#006aff', letterSpacing: '-1px'}}>
          hom<span style={{color: '#1a1a1a'}}>agio</span>
        </div>
        <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
          <span style={{fontSize: '14px', color: '#666'}}>{user?.user_metadata?.full_name || user?.email}</span>
          <button onClick={handleSignOut} style={{padding: '8px 18px', borderRadius: '8px', border: '1.5px solid #e5e5e5', background: '#fff', fontSize: '14px', fontWeight: 500, cursor: 'pointer', color: '#444'}}>
            Sign Out
          </button>
        </div>
      </nav>

      <div style={{maxWidth: '1200px', margin: '0 auto', padding: '48px 32px'}}>

        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', flexWrap: 'wrap', gap: '16px'}}>
          <div>
            <h1 style={{fontSize: '28px', fontWeight: 700, color: '#1a1a1a', letterSpacing: '-0.5px'}}>My Homes</h1>
            <p style={{fontSize: '15px', color: '#666', marginTop: '4px'}}>
              {homes.length === 0 ? 'Add your first home to get started' : `${homes.length} home${homes.length > 1 ? 's' : ''} cataloged`}
            </p>
          </div>
          <button onClick={() => router.push('/homes/add')} style={{background: '#006aff', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '8px', fontSize: '15px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit'}}>
            + Add Home
          </button>
        </div>

        <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px'}}>
          {[
            {icon: '🏠', label: 'Homes', value: homes.length},
            {icon: '📦', label: 'Materials', value: '0'},
            {icon: '💰', label: 'Budget Tracked', value: '$0'},
            {icon: '📸', label: 'Photos', value: '0'},
          ].map(stat => (
            <div key={stat.label} style={{background: '#fff', border: '1px solid #e5e5e5', borderRadius: '12px', padding: '20px', textAlign: 'center'}}>
              <div style={{fontSize: '28px', marginBottom: '8px'}}>{stat.icon}</div>
              <div style={{fontSize: '24px', fontWeight: 700, color: '#1a1a1a'}}>{stat.value}</div>
              <div style={{fontSize: '13px', color: '#888', marginTop: '4px'}}>{stat.label}</div>
            </div>
          ))}
        </div>

        {homes.length === 0 ? (
          <div style={{background: '#fff', border: '2px dashed #e5e5e5', borderRadius: '16px', padding: '64px 32px', textAlign: 'center'}}>
            <div style={{fontSize: '48px', marginBottom: '16px'}}>🏠</div>
            <h2 style={{fontSize: '22px', fontWeight: 700, color: '#1a1a1a', marginBottom: '8px'}}>Add your first home</h2>
            <p style={{fontSize: '15px', color: '#666', maxWidth: '400px', margin: '0 auto 28px'}}>
              Start building your home's digital twin. Catalog every material, track every dollar.
            </p>
            <button onClick={() => router.push('/homes/add')} style={{background: '#006aff', color: '#fff', border: 'none', padding: '14px 32px', borderRadius: '8px', fontSize: '15px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit'}}>
              + Add My First Home
            </button>
          </div>
        ) : (
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px'}}>
            {homes.map(home => (
              <div key={home.id} onClick={() => router.push(`/homes/${home.id}`)} style={{background: '#fff', border: '1px solid #e5e5e5', borderRadius: '16px', overflow: 'hidden', cursor: 'pointer'}}>
                <div style={{height: '140px', background: 'linear-gradient(135deg, #0D1B2A, #1a3a5c)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px'}}>
                  🏠
                </div>
                <div style={{padding: '20px'}}>
                  <div style={{fontSize: '16px', fontWeight: 700, color: '#1a1a1a', marginBottom: '4px'}}>{home.name || home.address}</div>
                  <div style={{fontSize: '13px', color: '#888', marginBottom: '12px'}}>{home.city}, {home.state} {home.zip}</div>
                  <div style={{display: 'flex', gap: '12px'}}>
                    {home.bedrooms && <span style={{fontSize: '12px', color: '#555'}}>{home.bedrooms} beds</span>}
                    {home.bathrooms && <span style={{fontSize: '12px', color: '#555'}}>{home.bathrooms} baths</span>}
                    {home.square_feet && <span style={{fontSize: '12px', color: '#555'}}>{home.square_feet.toLocaleString()} sqft</span>}
                  </div>
                </div>
              </div>
            ))}
            <div onClick={() => router.push('/homes/add')} style={{background: '#fff', border: '2px dashed #e5e5e5', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', minHeight: '220px', flexDirection: 'column', gap: '12px'}}>
              <div style={{fontSize: '32px'}}>+</div>
              <div style={{fontSize: '14px', fontWeight: 500, color: '#888'}}>Add Another Home</div>
            </div>
          </div>
        )}

        <div style={{marginTop: '32px'}}>
          <h3 style={{fontSize: '18px', fontWeight: 600, marginBottom: '16px', color: '#1a1a1a'}}>Quick Actions</h3>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px'}}>
            {[
              {icon: '📸', title: 'Upload Photos', desc: 'AI detects your materials'},
              {icon: '🛒', title: 'Shopping List', desc: 'Shop your home\'s materials'},
              {icon: '💰', title: 'Budget Tracker', desc: 'Track renovation costs'},
            ].map(action => (
              <div key={action.title} style={{background: '#fff', border: '1px solid #e5e5e5', borderRadius: '12px', padding: '24px', cursor: 'pointer'}}>
                <div style={{fontSize: '28px', marginBottom: '12px'}}>{action.icon}</div>
                <div style={{fontSize: '15px', fontWeight: 600, color: '#1a1a1a', marginBottom: '4px'}}>{action.title}</div>
                <div style={{fontSize: '13px', color: '#888'}}>{action.desc}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}            Sign Out
          </button>
        </div>
      </nav>

      <div style={{maxWidth: '1200px', margin: '0 auto', padding: '48px 32px'}}>

        {/* Header */}
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', flexWrap: 'wrap', gap: '16px'}}>
          <div>
            <h1 style={{fontSize: '28px', fontWeight: 700, color: '#1a1a1a', letterSpacing: '-0.5px'}}>
              My Homes
            </h1>
            <p style={{fontSize: '15px', color: '#666', marginTop: '4px'}}>
              {homes.length === 0 ? 'Add your first home to get started' : `${homes.length} home${homes.length > 1 ? 's' : ''} cataloged`}
            </p>
          </div>
          <button
            onClick={() => router.push('/homes/add')}
            style={{background: '#006aff', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '8px', fontSize: '15px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit'}}
          >
            + Add Home
          </button>
        </div>

        {/* Stats Row */}
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px'}}>
          {[
            {icon: '🏠', label: 'Homes', value: homes.length},
            {icon: '📦', label: 'Materials', value: '0'},
            {icon: '💰', label: 'Budget Tracked', value: '$0'},
            {icon: '📸', label: 'Photos', value: '0'},
          ].map(stat => (
            <div key={stat.label} style={{background: '#fff', border: '1px solid #e5e5e5', borderRadius: '12px', padding: '20px', textAlign: 'center'}}>
              <div style={{fontSize: '28px', marginBottom: '8px'}}>{stat.icon}</div>
              <div style={{fontSize: '24px', fontWeight: 700, color: '#1a1a1a'}}>{stat.value}</div>
              <div style={{fontSize: '13px', color: '#888', marginTop: '4px'}}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Homes Grid */}
        {homes.length === 0 ? (
          <div style={{background: '#fff', border: '2px dashed #e5e5e5', borderRadius: '16px', padding: '64px 32px', textAlign: 'center'}}>
            <div style={{fontSize: '48px', marginBottom: '16px'}}>🏠</div>
            <h2 style={{fontSize: '22px', fontWeight: 700, color: '#1a1a1a', marginBottom: '8px'}}>
              Add your first home
            </h2>
            <p style={{fontSize: '15px', color: '#666', marginBottom: '28px', maxWidth: '400px', margin: '0 auto 28px'}}>
              Start building your home's digital twin. Catalog every material, track every dollar.
            </p>
            <button
              onClick={() => router.push('/homes/add')}
              style={{background: '#006aff', color: '#fff', border: 'none', padding: '14px 32px', borderRadius: '8px', fontSize: '15px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit'}}
            >
              + Add My First Home
            </button>
          </div>
        ) : (
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px'}}>
            {homes.map(home => (
              <div
                key={home.id}
                onClick={() => router.push(`/homes/${home.id}`)}
                style={{background: '#fff', border: '1px solid #e5e5e5', borderRadius: '16px', overflow: 'hidden', cursor: 'pointer'}}
              >
                <div style={{height: '140px', background: 'linear-gradient(135deg, #0D1B2A, #1a3a5c)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px'}}>
                  🏠
                </div>
                <div style={{padding: '20px'}}>
                  <div style={{fontSize: '16px', fontWeight: 700, color: '#1a1a1a', marginBottom: '4px'}}>
                    {home.name || home.address}
                  </div>
                  <div style={{fontSize: '13px', color: '#888', marginBottom: '12px'}}>
                    {home.city}, {home.state} {home.zip}
                  </div>
                  <div style={{display: 'flex', gap: '12px'}}>
                    {home.bedrooms && <span style={{fontSize: '12px', color: '#555'}}>{home.bedrooms} beds</span>}
                    {home.bathrooms && <span style={{fontSize: '12px', color: '#555'}}>{home.bathrooms} baths</span>}
                    {home.square_feet && <span style={{fontSize: '12px', color: '#555'}}>{home.square_feet.toLocaleString()} sqft</span>}
                  </div>
                </div>
              </div>
            ))}
            {/* Add another home card */}
            <div
              onClick={() => router.push('/homes/add')}
              style={{background: '#fff', border: '2px dashed #e5e5e5', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', minHeight: '220px', flexDirection: 'column', gap: '12px'}}
            >
              <div style={{fontSize: '32px'}}>+</div>
              <div style={{fontSize: '14px', fontWeight: 500, color: '#888'}}>Add Another Home</div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        {homes.length > 0 && (
          <div style={{marginTop: '32px'}}>
            <h3 style={{fontSize: '18px', fontWeight: 600, marginBottom: '16px', color: '#1a1a1a'}}>Quick Actions</h3>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px'}}>
              {[
                {icon: '📸', title: 'Upload Photos', desc: 'AI detects your materials', color: '#7c3aed'},
                {icon: '🛒', title: 'Shopping List', desc: 'Shop your home\'s materials', color: '#16a34a'},
                {icon: '💰', title: 'Budget Tracker', desc: 'Track renovation costs', color: '#d97706'},
              ].map(action => (
                <div
                  key={action.title}
                  style={{background: '#fff', border: '1px solid #e5e5e5', borderRadius: '12px', padding: '24px', cursor: 'pointer'}}
                >
                  <div style={{fontSize: '28px', marginBottom: '12px'}}>{action.icon}</div>
                  <div style={{fontSize: '15px', fontWeight: 600, color: '#1a1a1a', marginBottom: '4px'}}>{action.title}</div>
                  <div style={{fontSize: '13px', color: '#888'}}>{action.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}        {/* Welcome Header */}
        <div style={{marginBottom: '40px'}}>
          <h1 style={{fontSize: '32px', fontWeight: 700, color: '#1a1a1a', letterSpacing: '-0.5px'}}>
            Welcome to Homagio 👋
          </h1>
          <p style={{fontSize: '16px', color: '#666', marginTop: '8px'}}>
            You're signed in as {user?.email}. Let's catalog your first home.
          </p>
        </div>

        {/* Empty State — Add First Home */}
        <div style={{background: '#fff', border: '2px dashed #e5e5e5', borderRadius: '16px', padding: '64px 32px', textAlign: 'center'}}>
          <div style={{fontSize: '48px', marginBottom: '16px'}}>🏠</div>
          <h2 style={{fontSize: '24px', fontWeight: 700, color: '#1a1a1a', marginBottom: '8px'}}>
            Add your first home
          </h2>
          <p style={{fontSize: '15px', color: '#666', marginBottom: '32px', maxWidth: '440px', margin: '0 auto 32px'}}>
            Start building your home's digital twin. Catalog every material, track every dollar, and discover every possibility.
          </p>
          <button
            style={{background: '#006aff', color: '#fff', border: 'none', padding: '14px 32px', borderRadius: '8px', fontSize: '15px', fontWeight: 600, cursor: 'pointer'}}
          >
            + Add My Home
          </button>
        </div>

        {/* Stats Row */}
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginTop: '32px'}}>
          {[
            {icon: '🏠', label: 'Homes', value: '0'},
            {icon: '📦', label: 'Materials', value: '0'},
            {icon: '💰', label: 'Budget Tracked', value: '$0'},
            {icon: '📸', label: 'Photos', value: '0'},
          ].map(stat => (
            <div key={stat.label} style={{background: '#fff', border: '1px solid #e5e5e5', borderRadius: '12px', padding: '20px', textAlign: 'center'}}>
              <div style={{fontSize: '28px', marginBottom: '8px'}}>{stat.icon}</div>
              <div style={{fontSize: '24px', fontWeight: 700, color: '#1a1a1a'}}>{stat.value}</div>
              <div style={{fontSize: '13px', color: '#888', marginTop: '4px'}}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div style={{marginTop: '32px'}}>
          <h3 style={{fontSize: '18px', fontWeight: 600, marginBottom: '16px'}}>Quick Actions</h3>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px'}}>
            {[
              {icon: '🏠', title: 'Add a Home', desc: 'Start your digital twin', color: '#006aff'},
              {icon: '📸', title: 'Upload Photos', desc: 'AI detects your materials', color: '#7c3aed'},
              {icon: '🛒', title: 'Shopping List', desc: 'Shop your home\'s materials', color: '#16a34a'},
            ].map(action => (
              <div
                key={action.title}
                style={{background: '#fff', border: '1px solid #e5e5e5', borderRadius: '12px', padding: '24px', cursor: 'pointer', transition: 'all 0.2s'}}
              >
                <div style={{fontSize: '28px', marginBottom: '12px'}}>{action.icon}</div>
                <div style={{fontSize: '15px', fontWeight: 600, color: '#1a1a1a', marginBottom: '4px'}}>{action.title}</div>
                <div style={{fontSize: '13px', color: '#888'}}>{action.desc}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
