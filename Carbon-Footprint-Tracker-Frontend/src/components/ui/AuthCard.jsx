import { C } from '../../constants/colors'

export default function AuthCard({ title, subtitle, children, footer }) {
  return (
    <div style={{
      minHeight: '100vh',
      background: C.bg,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Poppins', sans-serif",
      padding: 20,
    }}>
      <div style={{
        background: C.card,
        borderRadius: 16,
        boxShadow: '0 4px 32px rgba(0,0,0,0.10)',
        padding: 40,
        width: '100%',
        maxWidth: 420,
      }}>
        <div style={{ textAlign: 'center', marginBottom: 30 }}>
          <div style={{ fontSize: 38, marginBottom: 10 }}>🌍</div>
          <div style={{ fontWeight: 800, fontSize: 22, color: C.darkGreen }}>{title}</div>
          {subtitle && (
            <div style={{ fontSize: 13, color: C.textMuted, marginTop: 6 }}>{subtitle}</div>
          )}
        </div>

        {children}

        {footer && (
          <div style={{ textAlign: 'center', marginTop: 22, fontSize: 13, color: C.textMuted }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
