# Shopify App Setup Verification

## Current Status
- ✅ App deployed to Railway: `https://web-production-99c0.up.railway.app`
- ✅ App loads without errors
- ❌ Missing `host` parameter (no embedded context)
- ❌ No session tokens

## Required Shopify Partner Dashboard Settings

### 1. App URLs Section
- **App URL**: `https://web-production-99c0.up.railway.app`
- **Allowed redirection URLs**: 
  - `https://web-production-99c0.up.railway.app/auth/callback`
  - `https://web-production-99c0.up.railway.app/auth/app`

### 2. App Distribution
- **Distribution**: Development stores only (for testing)
- **Development stores**: Add `gift-booster-test.myshopify.com`

### 3. App Access Scopes
- `read_products`
- `write_products` 
- `read_orders`
- `write_draft_orders`

## How to Access App Correctly

### ❌ Wrong Way (Direct Access):
```
https://web-production-99c0.up.railway.app
```
This gives you `host: null`

### ✅ Correct Way (Through Shopify Admin):
1. Go to: `https://gift-booster-test.myshopify.com/admin`
2. Click "Apps" in left sidebar
3. Click your app name
4. This should load: `https://web-production-99c0.up.railway.app/?shop=gift-booster-test.myshopify.com&host=ENCODED_HOST&timestamp=123456`

## Troubleshooting Steps

### If app doesn't appear in Shopify admin Apps section:
1. Go to Shopify Partner dashboard
2. Click "Test on development store"
3. Select your development store
4. Complete installation process

### If app appears but still no host parameter:
1. Check that App URL in Partner dashboard matches Railway URL exactly
2. Make sure app is set as "Embedded app" in Partner dashboard
3. Try uninstalling and reinstalling the app

### If installation fails:
1. Check Railway logs for errors
2. Verify environment variables are set
3. Test the `/auth/install` endpoint