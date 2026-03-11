import { C } from '../constants/colors'
import { articles } from '../constants/mockData'
import Card from '../components/ui/Card'
import Btn from '../components/ui/Btn'

const TAG_COLORS = {
  Transport: C.deepGreen,
  Food:      C.freshGreen,
  Energy:    '#F59E0B',
  Waste:     '#6B7280',
}

export default function SustainabilityHubPage() {
  return (
    <div style={{ maxWidth: 1000 }}>
      {/* Hero banner */}
      <div style={{
        background: `linear-gradient(135deg, ${C.darkGreen}, ${C.medGreen})`,
        borderRadius: 14, padding: '32px 36px', marginBottom: 28,
      }}>
        <div style={{ fontSize: 13, color: C.lightGreen, fontWeight: 600, marginBottom: 8 }}>
          🌿 Sustainability Hub
        </div>
        <h2 style={{ color: '#fff', fontSize: 24, fontWeight: 800, marginBottom: 8 }}>
          Your Guide to a Greener Lifestyle
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, maxWidth: 500 }}>
          Explore expert articles, tips, and guides to help you reduce your carbon footprint across every area of life.
        </p>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        {['All', 'Transport', 'Food', 'Energy', 'Waste'].map(cat => (
          <button key={cat} style={{
            padding: '7px 16px', borderRadius: 20, fontSize: 13,
            border: `1px solid ${C.border}`, cursor: 'pointer',
            background: cat === 'All' ? C.deepGreen : C.card,
            color: cat === 'All' ? '#fff' : C.textMuted,
            fontFamily: "'Poppins', sans-serif",
          }}>{cat}</button>
        ))}
      </div>

      {/* Article cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        gap: 20,
      }}>
        {articles.map((a, i) => (
          <Card key={i} style={{ cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s' }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-4px)'
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.10)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 1px 8px rgba(0,0,0,0.06)'
            }}
          >
            {/* Article icon */}
            <div style={{
              width: '100%', height: 100,
              background: `${TAG_COLORS[a.tag]}18`,
              borderRadius: 8, display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              fontSize: 44, marginBottom: 16,
            }}>
              {a.icon}
            </div>

            {/* Meta */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 10, alignItems: 'center' }}>
              <span style={{
                background: (TAG_COLORS[a.tag] || C.deepGreen) + '22',
                color: TAG_COLORS[a.tag] || C.deepGreen,
                fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20,
              }}>{a.tag}</span>
              <span style={{ color: C.textMuted, fontSize: 11 }}>📖 {a.read} read</span>
            </div>

            <div style={{ fontWeight: 700, fontSize: 15, color: C.text, marginBottom: 8 }}>
              {a.title}
            </div>
            <div style={{ fontSize: 13, color: C.textMuted, lineHeight: 1.65, marginBottom: 16 }}>
              {a.desc}
            </div>

            <Btn variant="outline" style={{ fontSize: 12, padding: '7px 14px' }}>
              Read Article →
            </Btn>
          </Card>
        ))}
      </div>
    </div>
  )
}
