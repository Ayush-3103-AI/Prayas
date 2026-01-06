# Prayas Backend API

Backend API for **Prayas - Urban Household Recycling & Social Impact Platform**

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` file with your configuration:
   ```env
   MONGODB_URI=mongodb://localhost:27017/prayas
   JWT_SECRET=your_secret_key_here
   FRONTEND_URL=http://localhost:5173
   ```

4. **Start the server**
   ```bash
   # Development mode (with nodemon)
   npm run dev

   # Production mode
   npm start
   ```

5. **Verify server is running**
   ```bash
   curl http://localhost:5000/health
   ```

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js          # MongoDB connection
│   │   └── constants.js          # App constants
│   ├── models/
│   │   ├── User.js
│   │   ├── Pickup.js
│   │   ├── Donation.js
│   │   ├── NGO.js
│   │   ├── Badge.js
│   │   ├── Leaderboard.js
│   │   └── CSRCampaign.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── pickupController.js
│   │   ├── donationController.js
│   │   ├── ngoController.js
│   │   ├── leaderboardController.js
│   │   ├── badgeController.js
│   │   └── adminController.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── pickupRoutes.js
│   │   ├── donationRoutes.js
│   │   ├── ngoRoutes.js
│   │   ├── leaderboardRoutes.js
│   │   ├── badgeRoutes.js
│   │   └── adminRoutes.js
│   ├── middleware/
│   │   ├── authMiddleware.js    # JWT verification
│   │   ├── errorHandler.js       # Global error handling
│   │   └── validation.js         # Input validation
│   ├── services/
│   │   ├── authService.js
│   │   ├── pickupService.js
│   │   ├── donationService.js
│   │   ├── leaderboardService.js
│   │   ├── notificationService.js
│   │   └── whatsappService.js
│   ├── utils/
│   │   ├── helpers.js
│   │   ├── logger.js
│   │   └── validators.js
│   └── app.js                    # Express app setup
├── server.js                     # Entry point
├── package.json
├── .env.example
└── README.md
```

## 🔌 API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/register` | Register new user | Public |
| POST | `/login` | Login user | Public |
| GET | `/me` | Get current user | Private |

### Users (`/api/users`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/profile` | Get user profile | Private (User) |
| PUT | `/profile` | Update user profile | Private (User) |
| GET | `/dashboard` | Get dashboard data | Private (User) |
| GET | `/impact-stats` | Get impact statistics | Private (User) |
| GET | `/badges` | Get user badges | Private (User) |
| PUT | `/change-password` | Change password | Private (User) |

### Pickups (`/api/pickups`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/` | Schedule pickup | Private (User) |
| GET | `/` | Get user pickups | Private (User) |
| GET | `/history` | Get pickup history | Private (User) |
| GET | `/:id` | Get pickup by ID | Private |
| DELETE | `/:id` | Cancel pickup | Private (User) |
| PATCH | `/:id/status` | Update pickup status | Private (Agent/Admin) |
| GET | `/agent/assigned` | Get agent pickups | Private (Agent) |

### Donations (`/api/donations`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/` | Get user donations | Private (User) |
| GET | `/history` | Get donation history | Private (User) |
| GET | `/total` | Get total donations | Private (User) |
| GET | `/:id` | Get donation by ID | Private |
| GET | `/receipt/:id` | Get donation receipt | Private |
| GET | `/ngo/received` | Get NGO donations | Private (NGO) |

### NGOs (`/api/ngos`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/` | Get all NGOs | Public |
| GET | `/categories` | Get NGO categories | Public |
| GET | `/:id` | Get NGO by ID | Public |
| GET | `/:id/impact` | Get NGO impact stories | Public |
| POST | `/register` | Register new NGO | Public |

### Leaderboard (`/api/leaderboard`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/global` | Get global leaderboard | Public |
| GET | `/community` | Get community leaderboard | Public |
| GET | `/weekly` | Get weekly leaderboard | Public |
| GET | `/monthly` | Get monthly leaderboard | Public |
| GET | `/user/:id` | Get user rank | Public |

### Badges (`/api/badges`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/` | Get all badges | Public |
| GET | `/user/:userId` | Get user badges | Public |

