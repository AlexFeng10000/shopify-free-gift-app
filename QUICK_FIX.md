# 🚨 Quick Fix for App Crash

## The Problem
Your app crashed because of missing dependencies or configuration issues.

## ✅ Quick Solution (2 minutes)

### Step 1: Install Everything
```bash
cd shopify-free-gift-app
npm run install-all
```

### Step 2: Start Safely
```bash
npm run dev
```

This will:
- ✅ Check all dependencies are installed
- ✅ Create missing .env files automatically  
- ✅ Start in demo mode (works without Shopify credentials)
- ✅ Show helpful error messages instead of crashing

## 🎯 What You'll See

**Terminal Output:**
```
🎁 Starting Shopify Free Gift App Development Server...

✅ Root dependencies installed
✅ Server dependencies installed  
✅ Client dependencies installed

🚀 Starting development servers...

🔧 Starting Free Gift App Server...
✅ Database initialized
⚠️  Shopify credentials not configured - running in demo mode
🚀 Free Gift App server running on port 5000
```

**Browser:**
- Frontend: http://localhost:3000 ✅
- Backend API: http://localhost:5000/api/health ✅

## 🔧 Add Shopify Credentials Later

Once you have your Shopify Partner account:

1. **Update `server/.env`:**
```env
SHOPIFY_API_KEY=your_actual_api_key
SHOPIFY_API_SECRET=your_actual_secret
```

2. **Update `client/.env`:**
```env
REACT_APP_SHOPIFY_API_KEY=your_actual_api_key
```

3. **Restart:**
```bash
npm run dev
```

## 🎉 Success Indicators

✅ No crash messages  
✅ Both servers start successfully  
✅ Dashboard loads at localhost:3000  
✅ Settings page works  
✅ No red errors in browser console  

## 🆘 Still Having Issues?

**Common fixes:**
```bash
# Clear everything and start fresh
rm -rf node_modules server/node_modules client/node_modules
npm run install-all
npm run dev
```

**Check your setup:**
```bash
npm run check
```

---

**The app now runs in demo mode even without Shopify credentials - no more crashes! 🎉**