@echo off
echo 🚀 Preparing for Railway deployment...

echo Step 1: Building production version...
cd client
npm run build
cd ..

echo Step 2: Copying build files...
if not exist "server\public" mkdir server\public
xcopy /E /I /Y client\build\* server\public\

echo Step 3: Committing changes...
git add .
git commit -m "Production build ready for deployment"

echo Step 4: Pushing to GitHub...
git push origin main

echo ✅ Ready for Railway deployment!
echo.
echo Next steps:
echo 1. Go to railway.app
echo 2. Sign up with GitHub
echo 3. Deploy from GitHub repo
echo 4. Add environment variables
echo 5. Update Shopify app settings with new URL
echo.
echo Your app will be live in 2-3 minutes! 🎉

pause