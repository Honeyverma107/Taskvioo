# TaskVio

Team task management app (React + Express + PostgreSQL + Prisma).

## Local setup

### Prerequisites

- Node.js 18+
- PostgreSQL

### 1. Backend

```bash
cd backend
cp .env.example .env
# Edit .env: DATABASE_URL, JWT_SECRET
npm install
npx prisma migrate dev
npm run db:seed
npm run dev
```

API: `http://localhost:5000` — health: `GET /api/health`

Demo login (after seed): `admin@taskvio.com` / `123456`

### 2. Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

App: `http://localhost:5173`

## Deploy

### Backend (Render)

1. Push repo to GitHub.
2. [Render Dashboard](https://dashboard.render.com) → **New Blueprint** → connect repo (uses root `render.yaml`).
3. Set **CLIENT_URL** to your frontend URL (e.g. `https://your-app.vercel.app`).
4. After first deploy, open the web service shell and run: `npm run db:seed` (optional demo user).

Or manually: **New Web Service** → root directory `backend`, build `npm install`, start `npm start`, attach PostgreSQL, set `DATABASE_URL`, `JWT_SECRET`, `CLIENT_URL`.

### Frontend (Vercel)

1. Import repo; set **Root Directory** to `frontend`.
2. Framework: Vite (auto-detected).
3. Environment variable (required for production):

   | Name | Example |
   |------|---------|
   | `VITE_API_URL` | `https://your-api.onrender.com/api` |

4. Deploy. SPA routing is configured in `frontend/vercel.json`.

### Environment checklist

| Variable | Where | Required |
|----------|--------|----------|
| `DATABASE_URL` | Backend | Yes |
| `JWT_SECRET` | Backend | Yes |
| `CLIENT_URL` | Backend | Production (CORS) |
| `PORT` | Backend | Set by host |
| `VITE_API_URL` | Frontend build | Production |

## Scripts

| Command | Location | Description |
|---------|----------|-------------|
| `npm run dev` | `backend` / `frontend` | Development server |
| `npm start` | `backend` | Migrate + start API |
| `npm run build` | `frontend` | Production build |
| `npm run db:seed` | `backend` | Create demo admin user |
