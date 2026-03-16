import { useState, useEffect } from 'react'
import { C } from '../constants/colors'
import Card from '../components/ui/Card'
import { getNotifications, markNotificationRead, markAllNotificationsRead, dismissNotification } from '../services/api'

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins  = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days  = Math.floor(diff / 86400000)
  if (days  > 0) return `${days}d ago`
  if (hours > 0) return `${hours}h ago`
  if (mins  > 0) return `${mins}m ago`
  return 'just now'
}

// Icon based on notification type field (with message fallback)
function iconFor(type = '', msg = '') {
  const icons = {
    achievement: '🏆',
    goal:        '🎯',
    streak:      '🔥',
    summary:     '📊',
    inactivity:  '📅',
    deadline:    '⏳',
    general:     '🌱',
  }
  if (icons[type]) return icons[type]
  // Fallback: scan message text
  if (msg.includes('🏆') || msg.includes('Achievement')) return '🏆'
  if (msg.includes('🔥') || msg.includes('streak'))      return '🔥'
  if (msg.includes('⚠️') || msg.includes('Warning'))     return '⚠️'
  if (msg.includes('🔴') || msg.includes('exceeded'))    return '🔴'
  if (msg.includes('📊') || msg.includes('week'))        return '📊'
  if (msg.includes('⏳') || msg.includes('deadline'))    return '⏳'
  if (msg.includes('📅') || msg.includes('haven'))       return '📅'
  if (msg.includes('🌱') || msg.includes('first'))       return '🌱'
  if (msg.includes('👋') || msg.includes('Welcome'))     return '👋'
  return '🔔'
}

export default function NotificationsPage() {
  const [notifs,  setNotifs]  = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getNotifications()
      .then(data => setNotifs(data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const unread = notifs.filter(n => !n.read).length

  const handleMarkRead = async (id) => {
    try {
      await markNotificationRead(id)
      setNotifs(prev => prev.map(n => n._id === id ? { ...n, read: true } : n))
    } catch { console.error('markRead failed') }
  }

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead()
      setNotifs(prev => prev.map(n => ({ ...n, read: true })))
    } catch { console.error('markAllRead failed') }
  }

  const handleDismiss = async (id, e) => {
    e.stopPropagation()
    try {
      await dismissNotification(id)
      setNotifs(prev => prev.filter(n => n._id !== id))
    } catch { console.error('dismiss failed') }
  }

  return (
    <div style={{ maxWidth: 640 , margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 17, color: C.text }}>Notifications</div>
          <div style={{ fontSize: 13, color: C.textMuted, marginTop: 2 }}>
            {loading ? 'Loading…' : unread > 0 ? `${unread} unread` : 'All caught up 🎉'}
          </div>
        </div>
        {unread > 0 && (
          <button onClick={handleMarkAllRead} style={{
            background: 'none', border: 'none', color: C.deepGreen,
            fontSize: 13, cursor: 'pointer', fontWeight: 600,
            fontFamily: "'Poppins', sans-serif",
          }}>Mark all as read</button>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {loading ? (
          <Card style={{ textAlign: 'center', padding: 32 }}>
            <div style={{ color: C.textMuted, fontSize: 14 }}>Loading…</div>
          </Card>
        ) : notifs.length === 0 ? (
          <Card style={{ textAlign: 'center', padding: 48 }}>
            <div style={{ fontSize: 44, marginBottom: 12 }}>📭</div>
            <div style={{ color: C.textMuted, fontSize: 14 }}>No notifications yet.</div>
          </Card>
        ) : notifs.map(n => (
          <div key={n._id} onClick={() => handleMarkRead(n._id)} style={{
            display: 'flex', alignItems: 'flex-start', gap: 16,
            padding: '16px 18px',
            background: n.read ? C.card : '#F0FDF4',
            borderRadius: 12,
            border: n.read ? `1px solid ${C.border}` : `1.5px solid ${C.freshGreen}44`,
            boxShadow: '0 1px 6px rgba(0,0,0,0.05)',
            cursor: 'pointer',
            transition: 'background 0.15s',
          }}>
            <div style={{ fontSize: 26, flexShrink: 0 }}>{iconFor(n.type, n.message)}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, color: C.text, fontWeight: n.read ? 400 : 600, lineHeight: 1.5 }}>
                {n.message}
              </div>
              <div style={{ fontSize: 12, color: C.textMuted, marginTop: 4 }}>{timeAgo(n.date)}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, flexShrink: 0 }}>
              {!n.read && <div style={{ width: 9, height: 9, background: C.freshGreen, borderRadius: '50%' }} />}
              <button onClick={(e) => handleDismiss(n._id, e)} style={{
                background: 'none', border: 'none', color: C.textMuted,
                cursor: 'pointer', fontSize: 16, lineHeight: 1,
                fontFamily: "'Poppins', sans-serif",
              }} title="Dismiss">✕</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
