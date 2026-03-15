import { C } from '../constants/colors'
import AuthCard from '../components/ui/AuthCard'
import Btn from '../components/ui/Btn'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { login } from '../services/api'

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

export default function LoginPage() {
  const navigate = useNavigate()

  const [form,    setForm]    = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  const handleLogin = async () => {
    if (!form.email.trim())  return setError('Please enter your email.')
    if (!form.password)      return setError('Please enter your password.')

    setLoading(true)
    setError('')

    try {
      const res = await login({
        email:    form.email.trim().toLowerCase(),
        password: form.password,
      })

      localStorage.setItem('ahb_token', res.token)
      navigate('/app/dashboard')

    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error   ||
        (err.message === 'Network Error'
          ? 'Cannot connect to server. Make sure the backend is running on port 5000.'
          : 'Login failed. Please try again.')
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleLogin()
  }

  return (
    <AuthCard
      title="Welcome Back"
      subtitle="Sign in to your CarbonTrack account"
      footer={
        <>
          Don't have an account?{' '}
          <button
            onClick={() => navigate('/signup')}
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
          <input
            type="email" name="email" value={form.email}
            placeholder="you@example.com"
            style={inp}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
        </div>

        <div>
          <label style={lbl}>Password</label>
          <input
            type="password" name="password" value={form.password}
            placeholder="••••••••"
            style={inp}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
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
          onClick={handleLogin}
          disabled={loading}
          style={{ width: '100%', padding: 14, fontSize: 15, marginTop: 4 }}
        >
          {loading ? 'Signing in…' : 'Login to Dashboard'}
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
