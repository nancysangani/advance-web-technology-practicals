# PulseRoom Live Chat

A realtime chat and notification service built with Node.js, Express, and Socket.IO.

## Features

- Multi-client realtime chat
- Presence list (online users)
- Typing indicator
- Server-broadcast notifications
- Message history (latest 100 messages)
- Responsive, modern UI with animated visual design

## Run Locally

```bash
npm install
npm start
```

Open:

- http://localhost:3000

To test realtime behavior, open multiple tabs or browser windows.

## Project Structure

- `server.js` - Express + Socket.IO server
- `public/index.html` - UI layout
- `public/styles.css` - visual design and responsive styling
- `public/app.js` - client-side realtime logic
