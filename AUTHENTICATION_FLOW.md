# Authentication Flow Documentation

## Overview

Your app now includes proper Shopify OAuth authentication flow that meets App Store requirements for immediate authentication and UI redirection.

## Authentication Flow Steps

### 1. App Installation Entry Point
```
https://your-app.vercel.app/?shop=store.myshopify.com
```
- Merchant clicks "Add app" in Shopify App Store
- Shopify redirects to your app with `shop` parameter
- App immediately redirects to OAuth flow

### 2. OAuth Initiation (`/auth/install`)
```
GET /auth/install?shop=store.myshopify.com
```
- Validates shop domain format
- Generates Shopify OAuth URL
- Redirects merchant to Shopify for permission approval

### 3. OAuth Callback (`/auth/callback`)
```
GET /auth/callback?shop=store.myshopify.com&code=abc123&state=xyz
```
- Receives OAuth callback from Shopify
- Exchanges code for access token
- Stores session data
- **Immediately redirects to app UI**

### 4. App UI (`/auth/app`)
```
GET /auth/app?shop=store.myshopify.com&installed=true
```
- Serves main app interface
- Shows success message for fresh installations
- **No additional authentication steps required**

## Key Features for Shopify Compliance

### ✅ Immediate Authentication
- App starts OAuth flow immediately after installation
- No manual authentication steps required
- Handles all OAuth complexity automatically

### ✅ Immediate UI Redirect
- After successful OAuth, immediately redirects to app interface
- No loading screens or additional steps
- Merchant sees app functionality right away

### ✅ Demo Mode Support
- Works without Shopify credentials for development
- Allows testing without full OAuth setup
- Graceful fallback for missing configuration

### ✅ Session Management
- Stores access tokens securely
- Validates sessions for API requests
- Handles authentication errors gracefully

## API Routes Protection

All API routes are now protected with authentication:

```javascript
// Protected API routes
app.use('/api/gifts', verifySession, giftRoutes);
```

The `verifySession` middleware:
- Checks for valid Shopify session
- Returns 401 if not authenticated
- Provides auth URL for re-authentication

## React App Integration

### AuthWrapper Component
- Handles authentication state in React
- Shows loading during auth check
- Displays error messages if auth fails
- Passes shop domain to child components

### URL Parameter Handling
- Reads `shop`, `demo`, and `installed` parameters
- Shows success message for fresh installations
- Clears URL parameters after processing

## Environment Variables Required

```env
SHOPIFY_API_KEY=your_api_key_from_partners_dashboard
SHOPIFY_API_SECRET=your_api_secret_from_partners_dashboard
SHOPIFY_SCOPES=read_products,write_products,read_orders
SHOPIFY_APP_URL=https://your-app.vercel.app
HOST=your-app.vercel.app
```

## Testing the Authentication Flow

### Local Testing:
1. Start your app: `npm run dev`
2. Visit: `http://localhost:5000/?shop=test.myshopify.com`
3. Should redirect through OAuth flow
4. Ends up at app UI with demo mode

### Production Testing:
1. Configure app in Shopify Partners dashboard
2. Set App URL: `https://your-app.vercel.app`
3. Set Redirect URLs: `https://your-app.vercel.app/auth/callback`
4. Install app on development store
5. Should complete full OAuth flow

## Shopify App Store Requirements Met

### ✅ Immediate Authentication
- App authenticates immediately after installation
- No manual steps required from merchant

### ✅ Immediate UI Redirect
- After authentication, immediately shows app interface
- No additional loading or setup screens

### ✅ Proper OAuth Implementation
- Uses official Shopify API library
- Handles all OAuth edge cases
- Secure token storage and validation

### ✅ Error Handling
- Graceful handling of authentication failures
- Clear error messages for merchants
- Fallback options for common issues

## Common Issues and Solutions

### Issue: "Missing shop parameter"
**Solution**: Ensure app URL is configured correctly in Partners dashboard

### Issue: "Invalid shop domain"
**Solution**: Shop parameter must include `.myshopify.com`

### Issue: "Authentication failed"
**Solution**: Check API key and secret in environment variables

### Issue: "OAuth callback failed"
**Solution**: Verify redirect URL matches Partners dashboard configuration

## Next Steps

1. **Configure in Partners Dashboard**:
   - Set App URL to your Vercel deployment
   - Set Redirect URL to `/auth/callback`
   - Add required scopes

2. **Test Installation Flow**:
   - Install app on development store
   - Verify immediate authentication
   - Confirm UI loads immediately after auth

3. **Deploy Updates**:
   - Push authentication code to GitHub
   - Deploy to Vercel with environment variables
   - Test live authentication flow

Your app now meets Shopify's authentication requirements and will pass the automated checks! 🎉