const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const database = require('./database');
const giftRoutes = require('./routes/gifts');
const webhookRoutes = require('./routes/webhooks');

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
  console.log('🔑 Shopify credentials found, initializing Shopify integration...');
  
  try {
    const { shopifyApi, LATEST_API_VERSION } = require('@shopify/shopify-api');
    const { shopifyApp } = require('@shopify/shopify-app-express');

    // Configure Shopify API
    const shopify = shopifyApi({
      apiKey: process.env.SHOPIFY_API_KEY,
      apiSecretKey: process.env.SHOPIFY_API_SECRET,
      scopes: process.env.SHOPIFY_SCOPES?.split(',') || ['read_products', 'write_products', 'read_orders'],
      hostName: process.env.HOST || 'localhost:5000',
      apiVersion: LATEST_API_VERSION,
      isEmbeddedApp: true,
    });

    // Shopify app middleware
    const shopifyAppMiddleware = shopifyApp({
      api: shopify,
      auth: {
        path: '/api/auth',
        callbackPath: '/api/auth/callback',
      },
      webhooks: {
        path: '/api/webhooks',
      },
    });

    app.use(shopifyAppMiddleware);
    console.log('✅ Shopify integration initialized');
  } catch (error) {
    console.error('❌ Shopify integration failed:', error.message);
    console.log('⚠️  Running in demo mode without Shopify integration');
  }
} else {
  console.log('⚠️  Shopify credentials not configured - running in demo mode');
  console.log('💡 Update server/.env with your Shopify API credentials');
}

// API Routes
app.use('/api/gifts', giftRoutes);

// Mandatory Privacy Compliance Webhooks
app.use('/webhooks', webhookRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Free Gift App Server Running' });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Free Gift App server running on port ${PORT}`);
  console.log(`📦 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;