import { useState, useEffect, useCallback } from 'react'
import { useLocation } from 'react-router-dom'
import { C } from '../constants/colors'
import Card from '../components/ui/Card'
import Btn from '../components/ui/Btn'
import { getActivities, deleteActivity, updateActivity } from '../services/api'

const TAG_COLORS = {
  transport: C.deepGreen,
  food:      C.freshGreen,
  energy:    '#F59E0B',
  waste:     '#6B7280',
  shopping:  '#8B5CF6',
}

const RANGES = [
  { value: 'all',   label: 'All Time'   },
  { value: 'today', label: 'Today'      },
  { value: 'week',  label: 'This Week'  },
  { value: 'month', label: 'This Month' },
]

function formatDetails(type, data) {
  if (!data) return '—'
  if (type === 'transport') return `${data.mode || 'Vehicle'} – ${data.distance || 0} km`
  if (type === 'food')      return `${data.meal || 'Meal'} × ${data.servings || data.quantity || 1}`
  if (type === 'energy')    return `${data.appliance || 'Appliance'} – ${data.hours || 0} hrs`
  if (type === 'waste')     return `${data.wasteType || 'Waste'} – ${data.kgWaste || data.weight || 0} kg`
  return JSON.stringify(data)
}

const todayStr = () => new Date().toISOString().split('T')[0]

