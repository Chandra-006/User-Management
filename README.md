# User Management System

A full-stack MERN (MongoDB, Express.js, React.js, Node.js) application for managing users with JWT authentication, CRUD operations, and an admin dashboard.

## 🚀 Features

### Core Features
- ✅ User Registration with validation
- ✅ Login/Logout with JWT tokens
- ✅ JWT Token-Based Authentication (Access: 1 hour, Refresh: 7 days)
- ✅ Admin Panel with Web Dashboard
- ✅ CRUD Operations (Create, Read, Update, Delete Users)
- ✅ Image Upload Support (JPG/PNG, max 2MB)
- ✅ Search & Filter Users
- ✅ Pagination (10 users per page)
- ✅ Role-Based Access Control (Admin/User)
- ✅ Input Validation (Frontend & Backend)
- ✅ Error Handling
- ✅ Security Middleware (Helmet, CORS)

### Admin Features
- View all users with pagination
- Search users by name, email, state, or city
- View single user details
- Edit user details
- Delete users
- View dashboard with statistics
- Logout

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## 🛠️ Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd user-management
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```env
MONGO_URI=mongodb://localhost:27017/user-management
# OR for MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/user-management

PORT=5000

JWT_ACCESS_SECRET=your_super_secret_access_key_here
JWT_REFRESH_SECRET=your_super_secret_refresh_key_here
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

Create a `.env` file in the `frontend` directory (optional):

```env
VITE_API_URL=http://localhost:5000
```

### 4. Start the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## 📁 Project Structure

```
user-management/
├── backend/
│   ├── src/
│   │   ├── app.js                 # Express app configuration
│   │   ├── config/
│   │   │   └── db.js              # MongoDB connection
│   │   ├── controllers/
│   │   │   ├── auth.controller.js # Authentication logic
│   │   │   └── user.controller.js # User CRUD operations
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.js # JWT authentication
│   │   │   ├── upload.middleware.js # File upload (Multer)
│   │   │   └── validation.middleware.js # Input validation
│   │   ├── models/
│   │   │   └── User.js            # User schema
│   │   ├── routes/
│   │   │   ├── auth.routes.js     # Auth routes
│   │   │   └── users.routes.js    # User routes
│   │   └── utils/
│   │       └── token.util.js     # JWT token generation
│   ├── uploads/                   # Profile images storage
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── axiosConfig.js    # Axios configuration
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── Loader.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx    # Auth state management
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── Users.jsx
│   │   │   ├── UserView.jsx
│   │   │   └── UserEdit.jsx
│   │   ├── utils/
│   │   │   └── imageUtils.js     # Image URL utilities
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
└── README.md
```

## 🔐 API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| POST | `/api/auth/refresh` | Refresh access token | No |

### Users (Admin Only)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/users` | Get all users (with search) | Yes (Admin) |
| GET | `/api/users/:id` | Get user by ID | Yes |
| PUT | `/api/users/:id` | Update user | Yes (Admin) |
| DELETE | `/api/users/:id` | Delete user | Yes (Admin) |

### Query Parameters

- `search`: Search users by name, email, state, or city
  - Example: `/api/users?search=john`

## 📝 Validation Rules

### Registration
- **name**: Min 3 characters, alphabets and spaces only
- **email**: Valid email format, unique
- **phone**: 10-15 digits, unique
- **password**: Min 6 characters, must contain at least one number
- **address**: Optional, max 150 characters
- **state**: Required
- **city**: Required
- **country**: Required
- **pincode**: Optional, 4-10 digits
- **profile_image**: JPG/PNG, max 2MB

### Login
- **identifier**: Email or phone number
- **password**: Required

## 🔒 Security Features

- Password hashing with bcrypt (10 rounds)
- JWT token-based authentication
- Access token expiration: 1 hour
- Refresh token expiration: 7 days
- CORS enabled
- Helmet.js for security headers
- Input validation and sanitization
- No sensitive data in API responses
- Protected routes with role-based access

