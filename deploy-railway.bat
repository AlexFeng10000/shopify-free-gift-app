@echo off
echo 🚂 Deploying Shopify Free Gift App to Railway...

echo.
echo 📋 Pre-deployment checklist:
echo   ✓ Make sure you have Railway CLI installed
echo   ✓ Make sure you're logged into Railway (railway login)
echo   ✓ Make sure your .env variables are set in Railway dashboard
echo.

echo 🔧 Building the application...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Build failed
    pause
    exit /b 1
)

echo.
echo 📦 Installing Railway CLI (if not already installed)...
where railway >nul 2>nul
if %errorlevel% neq 0 (
    echo Installing Railway CLI...
    npm install -g @railway/cli
    if %errorlevel% neq 0 (
        echo ❌ Failed to install Railway CLI
        echo Please install manually: npm install -g @railway/cli
        pause
        exit /b 1
    )
)

echo.
echo 🔐 Checking Railway authentication...
railway whoami
if %errorlevel% neq 0 (
    echo ❌ Not logged into Railway
    echo Please run: railway login
    pause
    exit /b 1
)

echo.
echo 🚀 Deploying to Railway...
railway up
if %errorlevel% neq 0 (
    echo ❌ Deployment failed
    pause
    exit /b 1
)

echo.
echo ✅ Deployment completed!
echo.
echo 📋 Next steps:
echo   1. Go to Railway dashboard: https://railway.app/dashboard
echo   2. Set environment variables in your project settings:
echo      - SHOPIFY_API_KEY=your_api_key
echo      - SHOPIFY_API_SECRET=your_api_secret
echo      - SHOPIFY_APP_URL=https://your-app.railway.app
echo      - SHOPIFY_SCOPES=read_products,write_products,read_orders
echo      - NODE_ENV=production
echo   3. Update your Shopify app settings with the new Railway URL
echo   4. Test the app installation
echo.
pause