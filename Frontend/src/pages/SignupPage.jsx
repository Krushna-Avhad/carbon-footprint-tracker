import { C } from '../constants/colors'
import AuthCard from '../components/ui/AuthCard'
import Btn from '../components/ui/Btn'
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { signup } from "../services/api"

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

export default function SignupPage() {

  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    country: "",
    dietType: ""
  })

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const handleSignup = async () => {
    try {

      await signup({
        name: form.name,
        email: form.email,
        password: form.password,
        country: form.country,
        dietType: form.dietType
      })

      alert("Account created successfully 🌱")

      navigate("/login")

    } catch (err) {

      alert(err.response?.data?.message || "Signup failed")

    }
  }

  return (
    <AuthCard
      title="Create Account"
      subtitle="Start your eco journey with CarbonTrack"
      footer={
        <>
          Already have an account?{" "}
          <button
            onClick={() => navigate('/login')}
            style={{
              color: C.deepGreen,
              fontWeight: 600,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontFamily: "'Poppins', sans-serif",
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
          <input
            name="name"
            placeholder="Alex Johnson"
            style={inp}
            onChange={handleChange}
          />
        </div>

        <div>
          <label style={lbl}>Email Address</label>
          <input
            name="email"
            type="email"
            placeholder="you@example.com"
            style={inp}
            onChange={handleChange}
          />
        </div>

        <div>
          <label style={lbl}>Password</label>
          <input
            name="password"
            type="password"
            placeholder="••••••••"
            style={inp}
            onChange={handleChange}
          />
        </div>

        <div>
          <label style={lbl}>Location</label>
          <input
            name="country"
            placeholder="City, Country"
            style={inp}
            onChange={handleChange}
          />
        </div>

        <div>
          <label style={lbl}>Diet Preference</label>
          <select
            name="dietType"
            style={inp}
            onChange={handleChange}
          >
            <option value="">Select</option>
            <option>Vegetarian</option>
            <option>Vegan</option>
            <option>Omnivore</option>
            <option>Pescatarian</option>
          </select>
        </div>

        <Btn
          onClick={handleSignup}
          style={{ width: '100%', padding: 14, fontSize: 15, marginTop: 6 }}
        >
          Create Account 🌿
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