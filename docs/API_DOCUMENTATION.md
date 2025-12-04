# API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication

All protected routes require a Bearer token in the Authorization header:
```
Authorization: Bearer <access_token>
```

---

## Authentication Endpoints

### 1. Register User

**POST** `/auth/register`

Register a new user account.

**Content-Type:** `multipart/form-data`

**Request Body:**
| Field | Type | Required | Validation |
|-------|------|----------|------------|
| name | String | Yes | Min 3 chars, alphabets only |
| email | String | Yes | Valid email, unique |
| phone | String | Yes | 10-15 digits, unique |
| password | String | Yes | Min 6 chars, must contain number |
| address | String | No | Max 150 chars |
| state | String | Yes | - |
| city | String | Yes | - |
| country | String | Yes | - |
| pincode | String | No | 4-10 digits |
| profile_image | File | No | JPG/PNG, max 2MB |

**Response (201):**
```json
{
  "success": true,
  "message": "User registered",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "1234567890",
    "profile_image": "uploads/filename.jpg"
  }
}
```

**Error Response (400):**
```json
{
  "message": "Email already registered",
  "errors": [...]
}
```

---

### 2. Login

**POST** `/auth/login`

Login with email/phone and password.

**Content-Type:** `application/json`

**Request Body:**
```json
{
  "identifier": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "1234567890",
    "role": "user",
    "profile_image": "uploads/filename.jpg"
  }
}
```

**Error Response (400):**
```json
{
  "message": "Invalid credentials"
}
```

---

### 3. Refresh Token

**POST** `/auth/refresh`

Refresh access token using refresh token.

**Content-Type:** `application/json`

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200):**
```json
{
  "success": true,
  "accessToken": "new_access_token",
  "refreshToken": "new_refresh_token"
}
```

**Error Response (401):**
```json
{
  "message": "Invalid or expired refresh token"
}
```

---

## User Endpoints

### 4. Get All Users

**GET** `/users`

Get list of all users (Admin only).

**Headers:**
```
Authorization: Bearer <access_token>
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| search | String | No | Search by name, email, state, or city |

**Example:**
```
GET /api/users?search=john
```

**Response (200):**
```json
{
  "users": [
    {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "1234567890",
      "profile_image": "uploads/filename.jpg",
      "state": "California",
      "city": "Los Angeles",
      "country": "USA",
      "pincode": "90001",
      "role": "user",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

**Error Response (401):**
```json
{
  "message": "No token provided"
}
```

**Error Response (403):**
```json
{
  "message": "Admins only"
}
```

---

### 5. Get User by ID

**GET** `/users/:id`

Get user details by ID.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "1234567890",
    "profile_image": "uploads/filename.jpg",
    "address": "123 Main St",
    "state": "California",
    "city": "Los Angeles",
    "country": "USA",
    "pincode": "90001",
    "role": "user"
  }
}
```

**Error Response (404):**
```json
{
  "message": "User not found"
}
```

---

### 6. Update User

**PUT** `/users/:id`

Update user details (Admin only).

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
```

**Request Body:**
| Field | Type | Required | Validation |
|-------|------|----------|------------|
| name | String | No | Min 3 chars, alphabets only |
| email | String | No | Valid email |
| phone | String | No | 10-15 digits |
| password | String | No | Min 6 chars, must contain number |
| address | String | No | Max 150 chars |
| state | String | No | - |
| city | String | No | - |
| country | String | No | - |
| pincode | String | No | 4-10 digits |
| profile_image | File | No | JPG/PNG, max 2MB |

**Response (200):**
```json
{
  "message": "User updated",
  "user": {
    "_id": "user_id",
    "name": "John Doe Updated",
    "email": "john@example.com",
    "phone": "1234567890",
    "profile_image": "uploads/new_filename.jpg",
    "address": "123 Main St",
    "state": "California",
    "city": "Los Angeles",
    "country": "USA",
    "pincode": "90001",
    "role": "user"
  }
}
```

**Error Response (400):**
```json
{
  "message": "Validation error",
  "errors": [...]
}
```

---

### 7. Delete User

**DELETE** `/users/:id`

Delete a user (Admin only). Cannot delete yourself.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "message": "User deleted"
}
```

**Error Response (400):**
```json
{
  "message": "You cannot delete your own account"
}
```

**Error Response (404):**
```json
{
  "message": "User not found"
}
```

---

## Error Responses

All endpoints may return the following error responses:

**400 Bad Request:**
```json
{
  "message": "Error message",
  "errors": [] // Optional, for validation errors
}
```

**401 Unauthorized:**
```json
{
  "message": "No token provided" | "Invalid or expired token"
}
```

**403 Forbidden:**
```json
{
  "message": "Admins only" | "Not authenticated"
}
```

**404 Not Found:**
```json
{
  "message": "User not found"
}
```

**500 Internal Server Error:**
```json
{
  "message": "Server error"
}
```

---

## Token Information

- **Access Token**: Expires in 1 hour
- **Refresh Token**: Expires in 7 days
- **Token Format**: JWT (JSON Web Token)
- **Algorithm**: HS256

---

## Postman Collection

Import the Postman collection from `docs/postman-collection.json` for easy API testing.

---

## Rate Limiting

Currently, there is no rate limiting implemented. For production, consider adding rate limiting middleware.

---

## CORS

CORS is enabled for all origins. For production, configure specific allowed origins.

---

Last Updated: 2024

