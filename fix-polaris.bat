@echo off
echo Fixing Polaris compatibility issues...

cd client
echo Installing compatible Polaris version and dependencies...
npm install @shopify/polaris@10.49.1
npm install @shopify/polaris-icons@6.11.3
npm install @shopify/app-bridge@3.7.0
npm install @shopify/app-bridge-react@3.7.0

echo Dependencies installed! Starting development server...
cd ..
npm run dev