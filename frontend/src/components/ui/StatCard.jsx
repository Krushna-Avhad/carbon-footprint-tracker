import Card from './Card'
import { C } from '../../constants/colors'

export default function StatCard({ icon, label, value, sub, iconBg }) {
  return (
    <Card style={{ flex: 1, minWidth: 180 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ color: C.textMuted, fontSize: 13, marginBottom: 6 }}>{label}</div>
          <div style={{ fontSize: 26, fontWeight: 700, color: C.text }}>{value}</div>
          {sub && (
            <div style={{ color: C.freshGreen, fontSize: 12, marginTop: 4 }}>{sub}</div>
          )}
        </div>
        <div style={{
          width: 44,
          height: 44,
          borderRadius: 10,
          background: iconBg || `${C.lightGreen}33`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 22,
          flexShrink: 0,
        }}>
          {icon}
        </div>
      </div>
    </Card>
  )
}
