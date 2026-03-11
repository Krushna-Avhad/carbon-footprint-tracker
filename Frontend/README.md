# 🌍 CarbonTrack – Carbon Footprint Tracker

A modern, eco-friendly SaaS-style dashboard for monitoring and reducing personal carbon emissions.

## Tech Stack
- **React 18** – UI library
- **Vite** – Build tool & dev server
- **Recharts** – Data visualization (line, bar, pie charts)
- **Poppins** – Typography (Google Fonts)

## Color Palette
| Role | Hex |
|------|-----|
| Dark Green (sidebar) | `#165A36` |
| Deep Green (buttons) | `#2C7A4B` |
| Medium Green (accents) | `#3E8F5F` |
| Fresh Green (icons) | `#59A86C` |
| Light Green (highlights) | `#7BC47F` |
| Background | `#F4F8F5` |

## Pages
1. 🏠 **Landing Page** – Hero, features, how-it-works, CTA
2. 🔐 **Login** – Email + password auth form
3. 📝 **Signup** – Registration form with diet preference
4. 📊 **Dashboard** – Stats, charts, impact widget, quick actions
5. ✏️ **Log Activity** – Tabbed form: Transport / Food / Energy / Waste
6. 📋 **Activity History** – Filterable table with edit/delete
7. 📈 **Carbon Analytics** – Line chart, bar chart, monthly breakdown
8. 🎯 **Goals** – Progress-tracked goal cards + create new goal
9. 🏆 **Achievements** – Earned/locked eco badge grid
10. 🌿 **Sustainability Hub** – Article cards with category filter
11. 🔔 **Notifications** – Read/unread list with dismiss
12. ⚙️ **Settings** – Profile, notifications preferences, security

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## File Structure
```
src/
├── App.jsx                     # Root router
├── main.jsx                    # React entry point
├── constants/
│   ├── colors.js               # Brand color palette
│   └── mockData.js             # All mock data
├── components/
│   ├── layout/
│   │   ├── AppShell.jsx        # Main app wrapper
│   │   ├── Sidebar.jsx         # Left navigation
│   │   └── Navbar.jsx          # Top header
│   └── ui/
│       ├── Card.jsx            # Base card
│       ├── Btn.jsx             # Button variants
│       ├── StatCard.jsx        # Metric card
│       └── AuthCard.jsx        # Auth page wrapper
├── pages/                      # All 12 page components
└── styles/
    └── index.css               # Global styles + scrollbar
```
