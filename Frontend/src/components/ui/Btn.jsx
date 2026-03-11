import { C } from '../../constants/colors'

const variants = {
  primary: {
    background: C.deepGreen,
    color: '#fff',
    border: 'none',
  },
  outline: {
    background: 'transparent',
    color: C.deepGreen,
    border: `1.5px solid ${C.deepGreen}`,
  },
  ghost: {
    background: C.bg,
    color: C.text,
    border: 'none',
  },
  danger: {
    background: 'transparent',
    color: '#EF4444',
    border: '1.5px solid #FCA5A5',
  },
}

export default function Btn({ children, onClick, style = {}, variant = 'primary', disabled = false }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: '10px 20px',
        borderRadius: 8,
        fontSize: 14,
        fontWeight: 600,
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontFamily: "'Poppins', sans-serif",
        transition: 'opacity 0.15s, transform 0.1s',
        opacity: disabled ? 0.55 : 1,
        ...variants[variant],
        ...style,
      }}
      onMouseEnter={e => { if (!disabled) e.currentTarget.style.opacity = '0.85' }}
      onMouseLeave={e => { if (!disabled) e.currentTarget.style.opacity = '1' }}
    >
      {children}
    </button>
  )
}
