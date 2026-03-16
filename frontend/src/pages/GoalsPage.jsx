import { useState, useEffect } from 'react'
import { C } from '../constants/colors'
import Card from '../components/ui/Card'
import Btn from '../components/ui/Btn'
import { createGoal, getGoalProgress, deleteGoal } from '../services/api'

const STATUS_COLORS = {
  'On Track':       C.freshGreen,
  'Ahead':          C.deepGreen,
  'Needs Work':     '#F59E0B',
  'Behind':         '#EF4444',
  'Completed ✅':   C.deepGreen,
  'Missed ❌':      '#EF4444',
}

const inp = {
  width: '100%', padding: '10px 14px', border: `1px solid ${C.border}`,
  borderRadius: 8, fontSize: 14, background: C.bg, outline: 'none',
  marginTop: 6, boxSizing: 'border-box', fontFamily: "'Poppins', sans-serif", color: C.text,
}
const lbl = { fontSize: 13, color: C.textMuted, fontWeight: 500 }

const EMPTY_FORM = { name: '', category: 'overall', targetKgCO2: '', endDate: '' }

export default function GoalsPage() {
  const [active,   setActive]   = useState([])
  const [past,     setPast]     = useState([])
  const [loading,  setLoading]  = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form,     setForm]     = useState(EMPTY_FORM)
  const [saving,   setSaving]   = useState(false)
  const [error,    setError]    = useState('')
  const [showPast, setShowPast] = useState(true)

  const load = async () => {
    setLoading(true)
    try {
      const data = await getGoalProgress()
      setActive(data.active || [])
      setPast(data.past || [])
    } catch { setError('Failed to load goals.') }
    finally   { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleCreate = async () => {
    if (!form.targetKgCO2 || !form.endDate) {
      setError('Target CO₂ and end date are required.')
      return
    }
    setSaving(true); setError('')
    try {
      await createGoal({
        name:        form.name || 'Carbon Reduction Goal',
        category:    form.category,
        targetKgCO2: parseFloat(form.targetKgCO2),
        endDate:     form.endDate,
      })
      setForm(EMPTY_FORM)
      setShowForm(false)
      await load()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create goal.')
    } finally { setSaving(false) }
  }

  const handleDelete = async (goalId) => {
    if (!window.confirm('Delete this goal?')) return
    try {
      await deleteGoal(goalId)
      setActive(prev => prev.filter(g => g.goalId !== goalId))
      setPast(prev => prev.filter(g => g.goalId !== goalId))
    } catch { alert('Failed to delete.') }
  }

  return (
    <div style={{ maxWidth: 800, display: 'flex', flexDirection: 'column', gap: 20, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 17, color: C.text }}>Your Carbon Goals</div>
          <div style={{ fontSize: 13, color: C.textMuted, marginTop: 2 }}>
            {loading ? 'Loading…' : `${active.length} active · ${past.length} completed`}
          </div>
        </div>
        <Btn onClick={() => { setShowForm(!showForm); setError('') }}>+ Create New Goal</Btn>
      </div>

      {/* Error */}
      {error && (
        <div style={{ padding: '10px 14px', background: '#FEF2F2', borderRadius: 8, color: '#EF4444', fontSize: 13 }}>
          {error}
        </div>
      )}

      {/* Create form */}
      {showForm && (
        <Card style={{ border: `2px solid ${C.freshGreen}` }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: C.text, marginBottom: 16 }}>New Goal</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={lbl}>Goal Title</label>
              <input style={inp} name="name" value={form.name} onChange={handleChange} placeholder="e.g. Reduce transport emissions" />
            </div>
            <div>
              <label style={lbl}>Category</label>
              <select style={inp} name="category" value={form.category} onChange={handleChange}>
                <option value="overall">Overall</option>
                <option value="transport">Transport</option>
                <option value="food">Food</option>
                <option value="energy">Energy</option>
                <option value="waste">Waste</option>
              </select>
            </div>
            <div>
              <label style={lbl}>Target CO₂ Limit (kg) *</label>
              <input style={inp} type="number" name="targetKgCO2" value={form.targetKgCO2} onChange={handleChange} placeholder="e.g. 50" min="0" />
            </div>
            <div>
              <label style={lbl}>Deadline *</label>
              <input style={inp} type="date" name="endDate" value={form.endDate} onChange={handleChange} min={new Date().toISOString().split('T')[0]} />
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
              <Btn onClick={handleCreate} disabled={saving}>{saving ? 'Saving…' : 'Save Goal'}</Btn>
              <Btn onClick={() => { setShowForm(false); setError('') }} variant="ghost">Cancel</Btn>
            </div>
          </div>
        </Card>
      )}

      {/* ── ACTIVE GOALS ── */}
      <div style={{ fontWeight: 700, fontSize: 15, color: C.text }}>
        🎯 Active Goals
      </div>

      {loading ? (
        <Card><div style={{ textAlign: 'center', color: C.textMuted, padding: 32 }}>Loading goals…</div></Card>
      ) : active.length === 0 ? (
        <Card style={{ textAlign: 'center', padding: 36 }}>
          <div style={{ fontSize: 36, marginBottom: 10 }}>🎯</div>
          <div style={{ color: C.textMuted, fontSize: 14 }}>No active goals. Create one to start tracking!</div>
        </Card>
      ) : active.map((g) => (
        <GoalCard key={g.goalId} g={g} onDelete={handleDelete} />
      ))}

      {/* ── PAST GOALS ── */}
      {past.length > 0 && (
        <>
          <div
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
            onClick={() => setShowPast(p => !p)}
          >
            <div style={{ fontWeight: 700, fontSize: 15, color: C.text }}>
              📋 Past Goals ({past.length})
            </div>
            <span style={{ fontSize: 13, color: C.textMuted }}>{showPast ? '▲ Hide' : '▼ Show'}</span>
          </div>

          {showPast && past.map((g) => (
            <PastGoalCard key={g.goalId} g={g} onDelete={handleDelete} />
          ))}
        </>
      )}
    </div>
  )
}

