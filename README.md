# AgriConnect – Smart Agriculture Assistance and Market Intelligence Platform

AgriConnect is a centralized web platform designed for Indian farmers, certified agricultural experts, and administrative researchers. It bridges the critical information gap between field agronomy, hyper-local meteorological forecasts, daily APMC mandi commodity prices, and direct university agronomist advisory.

---

## 🌟 Key Features

1. **Role-Based Authentication & Permissions (RBAC)**:
   - **Farmer**: Manage farm plots, log operations (sowing, irrigation, fertilizer, spraying), monitor micro-weather, discover mandi rates, run 5-parameter AI crop suitability matching, post queries to agronomists.
   - **Agricultural Expert**: View unassigned farmer queries, filter by pathology/pest/soil categories, submit official diagnosis and dosage recommendations, mark queries resolved.
   - **Platform Administrator**: Monitor platform-wide KPIs, activate/deactivate accounts, approve pending agronomist applications, curate the 22+ crop variety catalog.

2. **Hyper-Local Agro-Weather Radar (Open-Meteo Integration)**:
   - Location-accurate current conditions, 7-day temperature trends, and precipitation sum forecasting.
   - Algorithmic farming decision rules: automated spray alerts for high wind (>20 km/h), rain postponement warnings (>15mm), evening irrigation advice for heat stress (>38°C), and night frost protection.
   - Geocoding lookup for any Indian village, district, or agricultural block.

3. **Agmarknet Mandi Commodity Price Intelligence**:
   - Daily arrival rates (Minimum, Maximum, and Modal price per Quintal) across major APMC mandis.
   - Interactive commodity price comparisons across regional mandis using Recharts.
   - Automatic 1-hour in-memory cache layer (`node-cache`) with graceful fallback to benchmark datasets.

4. **AI-Assisted 5-Parameter Crop Recommendation Engine**:
   - Scores candidate crop varieties against Soil Texture (25%), Seasonal Window (25%), Expected Rainfall (20%), Thermal Band (15%), and Soil pH (15%).
   - 1-Click "Autofill from Saved Farm" integrating real-time weather and soil properties.
   - Delivers top 5 ranked recommendations with percentage scores, maturity durations, and cultivation tips.

5. **Direct Agronomist Advisory Network (Ask Expert)**:
   - Farmer query submission categorized by Crop Disease, Pest Control, Soil, Irrigation, Fertilizer, Market, or Weather.
   - Real-time automated notifications generated upon query submission and expert replies.
   - Auditable conversation threads with resolution toggling.

---

## 🏗 Tech Stack

- **Frontend**: React 19, React Router v7, Tailwind CSS v4, Lucide React icons, Recharts.
- **Backend**: Node.js, Express.js, JWT (`jsonwebtoken`), `bcryptjs`, `cors`, `dotenv`, `axios`, `node-cache`.
- **Database**: MongoDB with Mongoose schemas & virtuals.
- **External APIs**: Open-Meteo (Weather Forecast & Geocoding), data.gov.in Agmarknet API.

---

## 📁 Project Directory Structure

