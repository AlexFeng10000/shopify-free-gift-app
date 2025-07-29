@echo off
echo 🔧 Fixing ESLint warnings and redeploying...

echo Step 1: Committing fixes...
git add .
git commit -m "Fix ESLint warnings for production build"

echo Step 2: Pushing to GitHub...
git push origin main

echo ✅ Fixes pushed to GitHub!
echo.
echo Vercel will automatically redeploy with the fixes.
echo Check your Vercel dashboard - the build should succeed now!
echo.
echo Your app will be live in 1-2 minutes! 🎉
echo.
pause