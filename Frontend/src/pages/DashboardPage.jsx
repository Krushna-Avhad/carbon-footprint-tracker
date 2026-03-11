import {
  LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { C, PIE_COLORS } from '../constants/colors'
import { lineData, pieData } from '../constants/mockData'
import Card from '../components/ui/Card'
import StatCard from '../components/ui/StatCard'
import Btn from '../components/ui/Btn'

export default function DashboardPage({ setPage }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 1200 }}>

      {/* ── Stat Cards ── */}
      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
        <StatCard icon="🌫️" label="Today's Carbon Footprint" value="8.4 kg"   sub="↓ 12% vs yesterday"  iconBg="#E8F5E9" />
        <StatCard icon="📅" label="Weekly Emissions"          value="52 kg"    sub="↓ 8% vs last week"   iconBg="#F0FDF4" />
        <StatCard icon="📆" label="Monthly Emissions"         value="198 kg"   sub="↓ 5% vs last month"  iconBg="#DCFCE7" />
        <StatCard icon="🌿" label="Eco Score"                 value="78 / 100" sub="↑ 3 pts this week"   iconBg="#D1FAE5" />
      </div>

      {/* ── Charts Row ── */}
      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
        {/* Line chart */}
        <Card style={{ flex: 2, minWidth: 320 }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: C.text, marginBottom: 16 }}>
            Carbon Emission Trends
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: C.textMuted }} />
              <YAxis tick={{ fontSize: 12, fill: C.textMuted }} unit=" kg" />
              <Tooltip
                contentStyle={{ borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 13 }}
              />
              <Line
                type="monotone" dataKey="emissions" name="CO₂ (kg)"
                stroke={C.deepGreen} strokeWidth={2.5}
                dot={{ r: 4, fill: C.deepGreen }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Pie chart */}
        <Card style={{ flex: 1, minWidth: 240 }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: C.text, marginBottom: 16 }}>
            Carbon Breakdown
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={pieData} cx="50%" cy="50%"
                outerRadius={72} innerRadius={28}
                dataKey="value"
              >
                {pieData.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => `${v}%`} />
            </PieChart>
          </ResponsiveContainer>
          {/* Legend */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 14px', marginTop: 10 }}>
            {pieData.map((d, i) => (
              <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 10, height: 10, borderRadius: 2, background: PIE_COLORS[i] }} />
                <span style={{ fontSize: 12, color: C.textMuted }}>{d.name} {d.value}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* ── Impact + Quick Actions ── */}
      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
        {/* Impact card */}
        <Card style={{
          flex: 2,
          background: `linear-gradient(135deg, ${C.darkGreen}, ${C.deepGreen})`,
          minWidth: 280,
        }}>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', marginBottom: 10, letterSpacing: 1, textTransform: 'uppercase' }}>
            🌍 Carbon Impact Today
          </div>
          <div style={{ fontSize: 20, color: '#fff', fontWeight: 700, marginBottom: 8, lineHeight: 1.4 }}>
            Your emissions today equal driving{' '}
            <span style={{ color: C.lightGreen }}>18 km by car</span>
          </div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginBottom: 20 }}>
            Equivalent to planting 2 trees to offset today's footprint.
          </div>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            {[['3.2 kg', 'Transport'], ['2.8 kg', 'Food'], ['1.5 kg', 'Energy'], ['0.9 kg', 'Waste']].map(([v, l]) => (
              <div key={l}>
                <div style={{ color: C.lightGreen, fontWeight: 700, fontSize: 15 }}>{v}</div>
                <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: 11 }}>{l}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick actions */}
        <Card style={{ flex: 1, minWidth: 200 }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: C.text, marginBottom: 16 }}>
            Quick Actions
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Btn onClick={() => setPage('log')}       style={{ width: '100%' }}>✏️  Log Activity</Btn>
            <Btn onClick={() => setPage('goals')}     style={{ width: '100%' }} variant="outline">🎯  Set Carbon Goal</Btn>
            <Btn onClick={() => setPage('analytics')} style={{ width: '100%' }} variant="ghost">📈  View Analytics</Btn>
          </div>
        </Card>
      </div>
    </div>
  )
}
