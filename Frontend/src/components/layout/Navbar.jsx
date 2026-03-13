import { useLocation, useNavigate } from "react-router-dom"
import { C } from "../../constants/colors"

const PAGE_TITLES = {
  dashboard: "Dashboard",
  log: "Log Activity",
  history: "Activity History",
  analytics: "Carbon Analytics",
  goals: "Goals",
  achievements: "Achievements",
  hub: "Sustainability Hub",
  notifications: "Notifications",
  settings: "Settings",
}

export default function Navbar() {

  const location = useLocation()
  const navigate = useNavigate()

  // get page name from url
  const page = location.pathname.split("/")[2] || "dashboard"

  return (
    <header
      style={{
        height: 64,
        background: C.card,
        borderBottom: `1px solid ${C.border}`,
        display: "flex",
        alignItems: "center",
        padding: "0 28px",
        justifyContent: "space-between",
        flexShrink: 0,
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
    >
      {/* Page title */}
      <div style={{ fontWeight: 700, fontSize: 18, color: C.text }}>
        {PAGE_TITLES[page]}
      </div>

      {/* Right controls */}
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>

        {/* Search */}
        <div style={{ position: "relative" }}>
          <input
            placeholder="Search…"
            style={{
              padding: "8px 14px 8px 36px",
              border: `1px solid ${C.border}`,
              borderRadius: 8,
              fontSize: 13,
              color: C.text,
              background: C.bg,
              outline: "none",
              width: 200,
              fontFamily: "'Poppins', sans-serif",
            }}
          />
          <span
            style={{
              position: "absolute",
              left: 11,
              top: "50%",
              transform: "translateY(-50%)",
              fontSize: 14,
              pointerEvents: "none",
            }}
          >
            🔍
          </span>
        </div>

        {/* Notification */}
        <button
          onClick={() => navigate("/app/notifications")}
          style={{
            background: "none",
            border: "none",
            fontSize: 20,
            cursor: "pointer",
            position: "relative",
            padding: 4,
          }}
        >
          🔔
          <span
            style={{
              position: "absolute",
              top: 2,
              right: 2,
              width: 8,
              height: 8,
              background: C.freshGreen,
              borderRadius: "50%",
              border: "2px solid #fff",
            }}
          />
        </button>

        {/* Log Activity */}
        <button
          onClick={() => navigate("/app/log")}
          style={{
            background: C.deepGreen,
            border: "none",
            color: "#fff",
            padding: "8px 14px",
            borderRadius: 8,
            fontWeight: 600,
            fontSize: 13,
            cursor: "pointer",
            fontFamily: "'Poppins', sans-serif",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span
            style={{
              background: C.freshGreen,
              width: 18,
              height: 18,
              borderRadius: 4,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 14,
              fontWeight: 700,
              color: "#fff",
            }}
          >
            +
          </span>
          🌱 Log Activity
        </button>

        {/* Eco score */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: C.bg,
            border: `1px solid ${C.border}`,
            borderRadius: 20,
            padding: "5px 14px",
          }}
        >
          <span style={{ fontSize: 14 }}>🌿</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: C.deepGreen }}>
            Eco Score: 78
          </span>
        </div>

        {/* Avatar */}
        <div
          onClick={() => navigate("/app/settings")}
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: C.deepGreen,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontWeight: 700,
            fontSize: 15,
            cursor: "pointer",
          }}
        >
          A
        </div>
      </div>
    </header>
  )
}