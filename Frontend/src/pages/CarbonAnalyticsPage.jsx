import {
  LineChart, Line, BarChart, Bar, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import { C, PIE_COLORS } from '../constants/colors'
import { lineData, barData, pieData } from '../constants/mockData'
import Card from '../components/ui/Card'
import StatCard from '../components/ui/StatCard'

export default function CarbonAnalyticsPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 1200 }}>

      {/* Summary stats */}
      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
        <StatCard icon="📉" label="Avg Daily (June)"    value="7.9 kg"      sub="↓ 11% vs May"      />
        <StatCard icon="📦" label="Total This Month"    value="198 kg"      sub="Goal: 180 kg"       />
        <StatCard icon="🏅" label="Best Reduction"      value="Transport"   sub="−22% this month"   />
        <StatCard icon="🔮" label="Projected (July)"    value="165 kg"      sub="On track for goal"  />
      </div>

      {/* Line chart */}
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, color: C.text }}>Emission Trends – 6 Months</div>
            <div style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>Monthly CO₂ in kg</div>
          </div>
          <select style={{
            padding: '7px 12px', border: `1px solid ${C.border}`,
            borderRadius: 8, fontSize: 12, color: C.text,
            background: C.bg, fontFamily: "'Poppins', sans-serif", outline: 'none',
          }}>
            <option>Last 6 months</option>
            <option>Last 12 months</option>
            <option>This year</option>
          </select>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={lineData}>
            <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: C.textMuted }} />
            <YAxis tick={{ fontSize: 12, fill: C.textMuted }} unit=" kg" />
            <Tooltip contentStyle={{ borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 13 }} />
            <Legend />
            <Line
              type="monotone" dataKey="emissions" name="CO₂ (kg)"
              stroke={C.deepGreen} strokeWidth={2.5}
              dot={{ r: 5, fill: C.deepGreen }} activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Bar + Summary */}
      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
        {/* Bar chart */}
        <Card style={{ flex: 3, minWidth: 320 }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: C.text, marginBottom: 20 }}>
            Category Comparison
          </div>
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={barData} barCategoryGap="35%">
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
              <XAxis dataKey="category" tick={{ fontSize: 12, fill: C.textMuted }} />
              <YAxis tick={{ fontSize: 12, fill: C.textMuted }} unit=" kg" />
              <Tooltip contentStyle={{ borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 13 }} />
              <Bar dataKey="value" name="CO₂ (kg)" radius={[6, 6, 0, 0]}>
                {barData.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Monthly progress */}
        <Card style={{ flex: 2, minWidth: 220 }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: C.text, marginBottom: 20 }}>
            Monthly Breakdown
          </div>
          {pieData.map((d, i) => (
            <div key={d.name} style={{ marginBottom: 18 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 13, color: C.text }}>{d.name}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: PIE_COLORS[i] }}>{d.value}%</span>
              </div>
              <div style={{ height: 8, background: C.bg, borderRadius: 4, overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${d.value}%`,
                  background: PIE_COLORS[i],
                  borderRadius: 4,
                  transition: 'width 0.6s ease',
                }} />
              </div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  )
}
