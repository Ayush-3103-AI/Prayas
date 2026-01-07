# Fix MongoDB Atlas Connection

## Current Issue
Authentication is failing. This usually means one of the following:

## Step-by-Step Fix

### 1. Verify Database User Credentials

1. Go to MongoDB Atlas: https://cloud.mongodb.com/
2. Log in to your account
3. Click on your cluster (Cluster0)
4. Go to **"Database Access"** in the left sidebar
5. Find the user `ayushkabbur_db_user`
6. Click the **"Edit"** button (pencil icon)
7. **Reset the password** or verify the current password
8. Make sure the user has **"Atlas admin"** or **"Read and write to any database"** permissions

### 2. Get the Correct Connection String

1. In MongoDB Atlas, go to **"Database"** in the left sidebar
2. Click **"Connect"** on your cluster
3. Choose **"Connect your application"**
4. Select **"Node.js"** and version **"5.5 or later"**
5. Copy the connection string - it will look like:
   ```
   mongodb+srv://<username>:<password>@cluster0.3zs7ksr.mongodb.net/?retryWrites=true&w=majority
   ```
6. **Replace `<password>` with your actual database user password**
7. **Add your database name** before the `?`:
   ```
   mongodb+srv://<username>:<password>@cluster0.3zs7ksr.mongodb.net/prayas?retryWrites=true&w=majority
   ```

### 3. Handle Special Characters in Password

If your password contains special characters like `@`, `#`, `%`, etc., you need to URL-encode them:
- `@` → `%40`
- `#` → `%23`
- `%` → `%25`
- `&` → `%26`
- `+` → `%2B`
- `/` → `%2F`
- `=` → `%3D`
- `?` → `%3F`

**Example:**
- Password: `Sanatan1710@`
- Encoded: `Sanatan1710%40`

### 4. Whitelist Your IP Address

1. In MongoDB Atlas, go to **"Network Access"** in the left sidebar
2. Click **"Add IP Address"**
3. For development, click **"Allow Access from Anywhere"** (adds `0.0.0.0/0`)
4. Or add your specific IP address
5. Click **"Confirm"**

### 5. Update .env File

Once you have the correct connection string, update your `.env` file:

```env
MONGODB_URI=mongodb+srv://ayushkabbur_db_user:YOUR_ENCODED_PASSWORD@cluster0.3zs7ksr.mongodb.net/prayas?retryWrites=true&w=majority
```

### 6. Test the Connection

Run the test script:
```bash
node test-connection.js
```

Or restart your server:
```bash
npm start
```

## Quick Test

You can also test the connection directly using the MongoDB shell or Compass:
- Download MongoDB Compass: https://www.mongodb.com/try/download/compass
- Use the connection string from Atlas
- If Compass connects, the credentials are correct

## Common Issues

1. **"bad auth"** → Wrong username or password
2. **"IP not whitelisted"** → Add your IP in Network Access
3. **"Connection timeout"** → Check internet connection or firewall
4. **"Database not found"** → Database will be created automatically on first use

