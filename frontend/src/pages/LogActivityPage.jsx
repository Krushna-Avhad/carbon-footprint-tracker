import { useState } from 'react'
import { C } from '../constants/colors'
import Card from '../components/ui/Card'
import Btn from '../components/ui/Btn'
import { logActivity } from '../services/api'

const TABS = [
  { id: 'transport', label: '🚗 Transport' },
  { id: 'food',      label: '🍽️ Food'      },
  { id: 'energy',    label: '⚡ Energy'    },
  { id: 'waste',     label: '🗑️ Waste'     },
]

const inp = {
  width: '100%', padding: '10px 14px',
  border: `1px solid ${C.border}`, borderRadius: 8,
  fontSize: 14, color: C.text, background: C.bg,
  outline: 'none', boxSizing: 'border-box',
  fontFamily: "'Poppins', sans-serif", marginTop: 6,
}
const lbl = { fontSize: 13, color: C.textMuted, fontWeight: 500 }

function Field({ label, children }) {
  return <div><label style={lbl}>{label}</label>{children}</div>
}

function TransportForm({ form, onChange }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <Field label="Transport Type">
        <select style={inp} name="mode" value={form.mode || ''} onChange={onChange}>
          <option value="car">Car (petrol)</option>
          <option value="car-electric">Car (electric)</option>
          <option value="bus">Bus</option>
          <option value="train">Train</option>
          <option value="motorcycle">Motorcycle</option>
          <option value="flight-short">Flight (short-haul)</option>
          <option value="flight-long">Flight (long-haul)</option>
          <option value="bike">Bicycle</option>
        </select>
      </Field>
      <Field label="Distance (km)">
        <input type="number" style={inp} name="distance" value={form.distance || ''} onChange={onChange} placeholder="e.g. 25" min="0" />
      </Field>
      <Field label="Number of Passengers">
        <input type="number" style={inp} name="passengers" value={form.passengers || ''} onChange={onChange} placeholder="e.g. 1" min="1" />
      </Field>
    </div>
  )
}

function FoodForm({ form, onChange }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <Field label="Meal Type">
        <select style={inp} name="meal" value={form.meal || ''} onChange={onChange}>
          <option value="vegetarian">Vegetarian</option>
          <option value="vegan">Vegan</option>
          <option value="chicken">Chicken</option>
          <option value="beef">Beef</option>
          <option value="fish">Fish / Seafood</option>
          <option value="pork">Pork</option>
        </select>
      </Field>
      <Field label="Number of Servings">
        <input type="number" style={inp} name="servings" value={form.servings || ''} onChange={onChange} placeholder="e.g. 2" min="1" />
      </Field>
      <Field label="Locally Sourced?">
        <select style={inp} name="locallySourced" value={form.locallySourced || ''} onChange={onChange}>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
          <option value="Unknown">Unknown</option>
        </select>
      </Field>
    </div>
  )
}

function EnergyForm({ form, onChange }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <Field label="Appliance Type">
        <select style={inp} name="appliance" value={form.appliance || ''} onChange={onChange}>
          <option value="Air Conditioner">Air Conditioner</option>
          <option value="Heating System">Heating System</option>
          <option value="Washing Machine">Washing Machine</option>
          <option value="Refrigerator">Refrigerator</option>
          <option value="Dishwasher">Dishwasher</option>
          <option value="Oven / Stove">Oven / Stove</option>
          <option value="Other">Other</option>
        </select>
      </Field>
      <Field label="Electricity Units (kWh)">
        <input type="number" style={inp} name="kwh" value={form.kwh || ''} onChange={onChange} placeholder="e.g. 5" min="0" />
      </Field>
      <Field label="Duration (hours)">
        <input type="number" style={inp} name="hours" value={form.hours || ''} onChange={onChange} placeholder="e.g. 3" min="0" />
      </Field>
      <Field label="Renewable Energy Source?">
        <select style={inp} name="renewable" value={form.renewable || ''} onChange={onChange}>
          <option value="No">No</option>
          <option value="Partial">Partial</option>
          <option value="Yes – 100% renewable">Yes – 100% renewable</option>
        </select>
      </Field>
    </div>
  )
}

function WasteForm({ form, onChange }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <Field label="Waste Type">
        <select style={inp} name="wasteType" value={form.wasteType || ''} onChange={onChange}>
          <option value="General Waste">General Waste</option>
          <option value="Recycled">Recycled (paper / plastic)</option>
          <option value="Organic">Organic / Composted</option>
          <option value="Electronic">Electronic Waste</option>
          <option value="Glass">Glass</option>
        </select>
      </Field>
      <Field label="Weight (kg)">
        <input type="number" style={inp} name="kgWaste" value={form.kgWaste || ''} onChange={onChange} placeholder="e.g. 2" min="0" />
      </Field>
      <Field label="Disposal Method">
        <select style={inp} name="disposal" value={form.disposal || ''} onChange={onChange}>
          <option value="Landfill">Landfill</option>
          <option value="Recycling Centre">Recycling Centre</option>
          <option value="Composting">Composting</option>
          <option value="Incineration">Incineration</option>
        </select>
      </Field>
    </div>
  )
}

const FORM_MAP = { transport: TransportForm, food: FoodForm, energy: EnergyForm, waste: WasteForm }

