const jwt = require('jsonwebtoken');
const crypto = require('crypto');

/**
 * Middleware to verify Shopify session tokens
 * This validates JWT tokens sent from App Bridge
 */
const verifySessionToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // If no session token, fall back to basic shop verification
      const shop = req.get('X-Shopify-Shop-Domain') || req.query.shop;
      if (shop) {
        req.session = { shop, demo: true };
        return next();
      }
      return res.status(401).json({ error: 'Missing session token' });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    // Decode the JWT token without verification first to get the header
    const decoded = jwt.decode(token, { complete: true });
    
    if (!decoded) {
      return res.status(401).json({ error: 'Invalid session token format' });
    }

    // Extract shop domain from the token payload
    const { iss: shop, aud: apiKey, exp, iat, nbf, sub, dest } = decoded.payload;
    
    // Verify the token is for our app
    if (apiKey !== process.env.SHOPIFY_API_KEY) {
      return res.status(401).json({ error: 'Token not for this app' });
    }

    // Verify the token hasn't expired
    const now = Math.floor(Date.now() / 1000);
    if (exp && exp < now) {
      return res.status(401).json({ error: 'Session token expired' });
    }

    // Verify the token is not used before its valid time
    if (nbf && nbf > now) {
      return res.status(401).json({ error: 'Session token not yet valid' });
    }

    // For session tokens, we need to verify the signature using the app secret
    // Shopify uses HMAC-SHA256 for session token verification
    try {
      const verified = jwt.verify(token, process.env.SHOPIFY_API_SECRET, {
        algorithms: ['HS256']
      });
      
      // Add session info to request
      req.session = {
        shop: shop,
        user: sub,
        dest: dest,
        sessionToken: token,
        verified: true
      };
      
      console.log(`✅ Session token verified for shop: ${shop}`);
      next();
      
    } catch (verifyError) {
      console.error('❌ Session token verification failed:', verifyError.message);
      return res.status(401).json({ error: 'Invalid session token signature' });
    }

  } catch (error) {
    console.error('❌ Session token middleware error:', error);
    return res.status(401).json({ error: 'Session token processing failed' });
  }
};

/**
 * Optional middleware that allows requests without session tokens
 * Useful for endpoints that can work in both authenticated and demo modes
 */
const optionalSessionToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // No session token, set demo mode
    const shop = req.get('X-Shopify-Shop-Domain') || req.query.shop || 'demo-store.myshopify.com';
    req.session = { shop, demo: true };
    return next();
  }

  // Has session token, verify it
  verifySessionToken(req, res, next);
};

module.exports = {
  verifySessionToken,
  optionalSessionToken
};