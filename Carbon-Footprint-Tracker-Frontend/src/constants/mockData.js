// ─── Chart Data ───────────────────────────────────────────────────────────────
export const lineData = [
  { month: 'Jan', emissions: 120 },
  { month: 'Feb', emissions: 105 },
  { month: 'Mar', emissions: 98  },
  { month: 'Apr', emissions: 88  },
  { month: 'May', emissions: 76  },
  { month: 'Jun', emissions: 70  },
]

export const pieData = [
  { name: 'Transport', value: 38 },
  { name: 'Food',      value: 28 },
  { name: 'Energy',    value: 22 },
  { name: 'Waste',     value: 12 },
]

export const barData = [
  { category: 'Transport', value: 45 },
  { category: 'Food',      value: 30 },
  { category: 'Energy',    value: 25 },
  { category: 'Waste',     value: 15 },
]

// ─── Activity History ─────────────────────────────────────────────────────────
export const historyData = [
  { date: '2024-06-10', type: 'Transport', details: 'Car – 15 km',        co2: '3.2 kg' },
  { date: '2024-06-10', type: 'Food',      details: 'Beef meal',           co2: '4.5 kg' },
  { date: '2024-06-09', type: 'Energy',    details: 'AC – 5 hrs',          co2: '2.1 kg' },
  { date: '2024-06-09', type: 'Transport', details: 'Bus – 10 km',         co2: '0.8 kg' },
  { date: '2024-06-08', type: 'Waste',     details: 'General waste',       co2: '1.2 kg' },
  { date: '2024-06-08', type: 'Food',      details: 'Vegetarian meal',     co2: '0.9 kg' },
  { date: '2024-06-07', type: 'Transport', details: 'Train – 40 km',       co2: '1.1 kg' },
  { date: '2024-06-07', type: 'Energy',    details: 'Washing machine x2',  co2: '0.7 kg' },
]

// ─── Goals ────────────────────────────────────────────────────────────────────
export const goalsData = [
  { title: 'Reduce emissions by 20%',          category: 'Overall',   deadline: 'Sep 2024', progress: 62, status: 'On Track'  },
  { title: 'Switch to public transport daily', category: 'Transport', deadline: 'Aug 2024', progress: 80, status: 'Ahead'     },
  { title: 'Adopt vegetarian diet 5x/week',    category: 'Food',      deadline: 'Jul 2024', progress: 40, status: 'Needs Work'},
]

// ─── Achievements ─────────────────────────────────────────────────────────────
export const badges = [
  { icon: '🌱', name: 'Green Starter',   desc: 'Logged your first activity',         date: 'May 1, 2024',  earned: true  },
  { icon: '✈️', name: 'Eco Traveler',    desc: 'Reduced transport emissions by 20%', date: 'May 15, 2024', earned: true  },
  { icon: '🗑️', name: 'Waste Warrior',  desc: 'Zero waste for 7 days',              date: 'Jun 1, 2024',  earned: true  },
  { icon: '⚡',  name: 'Energy Saver',   desc: 'Cut energy usage by 30%',            date: '—',            earned: false },
  { icon: '🥗',  name: 'Plant Powered',  desc: 'Vegetarian for 30 days',             date: '—',            earned: false },
  { icon: '🌍',  name: 'Carbon Hero',    desc: 'Reach net zero for a month',         date: '—',            earned: false },
]

// ─── Articles ─────────────────────────────────────────────────────────────────
export const articles = [
  { icon: '🚗', tag: 'Transport', read: '5 min', title: 'How to Reduce Transport Emissions', desc: 'Practical tips to lower your daily commute footprint with electric vehicles and public transit.' },
  { icon: '🥦', tag: 'Food',      read: '7 min', title: 'Low Carbon Diet Guide',              desc: 'Switch to a plant-rich diet and discover how food choices dramatically affect your carbon output.' },
  { icon: '💡', tag: 'Energy',    read: '4 min', title: 'Energy Saving Tips for Home',        desc: 'Smart appliance choices and behavioral changes that reduce household energy consumption.' },
  { icon: '♻️', tag: 'Waste',     read: '6 min', title: 'Zero Waste Lifestyle',               desc: 'Reduce, reuse, recycle — a beginner\'s roadmap to producing less waste every day.' },
]

// ─── Notifications ────────────────────────────────────────────────────────────
export const notifications = [
  { id: 1, icon: '🎉', msg: 'You reduced emissions by 5% this week!',             time: '2h ago', read: false },
  { id: 2, icon: '⚠️', msg: 'Your transport emissions are above your weekly goal.', time: '1d ago', read: false },
  { id: 3, icon: '🏆', msg: 'New achievement unlocked: Eco Traveler!',             time: '3d ago', read: true  },
  { id: 4, icon: '📊', msg: 'Your monthly carbon report is ready to view.',        time: '5d ago', read: true  },
]

// ─── Sidebar Nav Items ────────────────────────────────────────────────────────
export const navItems = [
  { id: 'dashboard',     icon: '📊', label: 'Dashboard'         },
  { id: 'log',           icon: '✏️', label: 'Log Activity'      },
  { id: 'history',       icon: '📋', label: 'Activity History'  },
  { id: 'analytics',     icon: '📈', label: 'Carbon Analytics'  },
  { id: 'goals',         icon: '🎯', label: 'Goals'             },
  { id: 'achievements',  icon: '🏆', label: 'Achievements'      },
  { id: 'hub',           icon: '🌿', label: 'Sustainability Hub' },
  { id: 'notifications', icon: '🔔', label: 'Notifications'     },
  { id: 'settings',      icon: '⚙️', label: 'Settings'          },
]
