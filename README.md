# Movie Application

A full-stack web application for exploring IMDb Top 250 movies, featuring a robust backend with lazy processing and a modern React-based frontend.

## 🚀 Features

- **Movie Catalog:** Explore IMDb Top Movies with pagination.
- **Filtering & Sorting:** Sort movies by rank, title, rating, release date, and duration.
- **Search:** Search for movies by title, description, or director.
- **Authentication:** Secure user registration and login using JWT.
- **Admin Dashboard:** 
  - Admin-only routes for database management.
  - **Lazy Movie Insertion:** Adding movies triggers an asynchronous in-memory queue to process database writes without blocking the user.
  - Manage, edit, and delete existing entries.
- **Responsive Design:** Premium UI built with Material UI (MUI).

## 🛠️ Tech Stack

### Backend
- **Node.js & Express:** Server-side logic and REST API.
- **MongoDB & Mongoose:** NoSQL database for flexible data modeling.
- **JWT (JSON Web Tokens):** Secure authentication and session management.
- **In-Memory Queueing:** Decoupled data insertion for performance.

### Frontend
- **React (Vite):** Fast dev server and modern component architecture.
- **Material UI (MUI):** Premium design system and components.
- **Axios:** API communication with interceptors for auth headers.
- **React Router:** Smooth client-side navigation.

## 🏁 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- MongoDB instance (Atlas or local)

### 1. Clone & Install
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Environment
Create a `.env` file in the **backend** directory:
```env
PORT=5001
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
NODE_ENV=development
```

Create a `.env` file in the **frontend** directory:
```env
VITE_APP_API_URL=http://localhost:5001/api
```

### 3. Seed the Database
```bash
cd backend
npm run seed
```

### 4. Create an Admin Account
```bash
cd backend
node utils/createAdmin.js
```

### 5. Run the Application
Open two terminals:

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

The application will be available at `http://localhost:3000`.

## 🔐 Admin Access
To access admin features, use the following default credentials (created via the script):
- **Email:** `admin@movieapp.com`
- **Password:** `adminpassword123`

## 📂 Project Structure
```
MovieApplication/
├── backend/            # Express Server
│   ├── middleware/     # Auth & Error handling
│   ├── models/         # Mongoose Schemas
│   ├── queues/         # In-memory processing
│   ├── routes/         # API Endpoints
│   ├── utils/          # Scripts (Seed, Admin)
│   └── server.js       # Entry point
└── frontend/           # React App
    ├── src/
    │   ├── components/ # Reusable UI components
    │   ├── context/    # Auth Management
    │   ├── pages/      # View components
    │   └── services/   # Axios API configuration
    └── vite.config.js  # Build config
```
