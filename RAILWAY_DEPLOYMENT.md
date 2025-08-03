# Railway Deployment Guide for Shopify Free Gift App

## Prerequisites

1. **Railway Account**: Sign up at [railway.app](https://railway.app)
2. **Railway CLI**: Install with `npm install -g @railway/cli`
3. **Shopify Partner Account**: With your app created
4. **Git Repository**: Your code should be in a Git repository

## Quick Deployment Steps

### 1. Install Railway CLI and Login
```bash
npm install -g @railway/cli
railway login
```

### 2. Deploy Using the Script
```bash
deploy-railway.bat
```

### 3. Set Environment Variables in Railway Dashboard

Go to your Railway project dashboard and add these environment variables:

**Required Variables:**
```
SHOPIFY_API_KEY=your_shopify_api_key
SHOPIFY_API_SECRET=your_shopify_api_secret
SHOPIFY_APP_URL=https://your-app-name.railway.app
SHOPIFY_SCOPES=read_products,write_products,read_orders
NODE_ENV=production
PORT=3000
```

**Optional Variables:**
```
HOST=your-app-name.railway.app
DATABASE_URL=sqlite:./database.sqlite
```

### 4. Update Shopify App Settings

In your Shopify Partner dashboard, update your app settings:

1. **App URL**: `https://your-app-name.railway.app`
2. **Allowed redirection URLs**: 
   - `https://your-app-name.railway.app/auth/callback`
   - `https://your-app-name.railway.app/auth/app`

## Manual Deployment Steps

### 1. Create Railway Project
```bash
railway login
railway init
railway link
```

### 2. Deploy
```bash
railway up
```

### 3. Set Environment Variables
```bash
railway variables set SHOPIFY_API_KEY=your_api_key
railway variables set SHOPIFY_API_SECRET=your_api_secret
railway variables set SHOPIFY_APP_URL=https://your-app.railway.app
railway variables set SHOPIFY_SCOPES=read_products,write_products,read_orders
railway variables set NODE_ENV=production
```

## Project Structure for Railway

Railway will automatically detect and build your app using:

- **Build Command**: `npm run build` (installs dependencies and builds React app)
- **Start Command**: `npm start` (starts the Express server)
- **Port**: Automatically assigned by Railway (accessible via `process.env.PORT`)

## Files Created for Railway

- `railway.json` - Railway configuration
- `deploy-railway.bat` - Automated deployment script
- `Procfile` - Process definition for Railway
- `RAILWAY_DEPLOYMENT.md` - This guide

## Troubleshooting

### Build Failures
- Check that all dependencies are listed in `package.json`
- Ensure the build script completes successfully locally
- Check Railway build logs for specific errors

### Runtime Errors
- Verify all environment variables are set correctly
- Check Railway application logs
- Ensure the PORT environment variable is used correctly

### App Bridge Issues
- Make sure `SHOPIFY_APP_URL` matches your Railway domain exactly
- Verify the app URL in Shopify Partner dashboard matches Railway URL
- Check that session tokens are working in browser console

## Railway CLI Commands

```bash
# View logs
railway logs

# Open project in browser
railway open

# Check deployment status
railway status

# Set environment variable
railway variables set KEY=value

# View all environment variables
railway variables

# Redeploy
railway up --detach
```

## Cost Considerations

Railway offers:
- **Hobby Plan**: $5/month with generous limits
- **Pro Plan**: $20/month with higher limits
- **Free Tier**: Limited but good for testing

## Security Notes

- Never commit `.env` files to Git
- Use Railway's environment variables for all secrets
- Enable HTTPS (Railway provides this automatically)
- Regularly rotate your Shopify API credentials

## Support

If you encounter issues:
1. Check Railway documentation: [docs.railway.app](https://docs.railway.app)
2. Check Railway community: [help.railway.app](https://help.railway.app)
3. Review Shopify App Bridge documentation
4. Check the app logs in Railway dashboard