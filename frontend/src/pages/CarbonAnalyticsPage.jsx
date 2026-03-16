import { useState, useEffect } from 'react'
import {
  LineChart, Line, BarChart, Bar, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import { C, PIE_COLORS } from '../constants/colors'
import Card from '../components/ui/Card'
import StatCard from '../components/ui/StatCard'
import { getAnalytics, getTrend, getSummary } from '../services/api'

const PERIODS = [
  { value: 'daily',   label: 'Today',      chartTitle: 'Hourly Breakdown — Today',        xKey: 'label', xLabel: 'Hour'  },
  { value: 'weekly',  label: 'This Week',  chartTitle: 'Daily Breakdown — This Week',     xKey: 'label', xLabel: 'Day'   },
  { value: 'monthly', label: 'This Month', chartTitle: 'Monthly Trend — Last 6 Months',   xKey: 'label', xLabel: 'Month' },
]

function pctLabel(val) {
  if (val === null || val === undefined) return '—'
  const sign = val <= 0 ? '↓' : '↑'
  return `${sign} ${Math.abs(val)}% vs previous`
}

// Only show every Nth tick to avoid crowding on hourly chart
const hourlyTick = (value, index) => index % 3 === 0 ? value : ''

export default function CarbonAnalyticsPage() {
  const [period,    setPeriod]    = useState('monthly')
  const [analytics, setAnalytics] = useState(null)
  const [trendData, setTrendData] = useState([])
  const [summary,   setSummary]   = useState(null)
  const [loading,   setLoading]   = useState(true)

  const currentPeriod = PERIODS.find(p => p.value === period)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const [ana, trd, sum] = await Promise.all([
          getAnalytics(period),
          getTrend(period),       // ← now fetches the correct trend for the period
          getSummary(),
        ])
        setAnalytics(ana)
        setTrendData(trd)
        setSummary(sum)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [period])  // ← re-runs whenever period changes

  // Build bar chart data from category emissions
  const barData = analytics
    ? Object.entries(analytics.categoryEmissions || {}).map(([cat, val]) => ({
        category: cat.charAt(0).toUpperCase() + cat.slice(1),
        value: parseFloat(val.toFixed(2)),
      }))
    : []

  // Category percentage breakdown
  const totalCat     = barData.reduce((s, d) => s + d.value, 0)
  const catPercent   = barData.map(d => ({
    name:  d.category,
    value: totalCat > 0 ? parseFloat(((d.value / totalCat) * 100).toFixed(1)) : 0,
  }))

  // For daily chart, only show every 3rd hour label to avoid crowding
  const tickFormatter = period === 'daily'
    ? (val, i) => i % 3 === 0 ? val : ''
    : val => val

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
        <StatCard icon="📦" label={`Total (${currentPeriod?.label})`}
          value={loading ? '…' : `${analytics?.totalEmissions ?? 0} kg`}
          sub="Selected period" />
      </div>

      {/* Period selector + Dynamic trend chart */}
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, color: C.text }}>
              {currentPeriod?.chartTitle}
            </div>
            <div style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>
              CO₂ emissions in kg · {currentPeriod?.xLabel}-by-{currentPeriod?.xLabel}
            </div>
          </div>
          {/* Period selector tabs */}
          <div style={{ display: 'flex', gap: 6 }}>
            {PERIODS.map(p => (
              <button
                key={p.value}
                onClick={() => setPeriod(p.value)}
                style={{
                  padding: '7px 14px', borderRadius: 8, fontSize: 12,
                  cursor: 'pointer', fontFamily: "'Poppins', sans-serif",
                  border: `1.5px solid ${period === p.value ? C.deepGreen : C.border}`,
                  background: period === p.value ? C.deepGreen : C.card,
                  color: period === p.value ? '#fff' : C.textMuted,
                  fontWeight: period === p.value ? 600 : 400,
                  transition: 'all 0.15s',
                }}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div style={{ height: 260, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.textMuted }}>
            Loading chart…
          </div>
        ) : trendData.every(d => d.emissions === 0) ? (
          <div style={{ height: 260, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: C.textMuted, gap: 8 }}>
            <div style={{ fontSize: 36 }}>📊</div>
            <div style={{ fontSize: 14 }}>No activities logged {period === 'daily' ? 'today' : period === 'weekly' ? 'this week' : 'this month'} yet.</div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={trendData} margin={{ left: 0, right: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11, fill: C.textMuted }}
                tickFormatter={tickFormatter}
                interval={period === 'daily' ? 2 : 0}
              />
              <YAxis tick={{ fontSize: 12, fill: C.textMuted }} unit=" kg" />
              <Tooltip
                contentStyle={{ borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 13 }}
                formatter={(val) => [`${val} kg`, 'CO₂']}
              />
              <Legend />
              <Line
                type="monotone" dataKey="emissions" name="CO₂ (kg)"
                stroke={C.deepGreen} strokeWidth={2.5}
                dot={{ r: period === 'daily' ? 3 : 5, fill: C.deepGreen }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </Card>

      {/* Bar chart + Category breakdown */}
      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
        <Card style={{ flex: 3, minWidth: 320 }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: C.text, marginBottom: 20 }}>
            Category Comparison — {currentPeriod?.label}
          </div>
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
          <div style={{ fontWeight: 700, fontSize: 15, color: C.text, marginBottom: 20 }}>
            Breakdown — {currentPeriod?.label}
          </div>
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
