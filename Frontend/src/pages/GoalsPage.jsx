import { useState } from 'react'
import { C } from '../constants/colors'
import { goalsData } from '../constants/mockData'
import Card from '../components/ui/Card'
import Btn from '../components/ui/Btn'

const STATUS_COLORS = {
  'On Track':  C.freshGreen,
  'Ahead':     C.deepGreen,
  'Needs Work': '#F59E0B',
  'Behind':    '#EF4444',
}

export default function GoalsPage() {
  const [goals, setGoals] = useState(goalsData)
  const [showForm, setShowForm] = useState(false)

  return (
    <div style={{ maxWidth: 800, display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 17, color: C.text }}>Your Carbon Goals</div>
          <div style={{ fontSize: 13, color: C.textMuted, marginTop: 2 }}>
            {goals.length} active goals
          </div>
        </div>
        <Btn onClick={() => setShowForm(!showForm)}>+ Create New Goal</Btn>
      </div>

      {/* New goal form */}
      {showForm && (
        <Card style={{ border: `2px solid ${C.freshGreen}` }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: C.text, marginBottom: 16 }}>
            New Goal
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              ['Goal Title', 'text', 'e.g. Reduce emissions by 15%'],
              ['Category', 'select', null],
              ['Target Deadline', 'date', null],
              ['Target Reduction (%)', 'number', 'e.g. 20'],
            ].map(([label, type, placeholder]) => (
              <div key={label}>
                <label style={{ fontSize: 13, color: C.textMuted, fontWeight: 500 }}>{label}</label>
                {type === 'select' ? (
                  <select style={{ width: '100%', padding: '10px 14px', border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 14, background: C.bg, outline: 'none', marginTop: 6, fontFamily: "'Poppins', sans-serif" }}>
                    <option>Overall</option>
                    <option>Transport</option>
                    <option>Food</option>
                    <option>Energy</option>
                    <option>Waste</option>
                  </select>
                ) : (
                  <input type={type} placeholder={placeholder} style={{ width: '100%', padding: '10px 14px', border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 14, background: C.bg, outline: 'none', marginTop: 6, boxSizing: 'border-box', fontFamily: "'Poppins', sans-serif" }} />
                )}
              </div>
            ))}
            <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
              <Btn onClick={() => setShowForm(false)}>Save Goal</Btn>
              <Btn onClick={() => setShowForm(false)} variant="ghost">Cancel</Btn>
            </div>
          </div>
        </Card>
      )}

      {/* Goal cards */}
      {goals.map((g, i) => (
        <Card key={i}>
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'flex-start', marginBottom: 18,
          }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, color: C.text, marginBottom: 4 }}>
                {g.title}
              </div>
              <div style={{ fontSize: 12, color: C.textMuted }}>
                📂 {g.category} &nbsp;·&nbsp; 📅 Deadline: {g.deadline}
              </div>
            </div>
            <span style={{
              background: (STATUS_COLORS[g.status] || C.textMuted) + '22',
              color: STATUS_COLORS[g.status] || C.textMuted,
              fontSize: 12, fontWeight: 600,
              padding: '5px 14px', borderRadius: 20, flexShrink: 0,
            }}>{g.status}</span>
          </div>

          {/* Progress bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
            <div style={{ flex: 1, height: 10, background: C.bg, borderRadius: 5, overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${g.progress}%`,
                background: `linear-gradient(90deg, ${C.deepGreen}, ${C.freshGreen})`,
                borderRadius: 5,
                transition: 'width 0.6s ease',
              }} />
            </div>
            <span style={{ fontSize: 16, fontWeight: 700, color: C.deepGreen, minWidth: 46, textAlign: 'right' }}>
              {g.progress}%
            </span>
          </div>

          {/* Milestone hints */}
          <div style={{ display: 'flex', gap: 8 }}>
            <Btn variant="outline" style={{ fontSize: 12, padding: '6px 14px' }}>📊 View Details</Btn>
            <Btn variant="ghost" style={{ fontSize: 12, padding: '6px 14px' }}>✏️ Edit Goal</Btn>
          </div>
        </Card>
      ))}
    </div>
  )
}
