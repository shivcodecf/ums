📘 User Management System (UMS)

A full-stack role-based User Management System (UMS) built with modern technologies.
It allows Admins, Managers, and Users to manage profiles, roles, and access with secure authentication.

---
🚀 Live Demo

```
🌐 Frontend:https://ums-liart.vercel.app/
🔗 Backend API:https://ums-2k11.onrender.com
```
---

🧠 Features
🔐 Authentication & Authorization
Secure login & signup
JWT-based authentication with cookies
Role-Based Access Control (RBAC)

---
🧑‍💼 Manager Capabilities
View users (excluding admin)
Search & filter users
Update non-admin user details
Cannot modify roles or admin accounts

---

👤 User Capabilities
View own profile
Update name & password
Cannot change role or view other users

---

🎯 UI/UX Features
✅ SaaS-style landing page
✅ Role-based dashboards
✅ Protected routes (frontend + backend)
✅ Toast notifications (instead of alerts)
✅ Reusable components (Button, Modal)
✅ Responsive design with Tailwind CSS

---

🧱 Tech Stack
Frontend
⚛️ React (Vite)
🎨 Tailwind CSS
🔀 React Router
📡 Axios
🔔 react-hot-toast

---

Backend
🟢 Node.js
🚀 Express.js
🍃 MongoDB + Mongoose
🔐 JWT Authentication
🔑 bcryptjs (password hashing)

---

📂 Folder Structure
---
🔙 Backend

```
backend/
├── config/          # Database & app configuration
├── controllers/     # Business logic
├── middlewares/     # Auth & role middleware
├── models/          # Mongoose schemas
├── routes/          # API routes
├── scripts/         # Seed scripts
├── utils/           # Helper functions
├── index.js         # Entry point
├── package.json

```

---

🎨 Frontend

```
frontend/
├── app/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── layout/     # Navbar, layout components
│   │   │   ├── ui/         # Reusable UI (Button, Modal)
│   │   │   └── ProtectedRoute.jsx
│   │   ├── pages/          # All pages (Admin, Manager, User)
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env
│   ├── package.json

```

---

🔐 Role-Based Access
Role	Permissions
Admin	Full system access
Manager	Manage non-admin users
User	Manage own profile

---

⚙️ Setup Instructions
1️⃣ Clone Repository

```
https://github.com/shivcodecf/ums.git

cd ums

```

---

2️⃣ Backend Setup

```
cd backend
npm install

```

---

Create .env:

```
PORT=
JWT_SECRET=
MONGO_URI=
FRONTEND_URL=

```

---

Run backend:

```
npm run dev

```

---
3️⃣ Frontend Setup

```
cd frontend/app
npm install

```

Create .env:

```
VITE_API_BASE_URL=

```

Run frontend:

---

```
npm run dev

```
---
🔥 Key Highlights
Server-side pagination
Search & filtering
RBAC implementation
Cookie-based authentication
Reusable UI components
Clean folder structure

---

🧠 Learnings
Implemented role-based authorization
Built reusable UI system (Button, Modal)
Managed authentication with cookies & JWT
Handled deployment issues (CORS, cookies)

---

🚀 Future Improvements
Advanced search (debounce)
Analytics dashboard
Password reset system
Dark mode

---

👨‍💻 Author

Shivam Yadav

GitHub: https://github.com/shivcodecf
LinkedIn: https://www.linkedin.com/in/shivam-yadav-620a03232/

---

⭐ Support

If you like this project, give it a ⭐ on GitHub!


