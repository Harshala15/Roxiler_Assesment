# Roxiler-systems-coding-round
# Store Rating System

A full-stack web application that allows users to rate stores on a scale of 1–5. The system supports different user roles (Admin, Store Owner, Normal User), with role-based access to features.  

This project is built as part of the **Roxiler System Coding Challenge**.

---

## 📌 Project Overview
The Store Rating System enables users to:
- Register and log in.
- View available stores.
- Submit and update ratings.
- Store Owners can track ratings on their stores.
- Admins can manage users and stores, and view platform statistics.

---

## 🛠 Tech Stack
**Frontend:**  
- React, Vite, JavaScript, CSS  

**Backend:**  
- Node.js, Express.js  
- Authentication: JWT, bcryptjs  
- Validation: express-validator  
- Security & Middleware: dotenv, cors  

**Database:**  
- MySQL  

---

## 🏗 Architecture
This project follows a **three-tier architecture**:
1. **Frontend (React):** Handles UI, API calls, and user interactions.
2. **Backend (Express.js):** Provides RESTful API endpoints, authentication, and validation middleware.
3. **Database (MySQL):** Stores users, stores, and ratings.

---

## 🚀 Features

### 🔑 User Authentication
- Registration & login with JWT-based authentication.
- Passwords hashed using `bcryptjs`.
- Role-based access control.

### 👥 User Roles & Functionalities
**System Administrator**
- Add new stores and users (Admin/Normal/Store Owner).  
- Dashboard:  
  - Total users  
  - Total stores  
  - Total ratings  
- Manage users (Name, Email, Role, Address).  
- Manage stores (Name, Email, Address, Rating).  
- Apply filters and sorting on listings.  

**Normal User**
- Register & login.  
- Update password.  
- View & search stores by name or address.  
- Submit ratings (1–5) for stores.  
- Modify submitted ratings.  

**Store Owner**
- Login & update password.  
- Dashboard:  
  - View ratings received from users.  
  - View average store rating.  

### 📝 Validations
- **Name:** 20–60 characters  
- **Address:** Max 400 characters  
- **Password:** 8–16 characters, must include at least 1 uppercase & 1 special character  
- **Email:** Must be valid format  

---

## 📂 Folder Structure
```
├── README.md
├── backend
    ├── .gitignore
    ├── config
    │   ├── database.js
    │   └── jwt.js
    ├── controllers
    │   ├── authController.js
    │   ├── ratingController.js
    │   ├── storeController.js
    │   └── userController.js
    ├── database
    │   └── schema.sql
    ├── middleware
    │   ├── auth.js
    │   └── validation.js
    ├── package-lock.json
    ├── package.json
    ├── routes
    │   ├── auth.js
    │   ├── rating.js
    │   ├── store.js
    │   └── users.js
    └── server.js
└── frontend
    ├── .gitignore
    ├── README.md
    ├── eslint.config.js
    ├── index.html
    ├── package-lock.json
    ├── package.json
    ├── public
        └── vite.svg
    ├── src
        ├── App.jsx
        ├── assets
        │   └── react.svg
        ├── components
        │   ├── admin
        │   │   ├── AddStore.jsx
        │   │   ├── AddUser.jsx
        │   │   ├── Dashboard.jsx
        │   │   ├── StoreList.jsx
        │   │   └── UserList.jsx
        │   ├── auth
        │   │   ├── Login.jsx
        │   │   └── Register.jsx
        │   ├── common
        │   │   ├── Footer.jsx
        │   │   ├── Header.jsx
        │   │   ├── Loading.jsx
        │   │   └── ProtectedRoute.jsx
        │   ├── storeowner
        │   │   ├── Dashboard.jsx
        │   │   └── Profile.jsx
        │   └── user
        │   │   ├── Dashboard.jsx
        │   │   ├── Profile.jsx
        │   │   ├── RatingModal.jsx
        │   │   └── StoreList.jsx
        ├── context
        │   └── AuthContext.jsx
        ├── index.css
        ├── main.jsx
        ├── services
        │   └── api.js
        └── utils
        │   └── validation.js
    └── vite.config.js
```

---

## ⚙️ Setup & Installation

### 1️⃣ Clone Repository
```bash
git clone https://github.com/Harshala15/Roxiler_Assesment.git
```

### 2️⃣ Backend Setup
```bash
cd Roxiler_Assesment
cd backend
npm install
```
- Configure `.env`:
  ```env
  DB_HOST=localhost
  DB_USER=root
  DB_PASSWORD=yourpassword
  DB_NAME=store_rating
  JWT_SECRET=your_jwt_secret
  ```
- Create MySQL schema:
  ```sql
  source database/schema.sql;
  ```
- Start server:
  ```bash
  npm start
  ```

### 3️⃣ Frontend Setup
```bash
cd Roxiler_Assesment
cd frontend
npm install
npm run dev
```

---

