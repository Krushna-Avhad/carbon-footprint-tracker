import { useState } from 'react'
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import { C } from '../../constants/colors'

import DashboardPage      from '../../pages/DashboardPage'
import LogActivityPage    from '../../pages/LogActivityPage'
import ActivityHistoryPage from '../../pages/ActivityHistoryPage'
import CarbonAnalyticsPage from '../../pages/CarbonAnalyticsPage'
import GoalsPage          from '../../pages/GoalsPage'
import AchievementsPage   from '../../pages/AchievementsPage'
import SustainabilityHubPage from '../../pages/SustainabilityHubPage'
import NotificationsPage  from '../../pages/NotificationsPage'
import SettingsPage       from '../../pages/SettingsPage'

const PAGE_MAP = {
  dashboard:     DashboardPage,
  log:           LogActivityPage,
  history:       ActivityHistoryPage,
  analytics:     CarbonAnalyticsPage,
  goals:         GoalsPage,
  achievements:  AchievementsPage,
  hub:           SustainabilityHubPage,
  notifications: NotificationsPage,
  settings:      SettingsPage,
}

export default function AppShell() {
  const [page, setPage] = useState('dashboard')
  const PageComponent = PAGE_MAP[page] || DashboardPage

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      fontFamily: "'Poppins', sans-serif",
      background: C.bg,
    }}>
      <Sidebar page={page} setPage={setPage} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
        <Navbar page={page} setPage={setPage} />
        <main style={{ flex: 1, padding: 28 }}>
          <PageComponent setPage={setPage} />
        </main>
      </div>
    </div>
  )
}
