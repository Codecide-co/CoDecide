# Get Started

Step-by-step guide to set up the **CoDecide** platform on your local machine.

---

## Prerequisites

Make sure you have the following installed:

| Tool | Version | Purpose |
|------|---------|---------|
| [Git](https://git-scm.com/) | >= 2.30 | Version control |
| [Python](https://www.python.org/) | >= 3.10 | Backend runtime |
| [Node.js](https://nodejs.org/) | >= 18 | Frontend runtime |
| [npm](https://www.npmjs.com/) | >= 9 | Frontend package manager |
| [MongoDB](https://www.mongodb.com/) | >= 6.0 | Document storage (attachments, audit logs) |

> **MongoDB** can run locally via `mongod` or with [Docker](https://www.docker.com/):
> ```bash
> docker run -d -p 27017:27017 --name codecide-mongo mongo:7
> ```

---

## 1. Clone the Repository

```bash
git clone https://github.com/Codecide-co/CoDecide.git
cd CoDecide
```

---

## 2. Switch to the Development Branch

All active development happens on the `dev` branch.

```bash
git checkout dev
git pull origin dev
```

---

## 3. Backend Setup

### 3.1 Create a Virtual Environment

**Windows (PowerShell):**
```powershell
cd apps\backend
python -m venv venv
.\venv\Scripts\Activate.ps1
```

**Linux / macOS:**
```bash
cd apps/backend
python3 -m venv venv
source venv/bin/activate
```

### 3.2 Install Dependencies

```bash
pip install -r requirements.txt
```

### 3.3 Configure Environment Variables

Copy the example environment file and adjust as needed:

```bash
cp .env.example .env
```

Default values in `.env` work for local development (SQLite, localhost MongoDB).

### 3.4 Run Database Migrations

```bash
flask db upgrade
```

This creates all required tables in SQLite (or MySQL if configured).

### 3.5 Start the Backend Server

```bash
python run.py
```

The API will be available at `http://localhost:5000`.  
Test it with:

```bash
curl http://localhost:5000/api/hello
# Expected: {"message":"Hello, CoDecide!"}
```

---

## 4. Frontend Setup

### 4.1 Install Dependencies

```bash
cd apps/frontend
npm install
```

### 4.2 Start the Development Server

```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`.

---

## 5. Verify Everything Works

1. **Frontend** — Open `http://localhost:5173` in your browser
2. **Backend health** — `curl http://localhost:5000/api/hello`
3. **Register a user** (all optional fields included):
   ```bash
   curl -X POST http://localhost:5000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Test User",
       "email": "test@example.com",
       "password": "123456",
       "apartment": "101",
       "tower": "A"
     }'
   ```
   Expected response (201):
   ```json
   {
     "id": 1,
     "name": "Test User",
     "email": "test@example.com",
     "role": "resident",
     "apartment": "101",
     "tower": "A",
     "created_at": "2026-07-16T12:00:00",
     "updated_at": "2026-07-16T12:00:00",
     "token": "eyJ..."
   }
   ```
4. **Login and save the token**:
   ```bash
   curl -X POST http://localhost:5000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"123456"}'
   ```
   The response includes the same user object plus a JWT `token` for authentication.

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| `pip` not found | Make sure Python is added to your PATH and the virtual environment is activated |
| `flask` not recognized | Run `pip install flask` or activate the virtual environment |
| MongoDB connection refused | Start MongoDB (`mongod`) or the Docker container |
| Port 5000 already in use | Change the port in `apps/backend/.env` or kill the process |
| Port 5173 already in use | Vite will automatically suggest the next available port |
| Database errors after pulling | Run `flask db upgrade` to apply new migrations |

---

## Next Steps

- Read the [backend architecture docs](../backend/EN/) to understand the API
- Read the [frontend architecture docs](../../docs/frontend/EN/) to understand the SPA structure
- Check [CONTRIBUTING.md](../CONTRIBUTING.md) for branch strategy and PR workflow
