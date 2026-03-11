import { C } from '../../constants/colors'

export default function Card({ children, style = {} }) {
  return (
    <div style={{
      background: C.card,
      borderRadius: 12,
      border: `1px solid ${C.border}`,
      boxShadow: '0 1px 8px rgba(0,0,0,0.06)',
      padding: 24,
      ...style,
    }}>
      {children}
    </div>
  )
}