// ── Active Goal Card ───────────────────────────────────────────────────────
function GoalCard({ g, onDelete }) {
  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 15, color: C.text, marginBottom: 4 }}>{g.name}</div>
          <div style={{ fontSize: 12, color: C.textMuted }}>
            📂 {g.category} &nbsp;·&nbsp; 📅 Deadline: {new Date(g.endDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })} &nbsp;·&nbsp; ⏳ {g.daysLeft} day{g.daysLeft !== 1 ? 's' : ''} left
          </div>
          <div style={{ fontSize: 12, color: C.textMuted, marginTop: 3 }}>
            {g.totalEmissions} kg emitted of {g.targetKgCO2} kg target
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
          <span style={{
            background: (STATUS_COLORS[g.status] || C.textMuted) + '22',
            color: STATUS_COLORS[g.status] || C.textMuted,
            fontSize: 12, fontWeight: 600, padding: '5px 14px', borderRadius: 20,
          }}>{g.status}</span>
          <button onClick={() => onDelete(g.goalId)} style={delBtn}>🗑️</button>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 10 }}>
        <div style={{ flex: 1, height: 10, background: C.bg, borderRadius: 5, overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${g.progressPercent}%`,
            background: g.progressPercent >= 90
              ? '#EF4444'
              : `linear-gradient(90deg, ${C.deepGreen}, ${C.freshGreen})`,
            borderRadius: 5, transition: 'width 0.6s ease',
          }} />
        </div>
        <span style={{ fontSize: 16, fontWeight: 700, color: C.deepGreen, minWidth: 50, textAlign: 'right' }}>
          {g.progressPercent}%
        </span>
      </div>

      {/* Message */}
      <div style={{ fontSize: 12, color: C.textMuted, marginTop: 4 }}>{g.message}</div>
    </Card>
  )
}

// ── Past Goal Card ─────────────────────────────────────────────────────────
function PastGoalCard({ g, onDelete }) {
  const isSuccess = g.succeeded
  const bgColor   = isSuccess ? '#F0FDF4' : '#FFF7F7'
  const bdColor   = isSuccess ? C.freshGreen + '66' : '#FCA5A566'
  const badge     = isSuccess ? '🏆 Completed' : '❌ Missed'
  const badgeBg   = isSuccess ? C.deepGreen : '#EF4444'

  return (
    <Card style={{ background: bgColor, border: `1.5px solid ${bdColor}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <div>
          {/* Badge */}
          <div style={{
            display: 'inline-block',
            background: badgeBg, color: '#fff',
            fontSize: 11, fontWeight: 700,
            padding: '3px 12px', borderRadius: 20, marginBottom: 8,
          }}>{badge}</div>

          <div style={{ fontWeight: 700, fontSize: 15, color: C.text, marginBottom: 4 }}>{g.name}</div>
          <div style={{ fontSize: 12, color: C.textMuted }}>
            📂 {g.category} &nbsp;·&nbsp;
            📅 {new Date(g.startDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })} → {new Date(g.endDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
          </div>
        </div>
        <button onClick={() => onDelete(g.goalId)} style={delBtn}>🗑️</button>
      </div>

      {/* Stats row */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 12, flexWrap: 'wrap' }}>
        <div style={statBox}>
          <div style={{ fontSize: 11, color: C.textMuted }}>Target</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: C.text }}>{g.targetKgCO2} kg</div>
        </div>
        <div style={statBox}>
          <div style={{ fontSize: 11, color: C.textMuted }}>Actual</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: isSuccess ? C.deepGreen : '#EF4444' }}>{g.totalEmissions} kg</div>
        </div>
        <div style={statBox}>
          <div style={{ fontSize: 11, color: C.textMuted }}>{isSuccess ? 'Saved' : 'Over by'}</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: isSuccess ? C.deepGreen : '#EF4444' }}>
            {isSuccess
              ? `${parseFloat((g.targetKgCO2 - g.totalEmissions).toFixed(2))} kg`
              : `${parseFloat((g.totalEmissions - g.targetKgCO2).toFixed(2))} kg`}
          </div>
        </div>
        <div style={statBox}>
          <div style={{ fontSize: 11, color: C.textMuted }}>Progress</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: C.text }}>{g.progressPercent}%</div>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: 8, background: '#E5E7EB', borderRadius: 4, overflow: 'hidden', marginBottom: 10 }}>
        <div style={{
          height: '100%',
          width: `${g.progressPercent}%`,
          background: isSuccess
            ? `linear-gradient(90deg, ${C.deepGreen}, ${C.freshGreen})`
            : `linear-gradient(90deg, #F87171, #EF4444)`,
          borderRadius: 4,
        }} />
      </div>

      {/* Message */}
      <div style={{
        fontSize: 13, fontWeight: 500,
        color: isSuccess ? C.deepGreen : '#B91C1C',
        padding: '8px 12px',
        background: isSuccess ? '#DCFCE7' : '#FEE2E2',
        borderRadius: 8,
      }}>{g.message}</div>
    </Card>
  )
}

const delBtn = {
  background: 'none', border: '1px solid #FCA5A5',
  borderRadius: 6, padding: '4px 8px',
  cursor: 'pointer', fontSize: 12, color: '#EF4444',
  fontFamily: "'Poppins', sans-serif",
}

const statBox = {
  background: 'rgba(255,255,255,0.7)',
  borderRadius: 8, padding: '8px 14px',
  minWidth: 80,
}
