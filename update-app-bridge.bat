@echo off
echo 🔧 Updating App Bridge to v3.7.11 (latest) and installing dependencies...

echo.
echo 📦 Installing server dependencies...
cd server
call npm install
if %errorlevel% neq 0 (
    echo ❌ Server dependency installation failed
    pause
    exit /b 1
)

echo.
echo 📦 Installing client dependencies...
cd ../client
call npm install
if %errorlevel% neq 0 (
    echo ❌ Client dependency installation failed
    pause
    exit /b 1
)

echo.
echo ✅ Dependencies updated successfully!
echo.
echo 🚀 Key changes made:
echo   • Updated to App Bridge v3.7.11 (latest stable)
echo   • Added proper session token authentication
echo   • Implemented App Bridge React Provider
echo   • Added JWT session token validation on server
echo.
echo 📋 To test the app:
echo   1. Run: npm run dev (or start.bat)
echo   2. Install app in Shopify Partner dashboard
echo   3. Check that session tokens are working in browser console
echo.
echo 🔍 Look for these success messages in console:
echo   • "✅ Session token obtained"
echo   • "✅ Using session token for API request"
echo   • "✅ Session token verified for shop"
echo.
pause