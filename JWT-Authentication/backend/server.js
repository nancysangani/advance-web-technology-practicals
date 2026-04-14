const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const requiredEnvVars = ["MONGO_URI", "JWT_SECRET", "JWT_EXPIRES_IN", "PORT"];
const missingEnvVars = requiredEnvVars.filter((envName) => !process.env[envName]);

if (missingEnvVars.length > 0) {
  throw new Error(`Missing required environment variables: ${missingEnvVars.join(", ")}`);
}

if (process.env.JWT_SECRET.length < 32) {
  console.warn(
    "JWT_SECRET is weak. Use a random secret with at least 32 characters for better security."
  );
}

const app = express();
app.use(express.json());

// Routes
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

// DB + Server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected...");
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on http://localhost:${process.env.PORT}/api/auth`);
    });
  })
  .catch((err) => console.log(err));
