@echo off
echo 🔧 Fixing Railway deployment issues...

echo Step 1: Renaming gitignore file...
if exist "gitignore.txt" (
    ren "gitignore.txt" ".gitignore"
    echo ✅ .gitignore created
)

echo Step 2: Committing fixes...
git add .
git commit -m "Fix Railway deployment configuration"

echo Step 3: Pushing fixes to GitHub...
git push origin main

echo ✅ Railway deployment fixes pushed!
echo.
echo Now try deploying on Railway again:
echo 1. Go to your Railway project
echo 2. Click "Redeploy" or trigger new deployment
echo 3. The build should work now!
echo.
pause