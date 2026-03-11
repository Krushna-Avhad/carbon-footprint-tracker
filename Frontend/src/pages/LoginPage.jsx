import { C } from '../constants/colors'
import AuthCard from '../components/ui/AuthCard'
import Btn from '../components/ui/Btn'

const inp = {
  width: '100%',
  padding: '11px 14px',
  border: `1px solid ${C.border}`,
  borderRadius: 8,
  fontSize: 14,
  color: C.text,
  background: C.bg,
  outline: 'none',
  boxSizing: 'border-box',
  fontFamily: "'Poppins', sans-serif",
  marginTop: 6,
}

const lbl = {
  fontSize: 13,
  color: C.textMuted,
  fontWeight: 500,
}

export default function LoginPage({ setView }) {
  return (
    <AuthCard
      title="Welcome Back"
      subtitle="Sign in to your CarbonTrack account"
      footer={
        <>
          Don't have an account?{' '}
          <button
            onClick={() => setView('signup')}
            style={{
              color: C.deepGreen, fontWeight: 600,
              background: 'none', border: 'none',
              cursor: 'pointer', fontFamily: "'Poppins', sans-serif",
            }}
          >
            Sign Up
          </button>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <label style={lbl}>Email Address</label>
          <input type="email" placeholder="you@example.com" style={inp} />
        </div>
        <div>
          <label style={lbl}>Password</label>
          <input type="password" placeholder="••••••••" style={inp} />
        </div>
        <div style={{ textAlign: 'right' }}>
          <button style={{
            color: C.deepGreen, background: 'none',
            border: 'none', fontSize: 13, cursor: 'pointer',
            fontFamily: "'Poppins', sans-serif",
          }}>
            Forgot password?
          </button>
        </div>
        <Btn onClick={() => setView('app')} style={{ width: '100%', padding: 14, fontSize: 15, marginTop: 4 }}>
          Login to Dashboard
        </Btn>
        <Btn onClick={() => setView('landing')} variant="ghost" style={{ width: '100%', padding: 12, fontSize: 13 }}>
          ← Back to Home
        </Btn>
      </div>
    </AuthCard>
  )
}
