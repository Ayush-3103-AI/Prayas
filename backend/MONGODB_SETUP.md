# MongoDB Setup Guide

## Quick Fix: Use MongoDB Atlas (Recommended - No Installation Required)

### Step 1: Create MongoDB Atlas Account
1. Go to https://www.mongodb.com/cloud/atlas/register
2. Sign up for a free account (M0 Free Tier)

### Step 2: Create a Cluster
1. Click "Build a Database"
2. Choose "FREE" (M0) tier
3. Select a cloud provider and region (closest to you)
4. Click "Create"

### Step 3: Create Database User
1. Go to "Database Access" in the left menu
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Enter username and password (save these!)
5. Set user privileges to "Atlas admin" or "Read and write to any database"
6. Click "Add User"

### Step 4: Whitelist Your IP
1. Go to "Network Access" in the left menu
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (for development) or add your specific IP
4. Click "Confirm"

### Step 5: Get Connection String
1. Go to "Database" in the left menu
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)
5. Replace `<password>` with your database user password
6. Add database name at the end: `mongodb+srv://username:password@cluster.mongodb.net/prayas`

### Step 6: Update .env File
Update the `MONGODB_URI` in your `.env` file:
```env
MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/prayas
```

### Step 7: Restart Server
```bash
npm start
```

---

## Alternative: Install MongoDB Locally

### Windows Installation
1. Download MongoDB Community Server: https://www.mongodb.com/try/download/community
2. Run the installer
3. Choose "Complete" installation
4. Install as a Windows Service (recommended)
5. Start MongoDB service:
   ```powershell
   net start MongoDB
   ```
6. Your `.env` file should already have: `MONGODB_URI=mongodb://localhost:27017/prayas`

### Verify MongoDB is Running
```powershell
# Check if MongoDB service is running
Get-Service -Name "*mongo*"

# Or test connection
mongosh
```

---

## Troubleshooting

### Connection Refused Error
- **Local MongoDB**: Make sure MongoDB service is running (`net start MongoDB`)
- **MongoDB Atlas**: Check your IP is whitelisted and connection string is correct

### Authentication Error
- Verify username and password in connection string
- Make sure database user has proper permissions

### Timeout Error
- Check your internet connection (for Atlas)
- Verify firewall settings
- Try increasing `serverSelectionTimeoutMS` in database.js

