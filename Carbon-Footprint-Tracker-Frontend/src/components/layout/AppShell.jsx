import { Routes, Route, Navigate } from "react-router-dom";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { C } from "../../constants/colors";

import DashboardPage from "../../pages/DashboardPage";
import LogActivityPage from "../../pages/LogActivityPage";
import ActivityHistoryPage from "../../pages/ActivityHistoryPage";
import CarbonAnalyticsPage from "../../pages/CarbonAnalyticsPage";
import GoalsPage from "../../pages/GoalsPage";
import AchievementsPage from "../../pages/AchievementsPage";
import SustainabilityHubPage from "../../pages/SustainabilityHubPage";
import NotificationsPage from "../../pages/NotificationsPage";
import SettingsPage from "../../pages/SettingsPage";

export default function AppShell() {
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        fontFamily: "'Poppins', sans-serif",
        background: C.bg,
      }}
    >
      {/* Sidebar */}
      <Sidebar />

      {/* Main content area */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "auto",
        }}
      >
        {/* Navbar */}
        <Navbar />

        {/* Page Content */}
        <main style={{ flex: 1, padding: 28, display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: '100%', maxWidth: 1300 }}>
          <Routes>
            <Route path="/" element={<Navigate to="dashboard" />} />

            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="log" element={<LogActivityPage />} />
            <Route path="history" element={<ActivityHistoryPage />} />
            <Route path="analytics" element={<CarbonAnalyticsPage />} />
            <Route path="goals" element={<GoalsPage />} />
            <Route path="achievements" element={<AchievementsPage />} />
            <Route path="hub" element={<SustainabilityHubPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}