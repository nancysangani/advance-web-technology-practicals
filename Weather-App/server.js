import express from "express";
import dotenv from "dotenv";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();

const PORT = process.env.PORT || 3000;

// absolute path to the public directory
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/weather", async (req, resp) => {
  const city = req.query.city;
  const apiKey = process.env.WEATHER_API_KEY;

  if (!city) {
    return resp.status(400).json({ error: "City name is required" });
  }
  try {
    const apiUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=7&aqi=yes`;
    const apiResponse = await fetch(apiUrl);
    const data = await apiResponse.json();
    resp.json(data);
  } catch (error) {
    resp.status(500).json({ error: "Failed to fetch weather data" });
  }
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;