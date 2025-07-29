@echo off
echo ========================================
echo   Setting Up Your Vercel Environment
echo ========================================
echo.
echo Your Vercel URL: https://shopify-free-gift-app-git-main-alexfeng10000s-projects.vercel.app/
echo.

REM Check Vercel CLI
vercel --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Installing Vercel CLI...
    npm install -g vercel
)

echo Checking authentication...
vercel whoami >nul 2>&1
if %errorlevel% neq 0 (
    echo Please login to Vercel:
    vercel login
)

echo.
echo Setting environment variables...
echo.

echo SHOPIFY_API_KEY...
echo 0a84e1df4c003abfab2f61d8344ea04b | vercel env add SHOPIFY_API_KEY production

echo SHOPIFY_API_SECRET...
echo 90636fd6406e3aede92601aa79a52350 | vercel env add SHOPIFY_API_SECRET production

echo SHOPIFY_SCOPES...
echo read_products,write_products,read_orders,write_draft_orders | vercel env add SHOPIFY_SCOPES production

echo SHOPIFY_APP_URL...
echo https://shopify-free-gift-app-git-main-alexfeng10000s-projects.vercel.app | vercel env add SHOPIFY_APP_URL production

echo HOST...
echo shopify-free-gift-app-git-main-alexfeng10000s-projects.vercel.app | vercel env add HOST production

echo NODE_ENV...
echo production | vercel env add NODE_ENV production

echo PORT...
echo 5000 | vercel env add PORT production

echo DATABASE_URL...
echo ./database.sqlite | vercel env add DATABASE_URL production

echo REACT_APP_SHOPIFY_API_KEY...
echo 0a84e1df4c003abfab2f61d8344ea04b | vercel env add REACT_APP_SHOPIFY_API_KEY production

echo GENERATE_SOURCEMAP...
echo false | vercel env add GENERATE_SOURCEMAP production

echo.
echo ✅ Environment variables setup complete!
echo.

echo Deploying to production...
vercel --prod

echo.
echo ========================================
echo   Setup Complete!
echo ========================================
echo.
echo Your app: https://shopify-free-gift-app-git-main-alexfeng10000s-projects.vercel.app/
echo.
echo Test your app now to make sure:
echo 1. App loads correctly
echo 2. Settings can be saved and updated
echo 3. Dashboard shows updated values
echo.
pause