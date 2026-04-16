# 🏭 DVC BTPS — Digital Quarter Allotment System

> **Damodar Valley Corporation · Bokaro Thermal Power Station**
> Complete Full-Stack Web Application — React + Flask + MongoDB

---

## 📁 Complete Project Structure

```
dvc-btps/
│
├── 📄 README.md                  ← You are here
├── 📄 .gitignore
├── 📄 dvc-btps.code-workspace    ← Open this in VS Code for best experience

│
├── 🐍 backend/
│   ├── app.py                    ← Flask entry point (run this)
│   ├── seed_db.py                ← Run ONCE to seed DB with admin + sample data
│   ├── requirements.txt          ← Python packages
│   ├── .env                      ← Your secrets (Mongo URI, JWT key)
│   ├── .env.example              ← Template for .env
│   └── routes/
│       ├── __init__.py
│       ├── auth.py               ← Register, Login, Admin Login, /me
│       ├── employee.py           ← Get/Update employee profile
│       ├── application.py        ← Save draft, Submit, Fetch applications
│       ├── admin.py              ← View/Approve/Reject apps, Stats
│       └── quarters.py           ← Quarter list and layout data
│
└── ⚛️  frontend/
    ├── package.json              ← Node dependencies + proxy config
    ├── public/
    │   └── index.html
    └── src/
        ├── App.jsx               ← Router with protected routes
        ├── index.js              ← React entry point
        ├── index.css             ← Global styles, fonts, CSS variables
        ├── context/
        │   └── AuthContext.jsx   ← Global auth state (login/logout/register)
        ├── components/
        │   └── Navbar.jsx        ← Top navigation bar
        └── pages/
            ├── HomePage.jsx            ← Landing page + plant info
            ├── LoginPage.jsx           ← Employee login
            ├── RegisterPage.jsx        ← New employee registration
            ├── DashboardPage.jsx       ← Employee home after login
            ├── ApplicationFormPage.jsx ← Full allotment form (mirrors paper form)
            ├── TrackApplicationPage.jsx← Live status tracker
            ├── AdminLoginPage.jsx      ← Secure admin login
            ├── AdminDashboard.jsx      ← Admin panel (apps + quarter map)
            ├── ContactPage.jsx
            └── HelpPage.jsx
```

---

## 🚀 HOW TO RUN IN VS CODE — STEP BY STEP

### STEP 0 — Install Required Software (Do this once)

1. **Python 3.8+**
   - Download: https://www.python.org/downloads/
   - ✅ During install, check **"Add Python to PATH"**
   - Verify: Open Command Prompt → type `python --version`

2. **Node.js 16+**
   - Download: https://nodejs.org/ (LTS version)
   - Verify: `node --version` and `npm --version`

3. **MongoDB Community Server**
   - Download: https://www.mongodb.com/try/download/community
   - Install with default settings
   - It runs automatically as a Windows Service (no need to start manually)

4. **VS Code**
   - Download: https://code.visualstudio.com/

---

### STEP 1 — Open Project in VS Code

1. Extract the ZIP you downloaded to a folder, e.g. `C:\Projects\dvc-btps\`
2. Open VS Code
3. Click **File → Open Folder** → select the `dvc-btps` folder
4. OR double-click `dvc-btps.code-workspace` — this opens all three folders neatly

---

### STEP 2 — Setup & Run the Backend (Flask)

Open a new terminal in VS Code: **Terminal → New Terminal**

```bash
# Go into the backend folder
cd backend

# Create a virtual environment (isolated Python space for this project)
python -m venv venv

# Activate it:
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Your terminal prompt now shows (venv) — that means it's active ✅

# Install all Python packages
pip install -r requirements.txt

# Seed the database (RUN THIS ONLY ONCE — creates admin + sample quarters)
python seed_db.py

# Start the Flask server
python app.py
```

You should see:
```
 * Running on http://127.0.0.1:5000
 * Debug mode: on
```
**Leave this terminal open.** Flask is now running.

---

### STEP 3 — Setup & Run the Frontend (React)

Open a **second terminal** in VS Code: click the **+** icon in the terminal panel

```bash
# Go into the frontend folder
cd frontend

# Install all Node packages (only needed first time — takes 1-2 minutes)
npm install

# Start the React app
npm start
```

Your browser will automatically open **http://localhost:3000** 🎉

---

### STEP 4 — Login and Test

After both servers are running:

| Role | Access |
|------|--------|
| Employee | Register and login using your own credentials |
| Admin | Configured via backend environment variables |
---

### STEP 5 — Register a New Employee (optional test)

1. Go to `http://localhost:3000/register`
2. Fill in all fields with your test data
3. Click **Register**
4. Login with your new Employee ID and password

---

## 🔑 Demo Access

You can:
- Register a new employee account via the registration page
- Use the application features after login

Admin access is configured securely via backend environment variables.

---

## 🌐 API Endpoints Reference

### Auth (`/api/auth/`)
| Method | URL | Body | Description |
|--------|-----|------|-------------|
| POST | `/api/auth/register` | employee fields | Register new employee |
| POST | `/api/auth/login` | `employee_id, password` | Employee login → JWT token |
| POST | `/api/auth/admin/login` | `username, password` | Admin login → JWT token |
| GET | `/api/auth/me` | — (JWT required) | Get current user data |

