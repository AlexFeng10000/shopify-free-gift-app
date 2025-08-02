// OAuth install endpoint
export default function handler(req, res) {
  try {
    const { shop } = req.query;
    
    if (!shop) {
      return res.status(400).json({ error: 'Missing shop parameter' });
    }

    // Generate OAuth URL
    const clientId = (process.env.SHOPIFY_API_KEY || '0a84e1df4c003abfab2f61d8344ea04b').trim();
    const appUrl = process.env.SHOPIFY_APP_URL || 'https://gift-booster-8snj2dl7z-alexfeng10000s-projects.vercel.app';
    const redirectUri = `${appUrl}/auth/callback`;
    const scopes = 'read_products,write_products,read_orders';
    const state = Math.random().toString(36).substring(7);
    
    const cleanShop = shop.replace('.myshopify.com', '');
    
    const oauthUrl = `https://${cleanShop}.myshopify.com/admin/oauth/authorize?` +
      `client_id=${clientId}&` +
      `scope=${encodeURIComponent(scopes)}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `state=${state}`;
    
    console.log('OAuth URL generated:', oauthUrl);
    
    // Redirect to Shopify OAuth
    res.setHeader('Location', oauthUrl);
    return res.status(302).end();
  } catch (error) {
    console.error('OAuth install error:', error);
    return res.status(500).json({ 
      error: 'OAuth install failed', 
      message: error.message 
    });
  }
}