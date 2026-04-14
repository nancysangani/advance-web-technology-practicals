import express from "express";
import { employeesRouter } from "./routes/employees";

export const app = express();

app.use(express.json());
app.use("/api/employees", employeesRouter);

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});
