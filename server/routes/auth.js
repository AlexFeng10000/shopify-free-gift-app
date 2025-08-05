const express = require('express');
const { shopifyApi, LATEST_API_VERSION } = require('@shopify/shopify-api');
require('@shopify/shopify-api/adapters/node');
const router = express.Router();

// For Node.js versions that don't have fetch built-in
const fetch = globalThis.fetch || require('node-fetch');

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
console.log(`   Scopes Raw: ${process.env.SHOPIFY_SCOPES || 'Missing'}`);
console.log(`   Has Config: ${hasShopifyConfig}`);

if (hasShopifyConfig) {
  try {
    // Ensure scopes are properly formatted
    const scopesString = process.env.SHOPIFY_SCOPES || 'read_products,write_products,read_orders,write_draft_orders';
    const scopesArray = scopesString.split(',').map(scope => scope.trim());
    
    console.log(`   Scopes Array: [${scopesArray.join(', ')}]`);
    
    shopify = shopifyApi({
      apiKey: process.env.SHOPIFY_API_KEY,
      apiSecretKey: process.env.SHOPIFY_API_SECRET,
      scopes: scopesArray,
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

    // Use manual OAuth URL construction (more reliable)
    const clientId = process.env.SHOPIFY_API_KEY;
    const redirectUri = `${process.env.SHOPIFY_APP_URL}/auth/callback`;
    const scopes = process.env.SHOPIFY_SCOPES || 'read_products,write_products,read_orders';
    const state = Math.random().toString(36).substring(7);
    
    // Ensure shop domain is clean
    const cleanShop = shop.replace('.myshopify.com', '');
    
    const oauthUrl = `https://${cleanShop}.myshopify.com/admin/oauth/authorize?` +
      `client_id=${clientId}&` +
      `scope=${encodeURIComponent(scopes)}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `state=${state}`;
    
    console.log(`🔗 Generated OAuth URL: ${oauthUrl}`);
    console.log(`🎯 Redirecting to Shopify OAuth...`);
    
    // This should redirect to something like:
    // https://uvszh1-m5.myshopify.com/admin/oauth/authorize?client_id=...
    return res.redirect(oauthUrl);

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

    // Manual OAuth token exchange
    const tokenUrl = `https://${shop}/admin/oauth/access_token`;
    const tokenData = {
      client_id: process.env.SHOPIFY_API_KEY,
      client_secret: process.env.SHOPIFY_API_SECRET,
      code: code
    };

    console.log(`🔄 Exchanging code for access token...`);

    // Exchange authorization code for access token
    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tokenData)
    });

    if (!response.ok) {
      throw new Error(`Token exchange failed: ${response.status} ${response.statusText}`);
    }

    const tokenResponse = await response.json();
    console.log(`✅ OAuth completed for shop: ${shop}`);
    console.log(`🔑 Access token obtained: ${tokenResponse.access_token ? 'Yes' : 'No'}`);

    // Store session data (in production, use proper session storage)
    const session = {
      shop: shop,
      accessToken: tokenResponse.access_token,
      scope: tokenResponse.scope,
      timestamp: new Date().toISOString()
    };

    global.shopifySessions = global.shopifySessions || {};
    global.shopifySessions[shop] = session;

    // Redirect to app UI with success
    console.log(`🎯 Redirecting to app UI for shop: ${shop}`);
    
    // Redirect to the main app with shop parameter and host
    console.log(`🎯 Redirecting to app UI for shop: ${shop}`);
    
    // Generate proper host parameter for embedded app
    const shopDomain = shop.includes('.myshopify.com') ? shop : `${shop}.myshopify.com`;
    const host = Buffer.from(`${shopDomain}/admin`).toString('base64').replace(/=/g, '');
    
    // Redirect to the main app with proper embedded parameters
    res.redirect(`/?shop=${shop}&host=${host}&installed=true`);

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

  // Serve the React app directly in production
  if (process.env.NODE_ENV === 'production') {
    // In production, serve the React app with query parameters
    const queryParams = new URLSearchParams({
      shop: shop,
      ...(demo && { demo: demo }),
      ...(installed && { installed: installed })
    }).toString();
    
    res.redirect(`/?${queryParams}`);
  } else {
    // In development, redirect to local React server
    const queryParams = new URLSearchParams({
      shop: shop,
      ...(demo && { demo: demo }),
      ...(installed && { installed: installed })
    }).toString();
    
    res.redirect(`http://localhost:3000/?${queryParams}`);
  }
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

    // Generate OAuth URL manually (same as install route)
    const clientId = process.env.SHOPIFY_API_KEY;
    const redirectUri = `${process.env.SHOPIFY_APP_URL}/auth/callback`;
    const scopes = process.env.SHOPIFY_SCOPES || 'read_products,write_products,read_orders';
    const state = Math.random().toString(36).substring(7);
    
    const cleanShop = shop.replace('.myshopify.com', '');
    
    const oauthUrl = `https://${cleanShop}.myshopify.com/admin/oauth/authorize?` +
      `client_id=${clientId}&` +
      `scope=${encodeURIComponent(scopes)}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `state=${state}`;

    res.json({
      success: true,
      shop,
      cleanShop,
      oauthUrl,
      expectedPattern: 'https://SHOP.myshopify.com/admin/oauth/authorize',
      environment: {
        clientId: clientId ? 'Set' : 'Missing',
        redirectUri,
        scopes,
        appUrl: process.env.SHOPIFY_APP_URL
      },
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
 * API OAuth Callback Handler
 * This is for the client-side OAuthCallback component
 */
router.post('/callback', async (req, res) => {
  try {
    const { shop, code, state, hmac } = req.body;

    if (!shop || !code) {
      return res.status(400).json({ 
        error: 'Missing required OAuth parameters',
        required: ['shop', 'code']
      });
    }

    console.log(`🔄 API OAuth callback for shop: ${shop}`);

    if (!shopify) {
      // Demo mode - return success
      console.log('⚠️  Demo mode: API OAuth callback, returning success');
      return res.json({
        success: true,
        shop: shop,
        demo: true,
        message: 'Demo mode authentication successful'
      });
    }

    // Manual OAuth token exchange (same as GET callback)
    const tokenUrl = `https://${shop}/admin/oauth/access_token`;
    const tokenData = {
      client_id: process.env.SHOPIFY_API_KEY,
      client_secret: process.env.SHOPIFY_API_SECRET,
      code: code
    };

    console.log(`🔄 API: Exchanging code for access token...`);

    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tokenData)
    });

    if (!response.ok) {
      throw new Error(`Token exchange failed: ${response.status} ${response.statusText}`);
    }

    const tokenResponse = await response.json();
    console.log(`✅ API OAuth completed for shop: ${shop}`);

    // Store session data
    const session = {
      shop: shop,
      accessToken: tokenResponse.access_token,
      scope: tokenResponse.scope,
      timestamp: new Date().toISOString()
    };

    global.shopifySessions = global.shopifySessions || {};
    global.shopifySessions[shop] = session;

    // Return success response for API
    res.json({
      success: true,
      shop: shop,
      scope: tokenResponse.scope,
      message: 'OAuth authentication successful'
    });

  } catch (error) {
    console.error('❌ API OAuth callback failed:', error);
    res.status(500).json({ 
      error: 'Authentication callback failed',
      message: error.message
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