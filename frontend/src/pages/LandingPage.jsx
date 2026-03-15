import { C } from '../constants/colors'
import Btn from '../components/ui/Btn'
import Card from '../components/ui/Card'
import { useNavigate } from "react-router-dom";


const features = [
  { icon: '📊', title: 'Real-Time Analytics',   desc: 'Live charts tracking your emissions across transport, food, energy and waste.' },
  { icon: '🎯', title: 'Smart Goal Setting',     desc: 'Set personalised carbon reduction goals with detailed progress tracking.' },
  { icon: '🏆', title: 'Eco Achievements',       desc: 'Earn badges as you build sustainable habits and hit milestones.' },
  { icon: '🌿', title: 'Sustainability Hub',      desc: 'Curated guides and articles to help you live a lower-carbon life.' },
]

const steps = [
  { step: '01', title: 'Create Your Account',  desc: 'Sign up in seconds with your profile and diet preferences.' },
  { step: '02', title: 'Log Daily Activities', desc: 'Track transport, food, energy, and waste with simple forms.' },
  { step: '03', title: 'Reduce & Earn Badges', desc: 'Get actionable insights and unlock eco-achievements.' },
]

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif", background: C.bg, minHeight: '100vh' }}>

      {/* ── Nav ── */}
      <nav style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '18px 60px', background: C.card, borderBottom: `1px solid ${C.border}`,
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 26 }}>🌍</span>
          <span style={{ fontWeight: 700, fontSize: 18, color: C.darkGreen }}>CarbonTrack</span>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <Btn variant="outline" onClick={() => navigate('/login')}>Login</Btn>
          <Btn onClick={() => navigate('/signup')}>Get Started</Btn>
        </div>
      </nav>

      {/* ── Hero ── */}
      <div style={{
        background: `linear-gradient(135deg, ${C.darkGreen} 0%, ${C.deepGreen} 60%, ${C.medGreen} 100%)`,
        padding: '96px 60px',
        textAlign: 'center',
      }}>
        <div style={{
          display: 'inline-block', background: 'rgba(255,255,255,0.12)',
          color: C.lightGreen, fontSize: 13, fontWeight: 600,
          padding: '6px 18px', borderRadius: 20, marginBottom: 24,
        }}>🌿 Environmental Analytics Platform</div>

        <h1 style={{
          color: '#fff', fontSize: 52, fontWeight: 800, lineHeight: 1.18,
          margin: '0 auto 22px', maxWidth: 720,
        }}>
          Track Your Lifestyle.<br />
          <span style={{ color: C.lightGreen }}>Reduce Your Carbon Footprint.</span>
        </h1>

        <p style={{
          color: 'rgba(255,255,255,0.75)', fontSize: 18, marginBottom: 40,
          maxWidth: 520, marginLeft: 'auto', marginRight: 'auto',
        }}>
          Monitor emissions from every daily activity, set reduction goals, and earn eco-badges — all in one beautiful dashboard.
        </p>

        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Btn
            onClick={() => setView('signup')}
            style={{ padding: '14px 34px', fontSize: 16, background: '#fff', color: C.darkGreen }}
          >
            Get Started — It's Free
          </Btn>
          <Btn
            onClick={() => navigate('/login')}
            variant="outline"
            style={{ padding: '14px 34px', fontSize: 16, color: '#fff', borderColor: 'rgba(255,255,255,0.5)' }}
          >
            Login to Dashboard
          </Btn>
        </div>

        {/* Hero stats */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 48, marginTop: 64, flexWrap: 'wrap' }}>
          {[['10K+', 'Active Users'], ['2.4M kg', 'CO₂ Tracked'], ['340K', 'Goals Completed']].map(([val, lbl]) => (
            <div key={lbl} style={{ textAlign: 'center' }}>
              <div style={{ color: '#fff', fontWeight: 800, fontSize: 28 }}>{val}</div>
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>{lbl}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Features ── */}
      <div style={{ padding: '80px 60px', textAlign: 'center' }}>
        <h2 style={{ fontSize: 32, fontWeight: 800, color: C.text, marginBottom: 12 }}>
          Everything you need to go green
        </h2>
        <p style={{ color: C.textMuted, marginBottom: 56, fontSize: 16 }}>
          Powerful tools, beautiful insights, and real environmental impact.
        </p>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 24, maxWidth: 1000, margin: '0 auto',
        }}>
          {features.map((f, i) => (
            <Card key={i} style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 36, marginBottom: 14 }}>{f.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 15, color: C.text, marginBottom: 8 }}>{f.title}</div>
              <div style={{ fontSize: 13, color: C.textMuted, lineHeight: 1.7 }}>{f.desc}</div>
            </Card>
          ))}
        </div>
      </div>

      {/* ── How it works ── */}
      <div style={{
        background: C.darkGreen,
        padding: '80px 60px',
        textAlign: 'center',
      }}>
        <h2 style={{ fontSize: 32, fontWeight: 800, color: '#fff', marginBottom: 56 }}>
          How It Works
        </h2>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 40, flexWrap: 'wrap' }}>
          {steps.map((s, i) => (
            <div key={i} style={{ maxWidth: 240 }}>
              <div style={{
                width: 56, height: 56, borderRadius: '50%',
                background: C.freshGreen, color: '#fff',
                fontWeight: 800, fontSize: 18,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 18px',
              }}>{s.step}</div>
              <div style={{ fontWeight: 700, fontSize: 16, color: '#fff', marginBottom: 8 }}>{s.title}</div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)', lineHeight: 1.7 }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── CTA ── */}
      <div style={{ padding: '80px 60px', textAlign: 'center' }}>
        <h2 style={{ fontSize: 30, fontWeight: 800, color: C.text, marginBottom: 16 }}>
          Ready to make a difference?
        </h2>
        <p style={{ color: C.textMuted, marginBottom: 36, fontSize: 16 }}>
          Join thousands of users tracking and reducing their carbon footprint every day.
        </p>
        <Btn onClick={() => setView('signup')} style={{ padding: '14px 44px', fontSize: 16 }}>
          Start Tracking Today 🌍
        </Btn>
      </div>

      {/* ── Footer ── */}
      <footer style={{
        background: C.darkGreen, padding: '24px 60px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12,
      }}>
        <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>
          © 2024 CarbonTrack. All rights reserved.
        </div>
        <div style={{ display: 'flex', gap: 24 }}>
          {['Privacy', 'Terms', 'Contact'].map(l => (
            <span key={l} style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, cursor: 'pointer' }}>{l}</span>
          ))}
        </div>
      </footer>
    </div>
  )
}
