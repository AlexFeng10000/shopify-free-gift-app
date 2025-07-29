@echo off
echo 🚀 Deploying to Vercel (Much easier than Railway!)...

echo Step 1: Committing Vercel configuration...
git add .
git commit -m "Add Vercel deployment configuration"

echo Step 2: Pushing to GitHub...
git push origin main

echo ✅ Ready for Vercel deployment!
echo.
echo Next steps:
echo 1. Go to vercel.com
echo 2. Sign up with GitHub
echo 3. Import your repository: shopify-free-gift-app
echo 4. Vercel will automatically deploy!
echo 5. Add environment variables in Vercel dashboard
echo.
echo Vercel is much more reliable than Railway for React apps!
echo Your app will be live in 2-3 minutes! 🎉
echo.
pause