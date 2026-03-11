import { useState } from 'react'
import { C } from '../constants/colors'
import { notifications as initialNotifs } from '../constants/mockData'
import Card from '../components/ui/Card'

export default function NotificationsPage() {
  const [notifs, setNotifs] = useState(initialNotifs)

  const unread = notifs.filter(n => !n.read).length

  const markAllRead = () => setNotifs(prev => prev.map(n => ({ ...n, read: true })))
  const dismiss = (id) => setNotifs(prev => prev.filter(n => n.id !== id))
  const markRead = (id) => setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))

  return (
    <div style={{ maxWidth: 640 }}>
      {/* Header */}
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: 20,
      }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 17, color: C.text }}>Notifications</div>
          <div style={{ fontSize: 13, color: C.textMuted, marginTop: 2 }}>
            {unread > 0 ? `${unread} unread` : 'All caught up 🎉'}
          </div>
        </div>
        {unread > 0 && (
          <button
            onClick={markAllRead}
            style={{
              background: 'none', border: 'none',
              color: C.deepGreen, fontSize: 13,
              cursor: 'pointer', fontWeight: 600,
              fontFamily: "'Poppins', sans-serif",
            }}
          >Mark all as read</button>
        )}
      </div>

      {/* Notification list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {notifs.length === 0 && (
          <Card style={{ textAlign: 'center', padding: 48 }}>
            <div style={{ fontSize: 44, marginBottom: 12 }}>📭</div>
            <div style={{ color: C.textMuted, fontSize: 14 }}>No notifications yet.</div>
          </Card>
        )}
        {notifs.map(n => (
          <div
            key={n.id}
            style={{
              display: 'flex', alignItems: 'flex-start', gap: 16,
              padding: '16px 18px',
              background: n.read ? C.card : '#F0FDF4',
              borderRadius: 12,
              border: n.read ? `1px solid ${C.border}` : `1.5px solid ${C.freshGreen}44`,
              boxShadow: '0 1px 6px rgba(0,0,0,0.05)',
              cursor: 'pointer',
            }}
            onClick={() => markRead(n.id)}
          >
            <div style={{ fontSize: 26, flexShrink: 0 }}>{n.icon}</div>

            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: 14, color: C.text,
                fontWeight: n.read ? 400 : 600,
                lineHeight: 1.5,
              }}>{n.msg}</div>
              <div style={{ fontSize: 12, color: C.textMuted, marginTop: 4 }}>{n.time}</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, flexShrink: 0 }}>
              {!n.read && (
                <div style={{
                  width: 9, height: 9,
                  background: C.freshGreen,
                  borderRadius: '50%',
                }} />
              )}
              <button
                onClick={e => { e.stopPropagation(); dismiss(n.id) }}
                style={{
                  background: 'none', border: 'none',
                  color: C.textMuted, cursor: 'pointer',
                  fontSize: 16, lineHeight: 1,
                  fontFamily: "'Poppins', sans-serif",
                }}
                title="Dismiss"
              >✕</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
