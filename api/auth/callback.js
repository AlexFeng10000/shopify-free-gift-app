// OAuth callback endpoint
export default function handler(req, res) {
  try {
    const { shop, code, state, host } = req.query;
    
    console.log('🔄 OAuth callback function called!');
    console.log('Query params:', req.query);
    console.log('URL:', req.url);
    
    if (!shop || !code) {
      return res.status(400).json({ 
        error: 'Missing OAuth parameters',
        debug: {
          shop: shop || 'missing',
          code: code || 'missing',
          state: state || 'missing',
          host: host || 'missing',
          allParams: req.query,
          url: req.url
        }
      });
    }
    
    console.log('✅ OAuth callback received for shop:', shop);
    
    // Redirect to the simplified app endpoint
    const appUrl = process.env.SHOPIFY_APP_URL || 'https://gift-booster-8snj2dl7z-alexfeng10000s-projects.vercel.app';
    
    // Build redirect URL without problematic host parameter
    const redirectUrl = `${appUrl}/app?shop=${encodeURIComponent(shop)}&installed=true`;
    
    console.log('Redirecting to simplified app:', redirectUrl);
    
    // Ensure the redirect URL is clean and doesn't contain problematic characters
    const cleanRedirectUrl = redirectUrl.replace(/[^\x20-\x7E]/g, '');
    
    res.setHeader('Location', cleanRedirectUrl);
    return res.status(302).end();
    
  } catch (error) {
    console.error('OAuth callback error:', error);
    return res.status(500).json({ 
      error: 'OAuth callback failed', 
      message: error.message,
      debug: {
        url: req.url,
        query: req.query
      }
    });
  }
}