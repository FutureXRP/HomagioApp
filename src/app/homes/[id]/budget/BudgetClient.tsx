'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Nav from '@/components/Nav'

const STATUS_COLORS: Record<string, { bg: string, text: string, border: string }> = {
  planning:    { bg: '#f0f6ff', text: '#1e40af', border: '#bfdbfe' },
  in_progress: { bg: '#fef9ee', text: '#92400e', border: '#fcd34d' },
  complete:    { bg: '#f0fdf4', text: '#166534', border: '#86efac' },
  on_hold:     { bg: '#f9fafb', text: '#6b7280', border: '#e5e7eb' },
}

const STATUS_LABELS: Record<string, string> = {
  planning: 'Planning',
  in_progress: 'In Progress',
  complete: 'Complete',
  on_hold: 'On Hold',
}

function fmt(cents: number) {
  return `$${Math.round(cents / 100).toLocaleString()}`
}

function pct(actual: number, estimated: number) {
  if (!estimated) return 0
  return Math.min(Math.round((actual / estimated) * 100), 100)
}

function ProgressBar({ actual, estimated }: { actual: number, estimated: number }) {
  const p = pct(actual, estimated)
  const over = actual > estimated
  return (
    <div style={{ marginTop: '8px' }}>
      <div style={{ height: '6px', background: '#f3f4f6', borderRadius: '99px', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${p}%`, background: over ? '#dc2626' : '#3db85a', borderRadius: '99px', transition: 'width 0.3s ease' }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
        <span style={{ fontSize: '11px', color: '#9ca3af' }}>{fmt(actual)} spent</span>
        <span style={{ fontSize: '11px', color: over ? '#dc2626' : '#9ca3af', fontWeight: over ? 600 : 400 }}>
          {p}% of {fmt(estimated)}
        </span>
      </div>
    </div>
  )
}

interface BudgetEntry {
  id: string
  home_id: string
  room_id: string | null
  project_name: string
  estimated: number
  actual: number
  status: string
  created_at: string
}

interface AILineItem {
  project_name: string
  room_id: string | null
  estimated_low: number
  estimated_high: number
  estimated: number
  notes: string
  status: string
}

interface Props {
  home: any
  rooms: any[]
  budgets: BudgetEntry[]
  homeId: string
}

export default function BudgetClient({ home, rooms, budgets: initialBudgets, homeId }: Props) {
  const [budgets, setBudgets] = useState<BudgetEntry[]>(initialBudgets)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [form, setForm] = useState({
    project_name: '', room_id: '', estimated: '', actual: '', status: 'planning',
  })

  // AI states
  const [showAI, setShowAI] = useState(false)
  const [aiPrompt, setAiPrompt] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [aiItems, setAiItems] = useState<AILineItem[]>([])
  const [aiStreamText, setAiStreamText] = useState('')
  const [aiError, setAiError] = useState('')
  const [savingAI, setSavingAI] = useState(false)

  const totalEstimated = budgets.reduce((sum, b) => sum + (b.estimated || 0), 0)
  const totalActual = budgets.reduce((sum, b) => sum + (b.actual || 0), 0)
  const totalOver = totalActual > totalEstimated

  const resetForm = () => {
    setForm({ project_name: '', room_id: '', estimated: '', actual: '', status: 'planning' })
    setEditingId(null)
    setShowForm(false)
  }

  const handleEdit = (budget: BudgetEntry) => {
    setForm({
      project_name: budget.project_name,
      room_id: budget.room_id || '',
      estimated: budget.estimated ? String(Math.round(budget.estimated / 100)) : '',
      actual: budget.actual ? String(Math.round(budget.actual / 100)) : '',
      status: budget.status || 'planning',
    })
    setEditingId(budget.id)
    setShowForm(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.project_name.trim()) return
    setSaving(true)
    const supabase = createClient()
    const payload = {
      home_id: homeId,
      room_id: form.room_id || null,
      project_name: form.project_name.trim(),
      estimated: form.estimated ? Math.round(parseFloat(form.estimated) * 100) : 0,
      actual: form.actual ? Math.round(parseFloat(form.actual) * 100) : 0,
      status: form.status,
    }
    if (editingId) {
      const { data } = await supabase.from('budgets').update(payload).eq('id', editingId).select().single()
      if (data) setBudgets(prev => prev.map(b => b.id === editingId ? data : b))
    } else {
      const { data } = await supabase.from('budgets').insert(payload).select().single()
      if (data) setBudgets(prev => [...prev, data])
    }
    setSaving(false)
    resetForm()
  }

  const handleDelete = async (id: string) => {
    const supabase = createClient()
    await supabase.from('budgets').delete().eq('id', id)
    setBudgets(prev => prev.filter(b => b.id !== id))
    setDeleteConfirm(null)
  }

  // AI budget generation
  const handleGenerateAI = async () => {
    if (!aiPrompt.trim()) return
    setAiLoading(true)
    setAiItems([])
    setAiStreamText('')
    setAiError('')

    const roomContext = rooms.length > 0
      ? `The home has these rooms: ${rooms.map(r => r.name).join(', ')}.`
      : 'No rooms have been added yet.'

    const systemPrompt = `You are an expert home renovation cost estimator for the Homagio platform. 
The user has a home located in ${home.city}, ${home.state}.
${roomContext}

Your job is to generate a detailed, realistic budget breakdown based on what the user describes.
Use current market rates for ${home.city}, ${home.state} — adjust for local cost of living.
Break every project into specific line items (materials, labor, permits separately when significant).
Always include a contingency line item of 10-15% for unexpected costs.

You MUST respond with ONLY a valid JSON array. No markdown, no explanation, no text before or after.
Each item in the array must have exactly these fields:
- project_name: string (specific and descriptive)
- room_name: string (matching one of the home's rooms, or "General / Site Work" for exterior/whole-home items)
- estimated_low: number (in dollars, realistic low estimate)
- estimated_high: number (in dollars, realistic high estimate)  
- notes: string (1 sentence explaining what's included)
- status: "planning"

Example format:
[
  {
    "project_name": "Quartz Countertop Installation",
    "room_name": "Kitchen",
    "estimated_low": 4000,
    "estimated_high": 8000,
    "notes": "Includes 40 sq ft of quartz, edge profiling, sink cutout, and installation labor.",
    "status": "planning"
  }
]`

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 4000,
          system: systemPrompt,
          messages: [{ role: 'user', content: aiPrompt }],
        }),
      })

      const data = await response.json()
      const text = data.content?.[0]?.text || ''
      setAiStreamText(text)

      // Parse JSON response
      const clean = text.replace(/```json|```/g, '').trim()
      const parsed: any[] = JSON.parse(clean)

      // Map room names to room IDs
      const roomNameToId: Record<string, string> = {}
      rooms.forEach(r => { roomNameToId[r.name.toLowerCase()] = r.id })

      const items: AILineItem[] = parsed.map(item => {
        const roomId = roomNameToId[item.room_name?.toLowerCase()] || null
        const estimatedMid = Math.round((item.estimated_low + item.estimated_high) / 2)
        return {
          project_name: item.project_name,
          room_id: roomId,
          estimated_low: item.estimated_low,
          estimated_high: item.estimated_high,
          estimated: estimatedMid,
          notes: item.notes,
          status: item.status || 'planning',
        }
      })

      setAiItems(items)
    } catch (err) {
      console.error('AI budget error:', err)
      setAiError('Something went wrong generating your budget. Please try again.')
    } finally {
      setAiLoading(false)
    }
  }

  const handleSaveAIBudget = async () => {
    setSavingAI(true)
    const supabase = createClient()
    const inserts = aiItems.map(item => ({
      home_id: homeId,
      room_id: item.room_id,
      project_name: item.project_name,
      estimated: item.estimated * 100, // convert to cents
      actual: 0,
      status: item.status,
    }))
    const { data } = await supabase.from('budgets').insert(inserts).select()
    if (data) setBudgets(prev => [...prev, ...data])
    setSavingAI(false)
    setShowAI(false)
    setAiItems([])
    setAiPrompt('')
  }

  const updateAIItem = (index: number, field: string, value: any) => {
    setAiItems(prev => prev.map((item, i) => i === index ? { ...item, [field]: value } : item))
  }

  const removeAIItem = (index: number) => {
    setAiItems(prev => prev.filter((_, i) => i !== index))
  }

  // Group budgets by room
  const grouped: { roomId: string | null, roomName: string, items: BudgetEntry[] }[] = []
  rooms.forEach(room => {
    const items = budgets.filter(b => b.room_id === room.id)
    if (items.length > 0) grouped.push({ roomId: room.id, roomName: room.name, items })
  })
  const uncategorized = budgets.filter(b => !b.room_id)
  if (uncategorized.length > 0) grouped.push({ roomId: null, roomName: 'General / Site Work', items: uncategorized })

  const aiTotal = aiItems.reduce((sum, item) => sum + item.estimated, 0)

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', system-ui, sans-serif; }
        .budget-row { display: flex; align-items: center; gap: 12px; padding: 14px 16px; border-radius: 10px; border: 1px solid #f3f4f6; background: #fff; transition: border-color 0.12s; }
        .budget-row:hover { border-color: #e2e8f0; }
        .input-field { width: 100%; padding: 10px 14px; border: 1.5px solid #e2e8f0; border-radius: 10px; font-size: 14px; font-family: inherit; color: #1a1a2e; background: #fff; outline: none; transition: border-color 0.15s; }
        .input-field:focus { border-color: #3db85a; }
        .stat-card { background: #fff; border: 1px solid #e9edf2; border-radius: 14px; padding: 22px 20px; display: flex; align-items: center; gap: 16px; }
        .stat-icon { width: 44px; height: 44px; border-radius: 12px; background: #0D1B2A; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .ai-item-row { background: #fff; border: 1.5px solid #e9edf2; border-radius: 12px; padding: 16px; transition: border-color 0.15s; }
        .ai-item-row:hover { border-color: #3db85a; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
      `}</style>

      <div style={{ minHeight: '100vh', background: '#f7f9fc', fontFamily: "'DM Sans', system-ui, sans-serif" }}>
        <Nav variant="dashboard" rightContent={
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <a href={`/homes/${homeId}`} style={{ fontSize: '13px', color: '#6b7280', textDecoration: 'none', fontWeight: 500 }}>← {home.name || home.address}</a>
            <button onClick={() => { setShowAI(true); setShowForm(false) }}
              style={{ background: 'linear-gradient(135deg, #0D1B2A 0%, #1a3a5c 100%)', color: '#3db85a', border: '1px solid rgba(61,184,90,0.3)', padding: '10px 20px', borderRadius: '9px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
              ✦ Generate with AI
            </button>
            <button onClick={() => { resetForm(); setShowForm(true); setShowAI(false) }}
              style={{ background: '#0D1B2A', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '9px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#112236')}
              onMouseLeave={e => (e.currentTarget.style.background = '#0D1B2A')}
            >+ Add Entry</button>
          </div>
        } />

        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 40px 80px' }}>

          {/* Header */}
          <div style={{ marginBottom: '32px' }}>
            <p style={{ fontSize: '13px', fontWeight: 600, color: '#3db85a', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>Budget Tracker</p>
            <h1 style={{ fontSize: '30px', fontWeight: 700, color: '#1a1a2e', letterSpacing: '-0.5px', marginBottom: '4px' }}>{home.name || home.address}</h1>
            <p style={{ fontSize: '14px', color: '#6b7280' }}>Track estimated vs actual spend across all rooms and projects.</p>
          </div>

          {/* Summary stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '28px' }}>
            {[
              { label: 'Total Budget', value: fmt(totalEstimated), svg: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="7.5" stroke="#3db85a" strokeWidth="1.5" fill="none"/><path d="M10 6v1.5M10 12.5V14M7.5 11.5c0 .83.67 1.5 1.5 1.5h2a1.5 1.5 0 000-3H9a1.5 1.5 0 010-3h2A1.5 1.5 0 0112.5 8.5" stroke="#3db85a" strokeWidth="1.5" strokeLinecap="round"/></svg> },
              { label: 'Total Spent', value: fmt(totalActual), valueColor: totalOver ? '#dc2626' : '#1a1a2e', svg: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 10h14M10 3v14" stroke="#3db85a" strokeWidth="1.5" strokeLinecap="round"/></svg> },
              { label: 'Remaining', value: fmt(Math.max(totalEstimated - totalActual, 0)), valueColor: totalOver ? '#dc2626' : '#3db85a', svg: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M5 10h10" stroke="#3db85a" strokeWidth="1.5" strokeLinecap="round"/></svg> },
              { label: 'Line Items', value: budgets.length, svg: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="3" y="3" width="14" height="14" rx="2" stroke="#3db85a" strokeWidth="1.5" fill="none"/><path d="M3 8h14M8 8v9" stroke="#3db85a" strokeWidth="1.5"/></svg> },
            ].map(stat => (
              <div key={stat.label} className="stat-card">
                <div className="stat-icon">{stat.svg}</div>
                <div>
                  <div style={{ fontSize: '20px', fontWeight: 700, color: (stat as any).valueColor || '#1a1a2e', letterSpacing: '-0.5px' }}>{stat.value}</div>
                  <div style={{ fontSize: '12px', color: '#9ca3af', fontWeight: 500, marginTop: '2px' }}>{stat.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Overall progress */}
          {totalEstimated > 0 && (
            <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e9edf2', padding: '24px 28px', marginBottom: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '15px', fontWeight: 700, color: '#1a1a2e' }}>Overall Progress</span>
                <span style={{ fontSize: '13px', color: totalOver ? '#dc2626' : '#6b7280', fontWeight: 600 }}>
                  {totalOver ? `${fmt(totalActual - totalEstimated)} over budget` : `${fmt(totalEstimated - totalActual)} remaining`}
                </span>
              </div>
              <ProgressBar actual={totalActual} estimated={totalEstimated} />
            </div>
          )}

          {/* AI Budget Generator */}
          {showAI && (
            <div style={{ background: '#0D1B2A', borderRadius: '20px', padding: '32px', marginBottom: '28px', position: 'relative', overflow: 'hidden', border: '1px solid rgba(61,184,90,0.2)' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(61,184,90,0.6), transparent)' }} />

              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'rgba(61,184,90,0.15)', border: '1px solid rgba(61,184,90,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="3" stroke="#3db85a" strokeWidth="1.2" fill="none"/><path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.05 3.05l1.41 1.41M11.54 11.54l1.41 1.41M3.05 12.95l1.41-1.41M11.54 4.46l1.41-1.41" stroke="#3db85a" strokeWidth="1.2" strokeLinecap="round"/></svg>
                    </div>
                    <span style={{ fontSize: '16px', fontWeight: 700, color: '#fff' }}>AI Budget Generator</span>
                  </div>
                  <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>
                    Describe what you want to do. AI will generate a detailed cost breakdown for {home.city}, {home.state}.
                  </p>
                </div>
                <button onClick={() => { setShowAI(false); setAiItems([]); setAiPrompt('') }}
                  style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '8px', width: '32px', height: '32px', cursor: 'pointer', color: 'rgba(255,255,255,0.6)', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  ×
                </button>
              </div>

              {/* Prompt input */}
              {!aiItems.length && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <textarea
                    value={aiPrompt}
                    onChange={e => setAiPrompt(e.target.value)}
                    placeholder="Example: I want to fully remodel my kitchen with quartz countertops, custom cabinets, and a tile backsplash. Also add a pool and covered outdoor kitchen in the backyard."
                    rows={4}
                    style={{ width: '100%', padding: '14px 16px', border: '1.5px solid rgba(255,255,255,0.15)', borderRadius: '12px', fontSize: '14px', fontFamily: 'inherit', color: '#fff', background: 'rgba(255,255,255,0.08)', outline: 'none', resize: 'vertical', lineHeight: 1.6 }}
                    onFocus={e => (e.currentTarget.style.borderColor = 'rgba(61,184,90,0.5)')}
                    onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)')}
                  />

                  {/* Example prompts */}
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {[
                      'Full kitchen remodel with new appliances',
                      'Master bathroom renovation',
                      'Add a pool and outdoor entertaining area',
                      'Whole home renovation on a $150,000 budget',
                    ].map(example => (
                      <button key={example} onClick={() => setAiPrompt(example)}
                        style={{ padding: '5px 12px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.55)', fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s' }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(61,184,90,0.4)'; e.currentTarget.style.color = '#3db85a' }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; e.currentTarget.style.color = 'rgba(255,255,255,0.55)' }}
                      >{example}</button>
                    ))}
                  </div>

                  {aiError && (
                    <div style={{ background: 'rgba(220,38,38,0.15)', border: '1px solid rgba(220,38,38,0.3)', borderRadius: '10px', padding: '12px 16px', fontSize: '13px', color: '#fca5a5' }}>
                      {aiError}
                    </div>
                  )}

                  <button onClick={handleGenerateAI} disabled={aiLoading || !aiPrompt.trim()}
                    style={{ background: aiLoading ? 'rgba(61,184,90,0.4)' : '#3db85a', color: '#fff', border: 'none', padding: '13px 24px', borderRadius: '10px', fontSize: '15px', fontWeight: 600, cursor: aiLoading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'background 0.15s' }}>
                    {aiLoading ? (
                      <>
                        <div style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid #fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                        Generating your budget...
                      </>
                    ) : '✦ Generate Budget'}
                  </button>
                </div>
              )}

              {/* AI Results preview */}
              {aiItems.length > 0 && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: '#fff', marginBottom: '3px' }}>
                        {aiItems.length} line items generated · Est. total: ${aiTotal.toLocaleString()}
                      </div>
                      <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)' }}>Review and edit before adding to your budget</div>
                    </div>
                    <button onClick={() => { setAiItems([]); setAiPrompt('') }}
                      style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', fontFamily: 'inherit' }}>
                      Start over
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px', maxHeight: '420px', overflowY: 'auto' }}>
                    {aiItems.map((item, i) => (
                      <div key={i} className="ai-item-row" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '14px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <input
                              value={item.project_name}
                              onChange={e => updateAIItem(i, 'project_name', e.target.value)}
                              style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none', fontSize: '14px', fontWeight: 600, color: '#fff', fontFamily: 'inherit', marginBottom: '4px' }}
                            />
                            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginBottom: '8px' }}>{item.notes}</div>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>Est:</span>
                                <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>${item.estimated_low.toLocaleString()} – ${item.estimated_high.toLocaleString()}</span>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>Using:</span>
                                <input
                                  type="number"
                                  value={item.estimated}
                                  onChange={e => updateAIItem(i, 'estimated', parseInt(e.target.value) || 0)}
                                  style={{ width: '80px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '6px', padding: '2px 8px', fontSize: '12px', color: '#3db85a', fontWeight: 600, fontFamily: 'inherit', outline: 'none' }}
                                />
                              </div>
                              <select
                                value={item.room_id || ''}
                                onChange={e => updateAIItem(i, 'room_id', e.target.value || null)}
                                style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '6px', padding: '2px 8px', fontSize: '11px', color: 'rgba(255,255,255,0.7)', fontFamily: 'inherit', outline: 'none' }}
                              >
                                <option value="">General / Site Work</option>
                                {rooms.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                              </select>
                            </div>
                          </div>
                          <button onClick={() => removeAIItem(i)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.3)', fontSize: '18px', padding: '2px', lineHeight: 1, flexShrink: 0 }}>
                            ×
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => { setAiItems([]); setAiPrompt('') }}
                      style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.15)', background: 'transparent', color: 'rgba(255,255,255,0.6)', fontSize: '14px', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>
                      Discard
                    </button>
                    <button onClick={handleSaveAIBudget} disabled={savingAI}
                      style={{ flex: 2, padding: '12px', borderRadius: '10px', background: savingAI ? 'rgba(61,184,90,0.5)' : '#3db85a', color: '#fff', border: 'none', fontSize: '14px', fontWeight: 700, cursor: savingAI ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}>
                      {savingAI ? 'Adding to budget...' : `Add ${aiItems.length} items to budget`}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Manual add/edit form */}
          {showForm && (
            <div style={{ background: '#fff', borderRadius: '16px', border: '1.5px solid #3db85a', padding: '28px', marginBottom: '28px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#1a1a2e', marginBottom: '20px' }}>
                {editingId ? 'Edit Budget Entry' : 'Add Budget Entry'}
              </h2>
              <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Project Name *</label>
                    <input className="input-field" type="text" placeholder="e.g. Kitchen Countertops" value={form.project_name} onChange={e => setForm(f => ({ ...f, project_name: e.target.value }))} required />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Room <span style={{ color: '#9ca3af', fontWeight: 400 }}>(optional)</span></label>
                    <select className="input-field" value={form.room_id} onChange={e => setForm(f => ({ ...f, room_id: e.target.value }))}>
                      <option value="">General / Site Work</option>
                      {rooms.map(room => <option key={room.id} value={room.id}>{room.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Estimated ($)</label>
                    <input className="input-field" type="number" placeholder="0" min="0" step="0.01" value={form.estimated} onChange={e => setForm(f => ({ ...f, estimated: e.target.value }))} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Actual Spent ($)</label>
                    <input className="input-field" type="number" placeholder="0" min="0" step="0.01" value={form.actual} onChange={e => setForm(f => ({ ...f, actual: e.target.value }))} />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Status</label>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {Object.entries(STATUS_LABELS).map(([val, label]) => (
                      <button key={val} type="button" onClick={() => setForm(f => ({ ...f, status: val }))}
                        style={{ padding: '6px 16px', borderRadius: '20px', border: `1.5px solid ${form.status === val ? '#3db85a' : '#e2e8f0'}`, background: form.status === val ? '#f0fdf4' : '#fff', color: form.status === val ? '#166534' : '#6b7280', fontSize: '13px', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                  <button type="button" onClick={resetForm}
                    style={{ padding: '10px 20px', borderRadius: '9px', border: '1.5px solid #e2e8f0', background: '#fff', fontSize: '14px', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', color: '#374151' }}>
                    Cancel
                  </button>
                  <button type="submit" disabled={saving}
                    style={{ padding: '10px 24px', borderRadius: '9px', background: saving ? '#9ca3af' : '#3db85a', color: '#fff', border: 'none', fontSize: '14px', fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}>
                    {saving ? 'Saving...' : editingId ? 'Save Changes' : 'Add Entry'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Empty state */}
          {budgets.length === 0 && !showForm && !showAI && (
            <div style={{ background: '#0D1B2A', borderRadius: '20px', padding: '64px 32px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(61,184,90,0.5), transparent)' }} />
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px', opacity: 0.4 }}>
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="18" stroke="#fff" strokeWidth="2" fill="none"/><path d="M24 14v4M24 30v4M17 24h4M27 24h4" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>
              </div>
              <div style={{ fontSize: '20px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>No budget entries yet</div>
              <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.45)', maxWidth: '380px', margin: '0 auto 32px', lineHeight: 1.7 }}>
                Start with AI to generate a complete budget instantly, or add entries manually.
              </div>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button onClick={() => setShowAI(true)}
                  style={{ background: 'linear-gradient(135deg, #1a3a5c 0%, #0D1B2A 100%)', color: '#3db85a', border: '1px solid rgba(61,184,90,0.3)', padding: '13px 28px', borderRadius: '10px', fontSize: '15px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                  ✦ Generate with AI
                </button>
                <button onClick={() => setShowForm(true)}
                  style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.15)', padding: '13px 28px', borderRadius: '10px', fontSize: '15px', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>
                  Add manually
                </button>
              </div>
            </div>
          )}

          {/* Budget groups */}
          {grouped.map(group => {
            const groupEstimated = group.items.reduce((sum, b) => sum + (b.estimated || 0), 0)
            const groupActual = group.items.reduce((sum, b) => sum + (b.actual || 0), 0)
            const groupOver = groupActual > groupEstimated
            return (
              <div key={group.roomId || 'general'} style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e9edf2', padding: '24px 28px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#1a1a2e', marginBottom: '2px' }}>{group.roomName}</h2>
                    <div style={{ fontSize: '13px', color: '#9ca3af' }}>{group.items.length} item{group.items.length !== 1 ? 's' : ''}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '18px', fontWeight: 700, color: groupOver ? '#dc2626' : '#1a1a2e', letterSpacing: '-0.3px' }}>{fmt(groupActual)}</div>
                    <div style={{ fontSize: '12px', color: '#9ca3af' }}>of {fmt(groupEstimated)} · {pct(groupActual, groupEstimated)}%</div>
                  </div>
                </div>
                {groupEstimated > 0 && <ProgressBar actual={groupActual} estimated={groupEstimated} />}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '16px' }}>
                  {group.items.map(budget => {
                    const s = STATUS_COLORS[budget.status] || STATUS_COLORS.planning
                    const itemOver = budget.actual > budget.estimated && budget.estimated > 0
                    return (
                      <div key={budget.id} className="budget-row">
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                            <div style={{ fontSize: '14px', fontWeight: 600, color: '#1a1a2e' }}>{budget.project_name}</div>
                            <span style={{ fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '20px', background: s.bg, color: s.text, border: `1px solid ${s.border}`, whiteSpace: 'nowrap' }}>
                              {STATUS_LABELS[budget.status] || budget.status}
                            </span>
                          </div>
                          <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                            Estimated: {fmt(budget.estimated || 0)} · Actual: {fmt(budget.actual || 0)}
                            {budget.estimated > 0 && <span style={{ marginLeft: '6px', color: itemOver ? '#dc2626' : '#3db85a', fontWeight: 600 }}>({pct(budget.actual, budget.estimated)}%)</span>}
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                          <div style={{ fontSize: '15px', fontWeight: 700, color: itemOver ? '#dc2626' : '#1a1a2e' }}>{fmt(budget.actual || 0)}</div>
                          <button onClick={() => handleEdit(budget)}
                            style={{ background: '#f7f9fc', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '5px 10px', fontSize: '12px', fontWeight: 500, cursor: 'pointer', color: '#6b7280', fontFamily: 'inherit' }}>
                            Edit
                          </button>
                          {deleteConfirm === budget.id ? (
                            <div style={{ display: 'flex', gap: '4px' }}>
                              <button onClick={() => handleDelete(budget.id)}
                                style={{ background: '#dc2626', border: 'none', borderRadius: '6px', padding: '5px 10px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', color: '#fff', fontFamily: 'inherit' }}>
                                Delete
                              </button>
                              <button onClick={() => setDeleteConfirm(null)}
                                style={{ background: '#f3f4f6', border: 'none', borderRadius: '6px', padding: '5px 10px', fontSize: '12px', cursor: 'pointer', color: '#6b7280', fontFamily: 'inherit' }}>
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button onClick={() => setDeleteConfirm(budget.id)}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#d1d5db', fontSize: '16px', padding: '4px', lineHeight: 1 }}>
                              ×
                            </button>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}

          {/* Add more */}
          {budgets.length > 0 && !showForm && !showAI && (
            <button onClick={() => { resetForm(); setShowForm(true) }}
              style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '2px dashed #e2e8f0', background: '#fff', fontSize: '14px', fontWeight: 600, color: '#9ca3af', cursor: 'pointer', fontFamily: 'inherit', transition: 'border-color 0.15s, color 0.15s, background 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#3db85a'; e.currentTarget.style.color = '#3db85a'; e.currentTarget.style.background = '#f0fdf4' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#9ca3af'; e.currentTarget.style.background = '#fff' }}
            >+ Add Another Entry</button>
          )}

        </div>
      </div>
    </>
  )
}
