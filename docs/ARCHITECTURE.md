# System Architecture

## User Management System - Architecture Overview

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                          │
│                     (React.js Frontend)                      │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Login    │  │ Register │  │  Profile │  │  Admin   │   │
│  │   Page    │  │   Page   │  │   Page   │  │ Dashboard│   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐ │
│  │           React Router (Client-Side Routing)          │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐ │
│  │         AuthContext (State Management)                │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐ │
│  │         Axios (HTTP Client)                           │ │
│  └──────────────────────────────────────────────────────┘ │
└──────────────────────┬───────────────────────────────────────┘
                       │
                       │ HTTP/REST API
                       │
┌──────────────────────▼───────────────────────────────────────┐
│                    API LAYER                                  │
│              (Express.js Backend)                             │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Middleware Stack                         │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐          │  │
│  │  │   CORS   │  │  Helmet  │  │  Morgan  │          │  │
│  │  └──────────┘  └──────────┘  └──────────┘          │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                    Routes                              │  │
│  │  ┌──────────────┐         ┌──────────────┐           │  │
│  │  │ /api/auth    │         │ /api/users   │           │  │
│  │  │ - register   │         │ - GET /      │           │  │
│  │  │ - login      │         │ - GET /:id   │           │  │
│  │  │ - refresh    │         │ - PUT /:id   │           │  │
│  │  └──────────────┘         │ - DELETE /:id│          │  │
│  │                            └──────────────┘           │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Middleware (Request Processing)          │  │
│  │  ┌──────────────┐  ┌──────────────┐                 │  │
│  │  │   Auth        │  │  Validation   │                 │  │
│  │  │  Middleware   │  │  Middleware   │                 │  │
│  │  └──────────────┘  └──────────────┘                 │  │
│  │  ┌──────────────┐  ┌──────────────┐                 │  │
│  │  │   Upload     │  │   Admin      │                 │  │
│  │  │  Middleware   │  │  Middleware   │                 │  │
│  │  └──────────────┘  └──────────────┘                 │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                  Controllers                           │  │
│  │  ┌──────────────┐         ┌──────────────┐           │  │
│  │  │ auth.controller│        │ user.controller│          │  │
│  │  └──────────────┘         └──────────────┘           │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                    Models                             │  │
│  │  ┌──────────────┐                                    │  │
│  │  │  User Model  │  (Mongoose Schema)                  │  │
│  │  └──────────────┘                                    │  │
│  └──────────────────────────────────────────────────────┘  │
└──────────────────────┬───────────────────────────────────────┘
                       │
                       │ Mongoose ODM
                       │
┌──────────────────────▼───────────────────────────────────────┐
│                    DATA LAYER                                  │
│                  (MongoDB Database)                            │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Users Collection                         │  │
│  │  - Documents (User Records)                           │  │
│  │  - Indexes (email, phone, role)                      │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    FILE STORAGE                                │
│              (Local File System)                              │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────────┐  │
│  │              uploads/ Directory                       │  │
│  │  - Profile Images (JPG/PNG)                           │  │
│  │  - Max 2MB per file                                   │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Component Architecture

### Frontend Components

```
App.jsx
├── Routes
│   ├── /login → Login Component
│   ├── /register → Register Component
│   ├── /profile → Profile Component (Protected)
│   ├── /admin → AdminDashboard (Admin Only)
│   ├── /users → Users List (Admin Only)
│   ├── /users/view/:id → UserView (Admin Only)
│   └── /users/edit/:id → UserEdit (Admin Only)
│
├── AuthContext
│   ├── User State
│   ├── Login Function
│   ├── Logout Function
│   └── Token Management
│
└── Components
    ├── Navbar
    ├── Sidebar (Admin Only)
    ├── ProtectedRoute
    └── Loader
```

### Backend Structure

