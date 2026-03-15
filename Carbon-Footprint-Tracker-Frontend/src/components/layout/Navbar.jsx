import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { C } from '../../constants/colors'
import { getSummary, getProfile } from '../../services/api'

const PAGE_TITLES = {
  dashboard:     'Dashboard',
  log:           'Log Activity',
  history:       'Activity History',
  analytics:     'Carbon Analytics',
  goals:         'Goals',
  achievements:  'Achievements',
  hub:           'Sustainability Hub',
  notifications: 'Notifications',
  settings:      'Settings',
}

// Score colour: green → yellow → red
function scoreColor(score) {
  if (score >= 70) return C.deepGreen
  if (score >= 40) return '#F59E0B'
  return '#EF4444'
}

export default function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()

  const page = location.pathname.split('/')[2] || 'dashboard'

  const [ecoScore,    setEcoScore]    = useState(null)
  const [unreadCount, setUnreadCount] = useState(0)
  const [search,      setSearch]      = useState('')
  const [userName,    setUserName]    = useState('')

  useEffect(() => {
    // Load eco score from summary endpoint
    getSummary()
      .then(data => setEcoScore(data.ecoScore ?? null))
      .catch(() => {})
  }, [location.pathname]) // refresh on each page change

  // Load user name from profile API
  useEffect(() => {
    const token = localStorage.getItem('ahb_token')
    if (!token) return
    getProfile()
      .then(data => {
        const initial = data?.name?.[0]?.toUpperCase() || data?.email?.[0]?.toUpperCase() || '?'
        setUserName(initial)
      })
      .catch(() => setUserName('?'))
  }, [])

  const handleSearch = (e) => {
    const val = e.target.value
    setSearch(val)

    // Navigate to history page and pass the search query via URL state
    if (val.trim()) {
      navigate('/app/history', { state: { search: val } })
    }
  }

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter' && search.trim()) {
      navigate('/app/history', { state: { search: search.trim() } })
    }
    if (e.key === 'Escape') {
      setSearch('')
    }
  }

  // Clear search input when navigating away from history
  useEffect(() => {
    if (page !== 'history') setSearch('')
  }, [page])

  return (
    <header style={{
      height: 64,
      background: C.card,
      borderBottom: `1px solid ${C.border}`,
      display: 'flex',
      alignItems: 'center',
      padding: '0 28px',
      justifyContent: 'space-between',
      flexShrink: 0,
      position: 'sticky',
      top: 0,
      zIndex: 10,
    }}>
      {/* Page title */}
      <div style={{ fontWeight: 700, fontSize: 18, color: C.text }}>
        {PAGE_TITLES[page] || 'Dashboard'}
      </div>

      {/* Right controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>

        {/* Global Search */}
        <div style={{ position: 'relative' }}>
          <input
            value={search}
            onChange={handleSearch}
            onKeyDown={handleSearchKeyDown}
            placeholder="Search activities…"
            style={{
              padding: '8px 14px 8px 36px',
              border: `1px solid ${search ? C.deepGreen : C.border}`,
              borderRadius: 8, fontSize: 13,
              color: C.text, background: C.bg,
              outline: 'none', width: 200,
              fontFamily: "'Poppins', sans-serif",
              transition: 'border-color 0.15s',
            }}
          />
          <span style={{
            position: 'absolute', left: 11, top: '50%',
            transform: 'translateY(-50%)', fontSize: 14, pointerEvents: 'none',
          }}>🔍</span>
          {search && (
            <button onClick={() => setSearch('')} style={{
              position: 'absolute', right: 8, top: '50%',
              transform: 'translateY(-50%)', background: 'none',
              border: 'none', cursor: 'pointer', fontSize: 14, color: C.textMuted,
            }}>✕</button>
          )}
        </div>

        {/* Notification Bell */}
        <button
          onClick={() => navigate('/app/notifications')}
          style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', position: 'relative', padding: 4 }}
        >
          🔔
          <span style={{
            position: 'absolute', top: 2, right: 2,
            width: 8, height: 8,
            background: C.freshGreen,
            borderRadius: '50%',
            border: '2px solid #fff',
          }} />
        </button>

        {/* Log Activity shortcut */}
        <button
          onClick={() => navigate('/app/log')}
          style={{
            background: C.deepGreen, border: 'none', color: '#fff',
            padding: '8px 14px', borderRadius: 8,
            fontWeight: 600, fontSize: 13, cursor: 'pointer',
            fontFamily: "'Poppins', sans-serif",
            display: 'flex', alignItems: 'center', gap: 8,
          }}
        >
          <span style={{
            background: C.freshGreen, width: 18, height: 18,
            borderRadius: 4, display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            fontSize: 14, fontWeight: 700, color: '#fff',
          }}>+</span>
          🌱 Log Activity
        </button>

        {/* Dynamic Eco Score */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: C.bg, border: `1px solid ${C.border}`,
          borderRadius: 20, padding: '5px 14px',
          cursor: 'pointer',
        }}
          onClick={() => navigate('/app/analytics')}
          title="Click to view Analytics"
        >
          <span style={{ fontSize: 14 }}>🌿</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: ecoScore !== null ? scoreColor(ecoScore) : C.textMuted }}>
            {ecoScore !== null ? `Eco Score: ${ecoScore}` : 'Eco Score: —'}
          </span>
        </div>

        {/* User Avatar */}
        <div
          onClick={() => navigate('/app/settings')}
          style={{
            width: 36, height: 36, borderRadius: '50%',
            background: `linear-gradient(135deg, ${C.deepGreen}, ${C.freshGreen})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 700, fontSize: 15, cursor: 'pointer',
          }}
        >
          {userName || '?'}
        </div>

      </div>
    </header>
  )
}