export default function ActivityHistoryPage() {
  const [data,     setData]     = useState([])
  const [filter,   setFilter]   = useState('All')
  const [range,    setRange]    = useState('all')
  const location   = useLocation()
  const [search,   setSearch]   = useState(location.state?.search || '')
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState('')
  const [editItem, setEditItem] = useState(null)

  // Sync search query sent from Navbar
  useEffect(() => {
    if (location.state?.search) {
      setSearch(location.state.search)
    }
  }, [location.state])

  const load = useCallback(async () => {
    setLoading(true); setError('')
    try {
      // Pass search to backend too for server-side filtering
      const res = await getActivities(filter, range, search)
      setData(res)
    } catch {
      setError('Failed to load activities.')
    } finally {
      setLoading(false)
    }
  }, [filter, range, search])

  useEffect(() => {
    // Debounce search by 350ms to avoid hammering the API on every keystroke
    const timer = setTimeout(() => { load() }, search ? 350 : 0)
    return () => clearTimeout(timer)
  }, [load, search])

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this activity?')) return
    try {
      await deleteActivity(id)
      setData(prev => prev.filter(d => d._id !== id))
    } catch {
      alert('Failed to delete.')
    }
  }

  const handleExportCSV = () => {
    const header = 'Date,Type,Details,CO2 (kg)'
    const rows = data.map(row =>
      `${new Date(row.date).toLocaleDateString()},${row.type},"${formatDetails(row.type, row.data)}",${row.co2Emissions}`
    )
    const blob = new Blob([[header, ...rows].join('\n')], { type: 'text/csv' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a'); a.href = url; a.download = 'activity-history.csv'; a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', width: '100%' }}>
      {editItem && (
        <EditModal
          item={editItem}
          onClose={() => setEditItem(null)}
          onSaved={(updated) => {
            setData(prev => prev.map(d => d._id === updated._id ? updated : d))
            setEditItem(null)
          }}
        />
      )}

      <Card>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 17, color: C.text }}>Activity History</div>
            <div style={{ fontSize: 13, color: C.textMuted, marginTop: 2 }}>
              {loading ? 'Loading…' : `${data.length} records found`}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <select value={filter} onChange={e => setFilter(e.target.value)} style={selStyle}>
              {['All', 'transport', 'food', 'energy', 'waste'].map(f => (
                <option key={f} value={f}>{f.charAt(0).toUpperCase() + f.slice(1)}</option>
              ))}
            </select>
            <select value={range} onChange={e => setRange(e.target.value)} style={selStyle}>
              {RANGES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
            </select>
            <Btn variant="outline" style={{ padding: '8px 16px', fontSize: 13 }} onClick={handleExportCSV}>
              📥 Export CSV
            </Btn>
          </div>
        </div>

        {/* Search bar */}
        <div style={{ position: 'relative', marginBottom: 18 }}>
          <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 14, pointerEvents: 'none' }}>🔍</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by type, mode, meal… (e.g. 'bus', 'beef', 'car')"
            style={{
              ...selStyle,
              width: '100%', boxSizing: 'border-box',
              paddingLeft: 36, paddingTop: 10, paddingBottom: 10,
              fontSize: 13,
            }}
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: C.textMuted }}
            >✕</button>
          )}
        </div>

        {error && <div style={{ color: '#EF4444', fontSize: 13, marginBottom: 12 }}>{error}</div>}

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: C.bg }}>
                {['Date', 'Activity Type', 'Details', 'CO₂ Emission', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 12, color: C.textMuted, fontWeight: 600, borderBottom: `1px solid ${C.border}`, whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} style={{ padding: 40, textAlign: 'center', color: C.textMuted, fontSize: 14 }}>Loading…</td></tr>
              ) : data.length === 0 ? (
                <tr><td colSpan={5} style={{ padding: 40, textAlign: 'center', color: C.textMuted, fontSize: 14 }}>
                  {search ? `No activities match "${search}"` : 'No records found.'}
                </td></tr>
              ) : data.map((row) => (
                <tr key={row._id} style={{ borderBottom: `1px solid ${C.border}` }}
                  onMouseEnter={e => e.currentTarget.style.background = C.bg}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '13px 14px', fontSize: 13, color: C.textMuted, whiteSpace: 'nowrap' }}>
                    {new Date(row.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </td>
                  <td style={{ padding: '13px 14px' }}>
                    <span style={{
                      background: (TAG_COLORS[row.type] || C.textMuted) + '22',
                      color: TAG_COLORS[row.type] || C.textMuted,
                      fontSize: 12, fontWeight: 600, padding: '3px 10px', borderRadius: 20,
                    }}>{row.type}</span>
                  </td>
                  <td style={{ padding: '13px 14px', fontSize: 13, color: C.text }}>{formatDetails(row.type, row.data)}</td>
                  <td style={{ padding: '13px 14px', fontSize: 14, fontWeight: 700, color: C.deepGreen }}>
                    {row.co2Emissions} kg
                  </td>
                  <td style={{ padding: '13px 14px' }}>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => setEditItem(row)} style={actionBtn}>✏️ Edit</button>
                      <button onClick={() => handleDelete(row._id)} style={{ ...actionBtn, border: '1px solid #FCA5A5', color: '#EF4444' }}>🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

// ── Full Edit Modal — supports all activity types + date ──────────────────────
function EditModal({ item, onClose, onSaved }) {
  const [form,   setForm]   = useState({ ...item.data })
  const [date,   setDate]   = useState(item.date ? new Date(item.date).toISOString().split('T')[0] : todayStr())
  const [saving, setSaving] = useState(false)
  const [error,  setError]  = useState('')

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSave = async () => {
    setSaving(true); setError('')
    try {
      const updated = await updateActivity(item._id, {
        type: item.type,
        data: form,
        date: date,
      })
      onSaved(updated)
    } catch (err) {
      setError(err.response?.data?.message || 'Save failed. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ background: C.card, borderRadius: 14, padding: 32, width: '100%', maxWidth: 420, boxShadow: '0 8px 40px rgba(0,0,0,0.18)', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ fontWeight: 700, fontSize: 16, color: C.text, marginBottom: 4 }}>Edit Activity</div>
        <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 20, textTransform: 'capitalize' }}>{item.type}</div>

        {/* Date */}
        <label style={modalLbl}>📅 Activity Date</label>
        <input type="date" value={date} max={todayStr()} onChange={e => setDate(e.target.value)} style={modalInp} />

        {/* Transport fields */}
        {item.type === 'transport' && <>
          <label style={modalLbl}>Transport Mode</label>
          <select name="mode" value={form.mode || ''} onChange={handleChange} style={modalInp}>
            <option value="car">Car (petrol)</option>
            <option value="car-electric">Car (electric)</option>
            <option value="bus">Bus</option>
            <option value="train">Train</option>
            <option value="motorcycle">Motorcycle</option>
            <option value="flight-short">Flight (short-haul)</option>
            <option value="flight-long">Flight (long-haul)</option>
            <option value="bike">Bicycle</option>
          </select>
          <label style={modalLbl}>Distance (km)</label>
          <input type="number" name="distance" value={form.distance || ''} onChange={handleChange} min="0" style={modalInp} />
          <label style={modalLbl}>Passengers</label>
          <input type="number" name="passengers" value={form.passengers || ''} onChange={handleChange} min="1" style={modalInp} />
        </>}

        {/* Food fields */}
        {item.type === 'food' && <>
          <label style={modalLbl}>Meal Type</label>
          <select name="meal" value={form.meal || ''} onChange={handleChange} style={modalInp}>
            <option value="vegetarian">Vegetarian</option>
            <option value="vegan">Vegan</option>
            <option value="chicken">Chicken</option>
            <option value="beef">Beef</option>
            <option value="fish">Fish / Seafood</option>
            <option value="pork">Pork</option>
          </select>
          <label style={modalLbl}>Servings</label>
          <input type="number" name="servings" value={form.servings || ''} onChange={handleChange} min="1" style={modalInp} />
        </>}

        {/* Energy fields */}
        {item.type === 'energy' && <>
          <label style={modalLbl}>Appliance</label>
          <select name="appliance" value={form.appliance || ''} onChange={handleChange} style={modalInp}>
            <option value="Air Conditioner">Air Conditioner</option>
            <option value="Heating System">Heating System</option>
            <option value="Washing Machine">Washing Machine</option>
            <option value="Refrigerator">Refrigerator</option>
            <option value="Dishwasher">Dishwasher</option>
            <option value="Oven / Stove">Oven / Stove</option>
            <option value="Other">Other</option>
          </select>
          <label style={modalLbl}>Duration (hours)</label>
          <input type="number" name="hours" value={form.hours || ''} onChange={handleChange} min="0" style={modalInp} />
          <label style={modalLbl}>kWh</label>
          <input type="number" name="kwh" value={form.kwh || ''} onChange={handleChange} min="0" style={modalInp} />
          <label style={modalLbl}>Renewable?</label>
          <select name="renewable" value={form.renewable || ''} onChange={handleChange} style={modalInp}>
            <option value="No">No</option>
            <option value="Partial">Partial</option>
            <option value="Yes – 100% renewable">Yes – 100% renewable</option>
          </select>
        </>}

        {/* Waste fields */}
        {item.type === 'waste' && <>
          <label style={modalLbl}>Waste Type</label>
          <select name="wasteType" value={form.wasteType || ''} onChange={handleChange} style={modalInp}>
            <option value="General Waste">General Waste</option>
            <option value="Recycled">Recycled (paper / plastic)</option>
            <option value="Organic">Organic / Composted</option>
            <option value="Electronic">Electronic Waste</option>
            <option value="Glass">Glass</option>
          </select>
          <label style={modalLbl}>Weight (kg)</label>
          <input type="number" name="kgWaste" value={form.kgWaste || ''} onChange={handleChange} min="0" style={modalInp} />
          <label style={modalLbl}>Disposal Method</label>
          <select name="disposal" value={form.disposal || ''} onChange={handleChange} style={modalInp}>
            <option value="Landfill">Landfill</option>
            <option value="Recycling Centre">Recycling Centre</option>
            <option value="Composting">Composting</option>
            <option value="Incineration">Incineration</option>
          </select>
        </>}

        {error && <div style={{ color: '#EF4444', fontSize: 13, marginTop: 8, marginBottom: 4 }}>{error}</div>}

        <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
          <Btn onClick={handleSave} disabled={saving}>{saving ? 'Saving…' : 'Save Changes'}</Btn>
          <Btn variant="ghost" onClick={onClose}>Cancel</Btn>
        </div>
      </div>
    </div>
  )
}

const selStyle = {
  padding: '8px 12px', border: `1px solid ${C.border}`,
  borderRadius: 8, fontSize: 13, color: C.text,
  background: C.bg, fontFamily: "'Poppins', sans-serif", outline: 'none',
}
const actionBtn = {
  background: 'none', border: `1px solid ${C.border}`,
  borderRadius: 6, padding: '4px 10px',
  cursor: 'pointer', fontSize: 12, color: C.textMuted,
  fontFamily: "'Poppins', sans-serif",
}
const modalLbl = { fontSize: 13, color: C.textMuted, fontWeight: 500, display: 'block', marginBottom: 4, marginTop: 14 }
const modalInp = {
  width: '100%', padding: '9px 12px', border: `1px solid ${C.border}`,
  borderRadius: 8, fontSize: 14, outline: 'none',
  background: C.bg, boxSizing: 'border-box',
  fontFamily: "'Poppins', sans-serif", color: C.text,
}
