@echo off
echo 🚀 Deploying with mock data for full demo functionality...

echo Step 1: Committing mock data changes...
git add .
git commit -m "Add mock data for demo - all pages now work!"

echo Step 2: Pushing to GitHub...
git push origin main

echo ✅ Mock data deployed!
echo.
echo Your app now has full functionality:
echo ✅ Dashboard shows realistic stats
echo ✅ Settings page loads and saves
echo ✅ Analytics page displays data
echo ✅ Perfect for demonstrations!
echo.
echo Vercel will auto-deploy in 1-2 minutes.
echo All pages will work beautifully! 🎉
echo.
pause