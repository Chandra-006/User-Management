# Entity Relationship Diagram

## User Management System - Database Schema

### User Entity

```
┌─────────────────────────────────────────┐
│              USER                        │
├─────────────────────────────────────────┤
│ _id: ObjectId (PK)                      │
│ name: String (required, min: 3)          │
│ email: String (required, unique)        │
│ phone: String (required, unique)         │
│ password: String (hashed, required)     │
│ profile_image: String (optional)         │
│ address: String (optional, max: 150)     │
│ state: String (required)                 │
│ city: String (required)                  │
│ country: String (required)               │
│ pincode: String (optional, 4-10 digits)  │
│ role: Enum ["user", "admin"]             │
│ refreshToken: String (optional)          │
│ createdAt: Date                          │
│ updatedAt: Date                          │
└─────────────────────────────────────────┘
```

## Relationships

### Current System
- **No Foreign Key Relationships**: The system uses a single User collection with no relationships to other entities.

### Future Enhancements (Optional)
- User → User (self-referencing for user hierarchy)
- User → Session (for session management)
- User → AuditLog (for activity tracking)

## Data Flow

```
┌─────────────┐
│   Client    │
│  (React)    │
└──────┬──────┘
       │
       │ HTTP Requests
       │
┌──────▼──────────────────┐
│   Express Server        │
│   (Node.js)             │
│                         │
│  ┌──────────────────┐ │
│  │  Auth Middleware   │ │
│  │  (JWT Verify)      │ │
│  └──────────────────┘ │
│                         │
│  ┌──────────────────┐ │
│  │  Validation      │ │
│  │  Middleware      │ │
│  └──────────────────┘ │
│                         │
│  ┌──────────────────┐ │
│  │  Controllers      │ │
│  └──────────────────┘ │
└──────┬─────────────────┘
       │
       │ Mongoose ODM
       │
┌──────▼──────────────────┐
│   MongoDB Database      │
│                         │
│  ┌──────────────────┐  │
│  │   Users          │  │
│  │   Collection     │  │
│  └──────────────────┘  │
└─────────────────────────┘
```

## Indexes

### User Collection Indexes

1. **Primary Key**: `_id` (automatic)
2. **Unique Index**: `email`
3. **Unique Index**: `phone`
4. **Index**: `role` (for filtering)
5. **Index**: `createdAt` (for sorting)

## Sample Data Structure

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "password": "$2a$10$hashedpassword...",
  "profile_image": "uploads/1234567890-filename.jpg",
  "address": "123 Main Street",
  "state": "California",
  "city": "Los Angeles",
  "country": "USA",
  "pincode": "90001",
  "role": "user",
  "refreshToken": null,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

## Constraints

1. **Email**: Must be unique, valid email format
2. **Phone**: Must be unique, 10-15 digits
3. **Name**: Minimum 3 characters, alphabets only
4. **Password**: Minimum 6 characters, must contain at least one number
5. **Role**: Must be either "user" or "admin"
6. **Pincode**: If provided, must be 4-10 digits
7. **Address**: If provided, maximum 150 characters

## Database Design Decisions

1. **NoSQL (MongoDB)**: Chosen for flexibility and scalability
2. **Single Collection**: Simple structure for user management
3. **Embedded Data**: All user information in one document
4. **Timestamps**: Automatic `createdAt` and `updatedAt` fields
5. **Password Hashing**: Stored as bcrypt hash, never plain text
6. **Image Storage**: File paths stored, actual files in `uploads/` directory

## Security Considerations

1. **Password**: Never stored in plain text, always hashed with bcrypt
2. **Tokens**: Refresh tokens stored in database for validation
3. **Sensitive Data**: Password and refreshToken never returned in API responses
4. **Validation**: Input validation at both frontend and backend levels

---

## Visual ER Diagram (Text Representation)

```
┌─────────────────────────────────────────────┐
│                                             │
│              USER TABLE                     │
│                                             │
│  ┌──────────────────────────────────────┐  │
│  │ _id (PK)                             │  │
│  │ name                                  │  │
│  │ email (UNIQUE)                        │  │
│  │ phone (UNIQUE)                        │  │
│  │ password (HASHED)                    │  │
│  │ profile_image                         │  │
│  │ address                               │  │
│  │ state                                 │  │
│  │ city                                  │  │
│  │ country                               │  │
│  │ pincode                               │  │
│  │ role (ENUM)                           │  │
│  │ refreshToken                          │  │
│  │ createdAt                             │  │
│  │ updatedAt                             │  │
│  └──────────────────────────────────────┘  │
│                                             │
└─────────────────────────────────────────────┘
```

---

Last Updated: 2024

