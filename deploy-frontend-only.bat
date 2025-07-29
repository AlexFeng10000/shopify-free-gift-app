@echo off
echo 🚀 Deploying React frontend only to Vercel...

echo Step 1: Building React app...
cd client
npm run build
cd ..

echo Step 2: Updating configuration for frontend-only deployment...
git add .
git commit -m "Configure for frontend-only Vercel deployment"

echo Step 3: Pushing to GitHub...
git push origin main

echo ✅ Frontend deployment configured!
echo.
echo The React app will deploy to Vercel.
echo For now, you can run the backend locally: npm run server
echo.
echo Next steps:
echo 1. Check Vercel dashboard for deployment status
echo 2. Your React app should be live soon!
echo 3. Backend will run locally for testing
echo.
pause