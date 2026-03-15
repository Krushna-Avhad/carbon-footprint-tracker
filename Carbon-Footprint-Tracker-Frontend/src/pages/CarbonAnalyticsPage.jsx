import { useState, useEffect } from 'react'
import {
  LineChart, Line, BarChart, Bar, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import { C, PIE_COLORS } from '../constants/colors'
import Card from '../components/ui/Card'
import StatCard from '../components/ui/StatCard'
import { getAnalytics, getMonthlyTrend, getSummary } from '../services/api'

const PERIODS = [
  { value: 'daily',   label: 'Today'      },
  { value: 'weekly',  label: 'This Week'  },
  { value: 'monthly', label: 'This Month' },
]

function pctLabel(val) {
  if (val === null || val === undefined) return '—'
  const sign = val <= 0 ? '↓' : '↑'
  return `${sign} ${Math.abs(val)}% vs previous`
}

export default function CarbonAnalyticsPage() {
  const [period,    setPeriod]    = useState('monthly')
  const [analytics, setAnalytics] = useState(null)
  const [trend,     setTrend]     = useState([])
  const [summary,   setSummary]   = useState(null)
  const [loading,   setLoading]   = useState(true)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const [ana, trd, sum] = await Promise.all([
          getAnalytics(period),
          getMonthlyTrend(),
          getSummary(),
        ])
        setAnalytics(ana)
        setTrend(trd)
        setSummary(sum)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [period])

  // Build bar data from categoryEmissions
  const barData = analytics
    ? Object.entries(analytics.categoryEmissions || {}).map(([cat, val]) => ({
        category: cat.charAt(0).toUpperCase() + cat.slice(1),
        value: parseFloat(val.toFixed(2)),
      }))
    : []

  // Build pie-style breakdown %
  const totalCat = barData.reduce((s, d) => s + d.value, 0)
  const catPercent = barData.map(d => ({
    name:  d.category,
    value: totalCat > 0 ? parseFloat(((d.value / totalCat) * 100).toFixed(1)) : 0,
  }))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 1200, margin: '0 auto', width: '100%' }}>

      {/* Summary Stats */}
      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
        <StatCard icon="📉" label="Today's Emissions"
          value={loading ? '…' : `${summary?.today?.total ?? 0} kg`}
          sub={pctLabel(summary?.today?.vsYesterday)} />
        <StatCard icon="📅" label="Weekly Emissions"
          value={loading ? '…' : `${summary?.weekly?.total ?? 0} kg`}
          sub={pctLabel(summary?.weekly?.vsLastWeek)} />
        <StatCard icon="📆" label="Monthly Emissions"
          value={loading ? '…' : `${summary?.monthly?.total ?? 0} kg`}
          sub={pctLabel(summary?.monthly?.vsLastMonth)} />
        <StatCard icon="📦" label={`Total (${PERIODS.find(p => p.value === period)?.label})`}
          value={loading ? '…' : `${analytics?.totalEmissions ?? 0} kg`}
          sub="Current period" />
      </div>

      {/* Period selector + Line chart */}
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, color: C.text }}>Emission Trends – 6 Months</div>
            <div style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>Monthly CO₂ in kg</div>
          </div>
          <select
            value={period} onChange={e => setPeriod(e.target.value)}
            style={{ padding: '7px 12px', border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 12, color: C.text, background: C.bg, fontFamily: "'Poppins', sans-serif", outline: 'none' }}
          >
            {PERIODS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
          </select>
        </div>
        {loading ? (
          <div style={{ height: 260, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.textMuted }}>Loading chart…</div>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={trend}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: C.textMuted }} />
              <YAxis tick={{ fontSize: 12, fill: C.textMuted }} unit=" kg" />
              <Tooltip contentStyle={{ borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 13 }} />
              <Legend />
              <Line type="monotone" dataKey="emissions" name="CO₂ (kg)"
                stroke={C.deepGreen} strokeWidth={2.5}
                dot={{ r: 5, fill: C.deepGreen }} activeDot={{ r: 7 }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </Card>

      {/* Bar chart + Category breakdown */}
      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
        <Card style={{ flex: 3, minWidth: 320 }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: C.text, marginBottom: 20 }}>Category Comparison</div>
          {loading || barData.length === 0 ? (
            <div style={{ height: 230, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.textMuted, fontSize: 13 }}>
              {loading ? 'Loading…' : 'No data for this period'}
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={230}>
              <BarChart data={barData} barCategoryGap="35%">
                <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                <XAxis dataKey="category" tick={{ fontSize: 12, fill: C.textMuted }} />
                <YAxis tick={{ fontSize: 12, fill: C.textMuted }} unit=" kg" />
                <Tooltip contentStyle={{ borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 13 }} />
                <Bar dataKey="value" name="CO₂ (kg)" radius={[6, 6, 0, 0]}>
                  {barData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>

        <Card style={{ flex: 2, minWidth: 220 }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: C.text, marginBottom: 20 }}>Monthly Breakdown</div>
          {catPercent.length === 0 ? (
            <div style={{ color: C.textMuted, fontSize: 13 }}>Log activities to see breakdown.</div>
          ) : catPercent.map((d, i) => (
            <div key={d.name} style={{ marginBottom: 18 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 13, color: C.text }}>{d.name}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: PIE_COLORS[i % PIE_COLORS.length] }}>{d.value}%</span>
              </div>
              <div style={{ height: 8, background: C.bg, borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${d.value}%`, background: PIE_COLORS[i % PIE_COLORS.length], borderRadius: 4, transition: 'width 0.6s ease' }} />
              </div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  )
}
