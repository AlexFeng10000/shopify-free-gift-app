# 🚀 Shopify App Setup Guide

## Step 1: Create Shopify Partner Account & App

### 1.1 Get Shopify Partner Account
1. Go to [partners.shopify.com](https://partners.shopify.com)
2. Sign up for free partner account
3. Verify your email

### 1.2 Create New App
1. In Partner Dashboard, click **"Apps"** → **"Create app"**
2. Choose **"Create app manually"**
3. Fill in app details:
   - **App name**: "Free Gift Booster" (or your choice)
   - **App URL**: `https://your-domain.com` (we'll update this)
   - **Allowed redirection URL(s)**: `https://your-domain.com/api/auth/callback`

### 1.3 Get Your Credentials
After creating the app, you'll see:
- **API key** (Client ID)
- **API secret key** (Client secret)

## Step 2: Configure Environment Variables

### 2.1 Copy Environment File
```bash
cd shopify-free-gift-app/server
cp .env.example .env
```

### 2.2 Update .env File
```env
# Replace with your actual values from Shopify Partner Dashboard
SHOPIFY_API_KEY=your_api_key_from_shopify
SHOPIFY_API_SECRET=your_secret_key_from_shopify
SHOPIFY_SCOPES=read_products,write_products,read_orders,write_draft_orders
SHOPIFY_APP_URL=https://your-domain.com
HOST=your-domain.com

# Local development
PORT=5000
NODE_ENV=development
DATABASE_URL=./database.sqlite
```

## Step 3: Install Dependencies & Run

### 3.1 Install All Dependencies
```bash
# From project root
cd shopify-free-gift-app
npm install

# Install server dependencies
cd server
npm install

# Install client dependencies  
cd ../client
npm install
```

### 3.2 Start Development Server
```bash
# From project root
cd shopify-free-gift-app
npm run dev
```

This will start:
- Backend server on `http://localhost:5000`
- Frontend React app on `http://localhost:3000`

## Step 4: Test Locally with ngrok

### 4.1 Install ngrok
```bash
# Install ngrok globally
npm install -g ngrok

# Or download from ngrok.com
```

### 4.2 Expose Local Server
```bash
# In a new terminal, expose port 5000
ngrok http 5000
```

You'll get a URL like: `https://abc123.ngrok.io`

### 4.3 Update Shopify App Settings
1. Go back to your Shopify Partner Dashboard
2. Edit your app settings
3. Update:
   - **App URL**: `https://abc123.ngrok.io`
   - **Allowed redirection URL**: `https://abc123.ngrok.io/api/auth/callback`

### 4.4 Update Your .env
```env
SHOPIFY_APP_URL=https://abc123.ngrok.io
HOST=abc123.ngrok.io
```

## Step 5: Create Development Store

### 5.1 Create Test Store
1. In Partner Dashboard → **"Stores"** → **"Add store"**
2. Choose **"Development store"**
3. Fill in store details
4. Choose **"Start with test data"** for sample products

### 5.2 Install Your App
1. In Partner Dashboard → **"Apps"** → Your app
2. Click **"Test on development store"**
3. Select your development store
4. Click **"Install app"**

## Step 6: Verify Installation

### 6.1 Check App Installation
- Your app should open in the Shopify admin
- You should see the Dashboard with Polaris UI
- No authentication errors

### 6.2 Test Core Features
1. **Dashboard**: Should load without errors
2. **Settings**: Try configuring a threshold amount
3. **Analytics**: Should show empty state initially

## 🎯 Quick Troubleshooting

### Common Issues:

**"App installation failed"**
- Check your ngrok URL is correct in Shopify settings
- Ensure .env file has correct API keys
- Restart your server after .env changes

**"Authentication error"**
- Verify API key and secret are correct
- Check redirect URL matches exactly
- Clear browser cache and try again

**"Database error"**
- Make sure you're in the server directory when running
- Check file permissions for database.sqlite

### Success Indicators:
✅ App loads in Shopify admin  
✅ Dashboard shows without errors  
✅ Settings page allows configuration  
✅ No console errors in browser  

## 🚀 Next Steps After Setup

1. **Test Gift Logic**: Configure a test product as gift
2. **Customize UI**: Update branding and colors
3. **Add Real Products**: Connect to actual Shopify products API
4. **Deploy**: Move from ngrok to production hosting
5. **App Store**: Submit for review once tested

## 📞 Need Help?

If you get stuck:
1. Check the browser console for errors
2. Check server logs in terminal
3. Verify all environment variables are set
4. Test with a fresh development store

---

**Ready to make your first $1K MRR? Let's get this app running! 🎉**