import express from "express";
import type { Express } from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.ts";
import studentRoutes from "./routes/studentRoutes.ts";

dotenv.config();
connectDB();

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use("/api", studentRoutes);

const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 5000;

app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}/api`);
});
