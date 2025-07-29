@echo off
echo ========================================
echo   Vercel Environment Variables Setup
echo ========================================
echo.

REM Check if Vercel CLI is installed
vercel --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Vercel CLI not found. Installing...
    npm install -g vercel
    if %errorlevel% neq 0 (
        echo ❌ Failed to install Vercel CLI
        echo Please install manually: npm install -g vercel
        pause
        exit /b 1
    )
)

echo ✅ Vercel CLI found
echo.

REM Login to Vercel if needed
echo 🔐 Checking Vercel authentication...
vercel whoami >nul 2>&1
if %errorlevel% neq 0 (
    echo Please login to Vercel:
    vercel login
    if %errorlevel% neq 0 (
        echo ❌ Vercel login failed
        pause
        exit /b 1
    )
)

echo ✅ Vercel authentication confirmed
echo.

REM Get the Vercel app URL
echo 📝 Please enter your Vercel app URL (e.g., https://your-app.vercel.app):
set /p VERCEL_URL="Vercel URL: "

if "%VERCEL_URL%"=="" (
    echo ❌ Vercel URL is required
    pause
    exit /b 1
)

REM Extract hostname from URL
for /f "tokens=3 delims=/" %%a in ("%VERCEL_URL%") do set HOST_NAME=%%a

echo.
echo 🚀 Setting up environment variables...
echo.

REM Set production environment variables
echo Setting SHOPIFY_API_KEY...
vercel env add SHOPIFY_API_KEY production
echo 0a84e1df4c003abfab2f61d8344ea04b

echo Setting SHOPIFY_API_SECRET...
vercel env add SHOPIFY_API_SECRET production
echo 90636fd6406e3aede92601aa79a52350

echo Setting SHOPIFY_SCOPES...
vercel env add SHOPIFY_SCOPES production
echo read_products,write_products,read_orders,write_draft_orders

echo Setting SHOPIFY_APP_URL...
vercel env add SHOPIFY_APP_URL production
echo %VERCEL_URL%

echo Setting HOST...
vercel env add HOST production
echo %HOST_NAME%

echo Setting NODE_ENV...
vercel env add NODE_ENV production
echo production

echo Setting PORT...
vercel env add PORT production
echo 5000

echo Setting DATABASE_URL...
vercel env add DATABASE_URL production
echo ./database.sqlite

echo Setting REACT_APP_SHOPIFY_API_KEY...
vercel env add REACT_APP_SHOPIFY_API_KEY production
echo 0a84e1df4c003abfab2f61d8344ea04b

echo Setting GENERATE_SOURCEMAP...
vercel env add GENERATE_SOURCEMAP production
echo false

echo.
echo ✅ Environment variables setup complete!
echo.
echo 🔄 Triggering new deployment...
vercel --prod

echo.
echo ========================================
echo   Setup Complete!
echo ========================================
echo.
echo Your app should now be deployed with all environment variables.
echo Visit: %VERCEL_URL%
echo.
pause