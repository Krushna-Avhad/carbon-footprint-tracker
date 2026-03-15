import { useState, useEffect } from 'react'
import {
  LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { useNavigate } from 'react-router-dom'
import { C, PIE_COLORS } from '../constants/colors'
import Card from '../components/ui/Card'
import StatCard from '../components/ui/StatCard'
import Btn from '../components/ui/Btn'
import { getSummary, getMonthlyTrend } from '../services/api'

function pctLabel(val) {
  if (val === null || val === undefined) return 'No data yet'
  const sign = val <= 0 ? '↓' : '↑'
  const color = val <= 0 ? C.freshGreen : '#EF4444'
  return { text: `${sign} ${Math.abs(val)}% vs previous`, color }
}

export default function DashboardPage() {
  const navigate  = useNavigate()
  const [summary, setSummary] = useState(null)
  const [trend,   setTrend]   = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [sum, trd] = await Promise.all([getSummary(), getMonthlyTrend()])
        setSummary(sum)
        setTrend(trd)
      } catch (err) {
        console.error('Dashboard load error:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  // Build pie data from categories
  const catData  = summary?.categories ? Object.entries(summary.categories).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value: parseFloat(value.toFixed(2)),
  })) : []

  const todayPct  = pctLabel(summary?.today?.vsYesterday)
  const weekPct   = pctLabel(summary?.weekly?.vsLastWeek)
  const monthPct  = pctLabel(summary?.monthly?.vsLastMonth)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 1200, margin: '0 auto', width: '100%' }}>

      {/* Stat Cards */}
      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
        <StatCard icon="🌫️" label="Today's Carbon Footprint"
          value={loading ? '…' : `${summary?.today?.total ?? 0} kg`}
          sub={typeof todayPct === 'object' ? todayPct.text : todayPct}
          iconBg="#E8F5E9" />
        <StatCard icon="📅" label="Weekly Emissions"
          value={loading ? '…' : `${summary?.weekly?.total ?? 0} kg`}
          sub={typeof weekPct === 'object' ? weekPct.text : weekPct}
          iconBg="#F0FDF4" />
        <StatCard icon="📆" label="Monthly Emissions"
          value={loading ? '…' : `${summary?.monthly?.total ?? 0} kg`}
          sub={typeof monthPct === 'object' ? monthPct.text : monthPct}
          iconBg="#DCFCE7" />
        <StatCard icon="🌿" label="Categories Tracked"
          value={loading ? '…' : catData.length}
          sub="Active categories this month"
          iconBg="#D1FAE5" />
      </div>

      {/* Charts Row */}
      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
        <Card style={{ flex: 2, minWidth: 320 }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: C.text, marginBottom: 16 }}>Carbon Emission Trends</div>
          {loading ? (
            <div style={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.textMuted }}>Loading…</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={trend}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: C.textMuted }} />
                <YAxis tick={{ fontSize: 12, fill: C.textMuted }} unit=" kg" />
                <Tooltip contentStyle={{ borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 13 }} />
                <Line type="monotone" dataKey="emissions" name="CO₂ (kg)"
                  stroke={C.deepGreen} strokeWidth={2.5}
                  dot={{ r: 4, fill: C.deepGreen }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </Card>

        <Card style={{ flex: 1, minWidth: 240 }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: C.text, marginBottom: 16 }}>Carbon Breakdown</div>
          {loading || catData.length === 0 ? (
            <div style={{ height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.textMuted, fontSize: 13 }}>
              {loading ? 'Loading…' : 'Log activities to see breakdown'}
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={catData} cx="50%" cy="50%" outerRadius={72} innerRadius={28} dataKey="value">
                  {catData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v) => `${v} kg`} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </Card>
      </div>

      {/* Quick Actions */}
      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
        <Card style={{ flex: 1, minWidth: 200 }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: C.text, marginBottom: 16 }}>Quick Actions</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Btn onClick={() => navigate('/app/log')}      style={{ width: '100%' }}>✏️ Log Activity</Btn>
            <Btn onClick={() => navigate('/app/goals')}    style={{ width: '100%' }} variant="outline">🎯 Set Carbon Goal</Btn>
            <Btn onClick={() => navigate('/app/analytics')} style={{ width: '100%' }} variant="ghost">📈 View Analytics</Btn>
          </div>
        </Card>

        {catData.length > 0 && (
          <Card style={{ flex: 2, minWidth: 260 }}>
            <div style={{ fontWeight: 700, fontSize: 15, color: C.text, marginBottom: 16 }}>This Month's Breakdown</div>
            {catData.map((d, i) => {
              const total = catData.reduce((s, x) => s + x.value, 0)
              const pct   = total > 0 ? Math.round((d.value / total) * 100) : 0
              return (
                <div key={d.name} style={{ marginBottom: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 13, color: C.text }}>{d.name}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: PIE_COLORS[i % PIE_COLORS.length] }}>{d.value} kg</span>
                  </div>
                  <div style={{ height: 6, background: C.bg, borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: PIE_COLORS[i % PIE_COLORS.length], borderRadius: 3 }} />
                  </div>
                </div>
              )
            })}
          </Card>
        )}
      </div>
    </div>
  )
}
