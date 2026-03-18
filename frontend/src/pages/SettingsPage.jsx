import { useState, useEffect } from 'react'
import { C } from '../constants/colors'
import Card from '../components/ui/Card'
import Btn from '../components/ui/Btn'
import { getProfile, updateProfile, changePassword, deleteAccount } from '../services/api'

const inp = {
  width: '100%', padding: '11px 14px', border: `1px solid ${C.border}`,
  borderRadius: 8, fontSize: 14, color: C.text, background: C.bg,
  outline: 'none', boxSizing: 'border-box',
  fontFamily: "'Poppins', sans-serif", marginTop: 6,
}
const lbl = { fontSize: 13, color: C.textMuted, fontWeight: 500 }
function Field({ label, children }) {
  return <div><label style={lbl}>{label}</label>{children}</div>
}

export default function SettingsPage() {
  const [profile,  setProfile]  = useState({ name: '', email: '', country: '', dietType: '', carbonGoal: '' })
  const [profSaved, setProfSaved] = useState(false)
  const [profErr,   setProfErr]   = useState('')

  const [pwForm,  setPwForm]  = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [pwMsg,   setPwMsg]   = useState('')
  const [pwErr,   setPwErr]   = useState('')
  const [pwLoading, setPwLoading] = useState(false)

  const [delPass,    setDelPass]    = useState('')
  const [delErr,     setDelErr]     = useState('')
  const [delLoading, setDelLoading] = useState(false)
  const [showDel,    setShowDel]    = useState(false)

  const [notifPrefs, setNotifPrefs] = useState({
    weeklyReports:     true,
    goalAlerts:        true,
    achievements:      true,
    sustainabilityTips: false,
  })

  // Load profile on mount
  useEffect(() => {
    getProfile().then(data => {
      setProfile({
        name:       data?.name    || '',
        email:      data?.email   || '',
        country:    data?.country || '',
        dietType:   data?.lifestylePreferences?.dietType || '',
        carbonGoal: data?.carbonGoal || '',
      })
    }).catch(console.error)
  }, [])

  const handleProfileChange = e => setProfile(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSaveProfile = async () => {
    setProfErr(''); setProfSaved(false)
    try {
      await updateProfile({
        name:       profile.name,
        email:      profile.email,
        country:    profile.country,
        dietType:   profile.dietType,
        carbonGoal: profile.carbonGoal ? parseFloat(profile.carbonGoal) : undefined,
      })
      setProfSaved(true)
      setTimeout(() => setProfSaved(false), 2500)
    } catch (err) {
      setProfErr(err.response?.data?.message || 'Failed to save profile.')
    }
  }

  const handleChangePw = async () => {
    setPwErr(''); setPwMsg('')
    if (!pwForm.currentPassword || !pwForm.newPassword)
      return setPwErr('Please fill in all password fields.')
    if (pwForm.newPassword !== pwForm.confirmPassword)
      return setPwErr('New passwords do not match.')
    if (pwForm.newPassword.length < 6)
      return setPwErr('New password must be at least 6 characters.')
    setPwLoading(true)
    try {
      await changePassword({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword })
      setPwMsg('Password changed successfully!')
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
      setTimeout(() => setPwMsg(''), 3000)
    } catch (err) {
      setPwErr(err.response?.data?.message || 'Failed to change password.')
    } finally { setPwLoading(false) }
  }

  const handleDeleteAccount = async () => {
    if (!delPass) return setDelErr('Enter your password to confirm deletion.')
    setDelLoading(true); setDelErr('')
    try {
      await deleteAccount({ password: delPass })
      localStorage.removeItem('ahb_token')
      window.location.href = '/'
    } catch (err) {
      setDelErr(err.response?.data?.message || 'Failed to delete account.')
    } finally { setDelLoading(false) }
  }

  return (
    <div style={{ maxWidth: 600, display: 'flex', flexDirection: 'column', gap: 24 , margin: '0 auto' }}>

      {/* ── Profile ── */}
      <Card>
        <div style={{ fontWeight: 700, fontSize: 16, color: C.text, marginBottom: 20 }}>Profile Information</div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 24 }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%',
            background: `linear-gradient(135deg, ${C.deepGreen}, ${C.freshGreen})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 800, fontSize: 26,
          }}>{profile.name?.charAt(0)?.toUpperCase() || '?'}</div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 15, color: C.text }}>{profile.name}</div>
            <div style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>{profile.email}</div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Field label="Full Name">
            <input style={inp} type="text" name="name" value={profile.name} onChange={handleProfileChange} />
          </Field>
          <Field label="Email Address">
            <input style={inp} type="email" name="email" value={profile.email} onChange={handleProfileChange} />
          </Field>
          <Field label="Country / Location">
            <input style={inp} type="text" name="country" value={profile.country} onChange={handleProfileChange} placeholder="e.g. India" />
          </Field>
          <Field label="Diet Preference">
            <select style={inp} name="dietType" value={profile.dietType} onChange={handleProfileChange}>
              <option value="">— Select —</option>
              <option value="Vegetarian">Vegetarian</option>
              <option value="Vegan">Vegan</option>
              <option value="Omnivore">Omnivore</option>
              <option value="Pescatarian">Pescatarian</option>
            </select>
          </Field>
          <Field label="Carbon Goal (kg/month)">
            <input style={inp} type="number" name="carbonGoal" value={profile.carbonGoal} onChange={handleProfileChange} placeholder="e.g. 200" min="0" />
          </Field>

          {profErr && <div style={{ color: '#EF4444', fontSize: 13 }}>{profErr}</div>}

          <div style={{ paddingTop: 8, display: 'flex', gap: 10, alignItems: 'center' }}>
            <Btn onClick={handleSaveProfile}>{profSaved ? '✓ Saved!' : 'Save Changes'}</Btn>
            {profSaved && <span style={{ fontSize: 13, color: C.freshGreen, fontWeight: 600 }}>Profile updated!</span>}
          </div>
        </div>
      </Card>

      {/* ── Change Password ── */}
      <Card>
        <div style={{ fontWeight: 700, fontSize: 16, color: C.text, marginBottom: 6 }}>Change Password</div>
        <div style={{ fontSize: 13, color: C.textMuted, marginBottom: 20 }}>
          Choose a strong password of at least 6 characters.
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Field label="Current Password">
            <input style={inp} type="password" value={pwForm.currentPassword}
              onChange={e => setPwForm(p => ({ ...p, currentPassword: e.target.value }))} placeholder="••••••••" />
          </Field>
          <Field label="New Password">
            <input style={inp} type="password" value={pwForm.newPassword}
              onChange={e => setPwForm(p => ({ ...p, newPassword: e.target.value }))} placeholder="••••••••" />
          </Field>
          <Field label="Confirm New Password">
            <input style={inp} type="password" value={pwForm.confirmPassword}
              onChange={e => setPwForm(p => ({ ...p, confirmPassword: e.target.value }))} placeholder="••••••••" />
          </Field>
          {pwErr && <div style={{ color: '#EF4444', fontSize: 13 }}>{pwErr}</div>}
          {pwMsg && <div style={{ color: C.freshGreen, fontSize: 13, fontWeight: 600 }}>{pwMsg}</div>}
          <div>
            <Btn onClick={handleChangePw} disabled={pwLoading}>{pwLoading ? 'Changing…' : '🔒 Change Password'}</Btn>
          </div>
        </div>
      </Card>

      {/* ── Notification Prefs ── */}
      <Card>
        <div style={{ fontWeight: 700, fontSize: 16, color: C.text, marginBottom: 4 }}>Notification Preferences</div>
        <div style={{ fontSize: 13, color: C.textMuted, marginBottom: 18 }}>Choose what notifications you receive.</div>
        {[
          { key: 'weeklyReports',    label: 'Weekly emission reports',  desc: 'A summary of your weekly CO₂ usage' },
          { key: 'goalAlerts',       label: 'Goal milestone alerts',    desc: 'When you are close to or exceed a goal' },
          { key: 'achievements',     label: 'New achievements',         desc: 'When you unlock a new badge' },
          { key: 'sustainabilityTips', label: 'Sustainability tips',    desc: 'Occasional eco tips and articles' },
        ].map(({ key, label, desc }) => {
          const on = notifPrefs[key]
          return (
            <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: `1px solid ${C.border}` }}>
              <div>
                <div style={{ fontSize: 14, color: C.text, fontWeight: 500 }}>{label}</div>
                <div style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>{desc}</div>
              </div>
              <div
                onClick={() => setNotifPrefs(p => ({ ...p, [key]: !p[key] }))}
                style={{
                  width: 44, height: 24, borderRadius: 12, flexShrink: 0,
                  background: on ? C.deepGreen : '#D1D5DB',
                  position: 'relative', cursor: 'pointer',
                  transition: 'background 0.2s',
                }}
              >
                <div style={{
                  position: 'absolute',
                  top: 3,
                  left: on ? 22 : 3,
                  width: 18, height: 18,
                  borderRadius: '50%',
                  background: '#fff',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                  transition: 'left 0.2s',
                }} />
              </div>
            </div>
          )
        })}
      </Card>

      {/* ── Delete Account ── */}
      <Card>
        <div style={{ fontWeight: 700, fontSize: 16, color: C.text, marginBottom: 6 }}>Danger Zone</div>
        <div style={{ fontSize: 13, color: C.textMuted, marginBottom: 20 }}>
          Permanently delete your account and all associated data. This cannot be undone.
        </div>

        {!showDel ? (
          <Btn variant="danger" onClick={() => setShowDel(true)} style={{ width: '100%' }}>
            🗑️ Delete Account
          </Btn>
        ) : (
          <div style={{ background: '#FEF2F2', borderRadius: 10, padding: 20, border: '1px solid #FCA5A5' }}>
            <div style={{ fontWeight: 600, fontSize: 14, color: '#DC2626', marginBottom: 12 }}>
              ⚠️ This will permanently delete all your data.
            </div>
            <label style={lbl}>Enter your password to confirm</label>
            <input
              style={{ ...inp, borderColor: '#FCA5A5' }}
              type="password" value={delPass}
              onChange={e => setDelPass(e.target.value)}
              placeholder="••••••••"
            />
            {delErr && <div style={{ color: '#EF4444', fontSize: 13, marginTop: 8 }}>{delErr}</div>}
            <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
              <Btn variant="danger" onClick={handleDeleteAccount} disabled={delLoading}>
                {delLoading ? 'Deleting…' : 'Yes, Delete My Account'}
              </Btn>
              <Btn variant="ghost" onClick={() => { setShowDel(false); setDelPass(''); setDelErr('') }}>Cancel</Btn>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