### Employee (`/api/employee/`)
| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/employee/profile` | Get employee profile (JWT) |
| PUT | `/api/employee/profile` | Update mobile/marital status (JWT) |

### Application (`/api/application/`)
| Method | URL | Description |
|--------|-----|-------------|
| POST | `/api/application/save` | Save or update draft |
| POST | `/api/application/submit` | Final submission |
| GET | `/api/application/my` | All my applications |
| GET | `/api/application/draft` | Get saved draft |

### Admin (`/api/admin/`)
| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/admin/applications?status=pending` | Filter applications |
| POST | `/api/admin/application/:id/action` | `{action, quarter_number, remarks}` |
| GET | `/api/admin/stats` | Dashboard statistics |

### Quarters (`/api/quarters/`)
| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/quarters/` | Get all quarters with status |
| POST | `/api/quarters/seed` | Seed quarters (one-time) |

---

## 🗺️ All Pages & What They Do

| Page | Route | Who Can Access | What It Does |
|------|-------|---------------|-------------|
| Homepage | `/` | Everyone | Plant info, stats, quick-access cards |
| Login | `/login` | Everyone | Employee login with ID + password |
| Register | `/register` | Everyone | New employee account creation |
| Admin Login | `/admin/login` | Everyone | Separate secure admin login |
| Employee Dashboard | `/dashboard` | Employees | Welcome card, profile details, application status |
| Apply for Quarter | `/apply` | Employees | Full allotment form (mirrors paper form), save draft, submit |
| Track Application | `/track` | Employees | Progress tracker with 4 steps, allotted quarter info |
| Admin Dashboard | `/admin` | Admin only | Stats, approve/reject apps, quarter map with 🟢🔴 |
| Contact | `/contact` | Everyone | BTPS address, housing committee contact |
| Help/FAQ | `/help` | Everyone | 10 accordion FAQ items |

---

## 🏗️ How the System Works — End to End

```
EMPLOYEE FLOW:
─────────────
Register → Login → Dashboard → Apply for Quarter
                                     ↓
                            Fill Form (pre-filled from DB)
                                     ↓
                         Save Draft (anytime) OR Submit
                                     ↓
                        Status: PENDING (in DB + dashboard)
                                     ↓
                        Admin reviews → Approves/Rejects
                                     ↓
                        Employee sees updated status + allotted quarter


ADMIN FLOW:
───────────
Admin Login → Admin Dashboard
                    ↓
         ┌──────────┴──────────┐
     View Stats            Quarter Map
    (pending/               (🟢/🔴 grid
    approved etc.)          per block)
         ↓
  Click Application
         ↓
  Enter Quarter No. + Remarks
         ↓
  Click ✅ Approve OR ❌ Reject
         ↓
  Employee's dashboard updates instantly
```

---

## 🛡️ Security

- **Passwords** are hashed with `bcrypt` (never stored in plain text)
- **JWT tokens** expire never in dev (change `JWT_ACCESS_TOKEN_EXPIRES` for production)
- **Admin routes** are double-protected: JWT required + identity must start with `admin:`
- **Employee routes** reject admin tokens and vice versa
- **Protected React routes** redirect if role doesn't match

---

## 🔧 Environment Variables (`backend/.env`)

```env
MONGO_URI=mongodb://localhost:27017/dvc_btps
JWT_SECRET_KEY=change-this-to-a-long-random-string
```

For MongoDB Atlas (cloud), replace MONGO_URI with your Atlas connection string.

---

## 📦 Tech Stack Summary

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | React 18 | UI framework |
| Routing | React Router v6 | Page navigation + protected routes |
| HTTP client | Axios | API calls from React to Flask |
| Notifications | react-hot-toast | Success/error toasts |
| Fonts | Google Fonts (Bebas Neue, Rajdhani) | DVC industrial aesthetic |
| Backend | Python Flask 3 | REST API server |
| Auth | flask-jwt-extended | JWT token generation & verification |
| Password | bcrypt | Secure password hashing |
| Database | MongoDB + pymongo | Document storage |
| Cross-Origin | flask-cors | Allow React → Flask requests |

---

## 🚨 Common Issues & Fixes

| Problem | Fix |
|---------|-----|
| `python` not found | Use `python3` instead, or reinstall Python with PATH checked |
| `venv\Scripts\activate` error on Windows | Run PowerShell as Admin → `Set-ExecutionPolicy RemoteSigned` |
| `npm install` takes forever | Normal on first run — wait it out |
| Can't connect to MongoDB | Make sure MongoDB service is running: search "Services" in Windows, find MongoDB, click Start |
| Port 3000 already in use | Type `Y` when React asks to use another port |
| Port 5000 already in use | Change `port=5001` in `app.py` and update `proxy` in `package.json` |
| Login says "Invalid credentials" | Make sure you ran `python seed_db.py` first |
| CORS errors in browser | Make sure Flask is running on port 5000 and proxy is set in package.json |

---

*Built for DVC BTPS · Bokaro Thermal Power Station · Damodar Valley Corporation*
*P.O. Bokaro Thermal, Dist. Bokaro (Jharkhand) – 829107*
