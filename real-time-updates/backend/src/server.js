import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import { randomUUID } from "crypto";

const app = express();
const httpServer = createServer(app);

const PORT = process.env.PORT || 4000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:3000";

const io = new Server(httpServer, {
  cors: {
    origin: CLIENT_ORIGIN,
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

app.use(
  cors({
    origin: CLIENT_ORIGIN,
  }),
);
app.use(express.json());

let items = [];

const broadcastSnapshot = () => {
  io.emit("items:snapshot", items);
};

io.on("connection", (socket) => {
  socket.emit("items:snapshot", items);

  socket.on("disconnect", () => {
    // no-op
  });
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "backend-api" });
});

app.get("/api/items", (_req, res) => {
  res.json(items);
});

app.post("/api/items", (req, res) => {
  const { title, description = "", status = "planned" } = req.body;

  if (!title || typeof title !== "string") {
    return res.status(400).json({ message: "title is required" });
  }

  const now = new Date().toISOString();
  const newItem = {
    id: randomUUID(),
    title: title.trim(),
    description: description.trim(),
    status,
    createdAt: now,
    updatedAt: now,
  };

  items = [newItem, ...items];
  io.emit("items:created", newItem);
  broadcastSnapshot();

  return res.status(201).json(newItem);
});

app.put("/api/items/:id", (req, res) => {
  const { id } = req.params;
  const item = items.find((entry) => entry.id === id);

  if (!item) {
    return res.status(404).json({ message: "item not found" });
  }

  const { title, description, status } = req.body;

  if (
    title !== undefined &&
    (typeof title !== "string" || title.trim() === "")
  ) {
    return res
      .status(400)
      .json({ message: "title must be a non-empty string" });
  }

  item.title = title !== undefined ? title.trim() : item.title;
  item.description =
    description !== undefined ? String(description).trim() : item.description;
  item.status = status !== undefined ? status : item.status;
  item.updatedAt = new Date().toISOString();

  io.emit("items:updated", item);
  broadcastSnapshot();

  return res.json(item);
});

app.delete("/api/items/:id", (req, res) => {
  const { id } = req.params;
  const existingLength = items.length;

  items = items.filter((entry) => entry.id !== id);

  if (items.length === existingLength) {
    return res.status(404).json({ message: "item not found" });
  }

  io.emit("items:deleted", { id });
  broadcastSnapshot();

  return res.status(204).send();
});

httpServer.listen(PORT, () => {
  console.log(
    `Backend API + Socket server listening on http://localhost:${PORT}`,
  );
});
