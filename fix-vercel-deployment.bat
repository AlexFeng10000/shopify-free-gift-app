@echo off
echo 🔧 Fixing Vercel deployment configuration...

echo Step 1: Committing Vercel fixes...
git add .
git commit -m "Fix Vercel deployment - React app only"

echo Step 2: Pushing to GitHub...
git push origin main

echo ✅ Vercel deployment fixes pushed!
echo.
echo Vercel will automatically redeploy with the new configuration.
echo The React app should load properly now!
echo.
echo Check your Vercel dashboard in 1-2 minutes.
echo Your app should be live at: shopify-free-gift-app.vercel.app
echo.
pause