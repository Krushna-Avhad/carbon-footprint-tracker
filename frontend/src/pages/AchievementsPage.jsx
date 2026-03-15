import { useState, useEffect } from 'react'
import { C } from '../constants/colors'
import Card from '../components/ui/Card'
import { getAchievements } from '../services/api'

export default function AchievementsPage() {
  const [badges,  setBadges]  = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getAchievements()
        setBadges(data)
      } catch {
        setError('Failed to load achievements.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const earned = badges.filter(b => b.earned).length

  if (loading) {
    return <Card style={{ textAlign: 'center', padding: 48 }}><div style={{ color: C.textMuted }}>Loading achievements…</div></Card>
  }

  if (error) {
    return <Card style={{ textAlign: 'center', padding: 48 }}><div style={{ color: '#EF4444' }}>{error}</div></Card>
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', width: '100%' }}>
      {/* Summary */}
      <div style={{ display: 'flex', gap: 20, marginBottom: 28, flexWrap: 'wrap' }}>
        <Card style={{ flex: 1, minWidth: 160, textAlign: 'center', background: `linear-gradient(135deg, ${C.deepGreen}, ${C.freshGreen})` }}>
          <div style={{ fontSize: 32, color: '#fff', fontWeight: 800 }}>{earned}</div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)' }}>Badges Earned</div>
        </Card>
        <Card style={{ flex: 1, minWidth: 160, textAlign: 'center' }}>
          <div style={{ fontSize: 32, color: C.text, fontWeight: 800 }}>{badges.length - earned}</div>
          <div style={{ fontSize: 13, color: C.textMuted }}>Still to Unlock</div>
        </Card>
        <Card style={{ flex: 1, minWidth: 160, textAlign: 'center' }}>
          <div style={{ fontSize: 32, color: C.text, fontWeight: 800 }}>
            {badges.length > 0 ? Math.round((earned / badges.length) * 100) : 0}%
          </div>
          <div style={{ fontSize: 13, color: C.textMuted }}>Completion</div>
        </Card>
      </div>

      <div style={{ fontWeight: 700, fontSize: 17, color: C.text, marginBottom: 20 }}>Eco Badges</div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(195px, 1fr))',
        gap: 18,
      }}>
        {badges.map((b, i) => (
          <Card key={i} style={{
            textAlign: 'center',
            opacity: b.earned ? 1 : 0.5,
            position: 'relative',
            transition: 'transform 0.2s',
            cursor: b.earned ? 'default' : 'not-allowed',
          }}
            onMouseEnter={e => { if (b.earned) e.currentTarget.style.transform = 'translateY(-3px)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)' }}
          >
            {b.earned && (
              <div style={{
                position: 'absolute', top: 10, right: 10,
                background: C.freshGreen, color: '#fff',
                fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 10,
              }}>✓ Earned</div>
            )}
            <div style={{ fontSize: 48, marginBottom: 12, filter: b.earned ? 'none' : 'grayscale(1)' }}>
              {b.icon}
            </div>
            <div style={{ fontWeight: 700, fontSize: 14, color: C.text, marginBottom: 6 }}>{b.name}</div>
            <div style={{ fontSize: 12, color: C.textMuted, lineHeight: 1.5, marginBottom: 10 }}>{b.desc}</div>
            {b.earned
              ? <div style={{ fontSize: 11, color: C.freshGreen }}>🗓 {b.date}</div>
              : <div style={{ fontSize: 11, color: C.textMuted }}>🔒 Not yet earned</div>
            }
          </Card>
        ))}
      </div>
    </div>
  )
}