### Admin (`/api/admin`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/users` | Get all users | Private (Admin) |
| GET | `/users/:id` | Get user by ID | Private (Admin) |
| PUT | `/users/:id` | Update user | Private (Admin) |
| DELETE | `/users/:id` | Delete user | Private (Admin) |
| PATCH | `/users/:id/status` | Activate/Deactivate user | Private (Admin) |
| GET | `/agents` | Get all agents | Private (Admin) |
| POST | `/agents/verify` | Verify agent | Private (Admin) |
| GET | `/pickups` | Get all pickups | Private (Admin) |
| GET | `/pickups/pending` | Get pending pickups | Private (Admin) |
| POST | `/pickups/:id/assign` | Assign pickup to agent | Private (Admin) |
| GET | `/ngos` | Get all NGOs | Private (Admin) |
| PATCH | `/ngos/:id/verify` | Verify NGO | Private (Admin) |
| GET | `/stats/overview` | Get platform statistics | Private (Admin) |
| GET | `/csr/campaigns` | Get CSR campaigns | Private (Admin) |
| POST | `/csr/campaigns` | Create CSR campaign | Private (Admin) |
| PUT | `/csr/campaigns/:id` | Update CSR campaign | Private (Admin) |
| DELETE | `/csr/campaigns/:id` | Delete CSR campaign | Private (Admin) |

## 🔐 Authentication

All protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

### User Roles

- `user` - Regular household user
- `agent` - Scrap collector/agent
- `admin` - Platform administrator
- `ngo` - NGO viewer (optional)
- `csr_admin` - CSR campaign administrator

## 📝 Example API Requests

### Register User

```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+919876543210",
  "password": "password123"
}
```

### Login

```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Schedule Pickup

```bash
POST /api/pickups
Authorization: Bearer <token>
Content-Type: application/json

{
  "pickupDate": "2024-01-15T10:00:00Z",
  "timeSlot": "9AM-12PM",
  "address": {
    "street": "123 Main St",
    "city": "Bangalore",
    "state": "Karnataka",
    "pincode": "560001"
  },
  "materials": [
    {
      "type": "paper",
      "estimatedWeight": 10
    },
    {
      "type": "plastic",
      "estimatedWeight": 5
    }
  ],
  "selectedNGO": "60d5ec49f1b2c72b8c8e4f1a"
}
```

## 🗄️ Database Models

### User
- Basic info (name, email, phone, password)
- Role-based access
- Impact metrics (pickups, weight, donations, CO2 saved)
- Badges earned
- Agent details (if role is agent)

### Pickup
- User and agent references
- Pickup date and time slot
- Address and materials
- Status tracking
- Value calculations

### Donation
- Linked to pickup and NGO
- Amount and CSR matching
- Receipt generation
- Transaction tracking

### NGO
- Organization details
- Verification status
- Impact stories
- Donation statistics

### Badge
- Badge criteria and thresholds
- Tier system (bronze, silver, gold, platinum)

### Leaderboard
- Period-based rankings
- Impact score calculations
- Community-based leaderboards

### CSRCampaign
- Company and campaign details
- Matching ratios
- Target NGOs
- Fund tracking

## 🔧 Business Logic

### Material Value Calculation
- Paper: ₹8/kg
- Plastic: ₹12/kg
- Metal: ₹25/kg
- Glass: ₹5/kg
- Electronics: ₹40/kg
- Mixed: ₹6/kg

### CO2 Savings
- Calculated per material type
- Factors range from 0.3 to 3.0 kg CO2 per kg

### Impact Score
Weighted calculation:
- Pickups: 10 points each
- Weight: 2 points per kg
- Donations: 0.5 points per ₹
- CO2 Saved: 5 points per kg

### CSR Matching
- Automatic matching when campaigns are active
- Matching ratio applied to donation amount
- Maximum match limits respected

## 🔔 Notifications

WhatsApp notifications are sent for:
- Pickup scheduled
- Agent assigned
- Pickup reminder (1 hour before)
- Collection complete
- Badge earned

## 🛡️ Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Input validation
- Rate limiting
- CORS configuration
- Helmet.js for security headers
- Error handling without stack traces in production

## 🧪 Testing

### Test User Credentials

After seeding the database, you can use:

```
Email: admin@prayas.com
Password: admin123
Role: admin
```

### Postman Collection

Import the Postman collection from `postman_collection.json` for easy API testing.

## 📦 Deployment

### Environment Variables for Production

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/prayas
JWT_SECRET=strong_secret_key_here
FRONTEND_URL=https://your-frontend-domain.com
```

### Recommended Platforms

- **Backend**: AWS EC2, Heroku, DigitalOcean
- **Database**: MongoDB Atlas
- **File Storage**: AWS S3 or Cloudinary
- **Process Manager**: PM2

## 📚 Additional Resources

- [MongoDB Documentation](https://docs.mongodb.com/)
- [Express.js Documentation](https://expressjs.com/)
- [JWT Documentation](https://jwt.io/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is part of the Prayas platform.

## 👥 Support

For issues and questions, please contact the development team.

---

**Built with ❤️ for a sustainable future**

