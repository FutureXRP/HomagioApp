'use client'
export const dynamic = 'force-dynamic'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login')
      } else {
        setUser(session.user)
      }
      setLoading(false)
    }
    getUser()
  }, [router])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div style={{minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f8f8'}}>
        <div style={{fontSize: '16px', color: '#888'}}>Loading your home...</div>
      </div>
    )
  }

  return (
    <div style={{minHeight: '100vh', background: '#f8f8f8'}}>

      {/* Nav */}
      <nav style={{background: '#fff', borderBottom: '1px solid #e5e5e5', padding: '0 32px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
        <div style={{fontSize: '24px', fontWeight: 700, color: '#006aff', letterSpacing: '-1px'}}>
          hom<span style={{color: '#1a1a1a'}}>agio</span>
        </div>
        <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
          <span style={{fontSize: '14px', color: '#666'}}>
            {user?.user_metadata?.full_name || user?.email}
          </span>
          <button
            onClick={handleSignOut}
            style={{padding: '8px 18px', borderRadius: '8px', border: '1.5px solid #e5e5e5', background: '#fff', fontSize: '14px', fontWeight: 500, cursor: 'pointer', color: '#444'}}
          >
            Sign Out
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div style={{maxWidth: '1200px', margin: '0 auto', padding: '48px 32px'}}>

        {/* Welcome Header */}
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
