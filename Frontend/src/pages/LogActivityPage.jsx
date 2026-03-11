import { useState } from 'react'
import { C } from '../constants/colors'
import Card from '../components/ui/Card'
import Btn from '../components/ui/Btn'

const TABS = [
  { id: 'transport', label: '🚗 Transport' },
  { id: 'food',      label: '🍽️ Food'      },
  { id: 'energy',    label: '⚡ Energy'    },
  { id: 'waste',     label: '🗑️ Waste'     },
]

const inp = {
  width: '100%',
  padding: '10px 14px',
  border: `1px solid ${C.border}`,
  borderRadius: 8,
  fontSize: 14,
  color: C.text,
  background: C.bg,
  outline: 'none',
  boxSizing: 'border-box',
  fontFamily: "'Poppins', sans-serif",
  marginTop: 6,
}

const lbl = { fontSize: 13, color: C.textMuted, fontWeight: 500 }

function Field({ label, children }) {
  return <div><label style={lbl}>{label}</label>{children}</div>
}

function TransportForm() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <Field label="Transport Type">
        <select style={inp}>
          <option>Car (petrol)</option>
          <option>Car (electric)</option>
          <option>Bus</option>
          <option>Train</option>
          <option>Motorcycle</option>
          <option>Flight (short-haul)</option>
          <option>Flight (long-haul)</option>
        </select>
      </Field>
      <Field label="Distance (km)">
        <input type="number" placeholder="e.g. 25" min="0" style={inp} />
      </Field>
      <Field label="Number of Passengers">
        <input type="number" placeholder="e.g. 1" min="1" style={inp} />
      </Field>
      <Field label="Date">
        <input type="date" style={inp} defaultValue={new Date().toISOString().split('T')[0]} />
      </Field>
    </div>
  )
}

function FoodForm() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <Field label="Meal Type">
        <select style={inp}>
          <option>Vegetarian</option>
          <option>Vegan</option>
          <option>Chicken</option>
          <option>Beef</option>
          <option>Fish / Seafood</option>
          <option>Pork</option>
        </select>
      </Field>
      <Field label="Number of Servings">
        <input type="number" placeholder="e.g. 2" min="1" style={inp} />
      </Field>
      <Field label="Locally Sourced?">
        <select style={inp}>
          <option>Yes</option>
          <option>No</option>
          <option>Unknown</option>
        </select>
      </Field>
    </div>
  )
}

function EnergyForm() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <Field label="Appliance Type">
        <select style={inp}>
          <option>Air Conditioner</option>
          <option>Heating System</option>
          <option>Washing Machine</option>
          <option>Refrigerator</option>
          <option>Dishwasher</option>
          <option>Oven / Stove</option>
          <option>Other</option>
        </select>
      </Field>
      <Field label="Electricity Units (kWh)">
        <input type="number" placeholder="e.g. 5" min="0" style={inp} />
      </Field>
      <Field label="Duration (hours)">
        <input type="number" placeholder="e.g. 3" min="0" style={inp} />
      </Field>
      <Field label="Renewable Energy Source?">
        <select style={inp}>
          <option>No</option>
          <option>Partial</option>
          <option>Yes – 100% renewable</option>
        </select>
      </Field>
    </div>
  )
}

function WasteForm() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <Field label="Waste Type">
        <select style={inp}>
          <option>General Waste</option>
          <option>Recycled (paper / plastic)</option>
          <option>Organic / Composted</option>
          <option>Electronic Waste</option>
          <option>Glass</option>
        </select>
      </Field>
      <Field label="Weight (kg)">
        <input type="number" placeholder="e.g. 2" min="0" style={inp} />
      </Field>
      <Field label="Disposal Method">
        <select style={inp}>
          <option>Landfill</option>
          <option>Recycling Centre</option>
          <option>Composting</option>
          <option>Incineration</option>
        </select>
      </Field>
    </div>
  )
}

const FORM_MAP = {
  transport: TransportForm,
  food:      FoodForm,
  energy:    EnergyForm,
  waste:     WasteForm,
}

const CO2_ESTIMATE = {
  transport: '~3.2 kg CO₂',
  food:      '~2.8 kg CO₂',
  energy:    '~1.5 kg CO₂',
  waste:     '~0.9 kg CO₂',
}

export default function LogActivityPage() {
  const [tab, setTab] = useState('transport')
  const [submitted, setSubmitted] = useState(false)
  const FormComponent = FORM_MAP[tab]

  if (submitted) {
    return (
      <Card style={{ maxWidth: 520, textAlign: 'center', padding: 48 }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>✅</div>
        <div style={{ fontWeight: 700, fontSize: 20, color: C.text, marginBottom: 8 }}>Activity Logged!</div>
        <div style={{ fontSize: 14, color: C.textMuted, marginBottom: 28 }}>
          Your carbon footprint has been updated. Keep up the great work!
        </div>
        <Btn onClick={() => setSubmitted(false)}>Log Another Activity</Btn>
      </Card>
    )
  }

  return (
    <Card style={{ maxWidth: 620 }}>
      <div style={{ fontWeight: 700, fontSize: 17, color: C.text, marginBottom: 6 }}>
        Log Your Activity
      </div>
      <div style={{ fontSize: 13, color: C.textMuted, marginBottom: 22 }}>
        Track your daily activities to calculate your carbon footprint.
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 28, flexWrap: 'wrap' }}>
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              padding: '8px 18px',
              borderRadius: 8,
              fontSize: 13,
              cursor: 'pointer',
              border: `1.5px solid ${tab === t.id ? C.deepGreen : C.border}`,
              background: tab === t.id ? C.deepGreen : C.card,
              color: tab === t.id ? '#fff' : C.textMuted,
              fontWeight: tab === t.id ? 600 : 400,
              fontFamily: "'Poppins', sans-serif",
              transition: 'all 0.15s',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Dynamic form */}
      <FormComponent />

      {/* Notes */}
      <div style={{ marginTop: 18 }}>
        <label style={lbl}>Notes (optional)</label>
        <textarea
          placeholder="Any additional context…"
          rows={2}
          style={{ ...inp, resize: 'vertical' }}
        />
      </div>

      {/* CO2 estimate + submit */}
      <div style={{
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 28, padding: '16px 18px',
        background: C.bg, borderRadius: 10,
      }}>
        <div>
          <div style={{ fontSize: 12, color: C.textMuted }}>Estimated CO₂ Emission</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: C.deepGreen }}>{CO2_ESTIMATE[tab]}</div>
        </div>
        <Btn onClick={() => setSubmitted(true)}>Log Activity ✓</Btn>
      </div>
    </Card>
  )
}
