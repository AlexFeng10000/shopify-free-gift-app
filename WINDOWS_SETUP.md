# 🪟 Windows Setup Guide

## 🚨 Quick Fix for Windows

The issue you're seeing is because Node.js isn't properly configured on your Windows system.

## ✅ **Option 1: Use Batch File (Easiest)**

Simply double-click this file:
```
start.bat
```

Or run in Command Prompt:
```cmd
start.bat
```

## ✅ **Option 2: Use PowerShell**

Right-click on `start.ps1` → "Run with PowerShell"

Or in PowerShell:
```powershell
.\start.ps1
```

## ✅ **Option 3: Fix Node.js PATH**

If you get `'node' is not recognized`:

### Check if Node.js is installed:
```cmd
where node
```

### If not found, install Node.js:
1. Go to [nodejs.org](https://nodejs.org)
2. Download LTS version
3. Install with default settings
4. Restart Command Prompt/PowerShell

### Add to PATH manually:
1. Search "Environment Variables" in Windows
2. Edit System Environment Variables
3. Add Node.js installation path (usually `C:\Program Files\nodejs\`)

## ✅ **Option 4: Use npm directly**

If Node.js is installed but scripts don't work:

```cmd
cd shopify-free-gift-app
npm install
npm install concurrently
npm run dev
```

## 🎯 **What Should Happen**

When working correctly, you'll see:
```
🎁 Starting Shopify Free Gift App...
✅ Node.js version: v18.x.x
✅ npm version: 9.x.x
📦 Installing dependencies...
🚀 Starting development servers...

Frontend: http://localhost:3000
Backend: http://localhost:5000
```

## 🆘 **Still Having Issues?**

### Try this step-by-step:

1. **Install Node.js** from [nodejs.org](https://nodejs.org)
2. **Restart your computer**
3. **Open Command Prompt as Administrator**
4. **Navigate to your project:**
   ```cmd
   cd path\to\shopify-free-gift-app
   ```
5. **Install everything:**
   ```cmd
   npm install
   cd server
   npm install
   cd ..\client
   npm install
   cd ..
   ```
6. **Start the app:**
   ```cmd
   npm run dev
   ```

## 🎉 **Success Indicators**

✅ No "not recognized" errors  
✅ Both servers start (ports 3000 and 5000)  
✅ Browser opens to localhost:3000  
✅ Dashboard loads without errors  

---

**The batch file should handle everything automatically! 🚀**