```text
agriconnect/
├── README.md                          # Project documentation and demo credentials
├── package.json                       # Frontend dependencies & scripts
├── vite.config.ts                     # Vite + Tailwind configuration
├── index.html                         # Entry HTML with typography & SEO tags
├── server/                            # Standalone Node.js & Express API
│   ├── package.json                   # Server dependencies (Express, Mongoose, JWT)
│   ├── .env.example                   # Backend environment template
│   ├── server.js                      # Express application entry point
│   ├── config/
│   │   └── db.js                      # MongoDB Mongoose connection
│   ├── models/
│   │   ├── User.js                    # User schema with bcrypt hashing & roles
│   │   ├── Farm.js                    # Farm parcels, acreage, soil & water
│   │   ├── Activity.js                # Farm operations timeline & cost tracking
│   │   ├── Crop.js                    # Agronomic constraints & cultivation tips
│   │   ├── Query.js                   # Advisory queries with virtual replies
│   │   ├── Reply.js                   # Agronomist recommendations
│   │   └── Notification.js            # User alerts & read status tracking
│   ├── middleware/
│   │   ├── auth.js                    # JWT verify & RBAC role guards
│   │   └── errorHandler.js            # Centralized API error handler
│   ├── controllers/
│   │   ├── authController.js          # Register, login, getMe, updateProfile
│   │   ├── farmController.js          # Farm parcels CRUD (owner-guarded)
│   │   ├── activityController.js      # Farm operations logbook
│   │   ├── weatherController.js       # Open-Meteo proxy & farming advice engine
│   │   ├── marketController.js        # Mandi rates with 1h cache & fallback
│   │   ├── cropController.js          # Crop recommendation scoring & Admin CRUD
│   │   ├── queryController.js         # Queries, replies & auto-notifications
│   │   ├── notificationController.js  # Notifications list & mark-as-read
│   │   └── adminController.js         # Platform metrics, user governance
│   ├── routes/                        # Express API route modules
│   ├── utils/
│   │   ├── weatherRules.js            # Agro-weather decision rules engine
│   │   └── cropScorer.js              # 5-parameter crop suitability scoring
│   └── seed/
│       └── seed.js                    # Database seeder (Users, Farms, 22+ Crops)
└── src/                               # Frontend Application
    ├── types/                         # TypeScript interfaces & domain models
    ├── context/
    │   ├── AuthContext.tsx            # Auth state, login/logout, demo switcher
    │   └── NotificationContext.tsx    # Live notifications & unread counts
    ├── services/
    │   ├── config.ts                  # USE_MOCK flag (swap mock & live in 1 line!)
    │   ├── api.ts                     # HTTP client with JWT interceptor
    │   ├── storage.ts                 # LocalStorage persistence for preview
    │   ├── mockData.ts                # Realistic Indian agricultural dataset
    │   └── [service files...]         # Auth, Farm, Weather, Market, Crop, Query
    ├── components/common/             # Reusable UI system (Button, Card, Modal, etc.)
    ├── layouts/
    │   ├── PublicLayout.tsx           # Top Bar contract, navigation, footer
    │   ├── DashboardLayout.tsx        # Fixed sidebar, demo role switcher, header
    │   └── ProtectedRoute.tsx         # Role-based route guard
    └── pages/                         # All Public, Farmer, Expert & Admin pages
```

---

## ⚡ Setup & Execution Instructions

### 1. Backend Server Setup

```bash
# Navigate to backend directory
cd server

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your MONGO_URI, JWT_SECRET, and AGMARKET_API_KEY (optional)

# Seed database with sample users, farms, activities, and 22+ crops
npm run seed

# Start Express server in development mode
npm run dev
# Server runs on http://localhost:5000
```

### 2. Frontend Client Setup

```bash
# In the root project directory:
npm install

# Start Vite development server
npm run dev
# Frontend runs on http://localhost:3000
```

### 3. Toggling Between Mock Service & Live Backend

In `src/services/config.ts`:
- Set `export const USE_MOCK = true;` to run seamlessly in any standalone preview or test environment with persistent local storage.
- Set `export const USE_MOCK = false;` to direct all requests to the live Node/Express API at `http://localhost:5000/api`.

---

## 🔑 Pre-Seeded Demo Credentials

All demo accounts use password: `password123`

| Role | Name | Email | Description |
| :--- | :--- | :--- | :--- |
| **Farmer** | Gurpreet Singh | `gurpreet.singh@agriconnect.org` | Primary farmer with 2 farms in Ludhiana, Punjab (Wheat & Mustard). |
| **Farmer** | Suresh Patil | `suresh.patil@agriconnect.org` | Farmer with onion & vineyard estate in Nashik, Maharashtra. |
| **Farmer** | Anita Devi | `anita.devi@agriconnect.org` | Pulse & rice farmer in Patna, Bihar. |
| **Expert** | Dr. Ramesh Sharma | `dr.sharma@agriconnect.org` | Plant Pathologist & Agronomist (Ludhiana). Approved. |
| **Expert** | Dr. Priya Patel | `priya.patel@agriconnect.org` | Soil & Irrigation Specialist (Anand, Gujarat). Approved. |
| **Expert** | Dr. Arvind Deshmukh | `arvind.deshmukh@agriconnect.org` | Specialist with account **pending admin approval**. |
| **Admin** | Dr. Virendra Kumar | `admin@agriconnect.org` | Platform Director with full administrative governance access. |

