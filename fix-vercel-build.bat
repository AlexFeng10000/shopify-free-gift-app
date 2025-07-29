@echo off
echo 🔧 Fixing Vercel build configuration...

echo Step 1: Committing build fixes...
git add .
git commit -m "Fix Vercel build - add dependencies and build script"

echo Step 2: Pushing to GitHub...
git push origin main

echo ✅ Vercel build fixes pushed!
echo.
echo Vercel will now:
echo 1. Install dependencies from root package.json
echo 2. Run npm run vercel-build (installs client deps and builds)
echo 3. Serve from client/build directory
echo.
echo Your app should deploy successfully now!
echo Check Vercel dashboard in 1-2 minutes.
echo.
pause