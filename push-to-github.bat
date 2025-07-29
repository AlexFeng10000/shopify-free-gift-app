@echo off
echo 🚀 Pushing Shopify Free Gift App to GitHub...

echo Step 1: Initializing git repository...
git init

echo Step 2: Adding all files...
git add .

echo Step 3: Creating initial commit...
git commit -m "Initial commit - Shopify Free Gift App ready for production"

echo Step 4: Setting up remote repository...
echo Please enter your GitHub username:
set /p username="GitHub Username: "
git remote add origin https://github.com/%username%/shopify-free-gift-app.git

echo Step 5: Pushing to GitHub...
git branch -M main
git push -u origin main

echo ✅ Successfully pushed to GitHub!
echo.
echo Next steps:
echo 1. Go to railway.app
echo 2. Deploy from your GitHub repository
echo 3. Add environment variables
echo 4. Your app will be live!
echo.
pause