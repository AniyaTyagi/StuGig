# JWT Authentication Implementation

## Overview
Complete JWT authentication system with access tokens, refresh tokens, and role-based authorization.

## Features
- ✅ Secure token generation with 256-bit secrets
- ✅ Password hashing with bcrypt (12 rounds)
- ✅ Protected routes middleware
- ✅ Role-based access control
- ✅ Token refresh capability
- ✅ Input validation

## API Endpoints

### 1. Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "freelancer"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "6584a1b2c3d4e5f6a7b8c9d0",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "freelancer"
  }
}
```

### 2. Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "6584a1b2c3d4e5f6a7b8c9d0",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "freelancer",
    "avatar": ""
  }
}
```

### 3. Get Profile (Protected)
```http
GET /api/auth/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "6584a1b2c3d4e5f6a7b8c9d0",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "freelancer",
    "skills": ["React", "Node.js"],
    "rating": 4.8,
    "earnings": 5000
  }
}
```

### 4. Update Password (Protected)
```http
PUT /api/auth/password
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "currentPassword": "password123",
  "newPassword": "newpassword456"
}
```

## Using in Protected Routes

### Example: Protect a route
```javascript
const { protect } = require('../middlewares/auth');

router.get('/protected', protect, (req, res) => {
  res.json({ user: req.user }); // req.user available after protect middleware
});
```

### Example: Role-based authorization
```javascript
const { protect, authorize } = require('../middlewares/auth');

// Only freelancers can access
router.post('/services', protect, authorize('freelancer'), createService);

// Only clients can access
router.post('/jobs', protect, authorize('client'), createJob);

// Multiple roles
router.get('/dashboard', protect, authorize('freelancer', 'client', 'admin'), getDashboard);
```

## Environment Variables

Update your `.env` file with secure secrets:

```env
JWT_SECRET=a7f9d2b3e8c4f1a6b5d9e2c8f7a3b6d1e4c9f2a5b8d3e6c1f9a2b7d4e8c3f6a9
JWT_EXPIRE=30d
JWT_REFRESH_SECRET=b8e3c6f1a9d2b5e7c4f9a3b6d8e1c5f2a7b4d9e6c3f8a1b5d7e9c2f4a6b3d8
```

**⚠️ IMPORTANT:** Generate new random secrets for production!

```bash
# Generate secure random keys
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Frontend Integration

### Store token in localStorage
```javascript
const login = async (email, password) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  
  const data = await response.json();
  localStorage.setItem('token', data.token);
  localStorage.setItem('refreshToken', data.refreshToken);
};
```

### Send token with requests
```javascript
const fetchProtectedData = async () => {
  const token = localStorage.getItem('token');
  
  const response = await fetch('/api/auth/me', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  return await response.json();
};
```

## Security Features

- **bcrypt hashing** - 12 rounds salt for password security
- **JWT tokens** - Signed with 256-bit secrets
- **Token expiry** - Access tokens expire in 30 days
- **Refresh tokens** - Long-lived tokens for re-authentication
- **Password validation** - Minimum 6 characters
- **Email validation** - Normalized and validated
- **Active user check** - Inactive/deleted users rejected
- **Role verification** - Middleware for role-based access

## Testing

```bash
# Start server
npm run dev

# Test registration
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com",
    "password": "password123",
    "role": "freelancer"
  }'

# Test login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

# Test protected route
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Files Created

- `utils/jwt.js` - Token generation/verification utilities
- `middlewares/auth.js` - Authentication & authorization middleware
- `middlewares/validate.js` - Input validation middleware
- `controllers/authController.js` - Authentication controllers
- `routes/auth.routes.js` - Authentication routes
- `.env` - Updated with secure JWT secrets
- `.env.example` - Environment template

## Next Steps

1. ✅ JWT authentication is ready
2. Protect your other routes with `protect` middleware
3. Add role checks with `authorize` middleware
4. Implement refresh token rotation (optional)
5. Add email verification (optional)
6. Set up frontend authentication flow

---

**Authentication is now fully implemented and ready to use!** 🎉
