import { C } from '../constants/colors'
import AuthCard from '../components/ui/AuthCard'
import Btn from '../components/ui/Btn'
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { login } from "../services/api"

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

export default function LoginPage() {

  const navigate = useNavigate()

  const [formData,setFormData] = useState({
    email:"",
    password:""
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleLogin = async () => {
  try {

    const res = await login({
      email: formData.email,
      password: formData.password
    });

    console.log("LOGIN RESPONSE:", res);

    localStorage.setItem("ahb_token", res.token); // ✅ correct

    alert("Login successfully 🌱");

    navigate("/app/dashboard");

  } catch (err) {
    console.log(err);
    alert(err.response?.data?.message || "Login failed");
  }
};
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
              color: C.deepGreen,
              fontWeight: 600,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontFamily: "'Poppins', sans-serif",
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
            type="email"
            name="email"
            placeholder="you@example.com"
            style={inp}
            onChange={handleChange}
          />
        </div>

        <div>
          <label style={lbl}>Password</label>
          <input
            type="password"
            name="password"
            placeholder="••••••••"
            style={inp}
            onChange={handleChange}
          />
        </div>

        <div style={{ textAlign: 'right' }}>
          <button style={{
            color: C.deepGreen,
            background: 'none',
            border: 'none',
            fontSize: 13,
            cursor: 'pointer',
            fontFamily: "'Poppins', sans-serif",
          }}>
            Forgot password?
          </button>
        </div>

        <Btn
          onClick={handleLogin}
          style={{ width: '100%', padding: 14, fontSize: 15, marginTop: 4 }}
        >
          Login to Dashboard
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