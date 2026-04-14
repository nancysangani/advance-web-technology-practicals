# Velocity Deploy Full-Stack App

A deploy-ready full-stack template with:

- Optimized frontend bundle (Vite chunking + lazy loading)
- Strict runtime environment validation (`zod`) for frontend and backend
- Modern UI with responsive layout and lightweight motion
- Live deployment setup for Vercel (frontend) + Render (backend)

## Project Structure

- `frontend/` React + Vite app
- `backend/` Express API
- `render.yaml` Render blueprint for backend deployment

## 1) Local Development

### Install

```bash
npm install
```

### Configure environments

1. Copy `backend/.env.example` to `backend/.env`
2. Copy `frontend/.env.example` to `frontend/.env`
3. Set `frontend/.env` value:
   - `VITE_API_BASE_URL=http://localhost:4000`
4. Set `backend/.env` values:
   - `FRONTEND_URL=http://localhost:5173`
   - `API_KEY=your_secure_key_here`

### Run

```bash
npm run dev:backend
npm run dev:frontend
```

Frontend runs on `http://localhost:5173`, backend on `http://localhost:4000`.

## 2) Bundle Size Optimization Implemented

- Manual vendor chunk splitting in `frontend/vite.config.ts`
- Route/feature-level lazy loading with `React.lazy` in `frontend/src/App.tsx`
- Removed browser-side `zod` dependency (env validation is now zero-dependency client code)
- CSS code splitting enabled
- Production minification and no source maps in build output

To inspect bundle output:

```bash
npm run build --workspace frontend
```

## 3) Environment Management Implemented

- Frontend env validation: `frontend/src/config/env.ts`
- Backend env validation: `backend/src/config/env.js`
- Fails fast on startup/build with clear validation errors
- Example env files included for safe onboarding
- Backend `FRONTEND_URL` accepts comma-separated origins for production + preview domains

## 4) Deploy on Vercel + Render

### A. Deploy backend to Render

1. Push repo to GitHub.
2. In Render, create **New +** -> **Blueprint**.
3. Select this repository (Render reads `render.yaml`).
4. Add env vars in Render dashboard:
   - `FRONTEND_URL` = your Vercel frontend URL(s). For multiple domains, use comma-separated values.
     - Example: `https://myapp.vercel.app,https://myapp-git-main.vercel.app`
   - `API_KEY` = strong random secret
5. Deploy and copy backend live URL (example: `https://your-api.onrender.com`).

### B. Deploy frontend to Vercel

1. Create a new Vercel project from same repo.
2. Set **Root Directory** to `frontend`.
3. Add env var in Vercel project:
   - `VITE_API_BASE_URL` = Render backend URL
4. Deploy.

### C. Update CORS on backend

After frontend URL is known, ensure Render backend `FRONTEND_URL` includes your Vercel domain(s).

## 5) Useful Commands

```bash
npm run build
npm run start
```

## Hosting Choice

- Frontend: Vercel (best for static React/Vite UX performance)
- Backend: Render (best simple always-on API hosting)

If you want a **single-platform** deploy, we can migrate this to a single Next.js app and host everything on Vercel.
