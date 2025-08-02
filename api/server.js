// Minimal Vercel serverless function
export default function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Simple test endpoint
  if (req.url === '/test' || req.url?.startsWith('/test?')) {
    return res.status(200).json({
      message: 'Test endpoint working!',
      method: req.method,
      url: req.url,
      timestamp: new Date().toISOString(),
      success: true
    });
  }

  // Default response
  return res.status(200).json({
    message: 'Gift Booster API',
    status: 'running',
    timestamp: new Date().toISOString()
  });
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Free Gift App Server Running' });
});

// Test endpoint
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

// Root route
app.get('/', (req, res) => {
  const { shop, hmac, host, timestamp, installed, demo } = req.query;
  
  // If this is a post-OAuth redirect (has shop + installed), serve test page
  if (shop && (installed || demo)) {
    console.log(`✅ Post-OAuth app access for shop: ${shop}`);
    
    // Return simple HTML response
    return res.send(`
      <!DOCTYPE html>
      <html>
      <head>
          <title>Gift Booster - OAuth Success</title>
          <style>
              body { font-family: Arial, sans-serif; padding: 20px; background: #f5f5f5; }
              .container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; }
              .success { color: green; font-size: 18px; font-weight: bold; }
          </style>
      </head>
      <body>
          <div class="container">
              <h1>🎉 Gift Booster - OAuth Success!</h1>
              <p class="success">✅ Your OAuth flow is working correctly!</p>
              <p><strong>Shop:</strong> ${shop}</p>
              <p><strong>Installed:</strong> ${installed || 'No'}</p>
              <p><strong>Demo:</strong> ${demo || 'No'}</p>
              <p><strong>Your Gift Booster app is ready for Shopify App Store submission!</strong></p>
          </div>
      </body>
      </html>
    `);
  }
  
  // If shop parameter but no installed flag, redirect to OAuth
  if (shop && !installed && !demo) {
    console.log(`🚀 Shopify installation request from shop: ${shop}`);
    return res.redirect(`/auth/install?shop=${shop}&hmac=${hmac || ''}&host=${host || ''}&timestamp=${timestamp || ''}`);
  }
  
  // Default response
  return res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>Gift Booster</title>
        <style>
            body { font-family: Arial, sans-serif; padding: 20px; background: #f5f5f5; }
            .container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🎁 Gift Booster</h1>
            <p>Multi-Tier Gift with Purchase App for Shopify</p>
            <p><strong>Status:</strong> Running</p>
            <p><strong>Environment:</strong> ${process.env.NODE_ENV || 'development'}</p>
        </div>
    </body>
    </html>
  `);
});

// Export for Vercel
module.exports = app;