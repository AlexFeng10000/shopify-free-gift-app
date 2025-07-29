@echo off
echo 🔧 Setting up Git identity and pushing to GitHub...

echo Please enter your GitHub details:
set /p email="Your GitHub Email: "
set /p name="Your Name: "
set /p username="Your GitHub Username: "

echo Setting up Git identity...
git config --global user.email "%email%"
git config --global user.name "%name%"

echo Creating commit...
git commit -m "Initial commit - Shopify Free Gift App ready for production"

echo Adding remote repository...
git remote add origin https://github.com/%username%/shopify-free-gift-app.git

echo Pushing to GitHub...
git branch -M main
git push -u origin main

echo ✅ Successfully pushed to GitHub!
echo.
echo Your repository: https://github.com/%username%/shopify-free-gift-app
echo.
echo Next: Deploy to Railway!
echo 1. Go to railway.app
echo 2. Sign up with GitHub
echo 3. Deploy from GitHub repo
echo 4. Add environment variables
echo.
pause