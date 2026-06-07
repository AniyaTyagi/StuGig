# 🚨 MongoDB Connection Issue - FIXED!

## Problem
`querySrv ECONNREFUSED` error means MongoDB Atlas cannot be reached.

## Root Causes
1. ❌ Your IP address is NOT whitelisted in MongoDB Atlas
2. ❌ Network/Firewall blocking the connection
3. ❌ MongoDB cluster is paused/deleted

## ✅ SOLUTIONS

### Option 1: Fix MongoDB Atlas (BEST - 2 minutes)

**Step-by-step:**

1. **Open MongoDB Atlas**: https://cloud.mongodb.com
2. **Login** with your credentials
3. **Select your project** (the one with stugig1 cluster)
4. **Click "Network Access"** in left sidebar (under SECURITY)
5. **Click "Add IP Address"** (green button)
6. **Select "Allow Access from Anywhere"**
   - This adds `0.0.0.0/0` to whitelist
7. **Click "Confirm"**
8. **Wait 1-2 minutes** for changes to propagate

**Then test:**
```bash
node test-connection.js
```

If you see ✅ MongoDB Connected, you're good!

---

### Option 2: Use Local MongoDB (If you have it installed)

1. Make sure MongoDB is installed and running locally
2. Edit `.env` and replace the MongoDB URI:

```env
MONGODB_URI=mongodb://localhost:27017/stugig
```

3. Start server:
```bash
npm run dev
```

---

### Option 3: Get New MongoDB Atlas Cluster

If cluster is deleted/paused:

1. Go to MongoDB Atlas
2. Create new FREE cluster (M0)
3. Create database user
4. Whitelist IP (0.0.0.0/0)
5. Get new connection string
6. Update `.env` with new URI

---

## Verify It's Fixed

Run this test:
```bash
node test-connection.js
```

Expected output:
```
✅ MongoDB Connected Successfully!
```

---

## Current Status

🔴 **MongoDB Atlas IP not whitelisted**
- Server will start but all DB operations will fail
- Fix this FIRST before testing APIs

After fixing, your server will work perfectly! 🚀

---

## Quick Commands

```bash
# Test MongoDB connection
node test-connection.js

# Start server (will work even if MongoDB fails)
npm run dev

# Kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID_NUMBER> /F
```
