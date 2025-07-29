# 🚀 Deployment Guide - Shopify Free Gift App

## Option 1: Railway Deployment (Recommended)

### Step 1: Prepare Your Code
```bash
# Make sure everything is committed
git add .
git commit -m "Ready for production deployment"
git push origin main
```

### Step 2: Deploy to Railway
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Click **"New Project"** → **"Deploy from GitHub repo"**
4. Select your `shopify-free-gift-app` repository
5. Railway will automatically detect and deploy your app

### Step 3: Set Environment Variables
In Railway dashboard, go to **Variables** and add:
```
NODE_ENV=production
SHOPIFY_API_KEY=your_shopify_api_key
SHOPIFY_API_SECRET=your_shopify_secret
SHOPIFY_SCOPES=read_products,write_products,read_orders,write_draft_orders
DATABASE_URL=./database.sqlite
```

### Step 4: Get Your Production URL
Railway will give you a URL like: `https://your-app-name.railway.app`

### Step 5: Update Shopify App Settings
1. Go to Shopify Partner Dashboard
2. Edit your app settings
3. Update:
   - **App URL**: `https://your-app-name.railway.app`
   - **Allowed redirection URL**: `https://your-app-name.railway.app/api/auth/callback`

---

## Option 2: Vercel Deployment

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Deploy
```bash
cd shopify-free-gift-app
vercel --prod
```

### Step 3: Configure
Follow the prompts and set your environment variables.

---

## Option 3: Heroku Deployment

### Step 1: Install Heroku CLI
Download from [heroku.com/cli](https://devcenter.heroku.com/articles/heroku-cli)

### Step 2: Create Heroku App
```bash
cd shopify-free-gift-app
heroku create your-app-name
```

### Step 3: Set Environment Variables
```bash
heroku config:set NODE_ENV=production
heroku config:set SHOPIFY_API_KEY=your_key
heroku config:set SHOPIFY_API_SECRET=your_secret
```

### Step 4: Deploy
```bash
git push heroku main
```

---

## 🎯 Quick Railway Deployment (5 minutes)

### Prerequisites:
- ✅ GitHub account
- ✅ Your code pushed to GitHub
- ✅ Shopify Partner account with app created

### Steps:
1. **Railway.app** → Sign up with GitHub
2. **New Project** → Deploy from GitHub
3. **Select repository** → shopify-free-gift-app
4. **Add environment variables** (see above)
5. **Copy production URL**
6. **Update Shopify app settings** with new URL
7. **Test your live app!**

### Expected Result:
- ✅ App running at `https://your-app.railway.app`
- ✅ Database working (SQLite)
- ✅ All API endpoints functional
- ✅ Ready for Shopify App Store submission

---

## 🔧 Troubleshooting

### Common Issues:

**Build fails:**
- Check that all dependencies are in package.json
- Ensure build script works locally: `npm run build`

**App won't start:**
- Check environment variables are set
- Verify PORT is not hardcoded (use process.env.PORT)

**Database issues:**
- SQLite works on most platforms
- For production, consider PostgreSQL add-on

**Shopify integration fails:**
- Double-check API keys
- Ensure redirect URLs match exactly
- Test with development store first

---

## 🎊 Success Checklist

After deployment, verify:
- [ ] App loads at production URL
- [ ] Dashboard displays correctly
- [ ] Settings can be saved
- [ ] Analytics page works
- [ ] API endpoints respond (test /api/health)
- [ ] Shopify app installation works
- [ ] No console errors in browser

**Once deployed, you're ready to submit to the Shopify App Store! 🚀**

---

## 💰 Next Steps After Deployment

1. **Test thoroughly** with development store
2. **Create app listing** for Shopify App Store
3. **Set pricing** at $29/month
4. **Submit for review**
5. **Launch and scale** to $14,500 MRR

Your app is production-ready! 🎉