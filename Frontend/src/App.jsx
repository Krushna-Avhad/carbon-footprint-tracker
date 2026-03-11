import { useState } from 'react'
import LandingPage  from './pages/LandingPage'
import LoginPage    from './pages/LoginPage'
import SignupPage   from './pages/SignupPage'
import AppShell     from './components/layout/AppShell'

export default function App() {
  const [view, setView] = useState('landing') // 'landing' | 'login' | 'signup' | 'app'

  switch (view) {
    case 'login':   return <LoginPage  setView={setView} />
    case 'signup':  return <SignupPage setView={setView} />
    case 'app':     return <AppShell />
    default:        return <LandingPage setView={setView} />
  }
}
