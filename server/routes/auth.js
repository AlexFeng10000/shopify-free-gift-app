const express = require('express');
const { shopifyApi, LATEST_API_VERSION } = require('@shopify/shopify-api');
const router = express.Router();

// Initialize Shopify API if credentials are available
let shopify = null;
const hasShopifyConfig = process.env.SHOPIFY_API_KEY && 
                        process.env.SHOPIFY_API_SECRET && 
                        process.env.SHOPIFY_API_KEY !== 'your_api_key_here';

if (hasShopifyConfig) {
  try {
    shopify = shopifyApi({
      apiKey: process.env.SHOPIFY_API_KEY,
      apiSecretKey: process.env.SHOPIFY_API_SECRET,
      scopes: process.env.SHOPIFY_SCOPES?.split(',') || ['read_products', 'write_products', 'read_orders'],
      hostName: process.env.HOST || 'localhost:5000',
      apiVersion: LATEST_API_VERSION,
      isEmbeddedApp: true,
      logger: {
        level: 'info',
        httpRequests: true,
        timestamps: true,
      },
    });
    console.log('✅ Shopify API initialized for authentication');
  } catch (error) {
    console.error('❌ Shopify API initialization failed:', error.message);
  }
}

/**
 * App Installation Entry Point
 * This is where merchants are redirected when they install your app
 */
router.get('/install', async (req, res) => {
  try {
    const { shop } = req.query;
    
    if (!shop) {
      return res.status(400).send('Missing shop parameter');
    }

    // Validate shop domain format
    if (!shop.includes('.myshopify.com')) {
      return res.status(400).send('Invalid shop domain');
    }

    console.log(`🔐 Starting OAuth for shop: ${shop}`);

    if (!shopify) {
      // Demo mode - redirect directly to app UI
      console.log('⚠️  Demo mode: Redirecting to app UI without OAuth');
      return res.redirect(`/app?shop=${shop}&demo=true`);
    }

    // Generate OAuth URL
    const authRoute = await shopify.auth.begin({
      shop,
      callbackPath: '/auth/callback',
      isOnline: false, // Offline access for app functionality
    });

    console.log(`🔗 Redirecting to OAuth: ${authRoute}`);
    res.redirect(authRoute);

  } catch (error) {
    console.error('❌ OAuth initiation failed:', error);
    res.status(500).send('Authentication failed. Please try again.');
  }
});

/**
 * OAuth Callback Handler
 * Shopify redirects here after merchant approves app installation
 */
router.get('/callback', async (req, res) => {
  try {
    const { shop, code, state } = req.query;

    if (!shop || !code) {
      return res.status(400).send('Missing required OAuth parameters');
    }

    console.log(`🔄 Processing OAuth callback for shop: ${shop}`);

    if (!shopify) {
      // Demo mode - redirect to app UI
      console.log('⚠️  Demo mode: OAuth callback, redirecting to app');
      return res.redirect(`/app?shop=${shop}&demo=true&installed=true`);
    }

    // Complete OAuth flow
    const session = await shopify.auth.callback({
      rawRequest: req,
      rawResponse: res,
    });

    console.log(`✅ OAuth completed for shop: ${session.shop}`);
    console.log(`🔑 Access token obtained: ${session.accessToken ? 'Yes' : 'No'}`);

    // Store session data (in production, use proper session storage)
    // For now, we'll use a simple in-memory store
    global.shopifySessions = global.shopifySessions || {};
    global.shopifySessions[session.shop] = session;

    // Redirect to app UI with success
    const appUrl = `/app?shop=${session.shop}&installed=true`;
    console.log(`🎯 Redirecting to app UI: ${appUrl}`);
    
    res.redirect(appUrl);

  } catch (error) {
    console.error('❌ OAuth callback failed:', error);
    res.status(500).send('Authentication callback failed. Please try installing the app again.');
  }
});

/**
 * App UI Route
 * Serves the main app interface after successful authentication
 */
router.get('/app', (req, res) => {
  const { shop, demo, installed } = req.query;
  
  if (!shop) {
    return res.status(400).send('Missing shop parameter');
  }

  console.log(`🎨 Serving app UI for shop: ${shop}`);
  console.log(`📊 Demo mode: ${demo ? 'Yes' : 'No'}`);
  console.log(`✅ Freshly installed: ${installed ? 'Yes' : 'No'}`);

  // In production, you'd serve your React app here
  // For now, we'll redirect to the client app
  const clientUrl = process.env.NODE_ENV === 'production' 
    ? '/' 
    : 'http://localhost:3000';
    
  res.redirect(`${clientUrl}?shop=${shop}&demo=${demo}&installed=${installed}`);
});

/**
 * Session Verification Middleware
 * Use this to protect API routes that require authentication
 */
const verifySession = async (req, res, next) => {
  try {
    const shop = req.get('X-Shopify-Shop-Domain') || req.query.shop;
    
    if (!shop) {
      return res.status(401).json({ error: 'Missing shop domain' });
    }

    // In demo mode, allow all requests
    if (!shopify) {
      req.session = { shop, demo: true };
      return next();
    }

    // Check if we have a valid session
    const session = global.shopifySessions?.[shop];
    
    if (!session || !session.accessToken) {
      return res.status(401).json({ 
        error: 'Not authenticated',
        authUrl: `/auth/install?shop=${shop}`
      });
    }

    // Verify session is still valid (simplified check)
    req.session = session;
    next();

  } catch (error) {
    console.error('❌ Session verification failed:', error);
    res.status(401).json({ error: 'Authentication required' });
  }
};

/**
 * Health check for authentication system
 */
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    shopifyConfigured: !!shopify,
    demoMode: !shopify,
    routes: [
      'GET /auth/install - Start app installation',
      'GET /auth/callback - OAuth callback handler', 
      'GET /auth/app - Main app interface',
      'GET /auth/health - This endpoint'
    ],
    timestamp: new Date().toISOString()
  });
});

module.exports = { router, verifySession };