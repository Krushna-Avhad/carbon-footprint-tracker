import { useState, useEffect } from 'react'
import { C } from '../constants/colors'
import Card from '../components/ui/Card'
import Btn from '../components/ui/Btn'
import { createGoal, getGoalProgress, deleteGoal } from '../services/api'

const STATUS_COLORS = {
  'On Track':  C.freshGreen,
  'Ahead':     C.deepGreen,
  'Needs Work':'#F59E0B',
  'Behind':    '#EF4444',
}

const inp = {
  width: '100%', padding: '10px 14px', border: `1px solid ${C.border}`,
  borderRadius: 8, fontSize: 14, background: C.bg, outline: 'none',
  marginTop: 6, boxSizing: 'border-box', fontFamily: "'Poppins', sans-serif", color: C.text,
}

const EMPTY_FORM = { name: '', category: 'overall', targetKgCO2: '', endDate: '' }

export default function GoalsPage() {
  const [goals,    setGoals]    = useState([])
  const [loading,  setLoading]  = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form,     setForm]     = useState(EMPTY_FORM)
  const [saving,   setSaving]   = useState(false)
  const [error,    setError]    = useState('')

  const load = async () => {
    setLoading(true)
    try {
      const data = await getGoalProgress()
      setGoals(data)
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
      setGoals(prev => prev.filter(g => g.goalId !== goalId))
    } catch { alert('Failed to delete.') }
  }

  return (
    <div style={{ maxWidth: 800, display: 'flex', flexDirection: 'column', gap: 20, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 17, color: C.text }}>Your Carbon Goals</div>
          <div style={{ fontSize: 13, color: C.textMuted, marginTop: 2 }}>
            {loading ? 'Loading…' : `${goals.length} active goals`}
          </div>
        </div>
        <Btn onClick={() => { setShowForm(!showForm); setError('') }}>+ Create New Goal</Btn>
      </div>

      {error && <div style={{ padding: '10px 14px', background: '#FEF2F2', borderRadius: 8, color: '#EF4444', fontSize: 13 }}>{error}</div>}

      {showForm && (
        <Card style={{ border: `2px solid ${C.freshGreen}` }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: C.text, marginBottom: 16 }}>New Goal</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

            <div>
              <label style={lbl}>Goal Title</label>
              <input style={inp} name="name" value={form.name} onChange={handleChange} placeholder="e.g. Reduce emissions by 15%" />
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

      {loading ? (
        <Card><div style={{ textAlign: 'center', color: C.textMuted, padding: 32 }}>Loading goals…</div></Card>
      ) : goals.length === 0 ? (
        <Card style={{ textAlign: 'center', padding: 48 }}>
          <div style={{ fontSize: 44, marginBottom: 12 }}>🎯</div>
          <div style={{ color: C.textMuted, fontSize: 14 }}>No goals yet. Create your first carbon goal!</div>
        </Card>
      ) : goals.map((g) => (
        <Card key={g.goalId}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, color: C.text, marginBottom: 4 }}>{g.name}</div>
              <div style={{ fontSize: 12, color: C.textMuted }}>
                📂 {g.category} &nbsp;·&nbsp; 📅 Deadline: {new Date(g.endDate).toLocaleDateString()} &nbsp;·&nbsp; ⏳ {g.daysLeft} days left
              </div>
              <div style={{ fontSize: 12, color: C.textMuted, marginTop: 4 }}>
                {g.totalEmissions} kg emitted / {g.targetKgCO2} kg target
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <span style={{
                background: (STATUS_COLORS[g.status] || C.textMuted) + '22',
                color: STATUS_COLORS[g.status] || C.textMuted,
                fontSize: 12, fontWeight: 600, padding: '5px 14px', borderRadius: 20,
              }}>{g.status}</span>
              <button onClick={() => handleDelete(g.goalId)} style={{
                background: 'none', border: '1px solid #FCA5A5', borderRadius: 6,
                padding: '4px 8px', cursor: 'pointer', fontSize: 12, color: '#EF4444',
                fontFamily: "'Poppins', sans-serif",
              }}>🗑️</button>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
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
          <div style={{ fontSize: 11, color: C.textMuted, marginTop: 6 }}>
            {g.progressPercent < 50 ? '✅ Well under target — great work!' : g.progressPercent < 90 ? '⚠️ Approaching your limit' : '🔴 Near or over limit'}
          </div>
        </Card>
      ))}
    </div>
  )
}

const lbl = { fontSize: 13, color: C.textMuted, fontWeight: 500 }
