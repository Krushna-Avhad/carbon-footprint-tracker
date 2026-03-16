import { Link, useLocation, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { C } from "../../constants/colors"
import { navItems } from "../../constants/mockData"
import { getProfile } from "../../services/api"

export default function Sidebar() {
  const location = useLocation()
  const navigate  = useNavigate()
  const [user, setUser] = useState(null)

  const handleLogout = () => {
    localStorage.removeItem('ahb_token')
    navigate('/login')
  }

  useEffect(() => {
    getProfile()
      .then(data => setUser(data))
      .catch(() => {})
  }, [])

  return (
    <aside style={{
      width: 240,
      minHeight: "100vh",
      background: C.darkGreen,
      display: "flex",
      flexDirection: "column",
      flexShrink: 0,
      position: "sticky",
      top: 0,
      height: "100vh",
      overflowY: "auto",
    }}>

      {/* Logo */}
      <div style={{
        padding: "28px 20px 20px",
        borderBottom: "1px solid rgba(255,255,255,0.1)",
        flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 28 }}>🌍</span>
          <div>
            <div style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>CarbonTrack</div>
            <div style={{ color: C.lightGreen, fontSize: 11 }}>Eco Analytics Platform</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: "12px 0" }}>
        {navItems.map(item => {
          const active = location.pathname === `/app/${item.id}`
          return (
            <Link
              key={item.id}
              to={`/app/${item.id}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                width: "100%",
                padding: "11px 20px",
                textDecoration: "none",
                background: active ? "rgba(255,255,255,0.12)" : "transparent",
                color: active ? "#fff" : "rgba(255,255,255,0.72)",
                fontSize: 14,
                fontWeight: active ? 600 : 400,
                borderLeft: active ? `3px solid ${C.lightGreen}` : "3px solid transparent",
                transition: "all 0.18s",
                fontFamily: "'Poppins', sans-serif",
                boxSizing: "border-box",
              }}
            >
              <span style={{ fontSize: 17 }}>{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* User footer */}
      <div style={{
        padding: "16px 20px",
        borderTop: "1px solid rgba(255,255,255,0.1)",
        flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* Avatar */}
          <div style={{
            width: 36, height: 36, borderRadius: "50%",
            background: C.medGreen, flexShrink: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontWeight: 700, fontSize: 15,
          }}>
            {user?.name?.[0]?.toUpperCase() || '?'}
          </div>

          {/* Name + email */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ color: "#fff", fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.name || 'Loading...'}
            </div>
            <div style={{ color: C.lightGreen, fontSize: 11, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.email || ''}
            </div>
          </div>

          {/* Logout button */}
          <button
            onClick={handleLogout}
            title="Logout"
            style={{
              background: 'none', border: 'none',
              cursor: 'pointer', fontSize: 18,
              color: 'rgba(255,255,255,0.45)',
              padding: 4, flexShrink: 0,
              transition: 'color 0.15s',
              lineHeight: 1,
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#fff'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.45)'}
          >⏻</button>
        </div>
      </div>

    </aside>
  )
}
