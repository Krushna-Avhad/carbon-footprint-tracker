# 🌍 CarbonTrack — Carbon Footprint Tracker

> A full-stack MERN application that helps users **measure, analyse, and reduce their personal carbon footprint** through daily lifestyle tracking.

CarbonTrack empowers users to become more environmentally conscious by visualizing the environmental impact of their **transport, food, energy, and waste habits**.

---

# 🚀 Live Concept

Track your emissions.
Understand your impact.
Build sustainable habits. 🌱

---

# ✨ Key Features

## 📊 Dashboard

A real-time overview of your environmental impact.

* Daily / weekly / monthly emission stats
* 6-month trend visualization
* Category emission breakdown (pie chart)
* Dynamic **Eco Score**

---

## 📝 Activity Logging

Users can log carbon-producing activities across multiple lifestyle areas:

* 🚗 Transport
* 🍽️ Food
* ⚡ Energy
* ♻️ Waste

Features include:

* Backdated logging
* Automatic CO₂ calculation (backend)
* Smart emission factor system

---

## 📚 Activity History

A powerful activity management system.

* Search activities
* Filter by category
* Edit or delete entries
* Export data to **CSV**

---

## 📈 Carbon Analytics

Deep insights into personal carbon usage.

* Daily / Weekly / Monthly analysis
* Category comparison bar charts
* Monthly trend analysis
* Emission summaries

---

## 🎯 Carbon Reduction Goals

Users can set sustainability targets.

* Category-based goals
* Deadline tracking
* Progress bars
* Automatic completion status

---

## 🏆 Achievement System

Gamified sustainability tracking.

Unlock eco badges such as:

| Badge            | Condition                     |
| ---------------- | ----------------------------- |
| 🌱 Green Starter | Log your first activity       |
| 🚴 Eco Traveler  | Use public transport 10 times |
| ♻️ Waste Warrior | Log waste activity for 7 days |
| ⚡ Energy Saver   | Log 5 energy activities       |
| 🥗 Plant Powered | Log 10 plant-based meals      |
| 🌍 Carbon Hero   | Log 50 total activities       |

---

## 🌿 Sustainability Hub

Educational content hub containing eco-friendly resources.

Categories include:

* Transport
* Food
* Energy
* Waste
* General Sustainability

---

## 🔔 Notifications

Stay informed with real-time updates.

* Achievement unlock alerts
* Milestone notifications
* Mark read / dismiss

---

## ⚙️ Settings

User account management.

* Update profile
* Change password
* Delete account securely

---

# 🛠️ Tech Stack

| Layer          | Technology                                    |
| -------------- | --------------------------------------------- |
| Frontend       | React 18, Vite, React Router, Axios, Recharts |
| Backend        | Node.js, Express.js                           |
| Database       | MongoDB Atlas                                 |
| Authentication | JWT + bcryptjs                                |

---

# 📂 Project Structure

```
carbontrack
│
├── backend
│   ├── config
│   ├── controller
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── utils
│   └── server.js
│
├── frontend
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── services
│   │   └── styles
│   └── vite.config.js
│
└── README.md
```

---

# ⚙️ Environment Variables

Create a `.env` file inside the **backend** folder.

```
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
```

⚠️ Never commit `.env` to the repository.

---

# 🚀 Installation

## 1️⃣ Clone the Repository

```
git clone https://github.com/Krushna-Avhad/carbon-footprint-tracker.git
cd carbon-footprint-tracker
```

---

## 2️⃣ Backend Setup

```
cd backend
npm install
npm start
```

Backend runs at:

```
http://localhost:5000
```

---

## 3️⃣ Frontend Setup

```
cd frontend
npm install
npm run dev
```

Frontend runs at:

```
http://localhost:5173
```

---

# 🧮 CO₂ Calculation System

Carbon emissions are calculated dynamically in:

```
backend/utils/calculateCO2.js
```

### Transport Factors

| Mode           | CO₂ / km |
| -------------- | -------- |
| Car (petrol)   | 0.21 kg  |
| Electric car   | 0.07 kg  |
| Bus            | 0.10 kg  |
| Train          | 0.05 kg  |
| Motorcycle     | 0.16 kg  |
| Flight (short) | 0.255 kg |
| Flight (long)  | 0.195 kg |
| Bicycle        | 0.00 kg  |

### Food Emissions

| Meal       | CO₂ / serving |
| ---------- | ------------- |
| Beef       | 27 kg         |
| Pork       | 7.6 kg        |
| Chicken    | 6 kg          |
| Fish       | 3.5 kg        |
| Vegetarian | 2 kg          |
| Vegan      | 1.5 kg        |

---

# 🌿 Eco Score System

Eco Score encourages sustainable behaviour.

Calculated from:

* Monthly emission comparison vs global average
* Public transport usage
* Plant-based meal frequency

Score Levels:

| Score     | Rating            |
| --------- | ----------------- |
| 🟢 70–100 | Great             |
| 🟡 40–69  | Average           |
| 🔴 0–39   | Needs Improvement |

---

# 🔒 Security

Security practices implemented:

* Password hashing with **bcrypt**
* JWT authentication
* Token expiration
* Route protection
* User data isolation
* Cascading account deletion

---

# 📦 Dependencies

## Backend

* Express
* Mongoose
* bcryptjs
* jsonwebtoken
* cors
* dotenv

## Frontend

* React
* React Router
* Axios
* Recharts
* Vite

---

# 🚀 Future Improvements

Planned enhancements:

* AI-based sustainability recommendations
* Carbon reduction suggestions
* Mobile responsive redesign
* Public climate data integration
* Progressive Web App support

---

# 👨‍💻 Author

**Krushna Avhad**

Full-Stack Developer | MERN Stack | Sustainable Tech Enthusiast 🌱
