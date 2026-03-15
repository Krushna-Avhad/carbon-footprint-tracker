import { useState, useEffect } from 'react'
import { C } from '../constants/colors'
import Card from '../components/ui/Card'
import Btn from '../components/ui/Btn'
import { getArticles } from '../services/api'

const TAG_COLORS = {
  Transport: C.deepGreen,
  Food:      C.freshGreen,
  Energy:    '#F59E0B',
  Waste:     '#6B7280',
  General:   '#6366F1',
}

const TAG_ICONS = {
  Transport: '🚗',
  Food:      '🥦',
  Energy:    '💡',
  Waste:     '♻️',
  General:   '🌍',
}

// Estimate read time from content length
function readTime(content = '') {
  const words = content.split(/\s+/).length
  return `${Math.max(1, Math.round(words / 200))} min`
}

export default function SustainabilityHubPage() {
  const [articles,  setArticles]  = useState([])
  const [category,  setCategory]  = useState('All')
  const [loading,   setLoading]   = useState(true)
  const [expanded,  setExpanded]  = useState(null)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const data = await getArticles(category === 'All' ? undefined : category)
        setArticles(data)
      } catch { console.error('Failed to load articles') }
      finally   { setLoading(false) }
    }
    load()
  }, [category])

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', width: '100%' }}>
      {/* Hero */}
      <div style={{ background: `linear-gradient(135deg, ${C.darkGreen}, ${C.medGreen})`, borderRadius: 14, padding: '32px 36px', marginBottom: 28 }}>
        <div style={{ fontSize: 13, color: C.lightGreen, fontWeight: 600, marginBottom: 8 }}>🌿 Sustainability Hub</div>
        <h2 style={{ color: '#fff', fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Your Guide to a Greener Lifestyle</h2>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, maxWidth: 500 }}>
          Explore expert articles, tips, and guides to help you reduce your carbon footprint across every area of life.
        </p>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        {['All', 'Transport', 'Food', 'Energy', 'Waste', 'General'].map(cat => (
          <button key={cat} onClick={() => setCategory(cat)} style={{
            padding: '7px 16px', borderRadius: 20, fontSize: 13,
            border: `1px solid ${category === cat ? C.deepGreen : C.border}`,
            cursor: 'pointer',
            background: category === cat ? C.deepGreen : C.card,
            color: category === cat ? '#fff' : C.textMuted,
            fontFamily: "'Poppins', sans-serif",
            transition: 'all 0.15s',
          }}>{cat}</button>
        ))}
      </div>

      {/* Article cards */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 48, color: C.textMuted }}>Loading articles…</div>
      ) : articles.length === 0 ? (
        <Card style={{ textAlign: 'center', padding: 48 }}>
          <div style={{ fontSize: 44, marginBottom: 12 }}>📭</div>
          <div style={{ color: C.textMuted, fontSize: 14 }}>No articles found. Check back later or ask an admin to add some!</div>
        </Card>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
          {articles.map((a) => (
            <Card key={a._id} style={{ cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.10)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 1px 8px rgba(0,0,0,0.06)' }}
            >
              <div style={{
                width: '100%', height: 100,
                background: `${TAG_COLORS[a.category] || '#6366F1'}18`,
                borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 44, marginBottom: 16,
              }}>{TAG_ICONS[a.category] || '🌍'}</div>

              <div style={{ display: 'flex', gap: 8, marginBottom: 10, alignItems: 'center' }}>
                <span style={{
                  background: (TAG_COLORS[a.category] || '#6366F1') + '22',
                  color: TAG_COLORS[a.category] || '#6366F1',
                  fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20,
                }}>{a.category}</span>
                <span style={{ color: C.textMuted, fontSize: 11 }}>📖 {readTime(a.content)} read</span>
              </div>

              <div style={{ fontWeight: 700, fontSize: 15, color: C.text, marginBottom: 8 }}>{a.title}</div>
              <div style={{ fontSize: 13, color: C.textMuted, lineHeight: 1.65, marginBottom: 16 }}>
                {expanded === a._id ? a.content : (a.content.length > 120 ? a.content.slice(0, 120) + '…' : a.content)}
              </div>

              <Btn variant="outline" style={{ fontSize: 12, padding: '7px 14px' }}
                onClick={() => setExpanded(expanded === a._id ? null : a._id)}>
                {expanded === a._id ? 'Show less ↑' : 'Read Article →'}
              </Btn>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
