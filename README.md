# CycleCare 🌸

A full-stack menstrual health tracker that helps users log periods, track symptoms and mood, get data-driven cycle predictions, and access general health education — built with privacy as a core design principle throughout.

**Live Demo:** [Add your deployed link here once live]
**Backend Repo/Folder:** `/server`
**Frontend Repo/Folder:** `/client`

---

## Why I Built This

Menstrual health tracking is a genuinely underserved niche in most student project portfolios, and it gave me a chance to work with real, sensitive user data — which meant every technical decision (auth, database queries, API design) had to be made with privacy and data protection in mind, not just functionality. It also let me build a complete product loop: authentication, CRUD operations, derived data/predictions, and a polished, cohesive UI.

---

## Features

### Core Tracking
- **Cycle Logging** — log period start/end dates and flow intensity, with full edit/delete history
- **Symptom & Mood Check-ins** — daily logging of mood, energy level, and symptoms, with automatic upsert logic (one entry per day)
- **Smart Predictions** — calculates average cycle length from logged history and predicts the next period date, with a manual override option for users who prefer to set their own average
- **Visual Calendar** — highlights past logged cycles and predicted upcoming dates at a glance
- **Dashboard Insights** — next period countdown, average cycle length, and most common recent symptom, all in one view

### Account & Privacy
- **Secure Authentication** — JWT stored in httpOnly cookies (not localStorage), preventing token theft via XSS
- **Password Hashing** — bcrypt hashing before any password touches the database
- **User-Scoped Data Access** — every database query is scoped to the logged-in user's ID, so no user can ever access another user's health data, even by guessing IDs
- **Settings & Profile Management** — update cycle preferences, toggle manual predictions on/off

### Extras
- **Partner Support Mode** — an opt-in feature letting users invite a partner or family member to receive a gentle, generic notification when a period is expected soon (e.g., "be extra supportive this week") — the invited person never sees any actual dates, symptoms, or health data
- **Health Library** — general, non-diagnostic educational content on cycle basics, common symptoms, and when to see a doctor
- **Mobile Responsive** — fully usable on both desktop and mobile screen sizes

### Planned (Phase 2)
- AI-assisted chatbot for period-related questions, with a safety-first system prompt (no diagnostic claims, always recommends professional care for concerning symptoms)

---

## Tech Stack

**Frontend:** React (Vite), Tailwind CSS, React Router DOM, Axios, react-calendar, date-fns, lucide-react

**Backend:** Node.js, Express, MongoDB (Mongoose), JWT, bcryptjs

**Database:** MongoDB Atlas

**Deployment:** Vercel (frontend), Render (backend)

---

## Architecture & Key Design Decisions

- **httpOnly cookies over localStorage for JWTs** — chosen specifically because localStorage is readable by any injected script (XSS risk), which felt like an unacceptable tradeoff for a health app handling sensitive personal data
- **Every backend route scoped to `req.user.id`** — enforced consistently across all controllers (cycles, symptoms, partner settings) so a user can never read, edit, or delete another user's data, even with a guessed or leaked document ID
- **Prediction logic: data-driven by default, with manual override** — the app calculates average cycle length from actual logged history once enough data exists, but respects a user's manual input if they toggle that preference on, balancing "smart automation" with user control
- **Partner notifications reveal no health data** — this feature was deliberately designed so the notified party receives only a generic, supportive message, never actual dates or symptoms, preserving the primary user's privacy even when they choose to loop someone else in

---

## Getting Started (Local Setup)

### Prerequisites
- Node.js installed
- A MongoDB Atlas account (free tier) with a cluster set up

### 1. Clone the repository
```bash
git clone https://github.com/bhavikasuthar10/cycelcare.git
cd cycelcare
```

### 2. Backend setup
```bash
cd server
npm install
```

Create a `.env` file in `/server` with:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_random_secret_string
NODE_ENV=development
```

Run the backend:
```bash
npm run dev
```

### 3. Frontend setup
```bash
cd ../client
npm install
npm run dev
```

The app will be available at `http://localhost:5173`, with the backend running at `http://localhost:5000`.

---

## API Overview

| Route | Method | Description |
|---|---|---|
| `/api/auth/signup` | POST | Create a new account |
| `/api/auth/login` | POST | Log in, sets JWT cookie |
| `/api/auth/logout` | POST | Clears JWT cookie |
| `/api/auth/me` | GET | Get current logged-in user |
| `/api/auth/updateMe` | PATCH | Update profile/settings |
| `/api/cycles` | GET, POST | Get all / log a new cycle |
| `/api/cycles/:id` | PATCH, DELETE | Update / delete a specific cycle |
| `/api/symptoms` | GET, POST | Get history / log daily check-in |
| `/api/symptoms/today` | GET | Get today's check-in, if logged |
| `/api/stats/insights` | GET | Get prediction, average cycle length, top symptom |
| `/api/notify/check-partners` | GET | Identify users due for a partner notification |

All routes except signup/login require authentication via JWT cookie.

---

## What I'd Improve Next
- Automate partner email notifications with a real scheduled job (currently a manually-triggerable check for demo purposes)
- Add the planned AI chatbot with a carefully scoped, safety-first system prompt
- Add data export (CSV/PDF) for users who want their own records
- Expand the Health Library with more topics and sourced references

---

## Author

Built by Bhavika Suthar — 3rd year CSE student.
