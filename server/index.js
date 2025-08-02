const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const database = require('./database');
const giftRoutes = require('./routes/gifts');
const webhookRoutes = require('./routes/webhooks');
const { router: authRoutes, verifySession } = require('./routes/auth');

console.log('🔧 Starting Free Gift App Server...');

// Initialize database
try {
  database.init();
  console.log('✅ Database initialized');
} catch (error) {
  console.error('❌ Database initialization failed:', error.message);
}

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Basic auth middleware for development
app.use((req, res, next) => {
  // For development, we'll simulate shop domain
  req.headers['x-shopify-shop-domain'] = 'demo-store.myshopify.com';
  next();
});

// Check if Shopify credentials are configured
const hasShopifyConfig = process.env.SHOPIFY_API_KEY && 
                        process.env.SHOPIFY_API_SECRET && 
                        process.env.SHOPIFY_API_KEY !== 'your_api_key_here';

if (hasShopifyConfig) {
  console.log('🔑 Shopify credentials found');
  console.log('✅ Using custom auth routes (auth.js) for Shopify integration');
  console.log('⚠️  Skipping shopify-app-express middleware to avoid conflicts');
} else {
  console.log('⚠️  Shopify credentials not configured - running in demo mode');
  console.log('💡 Update server/.env with your Shopify API credentials');
}

// Authentication Routes (must come first)
app.use('/auth', authRoutes);

// API Routes (protected by authentication)
app.use('/api/gifts', verifySession, giftRoutes);

// Mandatory Privacy Compliance Webhooks
app.use('/webhooks', webhookRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Free Gift App Server Running' });
});

// Test endpoint to debug OAuth issues
app.get('/test', (req, res) => {
  const { shop, installed, demo } = req.query;
  res.json({
    message: 'Test endpoint working',
    query: req.query,
    shop: shop,
    installed: installed,
    demo: demo,
    nodeEnv: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

// Root route - handles app installation entry point
app.get('/', (req, res) => {
  const { shop, hmac, host, timestamp, installed, demo } = req.query;
  
  // If this is a post-OAuth redirect (has shop + installed), serve the app
  if (shop && (installed || demo)) {
    console.log(`✅ Post-OAuth app access for shop: ${shop}`);
    console.log(`🎯 Installed: ${installed ? 'Yes' : 'No'}, Demo: ${demo ? 'Yes' : 'No'}`);
    console.log(`📁 NODE_ENV: ${process.env.NODE_ENV}`);
    console.log(`📂 Build path: ${path.join(__dirname, '../client/build', 'index.html')}`);
    
    if (process.env.NODE_ENV === 'production') {
      // Temporarily serve test page instead of React app
      const testPath = path.join(__dirname, '../client/public', 'test.html');
      console.log(`📄 Serving test page from: ${testPath}`);
      return res.sendFile(testPath);
    } else {
      return res.json({
        message: 'Gift Booster - Multi-Tier Gift with Purchase App',
        status: 'authenticated',
        shop: shop,
        installed: installed,
        demo: demo,
        environment: 'development'
      });
    }
  }
  
  // If shop parameter but no installed flag, this is a fresh installation request
  if (shop && !installed && !demo) {
    console.log(`🚀 Shopify installation request from shop: ${shop}`);
    console.log(`📋 HMAC: ${hmac ? 'Present' : 'Missing'}`);
    console.log(`🏠 Host: ${host ? 'Present' : 'Missing'}`);
    
    // Redirect directly to OAuth flow
    return res.redirect(`/auth/install?shop=${shop}&hmac=${hmac || ''}&host=${host || ''}&timestamp=${timestamp || ''}`);
  }
  
  // If no shop parameter, serve the main app (for direct access)
  console.log(`🏠 No shop parameter - serving main app`);
  console.log(`📁 NODE_ENV: ${process.env.NODE_ENV}`);
  
  if (process.env.NODE_ENV === 'production') {
    // Temporarily serve test page instead of React app
    const testPath = path.join(__dirname, '../client/public', 'test.html');
    console.log(`📄 Serving test page from: ${testPath}`);
    return res.sendFile(testPath);
  } else {
    return res.json({
      message: 'Gift Booster - Multi-Tier Gift with Purchase App',
      status: 'running',
      environment: 'development',
      installUrl: '/?shop=your-store.myshopify.com',
      authFlow: '/auth/install?shop=your-store.myshopify.com'
    });
  }
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  
  // Catch-all handler for React Router (but not for API routes)
  app.get('*', (req, res) => {
    // Don't serve React app for API routes
    if (req.path.startsWith('/api/') || req.path.startsWith('/auth/') || req.path.startsWith('/webhooks/')) {
      return res.status(404).json({ error: 'API endpoint not found' });
    }
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Free Gift App server running on port ${PORT}`);
  console.log(`📦 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;