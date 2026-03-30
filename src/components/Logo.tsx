import React from 'react'

export default function Logo({ size = 22 }: { size?: number }) {
  return (
    <a href="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
      <span style={{ fontSize: `${size}px`, fontWeight: 700, color: '#0D1B2A', letterSpacing: '-0.5px', fontFamily: "'DM Sans', system-ui, sans-serif" }}>
        hom
      </span>
      <span style={{ fontSize: `${size}px`, fontWeight: 700, color: '#3db85a', letterSpacing: '-0.5px', fontFamily: "'DM Sans', system-ui, sans-serif" }}>
        agio
      </span>
    </a>
  )
}
