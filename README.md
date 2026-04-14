# AWT Practicals - Web Development Projects

A comprehensive collection of web development practicals and projects, showcasing various technologies and architectures including React, Next.js, Express, TypeScript, and full-stack applications.

## 📁 Projects Overview

### 1. **add-to-cart**

- **Tech Stack:** React + Vite + Context API
- **Description:** E-commerce shopping cart application with add-to-cart functionality
- **Features:** State management using React Context, responsive UI
- **To Run:** `cd add-to-cart && npm install && npm run dev`

### 2. **deploy-app**

- **Tech Stack:** React (Frontend) + Express (Backend) + Docker
- **Description:** Full-stack application ready for deployment
- **Features:** Optimized bundle with Vite, Render blueprint for backend, Vercel-ready frontend
- **Deployment:** Backend on Render, Frontend on Vercel
- **To Run:**
  - Frontend: `cd deploy-app/frontend && npm install && npm run dev`
  - Backend: `cd deploy-app/backend && npm install && npm start`

### 3. **employees-dataset**

- **Tech Stack:** Node.js + Express + TypeScript
- **Description:** Employee management API with dataset handling
- **Features:** REST API, TypeScript setup, data routes and types
- **To Run:** `cd employees-dataset && npm install && npm run dev`

### 4. **feedback-form**

- **Tech Stack:** React + Vite
- **Description:** User feedback collection form application
- **Features:** Form validation, responsive design
- **To Run:** `cd feedback-form && npm install && npm run dev`

### 5. **JWT-Authentication**

- **Tech Stack:** Node.js + Express + JWT + Bcrypt
- **Description:** Authentication system with JWT tokens and password hashing
- **Features:** User registration, login, JWT middleware, password encryption
- **To Run:** `cd JWT-Authentication/backend && npm install && npm start`

### 6. **live-chat-app**

- **Tech Stack:** Node.js + Express + Socket.io
- **Description:** Real-time chat application
- **Features:** WebSocket communication, live message updates
- **To Run:** `cd live-chat-app && npm install && npm start`

### 7. **mini-full-stack-app**

- **Tech Stack:** Next.js + TypeScript
- **Description:** Complete full-stack application with Next.js
- **Features:** Server-side rendering, API routes, TypeScript support
- **To Run:** `cd mini-full-stack-app && npm install && npm run dev`

### 8. **portfolio-application**

- **Tech Stack:** Next.js + TypeScript + MDX
- **Description:** Personal portfolio website with blog
- **Features:** Static site generation, blog support with MDX, responsive design
- **To Run:** `cd portfolio-application && npm install && npm run dev`

### 9. **real-time-updates**

- **Tech Stack:** Node.js (Backend) + Next.js (Frontend)
- **Description:** Real-time data updates between frontend and backend
- **Features:** Live data synchronization
- **To Run:**
  - Backend: `cd real-time-updates/backend && npm install && npm start`
  - Frontend: `cd real-time-updates/frontend && npm install && npm run dev`

### 10. **Student-Management-System**

- **Tech Stack:** Node.js + Express + TypeScript
- **Description:** Complete student management system API
- **Features:** CRUD operations, database models, REST routes
- **To Run:** `cd Student-Management-System/backend && npm install && npm start`

### 11. **to-do-list**

- **Tech Stack:** React + Vite
- **Description:** Task management application
- **Features:** Add, edit, delete tasks with UI
- **To Run:** `cd to-do-list && npm install && npm run dev`

### 12. **user-profile**

- **Tech Stack:** React + Vite + TypeScript
- **Description:** User profile page application
- **Features:** Profile display, form handling, TypeScript
- **To Run:** `cd user-profile && npm install && npm run dev`

### 13. **utility-app**

- **Tech Stack:** Vanilla JavaScript + TypeScript
- **Description:** Utility tools application
- **Features:** Helper functions, lightweight
- **To Run:** `npm install` (if needed)

### 14. **Weather-App**

- **Tech Stack:** Node.js + Express + API Integration
- **Description:** Weather information application
- **Features:** External API integration, Vercel deployment ready
- **To Run:** `cd Weather-App && npm install && npm start`

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Git

### General Setup Instructions

1. **Clone/Navigate to the repository:**

   ```bash
   cd "d:\VSCode Projects\AWT\Practicals"
   ```

2. **Install dependencies for a specific project:**

   ```bash
   cd [project-name]
   npm install
   ```

3. **Run the project:**
   ```bash
   npm run dev    # for Vite/Next.js projects
   npm start      # for Express/Node.js projects
   ```

---

## 📝 Environment Variables

Some projects use `.env` files for configuration. These are ignored by `.gitignore` and should be created locally:

```bash
# Example for projects requiring API keys or credentials
VITE_API_URL=http://localhost:3000
DATABASE_URL=your_connection_string
JWT_SECRET=your_secret_key
```

**Never commit `.env` files to version control!**

---

## 🔧 Common Commands

| Command         | Purpose                      |
| --------------- | ---------------------------- |
| `npm install`   | Install project dependencies |
| `npm run dev`   | Start development server     |
| `npm start`     | Start application (Node.js)  |
| `npm run build` | Build for production         |
| `npm run lint`  | Run ESLint checks            |
| `npm test`      | Run tests (if configured)    |

---

## 📚 Technologies Used

- **Frontend:** React, Next.js, Vite, TypeScript, CSS
- **Backend:** Node.js, Express, TypeScript
- **Database:** MongoDB, PostgreSQL (varies by project)
- **Authentication:** JWT, Bcrypt
- **Real-time:** Socket.io
- **Deployment:** Vercel, Render, Docker
- **DevTools:** ESLint, TypeScript, TSConfig

---

## 🌐 Deployment

- **Frontend:** Most projects are ready for Vercel deployment
- **Backend:** Projects include Render and Docker configurations
- **Static:** Next.js projects can be deployed as static sites

Refer to individual project READMEs for specific deployment instructions.

---

## 📖 Project Structure

Each project follows a clean architecture with:

- `src/` - Source code
- `public/` - Static assets
- `package.json` - Dependencies and scripts
- `README.md` - Project-specific documentation

---

## ✅ Best Practices

- Always create a `.env` file locally for sensitive data
- Run `npm install` before starting development
- Check project-specific README for additional setup
- Keep dependencies updated regularly
- Use meaningful commit messages when contributing

---

## 📄 License

Individual projects may have their own licenses. Check specific project directories for details.

---

## 🤝 Notes

- All projects are learning/practice examples
- Modify and extend projects for your requirements
- Use for portfolio or educational purposes
- Reference individual READMEs for project-specific details

---

**Happy Coding! 🎉**
