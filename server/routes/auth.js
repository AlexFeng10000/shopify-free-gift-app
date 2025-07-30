const express = require('express');
const { shopifyApi, LATEST_API_VERSION } = require('@shopify/shopify-api');
const router = express.Router();

// Initialize Shopify API if credentials are available
let shopify = null;
const hasShopifyConfig = process.env.SHOPIFY_API_KEY && 
                        process.env.SHOPIFY_API_SECRET && 
                        process.env.SHOPIFY_API_KEY !== 'your_api_key_here';

console.log('🔧 Shopify Auth Configuration:');
console.log(`   API Key: ${process.env.SHOPIFY_API_KEY ? 'Set' : 'Missing'}`);
console.log(`   API Secret: ${process.env.SHOPIFY_API_SECRET ? 'Set' : 'Missing'}`);
console.log(`   App URL: ${process.env.SHOPIFY_APP_URL || 'Missing'}`);
console.log(`   Host: ${process.env.HOST || 'Missing'}`);
console.log(`   Has Config: ${hasShopifyConfig}`);

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
    console.error('❌ Full error:', error);
  }
} else {
  console.log('⚠️  Running in demo mode - Shopify API not configured');
}

/**
 * App Installation Entry Point
 * This is where merchants are redirected when they install your app
 */
router.get('/install', async (req, res) => {
  try {
    const { shop, hmac, host, timestamp } = req.query;
    
    if (!shop) {
      return res.status(400).send('Missing shop parameter');
    }

    // Validate shop domain format
    if (!shop.includes('.myshopify.com')) {
      return res.status(400).send('Invalid shop domain');
    }

    console.log(`🔐 Starting OAuth for shop: ${shop}`);
    console.log(`📋 Request params: hmac=${hmac ? 'present' : 'missing'}, host=${host ? 'present' : 'missing'}`);

    if (!shopify) {
      // Demo mode - redirect directly to app UI
      console.log('⚠️  Demo mode: Redirecting to app UI without OAuth');
      return res.redirect(`/auth/app?shop=${shop}&demo=true`);
    }

    try {
      // Generate OAuth URL using Shopify API
      const authRoute = await shopify.auth.begin({
        shop: shop.replace('.myshopify.com', ''), // Remove domain suffix if present
        callbackPath: '/auth/callback',
        isOnline: false, // Offline access for app functionality
      });

      console.log(`🔗 Generated OAuth URL: ${authRoute}`);
      console.log(`🎯 Redirecting to Shopify OAuth...`);
      
      // This should redirect to something like:
      // https://admin.shopify.com/store/SHOP/app/grant?client_id=...
      return res.redirect(authRoute);

    } catch (authError) {
      console.error('❌ OAuth URL generation failed:', authError);
      
      // Fallback: Manual OAuth URL construction
      const clientId = process.env.SHOPIFY_API_KEY;
      const redirectUri = `${process.env.SHOPIFY_APP_URL}/auth/callback`;
      const scopes = process.env.SHOPIFY_SCOPES || 'read_products,write_products,read_orders';
      const state = Math.random().toString(36).substring(7);
      
      const manualOAuthUrl = `https://${shop}/admin/oauth/authorize?` +
        `client_id=${clientId}&` +
        `scope=${encodeURIComponent(scopes)}&` +
        `redirect_uri=${encodeURIComponent(redirectUri)}&` +
        `state=${state}`;
      
      console.log(`🔄 Fallback OAuth URL: ${manualOAuthUrl}`);
      return res.redirect(manualOAuthUrl);
    }

  } catch (error) {
    console.error('❌ OAuth initiation failed:', error);
    res.status(500).send(`Authentication failed: ${error.message}`);
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
 * Test OAuth URL generation
 */
router.get('/test-oauth', async (req, res) => {
  const { shop } = req.query;
  
  if (!shop) {
    return res.json({
      error: 'Missing shop parameter',
      usage: '/auth/test-oauth?shop=test.myshopify.com'
    });
  }

  try {
    if (!shopify) {
      return res.json({
        error: 'Shopify API not configured',
        demoMode: true,
        shop,
        fallbackUrl: `/auth/app?shop=${shop}&demo=true`
      });
    }

    const authRoute = await shopify.auth.begin({
      shop: shop.replace('.myshopify.com', ''),
      callbackPath: '/auth/callback',
      isOnline: false,
    });

    res.json({
      success: true,
      shop,
      oauthUrl: authRoute,
      expectedPattern: 'https://admin.shopify.com/store/*/app/grant',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    res.json({
      error: 'OAuth URL generation failed',
      message: error.message,
      shop,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * Health check for authentication system
 */
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    shopifyConfigured: !!shopify,
    demoMode: !shopify,
    environment: {
      apiKey: process.env.SHOPIFY_API_KEY ? 'Set' : 'Missing',
      apiSecret: process.env.SHOPIFY_API_SECRET ? 'Set' : 'Missing',
      appUrl: process.env.SHOPIFY_APP_URL || 'Missing',
      host: process.env.HOST || 'Missing'
    },
    routes: [
      'GET /auth/install - Start app installation',
      'GET /auth/callback - OAuth callback handler', 
      'GET /auth/app - Main app interface',
      'GET /auth/test-oauth - Test OAuth URL generation',
      'GET /auth/health - This endpoint'
    ],
    timestamp: new Date().toISOString()
  });
});

module.exports = { router, verifySession };