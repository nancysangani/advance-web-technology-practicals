# 🌦️ Node Weather App — Secure Full-Stack Weather Application

A modern full-stack weather web application built using HTML, CSS, JavaScript, and Node.js that fetches real-time weather data from a third-party API while securely hiding the API key using a backend server.

This project demonstrates frontend + backend integration, API security best practices, and clean project structuring — making it suitable for internship, placement, and portfolio showcase.

## 🌐 Live Demo

**[View Live Demo](https://node-weather-app-lemon.vercel.app/)** 🚀

> Deployed on [Vercel](https://vercel.com) 

## 🚀 Features

* 🌍 Search weather by city name
* 📡 Real-time weather data using external Weather API
* 🔐 API key securely hidden using Node.js backend (no exposure in frontend)
* 🎨 Clean and responsive UI
* ⚡ Fast and lightweight
* 🧩 Simple and maintainable code structure
* 🌐 REST API proxy pattern implemented

## 🛠️ Tech Stack

**Frontend:**
* HTML5
* CSS3
* Vanilla JavaScript

**Backend:**
* Node.js
* Express.js

**Other Tools:**
* Fetch API
* dotenv (for environment variables)
* Git & GitHub

## 📁 Project Structure
```
node-weather-app/
│
├── public/
│   ├── index.html
│   ├── styles.css
│   └── script.js
│
├── server.js
├── .env
├── .gitignore
├── package.json
└── README.md
```

## 🔐 Security Implementation

* The API key is never exposed in frontend JavaScript.
* All API requests are routed through the Node.js backend server.
* The API key is stored safely in a `.env` file using environment variables:
```env
WEATHER_API_KEY=your_api_key_here
```

* Accessed in `server.js` using:
```javascript
process.env.WEATHER_API_KEY
```

This follows industry best practices for protecting sensitive credentials.

## ⚙️ Installation & Setup

Follow these steps to run the project locally:

### 1️⃣ Clone the repository
```bash
git clone https://github.com/nancysangani/node-weather-app.git
cd node-weather-app
```

### 2️⃣ Install dependencies
```bash
npm install
```

### 3️⃣ Create a `.env` file in the root directory
```env
WEATHER_API_KEY=your_api_key_here
```

Get your API key from a weather service like [OpenWeatherMap](https://openweathermap.org/api).

### 4️⃣ Start the server
```bash
node server.js
```

### 5️⃣ Open in browser

Visit:
```
http://localhost:3000
```

## 🎯 What This Project Demonstrates

* ✅ Full-stack development basics
* ✅ Secure API key handling
* ✅ Backend proxy server concept
* ✅ Frontend–Backend communication
* ✅ Clean code organization
* ✅ Real-world project structure
* ✅ Git & GitHub workflow

## 👩‍💻 Author

**Nancy Sangani**  
BTech in Computer Science Engineering  
Interested in Full Stack Development, Cloud, AI/ML

GitHub: [https://github.com/nancysangani](https://github.com/nancysangani)

## 📄 License

This project is open-source and available under the MIT License.

## ⭐ If you like this project

Don't forget to star ⭐ the repository — it really helps and looks great on your GitHub profile!