## 🎨 Admin Panel Features

- **Dashboard**: Statistics cards showing total users, admins, and regular users
- **User List**: Table view with search, pagination, and actions
- **User View**: Detailed user information
- **User Edit**: Update user details and profile image
- **User Delete**: Delete users with confirmation (cannot delete yourself)

## 🧪 Testing

### Using Postman

Import the Postman collection from `docs/postman-collection.json` or use the API documentation below.

### Manual Testing

1. **Register a user:**
   ```bash
   POST http://localhost:5000/api/auth/register
   Content-Type: multipart/form-data
   
   name: John Doe
   email: john@example.com
   phone: 1234567890
   password: pass123
   state: California
   city: Los Angeles
   country: USA
   ```

2. **Login:**
   ```bash
   POST http://localhost:5000/api/auth/login
   Content-Type: application/json
   
   {
     "identifier": "john@example.com",
     "password": "pass123"
   }
   ```

3. **Get all users (Admin):**
   ```bash
   GET http://localhost:5000/api/users
   Authorization: Bearer <access_token>
   ```

## 📊 Database Schema

### User Model

```javascript
{
  _id: ObjectId,
  name: String (min: 3, alphabets only),
  email: String (unique, required),
  phone: String (unique, required, 10-15 digits),
  password: String (hashed with bcrypt),
  profile_image: String (path to image),
  address: String (optional, max: 150),
  state: String (required),
  city: String (required),
  country: String (required),
  pincode: String (optional, 4-10 digits),
  role: String (enum: ["user", "admin"], default: "user"),
  refreshToken: String (optional),
  createdAt: Date,
  updatedAt: Date
}
```

## 🐳 Docker Setup (Recommended)

### Quick Start with Docker

**Option 1: Using Make (if available):**
```bash
# Production
make prod

# Development
make dev

# View logs
make logs

# Stop services
make down
```

**Option 2: Using Docker Compose directly:**

**Production Mode:**
```bash
docker-compose up -d --build
```

**Development Mode:**
```bash
docker-compose -f docker-compose.dev.yml up -d --build
```

The application will be available at:
- **Frontend**: http://localhost:3000 (production) or http://localhost:5173 (development)
- **Backend API**: http://localhost:5000
- **MongoDB**: mongodb://localhost:27017

**Stop services:**
```bash
docker-compose down
```

**View logs:**
```bash
docker-compose logs -f
```

### Docker Services

- **MongoDB**: Database server (port 27017)
- **Backend**: Express.js API (port 5000)
- **Frontend**: React.js app (port 3000/5173)

For detailed Docker setup instructions, see [docs/DOCKER_SETUP.md](docs/DOCKER_SETUP.md)

## 📚 Documentation

- **API Documentation**: See `docs/API_DOCUMENTATION.md`
- **ER Diagram**: See `docs/ER_DIAGRAM.md`
- **Architecture Diagram**: See `docs/ARCHITECTURE.md`

## 🚨 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check `MONGO_URI` in `.env` file

2. **Port Already in Use**
   - Change `PORT` in backend `.env`
   - Update `VITE_API_URL` in frontend `.env`

3. **Image Upload Fails**
   - Ensure `uploads` directory exists in backend
   - Check file size (max 2MB) and format (JPG/PNG)

4. **CORS Errors**
   - Verify backend CORS configuration
   - Check frontend API URL

## 👥 Default Admin

To create an admin user, you can:
1. Register a user normally
2. Manually update the role in MongoDB:
   ```javascript
   db.users.updateOne(
     { email: "admin@example.com" },
     { $set: { role: "admin" } }
   )
   ```

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Developed as a full-stack user management system with MERN stack.

## 🙏 Acknowledgments

- Express.js
- React.js
- MongoDB
- JWT
- Bootstrap
- Multer

---

For detailed API documentation, see `docs/API_DOCUMENTATION.md`

