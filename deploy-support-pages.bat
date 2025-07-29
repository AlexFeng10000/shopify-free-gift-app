@echo off
echo 🚀 Deploying support pages for App Store compliance...

echo Step 1: Committing support pages...
git add .
git commit -m "Add support pages: Privacy Policy, FAQ, Setup Guide, Contact"

echo Step 2: Pushing to GitHub...
git push origin main

echo ✅ Support pages deployed!
echo.
echo Your pages will be available at:
echo ✅ Privacy Policy: https://free-gift-booster.vercel.app/privacy.html
echo ✅ FAQ: https://free-gift-booster.vercel.app/faq.html
echo ✅ Setup Guide: https://free-gift-booster.vercel.app/setup.html
echo ✅ Contact: https://free-gift-booster.vercel.app/contact.html
echo.
echo Use these URLs in your Shopify App Store listing!
echo.
pause