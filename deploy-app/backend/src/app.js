import cors from "cors";
import express from "express";
import { env } from "./config/env.js";

const app = express();

function normalizeOrigin(rawOrigin) {
  try {
    return new URL(rawOrigin).origin;
  } catch {
    return rawOrigin;
  }
}

const allowedOrigins = new Set(env.FRONTEND_URL.map(normalizeOrigin));

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) {
        callback(null, true);
        return;
      }

      const normalizedOrigin = normalizeOrigin(origin);

      if (allowedOrigins.has(normalizedOrigin)) {
        callback(null, true);
        return;
      }

      callback(new Error(`Origin "${origin}" is not allowed by CORS`));
    },
    methods: ["GET"],
  }),
);
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    message: "API is healthy and deployment-ready.",
    now: new Date().toISOString(),
  });
});

app.get("/api/secure-ping", (req, res) => {
  const token = req.header("x-api-key");
  if (!token || token !== env.API_KEY) {
    return res.status(401).json({ ok: false, message: "Unauthorized" });
  }

  return res.json({ ok: true, message: "Authenticated request accepted." });
});

export default app;
