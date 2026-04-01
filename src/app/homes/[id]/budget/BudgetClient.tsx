'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Nav from '@/components/Nav'

// ─── Types ───────────────────────────────────────────────────────────────────

interface BudgetProject {
  id: string
  home_id: string
  name: string
  status: string
  created_at: string
}

interface BudgetEntry {
  id: string
  home_id: string
  room_id: string | null
  budget_project_id: string | null
  project_name: string
  estimated: number
  actual: number
  status: string
  description: string | null
  brand: string | null
  color: string | null
  finish: string | null
  purchase_url: string | null
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
  budgetProjects: BudgetProject[]
  budgets: BudgetEntry[]
  homeId: string
}

// ─── Constants ───────────────────────────────────────────────────────────────

const STATUS_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  planning:    { bg: '#f0f6ff', text: '#1e40af', border: '#bfdbfe' },
  in_progress: { bg: '#fef9ee', text: '#92400e', border: '#fcd34d' },
  complete:    { bg: '#f0fdf4', text: '#166534', border: '#86efac' },
  on_hold:     { bg: '#f9fafb', text: '#6b7280', border: '#e5e7eb' },
}

const STATUS_LABELS: Record<string, string> = {
  planning: 'Planning', in_progress: 'In Progress', complete: 'Complete', on_hold: 'On Hold',
}

