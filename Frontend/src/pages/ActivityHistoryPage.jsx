import { useState } from 'react'
import { C } from '../constants/colors'
import { historyData } from '../constants/mockData'
import Card from '../components/ui/Card'
import Btn from '../components/ui/Btn'

const TAG_COLORS = {
  Transport: C.deepGreen,
  Food:      C.freshGreen,
  Energy:    '#F59E0B',
  Waste:     '#6B7280',
}

export default function ActivityHistoryPage() {
  const [filter, setFilter] = useState('All')
  const [data, setData] = useState(historyData)

  const filtered = filter === 'All' ? data : data.filter(d => d.type === filter)

  const handleDelete = (index) => {
    setData(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <div style={{ maxWidth: 1100 }}>
      <Card>
        {/* Header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12,
        }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 17, color: C.text }}>Activity History</div>
            <div style={{ fontSize: 13, color: C.textMuted, marginTop: 2 }}>
              {filtered.length} records found
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <select
              value={filter}
              onChange={e => setFilter(e.target.value)}
              style={{
                padding: '8px 12px', border: `1px solid ${C.border}`,
                borderRadius: 8, fontSize: 13, color: C.text,
                background: C.bg, fontFamily: "'Poppins', sans-serif", outline: 'none',
              }}
            >
              {['All', 'Transport', 'Food', 'Energy', 'Waste'].map(f => (
                <option key={f}>{f}</option>
              ))}
            </select>
            <Btn variant="outline" style={{ padding: '8px 16px', fontSize: 13 }}>
              📥 Export CSV
            </Btn>
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: C.bg }}>
                {['Date', 'Activity Type', 'Details', 'CO₂ Emission', 'Actions'].map(h => (
                  <th key={h} style={{
                    padding: '10px 14px', textAlign: 'left',
                    fontSize: 12, color: C.textMuted, fontWeight: 600,
                    borderBottom: `1px solid ${C.border}`,
                    whiteSpace: 'nowrap',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: 40, textAlign: 'center', color: C.textMuted, fontSize: 14 }}>
                    No records found.
                  </td>
                </tr>
              ) : filtered.map((row, i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${C.border}` }}
                  onMouseEnter={e => e.currentTarget.style.background = C.bg}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '13px 14px', fontSize: 13, color: C.textMuted, whiteSpace: 'nowrap' }}>
                    {row.date}
                  </td>
                  <td style={{ padding: '13px 14px' }}>
                    <span style={{
                      background: (TAG_COLORS[row.type] || C.textMuted) + '22',
                      color: TAG_COLORS[row.type] || C.textMuted,
                      fontSize: 12, fontWeight: 600,
                      padding: '3px 10px', borderRadius: 20,
                    }}>{row.type}</span>
                  </td>
                  <td style={{ padding: '13px 14px', fontSize: 13, color: C.text }}>{row.details}</td>
                  <td style={{ padding: '13px 14px', fontSize: 14, fontWeight: 700, color: C.deepGreen }}>
                    {row.co2}
                  </td>
                  <td style={{ padding: '13px 14px' }}>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button style={{
                        background: 'none', border: `1px solid ${C.border}`,
                        borderRadius: 6, padding: '4px 10px',
                        cursor: 'pointer', fontSize: 12, color: C.textMuted,
                        fontFamily: "'Poppins', sans-serif",
                      }}>✏️ Edit</button>
                      <button
                        onClick={() => handleDelete(i)}
                        style={{
                          background: 'none', border: '1px solid #FCA5A5',
                          borderRadius: 6, padding: '4px 10px',
                          cursor: 'pointer', fontSize: 12, color: '#EF4444',
                          fontFamily: "'Poppins', sans-serif",
                        }}
                      >🗑️</button>
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