```
src/
├── app.js (Express App Configuration)
├── config/
│   └── db.js (MongoDB Connection)
├── controllers/
│   ├── auth.controller.js
│   └── user.controller.js
├── middlewares/
│   ├── auth.middleware.js (JWT Verification)
│   ├── upload.middleware.js (Multer File Upload)
│   └── validation.middleware.js (Input Validation)
├── models/
│   └── User.js (Mongoose Schema)
├── routes/
│   ├── auth.routes.js
│   └── users.routes.js
└── utils/
    └── token.util.js (JWT Generation)
```

## Request Flow

### Authentication Flow

```
1. User submits login form
   ↓
2. Frontend sends POST /api/auth/login
   ↓
3. Backend validates credentials
   ↓
4. Backend generates JWT tokens
   ↓
5. Backend returns tokens + user data
   ↓
6. Frontend stores tokens in localStorage
   ↓
7. Frontend redirects to dashboard
```

### Protected Route Flow

```
1. User navigates to protected route
   ↓
2. Frontend checks for token in localStorage
   ↓
3. Frontend sends request with Authorization header
   ↓
4. Backend auth middleware verifies JWT
   ↓
5. Backend processes request
   ↓
6. Backend returns response
   ↓
7. Frontend renders component
```

### File Upload Flow

```
1. User selects image file
   ↓
2. Frontend creates FormData
   ↓
3. Frontend sends POST/PUT with multipart/form-data
   ↓
4. Backend upload middleware (Multer) processes file
   ↓
5. File saved to uploads/ directory
   ↓
6. File path stored in database
   ↓
7. Response returned with file path
```

## Security Architecture

```
┌─────────────────────────────────────────┐
│         Security Layers                 │
├─────────────────────────────────────────┤
│ 1. Frontend Validation                  │
│    - Input sanitization                 │
│    - Client-side validation             │
│                                         │
│ 2. CORS Protection                      │
│    - Configured origins                 │
│                                         │
│ 3. Helmet.js                            │
│    - Security headers                   │
│    - XSS protection                     │
│                                         │
│ 4. Authentication                      │
│    - JWT tokens                         │
│    - Token expiration                   │
│                                         │
│ 5. Authorization                        │
│    - Role-based access control          │
│    - Admin middleware                   │
│                                         │
│ 6. Input Validation                     │
│    - express-validator                  │
│    - Backend validation                 │
│                                         │
│ 7. Password Security                   │
│    - bcrypt hashing                     │
│    - Never stored in plain text        │
│                                         │
│ 8. File Upload Security                │
│    - File type validation               │
│    - File size limits                   │
└─────────────────────────────────────────┘
```

## Technology Stack

### Frontend
- **React.js**: UI library
- **React Router**: Client-side routing
- **Axios**: HTTP client
- **Bootstrap**: CSS framework
- **Vite**: Build tool

### Backend
- **Node.js**: Runtime environment
- **Express.js**: Web framework
- **MongoDB**: Database
- **Mongoose**: ODM (Object Document Mapper)
- **JWT**: Authentication
- **bcrypt**: Password hashing
- **Multer**: File upload
- **express-validator**: Input validation
- **Helmet**: Security middleware
- **CORS**: Cross-origin resource sharing

## Deployment Architecture (Future)

```
┌─────────────────────────────────────────┐
│         Load Balancer                    │
└──────────────┬──────────────────────────┘
               │
    ┌──────────┴──────────┐
    │                     │
┌───▼────┐          ┌─────▼───┐
│  App   │          │   App   │
│ Server │          │ Server  │
│   (1)  │          │   (2)   │
└───┬────┘          └─────┬───┘
    │                     │
    └──────────┬──────────┘
               │
        ┌──────▼──────┐
        │  MongoDB    │
        │  Cluster    │
        └─────────────┘
```

## Data Flow Diagram

```
User Action
    ↓
React Component
    ↓
Axios Request
    ↓
Express Middleware
    ├── CORS
    ├── Helmet
    ├── Auth (if protected)
    └── Validation
    ↓
Controller
    ↓
Model (Mongoose)
    ↓
MongoDB
    ↓
Response
    ↓
React Component Update
```

---

Last Updated: 2024

