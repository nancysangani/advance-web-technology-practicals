const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.use(express.static("public"));

const onlineUsers = new Map();
const messages = [];
const MAX_HISTORY = 100;

function pushMessage(message) {
  messages.push(message);
  if (messages.length > MAX_HISTORY) {
    messages.shift();
  }
}

function listUsers() {
  return Array.from(onlineUsers.values());
}

io.on("connection", (socket) => {
  socket.emit("history", messages);

  socket.on("join", (usernameRaw) => {
    const username =
      String(usernameRaw || "Guest")
        .trim()
        .slice(0, 24) || "Guest";

    onlineUsers.set(socket.id, username);
    socket.data.username = username;

    socket.broadcast.emit("system", {
      type: "join",
      text: `${username} joined the room`,
      timestamp: new Date().toISOString(),
    });

    io.emit("presence", listUsers());
  });

  socket.on("typing", (isTyping) => {
    if (!socket.data.username) {
      return;
    }

    socket.broadcast.emit("typing", {
      username: socket.data.username,
      isTyping: Boolean(isTyping),
    });
  });

  socket.on("chat-message", (textRaw) => {
    if (!socket.data.username) {
      return;
    }

    const text = String(textRaw || "")
      .trim()
      .slice(0, 300);
    if (!text) {
      return;
    }

    const message = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      username: socket.data.username,
      text,
      timestamp: new Date().toISOString(),
    };

    pushMessage(message);
    io.emit("chat-message", message);
  });

  socket.on("notify-all", (payloadRaw) => {
    if (!socket.data.username) {
      return;
    }

    const payload = String(payloadRaw || "")
      .trim()
      .slice(0, 120);
    if (!payload) {
      return;
    }

    io.emit("notification", {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      title: "Live Notification",
      body: payload,
      by: socket.data.username,
      timestamp: new Date().toISOString(),
    });
  });

  socket.on("disconnect", () => {
    const username = onlineUsers.get(socket.id);
    onlineUsers.delete(socket.id);

    if (username) {
      socket.broadcast.emit("system", {
        type: "leave",
        text: `${username} left the room`,
        timestamp: new Date().toISOString(),
      });

      io.emit("presence", listUsers());
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Live chat server running on http://localhost:${PORT}`);
});
