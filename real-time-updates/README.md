# Next.js + Node.js Realtime CRUD

A full-stack workspace that integrates:

- Frontend: Next.js (App Router)
- Backend: Node.js + Express API
- Realtime updates: Socket.IO

## Features

- Create, read, update, and delete items
- Live synchronization across browser tabs/windows
- Clean, modern responsive UI

## Run locally

1. Install dependencies from workspace root:

   ```bash
   npm install
   ```

2. Start frontend and backend together:

   ```bash
   npm run dev
   ```

3. Open:
   - Frontend: http://localhost:3000
   - Backend: http://localhost:4000

## Environment variables (optional)

The frontend defaults to `http://localhost:4000`, but you can override:

- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_SOCKET_URL`

The backend allows CORS from `http://localhost:3000` by default. Override with:

- `CLIENT_ORIGIN`