> 💡 **Tip**: When viewing the app, use the **"Demo Role" dropdown** in the lower-left sidebar or the 1-click buttons on the Login page to instantly preview Farmer, Expert, and Admin views!

---

## 📡 REST API Reference

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new farmer or expert |
| `POST` | `/api/auth/login` | Public | Authenticate user & return JWT token |
| `GET` | `/api/auth/me` | Private | Get profile of logged-in user |
| `PUT` | `/api/auth/profile` | Private | Update contact info & location |
| `GET` | `/api/farms` | Farmer | List all farms owned by user |
| `POST` | `/api/farms` | Farmer | Register new agricultural plot |
| `GET` | `/api/farms/:id` | Private | Get single farm details |
| `PUT` | `/api/farms/:id` | Farmer (Owner) | Update farm parcel specifications |
| `DELETE`| `/api/farms/:id` | Farmer (Owner) | Delete farm parcel & related activities |
| `GET` | `/api/farms/:id/activities` | Private | List activities timeline for farm |
| `POST` | `/api/activities` | Farmer | Log new activity (sowing, spray, irrigation) |
| `PUT` | `/api/activities/:id` | Farmer (Owner) | Edit logged activity |
| `DELETE`| `/api/activities/:id` | Farmer (Owner) | Remove activity entry |
| `GET` | `/api/weather?lat=&lon=` | Public | Open-Meteo proxy + 7-day forecast + farming advice |
| `GET` | `/api/weather/geocode?q=` | Public | Search Indian cities, districts & villages |
| `GET` | `/api/market` | Public | Agmarknet mandi rates with 1h cache & fallback |
| `GET` | `/api/market/filters` | Public | List distinct states & commodities |
| `POST` | `/api/crops/recommend` | Public | 5-parameter crop suitability scoring algorithm |
| `GET` | `/api/crops` | Public | List all crops in AI knowledge base |
| `POST` | `/api/crops` | Admin | Add new crop variety to catalog |
| `PUT` | `/api/crops/:id` | Admin | Update crop agronomic constraints |
| `DELETE`| `/api/crops/:id` | Admin | Remove crop variety from catalog |
| `POST` | `/api/queries` | Farmer | Post new advisory query (notifies specialists) |
| `GET` | `/api/queries/mine` | Farmer | List logged-in farmer's queries |
| `GET` | `/api/queries` | Expert / Admin | View all inquiries (filterable by status/category)|
| `GET` | `/api/queries/:id` | Private | Get query thread with expert replies |
| `POST` | `/api/queries/:id/replies` | Expert / Admin | Post specialist advice (notifies farmer) |
| `PUT` | `/api/queries/:id/resolve` | Private | Mark query status as Resolved |
| `GET` | `/api/notifications` | Private | List alerts and advisory notifications |
| `PUT` | `/api/notifications/:id/read` | Private | Mark single notification as read |
| `PUT` | `/api/notifications/read-all` | Private | Mark all notifications as read |
| `GET` | `/api/admin/stats` | Admin | Platform overview counts & metrics |
| `GET` | `/api/admin/users` | Admin | List all registered users |
| `PUT` | `/api/admin/users/:id/status` | Admin | Activate or suspend user account |
| `PUT` | `/api/admin/users/:id/approve` | Admin | Approve pending expert application |
| `DELETE`| `/api/admin/users/:id` | Admin | Delete user account & clean records |

---

## 📜 License

Apache-2.0. Dedicated to the advancement of Indian agriculture and farming communities.
