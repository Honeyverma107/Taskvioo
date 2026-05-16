# ⚡ TASKVIOO

### Smart Project & Team Collaboration Platform

<p align="center">
A modern productivity workspace for managing projects, tasks, and teams with a beautiful full-stack architecture.
</p>

<br/>

<p align="center">
<img src="https://img.shields.io/badge/React-Frontend-ff4da6?style=flat-square"/>
<img src="https://img.shields.io/badge/Node.js-Backend-black?style=flat-square"/>
<img src="https://img.shields.io/badge/PostgreSQL-Database-3f7cff?style=flat-square"/>
<img src="https://img.shields.io/badge/Prisma-ORM-1d2433?style=flat-square"/>
<img src="https://img.shields.io/badge/Auth-JWT-success?style=flat-square"/>
</p>

---

# 🌐 Live Deployment

## 🚀 Frontend

[https://taskvioo.vercel.app](https://taskvioo.vercel.app)

---

## ⚙️ Backend API

[https://taskvioo-production.up.railway.app/api/health](https://taskvioo-production.up.railway.app/api/health)

---

# 🧩 About The Project

TaskVio is a modern full-stack productivity platform designed for teams and individuals to efficiently manage workflows, assign tasks, monitor progress, and collaborate inside organized project workspaces.

The application focuses on:

* Clean UI/UX
* Smooth workflow management
* Secure authentication
* Scalable backend architecture
* Responsive cross-device experience

---

# 🎯 Main Highlights

| Feature Area          | Description                                                 |
| --------------------- | ----------------------------------------------------------- |
| 🔐 Authentication     | JWT Authentication, Secure Login & Signup, Protected Routes |
| 📁 Project Management | Create Projects, Manage Workspaces, Track Progress          |
| ✅ Task System         | Assign Tasks, Status Workflow, Priority Levels, Due Dates   |
| 🌙 User Experience    | Dark/Light Mode, Responsive Design, Smooth Animations       |

---

# 🛠️ Tech Stack

## Frontend

```yaml
React.js
Vite
Tailwind CSS
React Router
Axios
React Query
Lucide Icons
```

---

## Backend

```yaml
Node.js
Express.js
Prisma ORM
PostgreSQL
JWT
bcryptjs
```

---

# 📂 Project Structure

```bash
TASKVIO
│
├── frontend
│   ├── src
│   │   ├── api
│   │   ├── components
│   │   ├── context
│   │   ├── pages
│   │   └── main.jsx
│   │
│   └── package.json
│
├── backend
│   ├── prisma
│   │   └── schema.prisma
│   │
│   ├── src
│   │   ├── controllers
│   │   ├── middleware
│   │   ├── routes
│   │   └── index.js
│   │
│   └── package.json
│
└── README.md
```

---

# 🚀 Core Features

* Workspace & Team Collaboration
* Real-Time Task Workflow
* Project Progress Monitoring
* Secure JWT Authentication
* Responsive UI
* Theme Toggle Support
* RESTful API Architecture
* PostgreSQL Database Integration

---

# 🧠 Architecture

```text
Frontend (React + Vite)
        ↓
REST API (Express.js)
        ↓
Prisma ORM
        ↓
PostgreSQL Database
```

---

# ⚙️ Environment Variables

## Backend `.env`

```env
PORT=5000

DATABASE_URL="postgresql://postgres:password@localhost:5432/taskvio"

JWT_SECRET=your_secret_key
```

---

## Frontend `.env`

```env
VITE_API_URL=https://taskvioo-production.up.railway.app/api
```

---

# 🚀 Local Setup

## Clone Repository

```bash
git clone https://github.com/Anmolso107/taskvio.git
cd taskvio
```

---

## Backend Setup

```bash
cd backend

npm install

npx prisma generate

npx prisma migrate dev

npm run dev
```

---

## Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

---

# 🌟 Future Improvements

* 🔔 Real-time notifications
* 📅 Calendar integration
* 💬 Team chat system
* 📊 Analytics dashboard
* 🤖 AI-powered task recommendations
* 📱 Mobile app support

---

# 👨‍💻 Developer

## Honey Verma

* GitHub: [https://github.com/Honeyverma107](https://github.com/Honeyverma107)
* LinkedIn: [https://www.linkedin.com/in/honey-verma-8052372a5](https://www.linkedin.com/in/honey-verma-8052372a5)
* Email: [sv.honey107@gmail.com](mailto:sv.honey107@gmail.com)

---

# ⭐ Support

If you like this project:

* Star the repository
* Fork the project
* Share it with others

---

<div align="center">

### Built with ❤️ using React, Node.js & PostgreSQL

</div>
