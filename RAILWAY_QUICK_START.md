# 🚂 Quick Railway Deployment

## Step 1: Login to Railway
```bash
railway login
```

## Step 2: Deploy
```bash
railway up
```

## Step 3: Set Environment Variables
After deployment, go to your Railway dashboard and set these variables:

```
SHOPIFY_API_KEY=your_shopify_api_key
SHOPIFY_API_SECRET=your_shopify_api_secret
SHOPIFY_APP_URL=https://your-app-name.railway.app
SHOPIFY_SCOPES=read_products,write_products,read_orders
NODE_ENV=production
```

## Step 4: Update Shopify App Settings
In your Shopify Partner dashboard:
- **App URL**: `https://your-app-name.railway.app`
- **Allowed redirection URLs**: `https://your-app-name.railway.app/auth/callback`

## Step 5: Test
Install your app in a development store and verify it works!

## Useful Commands
```bash
railway logs          # View logs
railway open           # Open app in browser
railway status         # Check deployment status
railway variables      # View environment variables
```