'use client'

import { useEffect, useRef, useState } from 'react'

const MAPBOX_TOKEN = 'pk.eyJ1IjoidGhlNWJsYWlycyIsImEiOiJjbW5hdmpheXAwbmZsMnFxMWo2bjBpcjdmIn0.Px8zSq6gn-Z3geHSYRB9LA'
const DEFAULT_CENTER: [number, number] = [-95.9928, 36.1540]
const DEFAULT_ZOOM = 11

export default function ExploreClient({ homes }: { homes: any[] }) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const mapRef = useRef<any>(null)
  const [selectedHome, setSelectedHome] = useState<any>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [mapError, setMapError] = useState(false)

  const homesWithCoords = homes.filter(h => h.lat && h.lng)

  useEffect(() => {
    if (mapRef.current) return

    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://api.mapbox.com/mapbox-gl-js/v3.3.0/mapbox-gl.css'
    document.head.appendChild(link)

    const script = document.createElement('script')
    script.src = 'https://api.mapbox.com/mapbox-gl-js/v3.3.0/mapbox-gl.js'

    script.onload = () => {
      const mapboxgl = (window as any).mapboxgl
      if (!mapboxgl) { setMapError(true); return }
      mapboxgl.accessToken = MAPBOX_TOKEN
      if (!mapContainer.current) return

      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: DEFAULT_CENTER,
        zoom: DEFAULT_ZOOM,
      })

      map.addControl(new mapboxgl.NavigationControl(), 'top-right')

      map.on('load', () => {
        setMapLoaded(true)
        mapRef.current = map

        const pinsToAdd = homesWithCoords.length > 0
          ? homesWithCoords
          : homes.length > 0 ? [{ ...homes[0], lat: DEFAULT_CENTER[1], lng: DEFAULT_CENTER[0] }] : []

        pinsToAdd.forEach(home => {
          // Use default Mapbox marker — no custom HTML, no anchor issues
          const marker = new mapboxgl.Marker({ color: '#006aff' })
            .setLngLat([home.lng, home.lat])
            .addTo(map)

          marker.getElement().addEventListener('click', () => {
            // Find the real home (not the fallback with default coords)
            const realHome = homes.find(h => h.id === home.id) || homes[0]
            setSelectedHome(realHome)
            setSidebarOpen(true)
            map.flyTo({ center: [home.lng, home.lat], zoom: 14, duration: 800 })
          })
        })
      })

      map.on('error', () => setMapError(true))
    }

    script.onerror = () => setMapError(true)
    document.head.appendChild(script)

    return () => {
      if (mapRef.current) { mapRef.current.remove(); mapRef.current = null }
    }
  }, [])

  const handleHomeClick = (home: any) => {
    setSelectedHome(home)
    setSidebarOpen(true)
    if (mapRef.current && home.lat && home.lng) {
      mapRef.current.flyTo({ center: [home.lng, home.lat], zoom: 14, duration: 800 })
    }
  }

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }
        body { font-family: system-ui, sans-serif; margin: 0; }
        .home-list-item { display: flex; gap: 12px; padding: 14px 16px; border-bottom: 1px solid #f3f4f6; cursor: pointer; transition: background 0.12s; }
        .home-list-item:hover { background: #f7f9fc; }
        .home-list-item.active { background: #f0f6ff; border-left: 3px solid #006aff; }
        @keyframes spin { 0%{transform:rotate(0deg)} 100%{transform:rotate(360deg)} }
      `}</style>

      <div style={{minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'system-ui, sans-serif'}}>
        <nav style={{background: '#fff', borderBottom: '1px solid #e9edf2', padding: '0 24px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 200, flexShrink: 0}}>
          <a href="/" style={{fontSize: '22px', fontWeight: 700, color: '#006aff', letterSpacing: '-0.5px', textDecoration: 'none'}}>
            hom<span style={{color: '#1a1a2e'}}>agio</span>
          </a>
          <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
            <span style={{fontSize: '14px', fontWeight: 600, color: '#1a1a2e'}}>Explore</span>
            <span style={{fontSize: '13px', color: '#9ca3af'}}>· {homes.length} home{homes.length !== 1 ? 's' : ''} on Homagio</span>
          </div>
          <a href="/dashboard" style={{fontSize: '13px', color: '#6b7280', textDecoration: 'none', fontWeight: 500}}>← Dashboard</a>
        </nav>

        <div style={{display: 'flex', flex: 1, height: 'calc(100vh - 64px)', overflow: 'hidden'}}>
          <div style={{width: '360px', flexShrink: 0, background: '#fff', borderRight: '1px solid #e9edf2', overflowY: 'auto', display: 'flex', flexDirection: 'column'}}>
            <div style={{padding: '16px', borderBottom: '1px solid #f3f4f6'}}>
              <div style={{fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '2px'}}>{homes.length} Public Home{homes.length !== 1 ? 's' : ''}</div>
              <div style={{fontSize: '12px', color: '#9ca3af'}}>Click a home to view on map</div>
            </div>
            {homes.length === 0 ? (
              <div style={{padding: '48px 24px', textAlign: 'center'}}>
                <div style={{fontSize: '36px', marginBottom: '12px'}}>🏠</div>
                <div style={{fontSize: '15px', fontWeight: 700, color: '#1a1a2e', marginBottom: '6px'}}>No public homes yet</div>
                <div style={{fontSize: '13px', color: '#9ca3af'}}>Be the first to make your home public.</div>
              </div>
            ) : (
              homes.map(home => (
                <div key={home.id} className={`home-list-item ${selectedHome?.id === home.id ? 'active' : ''}`} onClick={() => handleHomeClick(home)}>
                  <div style={{width: '64px', height: '64px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0, background: '#f0f6ff', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    {home.photo_url ? <img src={home.photo_url} alt={home.name || home.address} style={{width: '100%', height: '100%', objectFit: 'cover'}} /> : <span style={{fontSize: '28px'}}>🏠</span>}
                  </div>
                  <div style={{flex: 1, minWidth: 0}}>
                    <div style={{fontSize: '14px', fontWeight: 700, color: '#1a1a2e', marginBottom: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>{home.name || home.address}</div>
                    <div style={{fontSize: '12px', color: '#6b7280', marginBottom: '4px'}}>{home.city}, {home.state}</div>
                    <div style={{display: 'flex', gap: '8px'}}>
                      {home.bedrooms && <span style={{fontSize: '11px', color: '#9ca3af'}}>🛏️ {home.bedrooms}</span>}
                      {home.bathrooms && <span style={{fontSize: '11px', color: '#9ca3af'}}>🛁 {home.bathrooms}</span>}
                      {home.square_feet && <span style={{fontSize: '11px', color: '#9ca3af'}}>📐 {home.square_feet.toLocaleString()}</span>}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div style={{flex: 1, position: 'relative'}}>
            <div ref={mapContainer} style={{width: '100%', height: '100%'}} />

            {!mapLoaded && !mapError && (
              <div style={{position: 'absolute', inset: 0, background: '#f7f9fc', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px'}}>
                <div style={{width: '32px', height: '32px', border: '2.5px solid #e9edf2', borderTop: '2.5px solid #006aff', borderRadius: '50%', animation: 'spin 0.8s linear infinite'}} />
                <div style={{fontSize: '14px', color: '#6b7280'}}>Loading map...</div>
              </div>
            )}

            {mapError && (
              <div style={{position: 'absolute', inset: 0, background: '#f7f9fc', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', padding: '32px', textAlign: 'center'}}>
                <div style={{fontSize: '36px'}}>🗺️</div>
                <div style={{fontSize: '16px', fontWeight: 700, color: '#1a1a2e'}}>Map unavailable</div>
                <div style={{fontSize: '13px', color: '#6b7280', maxWidth: '320px'}}>Unable to load the map. Please try refreshing.</div>
              </div>
            )}

            {sidebarOpen && selectedHome && (
              <div style={{position: 'absolute', top: '16px', right: '16px', width: '320px', background: '#fff', borderRadius: '16px', boxShadow: '0 8px 32px rgba(0,0,0,0.15)', overflow: 'hidden', zIndex: 100}}>
                <button onClick={() => setSidebarOpen(false)} style={{position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.5)', color: '#fff', border: 'none', borderRadius: '50%', width: '28px', height: '28px', fontSize: '16px', cursor: 'pointer', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'inherit'}}>×</button>
                <div style={{height: '180px', background: '#0D1B2A', overflow: 'hidden'}}>
                  {selectedHome.photo_url ? <img src={selectedHome.photo_url} alt={selectedHome.name} style={{width: '100%', height: '100%', objectFit: 'cover', display: 'block'}} /> : <div style={{width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px', opacity: 0.4}}>🏠</div>}
                </div>
                <div style={{padding: '16px'}}>
                  <div style={{fontSize: '16px', fontWeight: 700, color: '#1a1a2e', marginBottom: '3px'}}>{selectedHome.name || selectedHome.address}</div>
                  {selectedHome.name && <div style={{fontSize: '12px', color: '#9ca3af', marginBottom: '2px'}}>{selectedHome.address}</div>}
                  <div style={{fontSize: '13px', color: '#6b7280', marginBottom: '12px'}}>{selectedHome.city}, {selectedHome.state} {selectedHome.zip}</div>
                  <div style={{display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '14px'}}>
                    {selectedHome.bedrooms && <span style={{fontSize: '12px', color: '#374151', background: '#f3f4f6', padding: '4px 8px', borderRadius: '6px'}}>🛏️ {selectedHome.bedrooms} beds</span>}
                    {selectedHome.bathrooms && <span style={{fontSize: '12px', color: '#374151', background: '#f3f4f6', padding: '4px 8px', borderRadius: '6px'}}>🛁 {selectedHome.bathrooms} baths</span>}
                    {selectedHome.square_feet && <span style={{fontSize: '12px', color: '#374151', background: '#f3f4f6', padding: '4px 8px', borderRadius: '6px'}}>📐 {selectedHome.square_feet.toLocaleString()} sqft</span>}
                    {selectedHome.year_built && <span style={{fontSize: '12px', color: '#374151', background: '#f3f4f6', padding: '4px 8px', borderRadius: '6px'}}>📅 {selectedHome.year_built}</span>}
                  </div>
                  <a href={`/explore/${selectedHome.id}`} style={{display: 'block', background: '#006aff', color: '#fff', padding: '11px', borderRadius: '9px', fontSize: '14px', fontWeight: 600, textDecoration: 'none', textAlign: 'center'}}>
                    View Full Home Profile →
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
