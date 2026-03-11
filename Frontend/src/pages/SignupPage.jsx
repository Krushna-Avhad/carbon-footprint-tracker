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

export default function SignupPage({ setView }) {
  return (
    <AuthCard
      title="Create Account"
      subtitle="Start your eco journey with CarbonTrack"
      footer={
        <>
          Already have an account?{' '}
          <button
            onClick={() => setView('login')}
            style={{
              color: C.deepGreen, fontWeight: 600,
              background: 'none', border: 'none',
              cursor: 'pointer', fontFamily: "'Poppins', sans-serif",
            }}
          >
            Login
          </button>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div>
          <label style={lbl}>Full Name</label>
          <input placeholder="Alex Johnson" style={inp} />
        </div>
        <div>
          <label style={lbl}>Email Address</label>
          <input type="email" placeholder="you@example.com" style={inp} />
        </div>
        <div>
          <label style={lbl}>Password</label>
          <input type="password" placeholder="••••••••" style={inp} />
        </div>
        <div>
          <label style={lbl}>Location</label>
          <input placeholder="City, Country" style={inp} />
        </div>
        <div>
          <label style={lbl}>Diet Preference</label>
          <select style={inp}>
            <option>Vegetarian</option>
            <option>Vegan</option>
            <option>Omnivore</option>
            <option>Pescatarian</option>
          </select>
        </div>
        <Btn onClick={() => setView('app')} style={{ width: '100%', padding: 14, fontSize: 15, marginTop: 6 }}>
          Create Account 🌿
        </Btn>
        <Btn onClick={() => setView('landing')} variant="ghost" style={{ width: '100%', padding: 12, fontSize: 13 }}>
          ← Back to Home
        </Btn>
      </div>
    </AuthCard>
  )
}