const DEFAULT_FORM = {
  transport: { mode: 'car',              distance: '',  passengers: '1' },
  food:      { meal: 'vegetarian',       servings: '1', locallySourced: 'Unknown' },
  energy:    { appliance: 'Air Conditioner', kwh: '',   hours: '', renewable: 'No' },
  waste:     { wasteType: 'General Waste',   kgWaste: '', disposal: 'Landfill' },
}

// Today's date in YYYY-MM-DD for the date input default
const todayStr = () => new Date().toISOString().split('T')[0]

export default function LogActivityPage() {
  const [tab,      setTab]      = useState('transport')
  const [formData, setFormData] = useState(DEFAULT_FORM)
  const [date,     setDate]     = useState(todayStr())
  const [notes,    setNotes]    = useState('')
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')
  const [result,   setResult]   = useState(null)

  const currentForm = formData[tab]

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [tab]: { ...prev[tab], [e.target.name]: e.target.value }
    }))
  }

  const handleSubmit = async () => {
    setError('')
    setLoading(true)
    try {
      const payload = {
        type: tab,
        data: { ...currentForm, notes },
        date: date,   // ← send chosen date to backend
      }
      const res = await logActivity(payload)
      setResult(res)
      setFormData(DEFAULT_FORM)
      setNotes('')
      setDate(todayStr())
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to log activity. Try again.')
    } finally {
      setLoading(false)
    }
  }

  if (result) {
    return (
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
      <Card style={{ maxWidth: 520, width: '100%', textAlign: 'center', padding: 48 }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>✅</div>
        <div style={{ fontWeight: 700, fontSize: 20, color: C.text, marginBottom: 8 }}>Activity Logged!</div>
        <div style={{ fontSize: 14, color: C.textMuted, marginBottom: 8 }}>
          Your carbon footprint has been updated. Keep up the great work!
        </div>
        <div style={{ fontSize: 28, fontWeight: 800, color: C.deepGreen, marginBottom: 4 }}>
          {result.co2Emissions} kg CO₂
        </div>
        <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 28 }}>
          Logged for {new Date(result.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
        <Btn onClick={() => setResult(null)}>Log Another Activity</Btn>
      </Card>
      </div>
    )
  }

  const FormComponent = FORM_MAP[tab]

  return (
    <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
    <Card style={{ maxWidth: 620, width: '100%' }}>
      <div style={{ fontWeight: 700, fontSize: 17, color: C.text, marginBottom: 6 }}>
        Log Your Activity
      </div>
      <div style={{ fontSize: 13, color: C.textMuted, marginBottom: 22 }}>
        Track your daily activities to calculate your carbon footprint.
      </div>

      {/* Activity Type Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 28, flexWrap: 'wrap' }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding: '8px 18px', borderRadius: 8, fontSize: 13, cursor: 'pointer',
            border: `1.5px solid ${tab === t.id ? C.deepGreen : C.border}`,
            background: tab === t.id ? C.deepGreen : C.card,
            color: tab === t.id ? '#fff' : C.textMuted,
            fontWeight: tab === t.id ? 600 : 400,
            fontFamily: "'Poppins', sans-serif", transition: 'all 0.15s',
          }}>{t.label}</button>
        ))}
      </div>

      {/* ── Date Picker ── */}
      <div style={{
        marginBottom: 24, padding: '14px 16px',
        background: `${C.deepGreen}0D`,
        border: `1px solid ${C.deepGreen}33`,
        borderRadius: 10,
      }}>
        <label style={{ ...lbl, color: C.deepGreen, fontWeight: 600, display: 'block', marginBottom: 6 }}>
          📅 Activity Date
        </label>
        <input
          type="date"
          value={date}
          max={todayStr()}
          onChange={e => setDate(e.target.value)}
          style={{ ...inp, marginTop: 0, borderColor: C.deepGreen + '44', background: '#fff' }}
        />
        {date !== todayStr() && (
          <div style={{ fontSize: 11, color: C.deepGreen, marginTop: 6, fontWeight: 500 }}>
            📌 Backdating to {new Date(date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </div>
        )}
      </div>

      {/* Dynamic form fields */}
      <FormComponent form={currentForm} onChange={handleChange} />

      {/* Notes */}
      <div style={{ marginTop: 18 }}>
        <label style={lbl}>Notes (optional)</label>
        <textarea
          value={notes} onChange={e => setNotes(e.target.value)}
          placeholder="Any additional context…"
          rows={2} style={{ ...inp, resize: 'vertical' }}
        />
      </div>

      {error && (
        <div style={{ marginTop: 14, padding: '10px 14px', background: '#FEF2F2', borderRadius: 8, color: '#EF4444', fontSize: 13 }}>
          {error}
        </div>
      )}

      {/* Submit */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginTop: 28, paddingTop: 20, borderTop: `1px solid ${C.border}`,
      }}>
        <div style={{ fontSize: 12, color: C.textMuted }}>
          {date === todayStr() ? "Logging for today" : `Logging for ${new Date(date + 'T00:00:00').toLocaleDateString()}`}
        </div>
        <Btn onClick={handleSubmit} disabled={loading}>
          {loading ? 'Logging…' : 'Log Activity ✓'}
        </Btn>
      </div>
    </Card>
    </div> 
  )
}
