@echo off
echo ========================================
echo   Vercel Environment Variables Setup
echo ========================================
echo.

REM Check if Vercel CLI is installed
vercel --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Installing Vercel CLI...
    npm install -g vercel
    if %errorlevel% neq 0 (
        echo Failed to install Vercel CLI
        echo Please install manually: npm install -g vercel
        pause
        exit /b 1
    )
)

echo Vercel CLI found
echo.

REM Get Vercel URL
echo Please enter your Vercel app URL
echo Example: https://shopify-free-gift-app.vercel.app
set /p VERCEL_URL="Your URL: "

if "%VERCEL_URL%"=="" (
    echo Error: Vercel URL is required
    echo Please run the script again and enter your URL
    pause
    exit /b 1
)

echo.
echo URL: %VERCEL_URL%
echo.

REM Login to Vercel
echo Checking Vercel authentication...
vercel whoami >nul 2>&1
if %errorlevel% neq 0 (
    echo Please login to Vercel:
    vercel login
    if %errorlevel% neq 0 (
        echo Login failed
        pause
        exit /b 1
    )
)

echo Authentication confirmed
echo.

REM Extract hostname from URL (simple approach)
set HOST_NAME=%VERCEL_URL:https://=%

echo Setting environment variables...
echo.

REM Set each environment variable
echo Setting SHOPIFY_API_KEY...
echo 0a84e1df4c003abfab2f61d8344ea04b | vercel env add SHOPIFY_API_KEY production

echo Setting SHOPIFY_API_SECRET...
echo 90636fd6406e3aede92601aa79a52350 | vercel env add SHOPIFY_API_SECRET production

echo Setting SHOPIFY_SCOPES...
echo read_products,write_products,read_orders,write_draft_orders | vercel env add SHOPIFY_SCOPES production

echo Setting SHOPIFY_APP_URL...
echo %VERCEL_URL% | vercel env add SHOPIFY_APP_URL production

echo Setting HOST...
echo %HOST_NAME% | vercel env add HOST production

echo Setting NODE_ENV...
echo production | vercel env add NODE_ENV production

echo Setting PORT...
echo 5000 | vercel env add PORT production

echo Setting DATABASE_URL...
echo ./database.sqlite | vercel env add DATABASE_URL production

echo Setting REACT_APP_SHOPIFY_API_KEY...
echo 0a84e1df4c003abfab2f61d8344ea04b | vercel env add REACT_APP_SHOPIFY_API_KEY production

echo Setting GENERATE_SOURCEMAP...
echo false | vercel env add GENERATE_SOURCEMAP production

echo.
echo Environment variables setup complete!
echo.

REM Ask about deployment
set /p DEPLOY="Deploy to production now? (y/n): "
if /i "%DEPLOY%"=="y" (
    echo Deploying...
    vercel --prod
)

echo.
echo ========================================
echo   Setup Complete!
echo ========================================
echo.
echo Your app: %VERCEL_URL%
echo.
echo Next steps:
echo 1. Visit your app URL to test
echo 2. Check settings save/load correctly
echo 3. Ready for screencast recording!
echo.
pause