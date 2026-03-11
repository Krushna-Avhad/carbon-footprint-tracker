import { useState } from 'react'
import { C } from '../constants/colors'
import Card from '../components/ui/Card'
import Btn from '../components/ui/Btn'

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
const lbl = { fontSize: 13, color: C.textMuted, fontWeight: 500 }

function Field({ label, children }) {
  return <div><label style={lbl}>{label}</label>{children}</div>
}

export default function SettingsPage() {
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div style={{ maxWidth: 600, display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* Profile */}
      <Card>
        <div style={{ fontWeight: 700, fontSize: 16, color: C.text, marginBottom: 20 }}>
          Profile Information
        </div>

        {/* Avatar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 24 }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%',
            background: `linear-gradient(135deg, ${C.deepGreen}, ${C.freshGreen})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 800, fontSize: 26,
          }}>A</div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 15, color: C.text }}>Alex Johnson</div>
            <button style={{
              background: 'none', border: 'none',
              color: C.deepGreen, fontSize: 13,
              cursor: 'pointer', fontFamily: "'Poppins', sans-serif",
              padding: 0, marginTop: 4,
            }}>Change profile photo</button>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Field label="Full Name">
            <input style={inp} defaultValue="Alex Johnson" />
          </Field>
          <Field label="Email Address">
            <input type="email" style={inp} defaultValue="alex@example.com" />
          </Field>
          <Field label="Location">
            <input style={inp} defaultValue="San Francisco, CA" />
          </Field>
          <Field label="Diet Preference">
            <select style={inp}>
              <option>Vegetarian</option>
              <option>Vegan</option>
              <option>Omnivore</option>
              <option>Pescatarian</option>
            </select>
          </Field>
          <Field label="Carbon Goal (kg/month)">
            <input type="number" style={inp} defaultValue="180" />
          </Field>

          <div style={{ paddingTop: 8, display: 'flex', gap: 10, alignItems: 'center' }}>
            <Btn onClick={handleSave}>
              {saved ? '✓ Saved!' : 'Save Changes'}
            </Btn>
            {saved && (
              <span style={{ fontSize: 13, color: C.freshGreen, fontWeight: 600 }}>
                Profile updated successfully.
              </span>
            )}
          </div>
        </div>
      </Card>

      {/* Notifications preferences */}
      <Card>
        <div style={{ fontWeight: 700, fontSize: 16, color: C.text, marginBottom: 18 }}>
          Notification Preferences
        </div>
        {[
          'Weekly emission reports',
          'Goal milestone alerts',
          'New achievements',
          'Sustainability tips',
        ].map(pref => (
          <div key={pref} style={{
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', padding: '12px 0',
            borderBottom: `1px solid ${C.border}`,
          }}>
            <span style={{ fontSize: 14, color: C.text }}>{pref}</span>
            <div style={{
              width: 40, height: 22, borderRadius: 11,
              background: C.deepGreen, position: 'relative', cursor: 'pointer',
            }}>
              <div style={{
                position: 'absolute', right: 3, top: 3,
                width: 16, height: 16, borderRadius: '50%',
                background: '#fff',
              }} />
            </div>
          </div>
        ))}
      </Card>

      {/* Security */}
      <Card>
        <div style={{ fontWeight: 700, fontSize: 16, color: C.text, marginBottom: 6 }}>
          Security
        </div>
        <div style={{ fontSize: 13, color: C.textMuted, marginBottom: 20 }}>
          Manage your password and account security settings.
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Btn variant="outline">🔒 Change Password</Btn>
          <Btn variant="outline">🔐 Enable Two-Factor Auth</Btn>
          <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 16, marginTop: 4 }}>
            <Btn variant="danger" style={{ width: '100%' }}>
              🗑️ Delete Account
            </Btn>
            <div style={{ fontSize: 12, color: C.textMuted, marginTop: 8, textAlign: 'center' }}>
              This action is irreversible. All your data will be permanently removed.
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
