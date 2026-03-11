import { C } from '../../constants/colors'
import { navItems } from '../../constants/mockData'

export default function Sidebar({ page, setPage }) {
  return (
    <aside style={{
      width: 240,
      minHeight: '100vh',
      background: C.darkGreen,
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
      position: 'sticky',
      top: 0,
      height: '100vh',
      overflowY: 'auto',
    }}>
      {/* Logo */}
      <div style={{
        padding: '28px 20px 20px',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 28 }}>🌍</span>
          <div>
            <div style={{ color: '#fff', fontWeight: 700, fontSize: 15, lineHeight: 1.2 }}>CarbonTrack</div>
            <div style={{ color: C.lightGreen, fontSize: 11 }}>Eco Analytics Platform</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '12px 0' }}>
        {navItems.map(item => {
          const active = page === item.id
          return (
            <button
              key={item.id}
              onClick={() => setPage(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                width: '100%',
                padding: '11px 20px',
                border: 'none',
                cursor: 'pointer',
                background: active ? 'rgba(255,255,255,0.12)' : 'transparent',
                color: active ? '#fff' : 'rgba(255,255,255,0.72)',
                fontSize: 14,
                fontWeight: active ? 600 : 400,
                borderLeft: active ? `3px solid ${C.lightGreen}` : '3px solid transparent',
                textAlign: 'left',
                transition: 'all 0.18s',
                fontFamily: "'Poppins', sans-serif",
              }}
              onMouseEnter={e => {
                if (!active) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.07)'
                  e.currentTarget.style.color = '#fff'
                }
              }}
              onMouseLeave={e => {
                if (!active) {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.color = 'rgba(255,255,255,0.72)'
                }
              }}
            >
              <span style={{ fontSize: 17 }}>{item.icon}</span>
              {item.label}
            </button>
          )
        })}
      </nav>

      {/* User footer */}
      <div style={{
        padding: '16px 20px',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: C.medGreen,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 700,
            fontSize: 15,
          }}>A</div>
          <div>
            <div style={{ color: '#fff', fontSize: 13, fontWeight: 600 }}>Alex Johnson</div>
            <div style={{ color: C.lightGreen, fontSize: 11 }}>Pro Member</div>
          </div>
        </div>
      </div>
    </aside>
  )
}
