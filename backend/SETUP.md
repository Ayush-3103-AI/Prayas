# Quick Setup Guide

## Step 1: Install Dependencies

```bash
cd backend
npm install
```

## Step 2: Configure Environment

Create a `.env` file in the `backend` directory with the following content:

```env
# Server
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/prayas
DB_NAME=prayas

# JWT
JWT_SECRET=your_jwt_secret_key_here_change_in_production
JWT_EXPIRE=15m
JWT_REFRESH_SECRET=your_refresh_token_secret_here_change_in_production
JWT_REFRESH_EXPIRE=7d

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173

# WhatsApp Business API (Optional)
WHATSAPP_API_KEY=your_whatsapp_api_key
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id

# Email (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads

# Rate Limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100
```

**Important**: Change `JWT_SECRET` and `JWT_REFRESH_SECRET` to strong random strings in production!

## Step 3: Start MongoDB

Make sure MongoDB is running on your system:

```bash
# If using local MongoDB
mongod

# Or use MongoDB Atlas connection string in MONGODB_URI
```

## Step 4: Seed Database (Optional)

```bash
npm run seed
```

This will create:
- Admin user: `admin@prayas.com` / `admin123`
- Test user: `user@test.com` / `user123`
- Test agent: `agent@test.com` / `agent123`
- Sample NGOs
- Sample badges
- Sample CSR campaign

## Step 5: Start Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

## Step 6: Test API

```bash
# Health check
curl http://localhost:5000/health

# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "+919876543210",
    "password": "test123"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@test.com",
    "password": "user123"
  }'
```

## Frontend Integration

Update your React frontend to use the backend API:

1. Set API base URL:
   ```javascript
   const API_BASE_URL = 'http://localhost:5000/api';
   ```

2. Make API calls:
   ```javascript
   // Example: Login
   const response = await fetch(`${API_BASE_URL}/auth/login`, {
     method: 'POST',
     headers: {
       'Content-Type': 'application/json',
     },
     body: JSON.stringify({ email, password }),
   });
   
   const data = await response.json();
   // Store token: localStorage.setItem('token', data.data.token);
   ```

3. Include token in requests:
   ```javascript
   const token = localStorage.getItem('token');
   const response = await fetch(`${API_BASE_URL}/users/profile`, {
     headers: {
       'Authorization': `Bearer ${token}`,
     },
   });
   ```

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check `MONGODB_URI` in `.env`
- For MongoDB Atlas, ensure IP whitelist includes your IP

### Port Already in Use
- Change `PORT` in `.env`
- Or kill the process using port 5000

### CORS Errors
- Ensure `FRONTEND_URL` in `.env` matches your frontend URL
- Check browser console for exact error

### JWT Errors
- Ensure `JWT_SECRET` is set in `.env`
- Token expires in 15 minutes (default)
- Re-login to get new token

## Next Steps

1. Review the [README.md](./README.md) for detailed API documentation
2. Import [Postman Collection](./POSTMAN_COLLECTION.md) for API testing
3. Integrate with your React frontend
4. Configure WhatsApp API for notifications (optional)
5. Deploy to production

## Production Deployment

Before deploying:

1. Set `NODE_ENV=production`
2. Use strong, random `JWT_SECRET` values
3. Use MongoDB Atlas or secure database
4. Configure proper CORS origins
5. Set up SSL/HTTPS
6. Use environment variables (not hardcoded secrets)
7. Enable rate limiting
8. Set up monitoring and logging

