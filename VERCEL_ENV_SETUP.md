# Vercel Environment Variables Setup Guide

## Automated Setup (Recommended)

### Option 1: PowerShell Script
```powershell
.\setup-vercel-env.ps1
```

### Option 2: Batch Script
```cmd
setup-vercel-env.bat
```

## Manual Setup (Alternative)

If the automated scripts don't work, you can set up environment variables manually:

### 1. Install Vercel CLI
```bash
npm install -g vercel
```

### 2. Login to Vercel
```bash
vercel login
```

### 3. Set Environment Variables

Run these commands one by one, replacing `YOUR_VERCEL_URL` with your actual Vercel app URL:

```bash
# Shopify Configuration
echo "0a84e1df4c003abfab2f61d8344ea04b" | vercel env add SHOPIFY_API_KEY production
echo "90636fd6406e3aede92601aa79a52350" | vercel env add SHOPIFY_API_SECRET production
echo "read_products,write_products,read_orders,write_draft_orders" | vercel env add SHOPIFY_SCOPES production
echo "YOUR_VERCEL_URL" | vercel env add SHOPIFY_APP_URL production
echo "your-app.vercel.app" | vercel env add HOST production

# Server Configuration
echo "production" | vercel env add NODE_ENV production
echo "5000" | vercel env add PORT production
echo "./database.sqlite" | vercel env add DATABASE_URL production

# React App Configuration
echo "0a84e1df4c003abfab2f61d8344ea04b" | vercel env add REACT_APP_SHOPIFY_API_KEY production
echo "false" | vercel env add GENERATE_SOURCEMAP production
```

### 4. Deploy
```bash
vercel --prod
```

## Via Vercel Dashboard (Web Interface)

1. **Go to Vercel Dashboard**: https://vercel.com/dashboard
2. **Select Your Project**: Click on your shopify-free-gift-app
3. **Go to Settings**: Click the "Settings" tab
4. **Environment Variables**: Click "Environment Variables" in the sidebar
5. **Add Variables**: Click "Add New" for each variable below

### Variables to Add:

| Name | Value | Environment |
|------|-------|-------------|
| `SHOPIFY_API_KEY` | `0a84e1df4c003abfab2f61d8344ea04b` | Production |
| `SHOPIFY_API_SECRET` | `90636fd6406e3aede92601aa79a52350` | Production |
| `SHOPIFY_SCOPES` | `read_products,write_products,read_orders,write_draft_orders` | Production |
| `SHOPIFY_APP_URL` | `https://your-app.vercel.app` | Production |
| `HOST` | `your-app.vercel.app` | Production |
| `NODE_ENV` | `production` | Production |
| `PORT` | `5000` | Production |
| `DATABASE_URL` | `./database.sqlite` | Production |
| `REACT_APP_SHOPIFY_API_KEY` | `0a84e1df4c003abfab2f61d8344ea04b` | Production |
| `GENERATE_SOURCEMAP` | `false` | Production |

## Verification

After setting up environment variables:

1. **Check Deployment**: Visit your Vercel app URL
2. **Test Functionality**: Ensure the app loads and works correctly
3. **Check Console**: Look for any environment-related errors

## Troubleshooting

### Common Issues:

1. **Vercel CLI Not Found**:
   ```bash
   npm install -g vercel
   ```

2. **Authentication Failed**:
   ```bash
   vercel logout
   vercel login
   ```

3. **Environment Variables Not Applied**:
   - Wait 2-3 minutes for deployment
   - Check Vercel dashboard for deployment status
   - Trigger manual deployment: `vercel --prod`

4. **App Still Shows Errors**:
   - Verify all variables are set correctly
   - Check Vercel function logs in dashboard
   - Ensure SHOPIFY_APP_URL matches your actual Vercel URL

## Next Steps

Once environment variables are set:
1. ✅ App should deploy successfully
2. ✅ Visit your Vercel URL to test
3. ✅ Ready for screencast recording
4. ✅ Ready for App Store submission