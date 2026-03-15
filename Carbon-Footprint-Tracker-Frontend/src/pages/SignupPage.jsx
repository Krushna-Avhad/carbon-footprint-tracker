import { C } from '../constants/colors'
import AuthCard from '../components/ui/AuthCard'
import Btn from '../components/ui/Btn'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { signup } from '../services/api'

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

const lbl = { fontSize: 13, color: C.textMuted, fontWeight: 500 }

export default function SignupPage() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    country: '',
    dietType: '',
  })

  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')
  const [success, setSuccess] = useState(false)

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setError('') // clear error on typing
  }

  const handleSignup = async () => {
    // Client-side validation
    if (!form.name.trim())     return setError('Full name is required.')
    if (!form.email.trim())    return setError('Email address is required.')
    if (!form.password)        return setError('Password is required.')
    if (form.password.length < 6) return setError('Password must be at least 6 characters.')

    setLoading(true)
    setError('')

    try {
      await signup({
        name:     form.name.trim(),
        email:    form.email.trim().toLowerCase(),
        password: form.password,
        country:  form.country.trim(),
        dietType: form.dietType,
      })

      setSuccess(true)
      setTimeout(() => navigate('/login'), 1800)

    } catch (err) {
      // Show the exact message from the backend
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error   ||
        (err.message === 'Network Error'
          ? 'Cannot connect to server. Make sure the backend is running on port 5000.'
          : 'Signup failed. Please try again.')
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  // Handle Enter key
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSignup()
  }

  if (success) {
    return (
      <AuthCard title="Account Created!" subtitle="Redirecting you to login…">
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>🌱</div>
          <div style={{ fontSize: 14, color: C.freshGreen, fontWeight: 600 }}>
            Welcome aboard! Taking you to login…
          </div>
        </div>
      </AuthCard>
    )
  }

  return (
    <AuthCard
      title="Create Account"
      subtitle="Start your eco journey with CarbonTrack"
      footer={
        <>
          Already have an account?{' '}
          <button
            onClick={() => navigate('/login')}
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
          <label style={lbl}>Full Name *</label>
          <input
            name="name" value={form.name}
            placeholder="Alex Johnson"
            style={inp}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
        </div>

        <div>
          <label style={lbl}>Email Address *</label>
          <input
            name="email" value={form.email}
            type="email"
            placeholder="you@example.com"
            style={inp}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
        </div>

        <div>
          <label style={lbl}>Password * (min. 6 characters)</label>
          <input
            name="password" value={form.password}
            type="password"
            placeholder="••••••••"
            style={inp}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
        </div>

        <div>
          <label style={lbl}>Location</label>
          <input
            name="country" value={form.country}
            placeholder="City, Country"
            style={inp}
            onChange={handleChange}
          />
        </div>

        <div>
          <label style={lbl}>Diet Preference</label>
          <select
            name="dietType" value={form.dietType}
            style={inp}
            onChange={handleChange}
          >
            <option value="">— Select (optional) —</option>
            <option value="Vegetarian">Vegetarian</option>
            <option value="Vegan">Vegan</option>
            <option value="Omnivore">Omnivore</option>
            <option value="Pescatarian">Pescatarian</option>
          </select>
        </div>

        {/* Error message */}
        {error && (
          <div style={{
            padding: '10px 14px',
            background: '#FEF2F2',
            border: '1px solid #FCA5A5',
            borderRadius: 8,
            color: '#DC2626',
            fontSize: 13,
            lineHeight: 1.5,
          }}>
            ⚠️ {error}
          </div>
        )}

        <Btn
          onClick={handleSignup}
          disabled={loading}
          style={{ width: '100%', padding: 14, fontSize: 15, marginTop: 6 }}
        >
          {loading ? 'Creating account…' : 'Create Account 🌿'}
        </Btn>

        <Btn
          onClick={() => navigate('/')}
          variant="ghost"
          style={{ width: '100%', padding: 12, fontSize: 13 }}
        >
          ← Back to Home
        </Btn>

      </div>
    </AuthCard>
  )
}