const EMPTY_FORM = {
  project_name: '', room_id: '', estimated: '', actual: '',
  status: 'planning', description: '', brand: '', color: '', finish: '', purchase_url: '',
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmt(cents: number) {
  return `$${Math.round(cents / 100).toLocaleString()}`
}

function pct(actual: number, estimated: number) {
  if (!estimated) return 0
  return Math.min(Math.round((actual / estimated) * 100), 100)
}

function ProgressBar({ actual, estimated }: { actual: number; estimated: number }) {
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

// ─── Main Component ───────────────────────────────────────────────────────────

export default function BudgetClient({ home, rooms, budgetProjects: initialProjects, budgets: initialBudgets, homeId }: Props) {
  const [projects, setProjects] = useState<BudgetProject[]>(initialProjects)
  const [budgets, setBudgets] = useState<BudgetEntry[]>(initialBudgets)
  const [activeProjectId, setActiveProjectId] = useState<string | null>(initialProjects[0]?.id ?? null)

  // New project form
  const [showNewProject, setShowNewProject] = useState(false)
  const [newProjectName, setNewProjectName] = useState('')
  const [creatingProject, setCreatingProject] = useState(false)

  // Line item form
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null)

  // Bulk select
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [bulkDeleting, setBulkDeleting] = useState(false)

  // Project actions
  const [projectMenuId, setProjectMenuId] = useState<string | null>(null)
  const [deleteProjectConfirm, setDeleteProjectConfirm] = useState<string | null>(null)
  const [duplicating, setDuplicating] = useState(false)
  const [archiving, setArchiving] = useState(false)

  // AI
  const [showAI, setShowAI] = useState(false)
  const [aiPrompt, setAiPrompt] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [aiItems, setAiItems] = useState<AILineItem[]>([])
  const [aiError, setAiError] = useState('')
  const [savingAI, setSavingAI] = useState(false)

  const activeProject = projects.find(p => p.id === activeProjectId) ?? null
  const activeItems = budgets.filter(b => b.budget_project_id === activeProjectId)
  const totalEstimated = activeItems.reduce((s, b) => s + (b.estimated || 0), 0)
  const totalActual = activeItems.reduce((s, b) => s + (b.actual || 0), 0)
  const totalOver = totalActual > totalEstimated

  // ─── Project CRUD ───────────────────────────────────────────────────────────

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) return
    setCreatingProject(true)
    const supabase = createClient()
    const { data } = await supabase
      .from('budget_projects')
      .insert({ home_id: homeId, name: newProjectName.trim(), status: 'active' })
      .select().single()
    if (data) {
      setProjects(prev => [...prev, data])
      setActiveProjectId(data.id)
    }
    setNewProjectName('')
    setShowNewProject(false)
    setCreatingProject(false)
    setShowForm(false)
    setSelectedIds(new Set())
  }

  const handleDeleteProject = async (projectId: string) => {
    const supabase = createClient()
    await supabase.from('budgets').delete().eq('budget_project_id', projectId)
    await supabase.from('budget_projects').delete().eq('id', projectId)
    setProjects(prev => prev.filter(p => p.id !== projectId))
    setBudgets(prev => prev.filter(b => b.budget_project_id !== projectId))
    const remaining = projects.filter(p => p.id !== projectId)
    setActiveProjectId(remaining[0]?.id ?? null)
    setDeleteProjectConfirm(null)
    setProjectMenuId(null)
  }

  const handleDuplicateProject = async (project: BudgetProject) => {
    setDuplicating(true)
    const supabase = createClient()
    const { data: newProject } = await supabase
      .from('budget_projects')
      .insert({ home_id: homeId, name: `${project.name} (Copy)`, status: 'active' })
      .select().single()
    if (newProject) {
      const items = budgets.filter(b => b.budget_project_id === project.id)
      if (items.length > 0) {
        const copies = items.map(({ id, created_at, ...rest }) => ({
          ...rest, budget_project_id: newProject.id,
        }))
        const { data: newItems } = await supabase.from('budgets').insert(copies).select()
        if (newItems) setBudgets(prev => [...prev, ...newItems])
      }
      setProjects(prev => [...prev, newProject])
      setActiveProjectId(newProject.id)
    }
    setDuplicating(false)
    setProjectMenuId(null)
  }

  const handleArchiveProject = async (project: BudgetProject) => {
    setArchiving(true)
    const supabase = createClient()
    const newStatus = project.status === 'archived' ? 'active' : 'archived'
    const { data } = await supabase
      .from('budget_projects')
      .update({ status: newStatus })
      .eq('id', project.id)
      .select().single()
    if (data) setProjects(prev => prev.map(p => p.id === project.id ? data : p))
    setArchiving(false)
    setProjectMenuId(null)
  }

  // ─── Line Item CRUD ─────────────────────────────────────────────────────────

  const resetForm = () => {
    setForm(EMPTY_FORM)
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
      description: budget.description || '',
      brand: budget.brand || '',
      color: budget.color || '',
      finish: budget.finish || '',
      purchase_url: budget.purchase_url || '',
    })
    setEditingId(budget.id)
    setShowForm(true)
    setShowAI(false)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.project_name.trim() || !activeProjectId) return
    setSaving(true)
    const supabase = createClient()
    const payload = {
      home_id: homeId,
      budget_project_id: activeProjectId,
      room_id: form.room_id || null,
      project_name: form.project_name.trim(),
      estimated: form.estimated ? Math.round(parseFloat(form.estimated) * 100) : 0,
      actual: form.actual ? Math.round(parseFloat(form.actual) * 100) : 0,
      status: form.status,
      description: form.description.trim() || null,
      brand: form.brand.trim() || null,
      color: form.color.trim() || null,
      finish: form.finish.trim() || null,
      purchase_url: form.purchase_url.trim() || null,
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

  const handleDeleteSingle = async (id: string) => {
    const supabase = createClient()
    await supabase.from('budgets').delete().eq('id', id)
    setBudgets(prev => prev.filter(b => b.id !== id))
    setSelectedIds(prev => { const n = new Set(prev); n.delete(id); return n })
  }

  // ─── Bulk Select ────────────────────────────────────────────────────────────

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const n = new Set(prev)
      n.has(id) ? n.delete(id) : n.add(id)
      return n
    })
  }

  const toggleSelectAll = () => {
    if (selectedIds.size === activeItems.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(activeItems.map(b => b.id)))
    }
  }

  const handleBulkDelete = async () => {
    if (!selectedIds.size) return
    setBulkDeleting(true)
    const supabase = createClient()
    const ids = Array.from(selectedIds)
    await supabase.from('budgets').delete().in('id', ids)
    setBudgets(prev => prev.filter(b => !selectedIds.has(b.id)))
    setSelectedIds(new Set())
    setBulkDeleting(false)
  }

  // ─── AI Generation ──────────────────────────────────────────────────────────

  const handleGenerateAI = async () => {
    if (!aiPrompt.trim()) return
    setAiLoading(true)
    setAiItems([])
    setAiError('')
    try {
      const res = await fetch('/api/ai-budget', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: aiPrompt,
          homeCityState: `${home.city}, ${home.state}`,
          roomNames: rooms.map(r => r.name),
        }),
      })
      const data = await res.json()
      if (!res.ok) { setAiError(data.error || 'Failed to generate budget.'); return }
      const roomNameToId: Record<string, string> = {}
      rooms.forEach(r => { roomNameToId[r.name.toLowerCase()] = r.id })
      const items: AILineItem[] = data.items.map((item: any) => ({
        project_name: item.project_name,
        room_id: roomNameToId[item.room_name?.toLowerCase()] || null,
        estimated_low: item.estimated_low,
        estimated_high: item.estimated_high,
        estimated: Math.round((item.estimated_low + item.estimated_high) / 2),
        notes: item.notes,
        status: item.status || 'planning',
      }))
      setAiItems(items)
    } catch {
      setAiError('Network error — please try again.')
    } finally {
      setAiLoading(false)
    }
  }

  const handleSaveAIBudget = async () => {
    if (!activeProjectId) return
    setSavingAI(true)
    const supabase = createClient()
    const inserts = aiItems.map(item => ({
      home_id: homeId,
      budget_project_id: activeProjectId,
      room_id: item.room_id,
      project_name: item.project_name,
      estimated: item.estimated * 100,
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

  // ─── Grouped items ──────────────────────────────────────────────────────────

  const grouped: { roomId: string | null; roomName: string; items: BudgetEntry[] }[] = []
  rooms.forEach(room => {
    const items = activeItems.filter(b => b.room_id === room.id)
    if (items.length > 0) grouped.push({ roomId: room.id, roomName: room.name, items })
  })
  const uncategorized = activeItems.filter(b => !b.room_id)
  if (uncategorized.length > 0) grouped.push({ roomId: null, roomName: 'General / Site Work', items: uncategorized })

  const activeProjects = projects.filter(p => p.status === 'active')
  const archivedProjects = projects.filter(p => p.status === 'archived')
  const aiTotal = aiItems.reduce((s, i) => s + i.estimated, 0)

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', system-ui, sans-serif; }
        .budget-row { display: flex; align-items: flex-start; gap: 12px; padding: 14px 16px; border-radius: 10px; border: 1px solid #f3f4f6; background: #fff; transition: border-color 0.12s; }
        .budget-row:hover { border-color: #e2e8f0; }
        .budget-row.selected { border-color: #3db85a; background: #f0fdf4; }
        .input-field { width: 100%; padding: 10px 14px; border: 1.5px solid #e2e8f0; border-radius: 10px; font-size: 14px; font-family: inherit; color: #1a1a2e; background: #fff; outline: none; transition: border-color 0.15s; }
        .input-field:focus { border-color: #3db85a; }
        .stat-card { background: #fff; border: 1px solid #e9edf2; border-radius: 14px; padding: 22px 20px; display: flex; align-items: center; gap: 16px; }
        .stat-icon { width: 44px; height: 44px; border-radius: 12px; background: #0D1B2A; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .ai-item-row { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 14px 16px; transition: border-color 0.15s; }
        .ai-item-row:hover { border-color: rgba(61,184,90,0.4); }
        .tab-btn { padding: 8px 16px; border-radius: 8px; font-size: 13px; font-weight: 600; border: 1.5px solid #e9edf2; background: #fff; color: #6b7280; cursor: pointer; font-family: inherit; white-space: nowrap; transition: all 0.15s; display: flex; align-items: center; gap: 6px; }
        .tab-btn:hover { border-color: #3db85a; color: #3db85a; }
        .tab-btn.active { background: #0D1B2A; color: #fff; border-color: #0D1B2A; }
        .tab-btn.archived { opacity: 0.6; font-style: italic; }
        .project-menu { position: absolute; top: 100%; right: 0; margin-top: 4px; background: #fff; border: 1px solid #e9edf2; border-radius: 10px; box-shadow: 0 8px 24px rgba(0,0,0,0.1); z-index: 100; min-width: 180px; overflow: hidden; }
        .project-menu-item { padding: 10px 16px; font-size: 13px; font-weight: 500; color: #374151; cursor: pointer; transition: background 0.1s; display: flex; align-items: center; gap: 8px; font-family: inherit; background: none; border: none; width: 100%; text-align: left; }
        .project-menu-item:hover { background: #f7f9fc; }
        .project-menu-item.danger { color: #dc2626; }
        .project-menu-item.danger:hover { background: #fef2f2; }
        .checkbox { width: 16px; height: 16px; border-radius: 4px; border: 1.5px solid #d1d5db; background: #fff; cursor: pointer; flex-shrink: 0; display: flex; align-items: center; justify-content: center; transition: all 0.12s; }
        .checkbox.checked { background: #3db85a; border-color: #3db85a; }
        .expand-detail { background: #f7f9fc; border-radius: 8px; padding: 12px 14px; margin-top: 10px; display: flex; flex-wrap: wrap; gap: 16px; }
        .detail-pill { display: flex; flex-direction: column; gap: 2px; }
        .detail-label { font-size: 10px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; }
        .detail-value { font-size: 13px; color: #374151; font-weight: 500; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>

      <div style={{ minHeight: '100vh', background: '#f7f9fc', fontFamily: "'DM Sans', system-ui, sans-serif" }}>

        {/* Nav */}
        <Nav variant="dashboard" rightContent={
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <a href={`/homes/${homeId}`} style={{ fontSize: '13px', color: '#6b7280', textDecoration: 'none', fontWeight: 500 }}>← {home.name || home.address}</a>
            {activeProjectId && (
              <button onClick={() => { setShowAI(true); setShowForm(false) }}
                style={{ background: 'linear-gradient(135deg, #0D1B2A 0%, #1a3a5c 100%)', color: '#3db85a', border: '1px solid rgba(61,184,90,0.3)', padding: '10px 20px', borderRadius: '9px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                ✦ Generate with AI
              </button>
            )}
            {activeProjectId && (
              <button onClick={() => { resetForm(); setShowForm(true); setShowAI(false) }}
                style={{ background: '#0D1B2A', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '9px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#112236')}
                onMouseLeave={e => (e.currentTarget.style.background = '#0D1B2A')}
              >+ Add Entry</button>
            )}
          </div>
        } />

        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 40px 80px' }}>

          {/* Header */}
          <div style={{ marginBottom: '28px' }}>
            <p style={{ fontSize: '13px', fontWeight: 600, color: '#3db85a', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>Budget Tracker</p>
            <h1 style={{ fontSize: '30px', fontWeight: 700, color: '#1a1a2e', letterSpacing: '-0.5px', marginBottom: '4px' }}>{home.name || home.address}</h1>
            <p style={{ fontSize: '14px', color: '#6b7280' }}>Manage project budgets, track spend, and plan renovations.</p>
          </div>

          {/* ── Project Tabs ── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '32px', paddingBottom: '20px', borderBottom: '1px solid #e9edf2' }}>
            {activeProjects.map(project => (
              <div key={project.id} style={{ position: 'relative' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <button
                    className={`tab-btn${activeProjectId === project.id ? ' active' : ''}`}
                    onClick={() => { setActiveProjectId(project.id); setSelectedIds(new Set()); setShowForm(false); setShowAI(false) }}
                    style={{ borderRadius: projectMenuId === project.id || activeProjectId === project.id ? '8px 0 0 8px' : '8px', borderRight: 'none' }}
                  >
                    {project.name}
                    <span style={{ fontSize: '11px', opacity: 0.7, fontWeight: 400 }}>
                      ({budgets.filter(b => b.budget_project_id === project.id).length})
                    </span>
                  </button>
                  <button
                    onClick={() => setProjectMenuId(projectMenuId === project.id ? null : project.id)}
                    style={{ height: '100%', padding: '8px 8px', border: `1.5px solid ${activeProjectId === project.id ? '#0D1B2A' : '#e9edf2'}`, borderLeft: '1px solid rgba(255,255,255,0.15)', borderRadius: '0 8px 8px 0', background: activeProjectId === project.id ? '#0D1B2A' : '#fff', cursor: 'pointer', color: activeProjectId === project.id ? 'rgba(255,255,255,0.7)' : '#9ca3af', display: 'flex', alignItems: 'center' }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/></svg>
                  </button>
                </div>

                {/* Project dropdown menu */}
                {projectMenuId === project.id && (
                  <div className="project-menu" onClick={e => e.stopPropagation()}>
                    <button className="project-menu-item" onClick={() => handleDuplicateProject(project)} disabled={duplicating}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
                      {duplicating ? 'Duplicating...' : 'Duplicate'}
                    </button>
                    <button className="project-menu-item" onClick={() => handleArchiveProject(project)} disabled={archiving}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/><line x1="10" y1="12" x2="14" y2="12"/></svg>
                      {archiving ? 'Archiving...' : 'Archive'}
                    </button>
                    {deleteProjectConfirm === project.id ? (
                      <div style={{ padding: '10px 16px', borderTop: '1px solid #fee2e2', background: '#fef2f2' }}>
                        <div style={{ fontSize: '12px', color: '#dc2626', marginBottom: '8px', fontWeight: 600 }}>Delete all {budgets.filter(b => b.budget_project_id === project.id).length} items?</div>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button onClick={() => handleDeleteProject(project.id)}
                            style={{ flex: 1, padding: '5px', borderRadius: '6px', background: '#dc2626', color: '#fff', border: 'none', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                            Delete
                          </button>
                          <button onClick={() => setDeleteProjectConfirm(null)}
                            style={{ flex: 1, padding: '5px', borderRadius: '6px', background: '#f3f4f6', color: '#374151', border: 'none', fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit' }}>
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button className="project-menu-item danger" onClick={() => setDeleteProjectConfirm(project.id)} style={{ borderTop: '1px solid #fee2e2' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                        Delete Budget
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}

            {/* Archived projects */}
            {archivedProjects.map(project => (
              <div key={project.id} style={{ position: 'relative' }}>
                <button
                  className={`tab-btn archived${activeProjectId === project.id ? ' active' : ''}`}
                  onClick={() => { setActiveProjectId(project.id); setSelectedIds(new Set()); setShowForm(false); setShowAI(false) }}
                >
                  {project.name}
                  <span style={{ fontSize: '10px', background: '#f3f4f6', color: '#9ca3af', padding: '1px 6px', borderRadius: '4px' }}>archived</span>
                </button>
              </div>
            ))}

            {/* New project */}
            {showNewProject ? (
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                <input
                  autoFocus
                  value={newProjectName}
                  onChange={e => setNewProjectName(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') handleCreateProject(); if (e.key === 'Escape') setShowNewProject(false) }}
                  placeholder="Budget name..."
                  style={{ padding: '7px 12px', border: '1.5px solid #3db85a', borderRadius: '8px', fontSize: '13px', fontFamily: 'inherit', outline: 'none', color: '#1a1a2e', width: '180px' }}
                />
                <button onClick={handleCreateProject} disabled={creatingProject || !newProjectName.trim()}
                  style={{ padding: '7px 14px', borderRadius: '8px', background: '#3db85a', color: '#fff', border: 'none', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                  {creatingProject ? '...' : 'Create'}
                </button>
                <button onClick={() => setShowNewProject(false)}
                  style={{ padding: '7px 10px', borderRadius: '8px', background: '#f3f4f6', color: '#6b7280', border: 'none', fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit' }}>
                  Cancel
                </button>
              </div>
            ) : (
              <button className="tab-btn" onClick={() => { setShowNewProject(true); setProjectMenuId(null) }}
                style={{ borderStyle: 'dashed', color: '#3db85a', borderColor: '#3db85a' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
                New Budget
              </button>
            )}
          </div>

          {/* Close menus on outside click */}
          {projectMenuId && (
            <div style={{ position: 'fixed', inset: 0, zIndex: 99 }} onClick={() => setProjectMenuId(null)} />
          )}

          {/* ── No projects empty state ── */}
          {projects.length === 0 && (
            <div style={{ background: '#0D1B2A', borderRadius: '20px', padding: '64px 32px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(61,184,90,0.5), transparent)' }} />
              <div style={{ fontSize: '20px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>No budgets yet</div>
              <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.45)', maxWidth: '340px', margin: '0 auto 32px', lineHeight: 1.7 }}>
                Create your first budget to start tracking a project — kitchen remodel, pool, whole-home renovation, and more.
              </div>
              <button onClick={() => setShowNewProject(true)}
                style={{ background: '#3db85a', color: '#fff', border: 'none', padding: '13px 28px', borderRadius: '10px', fontSize: '15px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                + Create First Budget
              </button>
            </div>
          )}

          {/* ── Active project content ── */}
          {activeProject && (
            <>
              {/* Summary stats */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '28px' }}>
                {[
                  { label: 'Total Budget', value: fmt(totalEstimated), svg: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="7.5" stroke="#3db85a" strokeWidth="1.5" fill="none"/><path d="M10 6v1.5M10 12.5V14M7.5 11.5c0 .83.67 1.5 1.5 1.5h2a1.5 1.5 0 000-3H9a1.5 1.5 0 010-3h2A1.5 1.5 0 0112.5 8.5" stroke="#3db85a" strokeWidth="1.5" strokeLinecap="round"/></svg> },
                  { label: 'Total Spent', value: fmt(totalActual), valueColor: totalOver ? '#dc2626' : '#1a1a2e', svg: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 10h14M10 3v14" stroke="#3db85a" strokeWidth="1.5" strokeLinecap="round"/></svg> },
                  { label: 'Remaining', value: fmt(Math.max(totalEstimated - totalActual, 0)), valueColor: totalOver ? '#dc2626' : '#3db85a', svg: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M5 10h10" stroke="#3db85a" strokeWidth="1.5" strokeLinecap="round"/></svg> },
                  { label: 'Line Items', value: activeItems.length, svg: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="3" y="3" width="14" height="14" rx="2" stroke="#3db85a" strokeWidth="1.5" fill="none"/><path d="M3 8h14M8 8v9" stroke="#3db85a" strokeWidth="1.5"/></svg> },
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

              {/* Bulk action bar */}
              {selectedIds.size > 0 && (
                <div style={{ background: '#0D1B2A', borderRadius: '12px', padding: '12px 20px', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: '#fff' }}>{selectedIds.size} item{selectedIds.size !== 1 ? 's' : ''} selected</span>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => setSelectedIds(new Set())}
                      style={{ padding: '7px 14px', borderRadius: '8px', background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', border: 'none', fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit' }}>
                      Deselect
                    </button>
                    <button onClick={handleBulkDelete} disabled={bulkDeleting}
                      style={{ padding: '7px 14px', borderRadius: '8px', background: '#dc2626', color: '#fff', border: 'none', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                      {bulkDeleting ? 'Deleting...' : `Delete ${selectedIds.size} item${selectedIds.size !== 1 ? 's' : ''}`}
                    </button>
                  </div>
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
                        Describe what you want to do. AI will generate a cost breakdown for {home.city}, {home.state}.
                      </p>
                    </div>
                    <button onClick={() => { setShowAI(false); setAiItems([]); setAiPrompt(''); setAiError('') }}
                      style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '8px', width: '32px', height: '32px', cursor: 'pointer', color: 'rgba(255,255,255,0.6)', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>×</button>
                  </div>

                  {!aiItems.length && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <textarea value={aiPrompt} onChange={e => setAiPrompt(e.target.value)}
                        placeholder="Example: Full kitchen remodel with quartz countertops, custom cabinets, and tile backsplash."
                        rows={4}
                        style={{ width: '100%', padding: '14px 16px', border: '1.5px solid rgba(255,255,255,0.15)', borderRadius: '12px', fontSize: '14px', fontFamily: 'inherit', color: '#fff', background: 'rgba(255,255,255,0.08)', outline: 'none', resize: 'vertical', lineHeight: 1.6 }}
                        onFocus={e => (e.currentTarget.style.borderColor = 'rgba(61,184,90,0.5)')}
                        onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)')} />
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {['Full kitchen remodel with new appliances', 'Master bathroom renovation', 'Add a pool and outdoor entertaining area', 'Whole home renovation on a $150,000 budget'].map(ex => (
                          <button key={ex} onClick={() => setAiPrompt(ex)}
                            style={{ padding: '5px 12px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.55)', fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit' }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(61,184,90,0.4)'; e.currentTarget.style.color = '#3db85a' }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; e.currentTarget.style.color = 'rgba(255,255,255,0.55)' }}
                          >{ex}</button>
                        ))}
                      </div>
                      {aiError && <div style={{ background: 'rgba(220,38,38,0.15)', border: '1px solid rgba(220,38,38,0.3)', borderRadius: '10px', padding: '12px 16px', fontSize: '13px', color: '#fca5a5' }}>{aiError}</div>}
                      <button onClick={handleGenerateAI} disabled={aiLoading || !aiPrompt.trim()}
                        style={{ background: aiLoading ? 'rgba(61,184,90,0.4)' : '#3db85a', color: '#fff', border: 'none', padding: '13px 24px', borderRadius: '10px', fontSize: '15px', fontWeight: 600, cursor: aiLoading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        {aiLoading ? <><div style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid #fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />Generating...</> : '✦ Generate Budget'}
                      </button>
                    </div>
                  )}

                  {aiItems.length > 0 && (
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                        <div>
                          <div style={{ fontSize: '14px', fontWeight: 600, color: '#fff', marginBottom: '3px' }}>{aiItems.length} items · Est. total: ${aiTotal.toLocaleString()}</div>
                          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)' }}>Review and edit before adding to your budget</div>
                        </div>
                        <button onClick={() => { setAiItems([]); setAiPrompt('') }}
                          style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', fontFamily: 'inherit' }}>Start over</button>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px', maxHeight: '420px', overflowY: 'auto' }}>
                        {aiItems.map((item, i) => (
                          <div key={i} className="ai-item-row">
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <input value={item.project_name} onChange={e => updateAIItem(i, 'project_name', e.target.value)}
                                  style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none', fontSize: '14px', fontWeight: 600, color: '#fff', fontFamily: 'inherit', marginBottom: '4px' }} />
                                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginBottom: '8px' }}>{item.notes}</div>
                                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                                  <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>Range: ${item.estimated_low.toLocaleString()} – ${item.estimated_high.toLocaleString()}</span>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>Using: $</span>
                                    <input type="number" value={item.estimated} onChange={e => updateAIItem(i, 'estimated', parseInt(e.target.value) || 0)}
                                      style={{ width: '80px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '6px', padding: '2px 8px', fontSize: '12px', color: '#3db85a', fontWeight: 600, fontFamily: 'inherit', outline: 'none' }} />
                                  </div>
                                  <select value={item.room_id || ''} onChange={e => updateAIItem(i, 'room_id', e.target.value || null)}
                                    style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '6px', padding: '2px 8px', fontSize: '11px', color: 'rgba(255,255,255,0.7)', fontFamily: 'inherit', outline: 'none' }}>
                                    <option value="">General / Site Work</option>
                                    {rooms.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                                  </select>
                                </div>
                              </div>
                              <button onClick={() => setAiItems(prev => prev.filter((_, j) => j !== i))}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.3)', fontSize: '18px', padding: '2px', lineHeight: 1, flexShrink: 0 }}>×</button>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button onClick={() => { setAiItems([]); setAiPrompt('') }}
                          style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.15)', background: 'transparent', color: 'rgba(255,255,255,0.6)', fontSize: '14px', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>Discard</button>
                        <button onClick={handleSaveAIBudget} disabled={savingAI}
                          style={{ flex: 2, padding: '12px', borderRadius: '10px', background: savingAI ? 'rgba(61,184,90,0.5)' : '#3db85a', color: '#fff', border: 'none', fontSize: '14px', fontWeight: 700, cursor: savingAI ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}>
                          {savingAI ? 'Adding...' : `Add ${aiItems.length} items to "${activeProject.name}"`}
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
                    {editingId ? 'Edit Line Item' : `Add to "${activeProject.name}"`}
                  </h2>
                  <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {/* Row 1 */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Item Name *</label>
                        <input className="input-field" type="text" placeholder="e.g. Kitchen Countertops" value={form.project_name} onChange={e => setForm(f => ({ ...f, project_name: e.target.value }))} required />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Room <span style={{ color: '#9ca3af', fontWeight: 400 }}>(optional)</span></label>
                        <select className="input-field" value={form.room_id} onChange={e => setForm(f => ({ ...f, room_id: e.target.value }))}>
                          <option value="">General / Site Work</option>
                          {rooms.map(room => <option key={room.id} value={room.id}>{room.name}</option>)}
                        </select>
                      </div>
                    </div>
                    {/* Row 2 */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Estimated ($)</label>
                        <input className="input-field" type="number" placeholder="0" min="0" step="0.01" value={form.estimated} onChange={e => setForm(f => ({ ...f, estimated: e.target.value }))} />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Actual Spent ($)</label>
                        <input className="input-field" type="number" placeholder="0" min="0" step="0.01" value={form.actual} onChange={e => setForm(f => ({ ...f, actual: e.target.value }))} />
                      </div>
                    </div>
                    {/* Description */}
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Description <span style={{ color: '#9ca3af', fontWeight: 400 }}>(optional)</span></label>
                      <textarea className="input-field" placeholder="Notes about this item, scope of work, etc." rows={2} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} style={{ resize: 'vertical' }} />
                    </div>
                    {/* Product details */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Brand <span style={{ color: '#9ca3af', fontWeight: 400 }}>(optional)</span></label>
                        <input className="input-field" type="text" placeholder="e.g. Silestone" value={form.brand} onChange={e => setForm(f => ({ ...f, brand: e.target.value }))} />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Color <span style={{ color: '#9ca3af', fontWeight: 400 }}>(optional)</span></label>
                        <input className="input-field" type="text" placeholder="e.g. Calacatta Gold" value={form.color} onChange={e => setForm(f => ({ ...f, color: e.target.value }))} />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Finish <span style={{ color: '#9ca3af', fontWeight: 400 }}>(optional)</span></label>
                        <input className="input-field" type="text" placeholder="e.g. Matte" value={form.finish} onChange={e => setForm(f => ({ ...f, finish: e.target.value }))} />
                      </div>
                    </div>
                    {/* Purchase URL */}
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Purchase Link <span style={{ color: '#9ca3af', fontWeight: 400 }}>(optional)</span></label>
                      <input className="input-field" type="url" placeholder="https://..." value={form.purchase_url} onChange={e => setForm(f => ({ ...f, purchase_url: e.target.value }))} />
                    </div>
                    {/* Status */}
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
                        style={{ padding: '10px 20px', borderRadius: '9px', border: '1.5px solid #e2e8f0', background: '#fff', fontSize: '14px', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', color: '#374151' }}>Cancel</button>
                      <button type="submit" disabled={saving}
                        style={{ padding: '10px 24px', borderRadius: '9px', background: saving ? '#9ca3af' : '#3db85a', color: '#fff', border: 'none', fontSize: '14px', fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}>
                        {saving ? 'Saving...' : editingId ? 'Save Changes' : 'Add Item'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Empty state for project with no items */}
              {activeItems.length === 0 && !showForm && !showAI && (
                <div style={{ background: '#0D1B2A', borderRadius: '20px', padding: '64px 32px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(61,184,90,0.5), transparent)' }} />
                  <div style={{ fontSize: '20px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>No items in "{activeProject.name}"</div>
                  <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.45)', maxWidth: '380px', margin: '0 auto 32px', lineHeight: 1.7 }}>
                    Generate a full budget with AI or add line items manually.
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

              {/* Select all bar */}
              {activeItems.length > 0 && !showForm && !showAI && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <div className={`checkbox${selectedIds.size === activeItems.length && activeItems.length > 0 ? ' checked' : ''}`}
                    onClick={toggleSelectAll}
                    style={{ cursor: 'pointer' }}>
                    {selectedIds.size === activeItems.length && activeItems.length > 0 && (
                      <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    )}
                  </div>
                  <span style={{ fontSize: '13px', color: '#9ca3af', fontWeight: 500 }}>
                    {selectedIds.size === activeItems.length && activeItems.length > 0 ? 'Deselect all' : 'Select all'}
                  </span>
                </div>
              )}

              {/* Budget groups */}
              {grouped.map(group => {
                const groupEst = group.items.reduce((s, b) => s + (b.estimated || 0), 0)
                const groupAct = group.items.reduce((s, b) => s + (b.actual || 0), 0)
                const groupOver = groupAct > groupEst
                return (
                  <div key={group.roomId || 'general'} style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e9edf2', padding: '24px 28px', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                      <div>
                        <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#1a1a2e', marginBottom: '2px' }}>{group.roomName}</h2>
                        <div style={{ fontSize: '13px', color: '#9ca3af' }}>{group.items.length} item{group.items.length !== 1 ? 's' : ''}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '18px', fontWeight: 700, color: groupOver ? '#dc2626' : '#1a1a2e', letterSpacing: '-0.3px' }}>{fmt(groupAct)}</div>
                        <div style={{ fontSize: '12px', color: '#9ca3af' }}>of {fmt(groupEst)} · {pct(groupAct, groupEst)}%</div>
                      </div>
                    </div>
                    {groupEst > 0 && <ProgressBar actual={groupAct} estimated={groupEst} />}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '16px' }}>
                      {group.items.map(budget => {
                        const s = STATUS_COLORS[budget.status] || STATUS_COLORS.planning
                        const itemOver = budget.actual > budget.estimated && budget.estimated > 0
                        const isSelected = selectedIds.has(budget.id)
                        const isExpanded = expandedItemId === budget.id
                        const hasDetails = budget.description || budget.brand || budget.color || budget.finish || budget.purchase_url

                        return (
                          <div key={budget.id}>
                            <div className={`budget-row${isSelected ? ' selected' : ''}`}>
                              {/* Checkbox */}
                              <div className={`checkbox${isSelected ? ' checked' : ''}`} onClick={() => toggleSelect(budget.id)}>
                                {isSelected && <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                              </div>

                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#1a1a2e' }}>{budget.project_name}</div>
                                  <span style={{ fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '20px', background: s.bg, color: s.text, border: `1px solid ${s.border}`, whiteSpace: 'nowrap' }}>
                                    {STATUS_LABELS[budget.status] || budget.status}
                                  </span>
                                  {hasDetails && (
                                    <button onClick={() => setExpandedItemId(isExpanded ? null : budget.id)}
                                      style={{ fontSize: '11px', color: '#006aff', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', padding: 0, textDecoration: 'underline' }}>
                                      {isExpanded ? 'Less' : 'Details'}
                                    </button>
                                  )}
                                </div>
                                <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                                  Estimated: {fmt(budget.estimated || 0)} · Actual: {fmt(budget.actual || 0)}
                                  {budget.estimated > 0 && <span style={{ marginLeft: '6px', color: itemOver ? '#dc2626' : '#3db85a', fontWeight: 600 }}>({pct(budget.actual, budget.estimated)}%)</span>}
                                </div>

                                {/* Expanded details */}
                                {isExpanded && hasDetails && (
                                  <div className="expand-detail">
                                    {budget.description && (
                                      <div className="detail-pill" style={{ width: '100%' }}>
                                        <span className="detail-label">Description</span>
                                        <span className="detail-value">{budget.description}</span>
                                      </div>
                                    )}
                                    {budget.brand && <div className="detail-pill"><span className="detail-label">Brand</span><span className="detail-value">{budget.brand}</span></div>}
                                    {budget.color && <div className="detail-pill"><span className="detail-label">Color</span><span className="detail-value">{budget.color}</span></div>}
                                    {budget.finish && <div className="detail-pill"><span className="detail-label">Finish</span><span className="detail-value">{budget.finish}</span></div>}
                                    {budget.purchase_url && (
                                      <div className="detail-pill">
                                        <span className="detail-label">Purchase Link</span>
                                        <a href={budget.purchase_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '13px', color: '#006aff', fontWeight: 500 }}>View product</a>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>

                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                                <div style={{ fontSize: '15px', fontWeight: 700, color: itemOver ? '#dc2626' : '#1a1a2e' }}>{fmt(budget.actual || 0)}</div>
                                <button onClick={() => handleEdit(budget)}
                                  style={{ background: '#f7f9fc', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '5px 10px', fontSize: '12px', fontWeight: 500, cursor: 'pointer', color: '#6b7280', fontFamily: 'inherit' }}>Edit</button>
                                <button onClick={() => handleDeleteSingle(budget.id)}
                                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#d1d5db', fontSize: '16px', padding: '4px', lineHeight: 1 }}>×</button>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}

              {/* Add more */}
              {activeItems.length > 0 && !showForm && !showAI && (
                <button onClick={() => { resetForm(); setShowForm(true) }}
                  style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '2px dashed #e2e8f0', background: '#fff', fontSize: '14px', fontWeight: 600, color: '#9ca3af', cursor: 'pointer', fontFamily: 'inherit', transition: 'border-color 0.15s, color 0.15s, background 0.15s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#3db85a'; e.currentTarget.style.color = '#3db85a'; e.currentTarget.style.background = '#f0fdf4' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#9ca3af'; e.currentTarget.style.background = '#fff' }}>
                  + Add Another Item
                </button>
              )}
            </>
          )}

        </div>
      </div>
    </>
  )
}