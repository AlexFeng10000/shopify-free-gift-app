import React, { useState, useEffect } from 'react';

// App Bridge integration
let AppBridge;
if (typeof window !== 'undefined' && window.ShopifyAppBridge) {
  AppBridge = window.ShopifyAppBridge;
}

const AuthWrapper = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [shopDomain, setShopDomain] = useState('');
  const [demoMode, setDemoMode] = useState(false);
  const [appBridge, setAppBridge] = useState(null);
  const [sessionToken, setSessionToken] = useState(null);

  const checkAuthStatus = async () => {
    try {
      // Get shop from URL parameters
      const urlParams = new URLSearchParams(window.location.search);
      const shop = urlParams.get('shop');
      const hmac = urlParams.get('hmac');
      const demo = urlParams.get('demo');
      const installed = urlParams.get('installed');
      const host = urlParams.get('host');

      // Initialize App Bridge if we have shop and host parameters
      if (shop && host && AppBridge && !appBridge) {
        console.log('🔗 Initializing App Bridge v4...');
        try {
          const app = AppBridge.createApp({
            apiKey: '0a84e1df4c003abfab2f61d8344ea04b',
            host: host,
            forceRedirect: true
          });
          
          setAppBridge(app);
          console.log('✅ App Bridge initialized successfully');
          
          // Initialize session token authentication
          if (app.idToken) {
            app.idToken().then((token) => {
              console.log('✅ Session token obtained via idToken()');
              setSessionToken(token);
            }).catch((error) => {
              console.log('⚠️ Session token failed:', error);
            });
          } else {
            console.log('⚠️ idToken method not available, using legacy approach');
          }
          
        } catch (error) {
          console.log('⚠️ App Bridge initialization failed:', error);
        }
      }

      // Check if this is a Shopify installation request
      if (shop && hmac && !installed && !demo) {
        console.log('🚀 Installation request detected, redirecting to OAuth...');
        
        // Generate OAuth URL
        const clientId = '0a84e1df4c003abfab2f61d8344ea04b';
        const appUrl = window.location.origin;
        const redirectUri = `${appUrl}/auth/callback`;
        const scopes = 'read_products,write_products,read_orders';
        const state = Math.random().toString(36).substring(7);
        
        const cleanShop = shop.replace('.myshopify.com', '');
        
        const oauthUrl = `https://${cleanShop}.myshopify.com/admin/oauth/authorize?` +
          `client_id=${clientId}&` +
          `scope=${encodeURIComponent(scopes)}&` +
          `redirect_uri=${encodeURIComponent(redirectUri)}&` +
          `state=${state}`;
        
        console.log('Redirecting to OAuth URL:', oauthUrl);
        window.location.href = oauthUrl;
        return;
      }

      // Check for demo mode
      if (demo === 'true' || window.location.search.includes('demo=true')) {
        console.log('🎭 Demo mode activated');
        setDemoMode(true);
        setAuthenticated(true);
        setShopDomain('demo-store.myshopify.com');
        setLoading(false);
        return;
      }

      // Check if we have a shop parameter (authenticated)
      if (shop) {
        console.log('✅ Shop parameter found:', shop);
        setShopDomain(shop);
        setAuthenticated(true);
        setLoading(false);
        return;
      }

      // No authentication found
      console.log('❌ No authentication found');
      setAuthenticated(false);
      setLoading(false);

    } catch (error) {
      console.error('❌ Authentication check failed:', error);
      setAuthenticated(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <>
        <style>{`
          .loading-container {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          }
          .loading-card {
            background: white;
            padding: 40px;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            text-align: center;
            max-width: 400px;
            width: 90%;
          }
          .spinner {
            border: 4px solid #f3f3f3;
            border-top: 4px solid #007ace;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            margin: 0 auto 20px;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
        <div className="loading-container">
          <div className="loading-card">
            <div className="spinner"></div>
            <h2>🎁 Gift Booster</h2>
            <p>Authenticating with Shopify...</p>
          </div>
        </div>
      </>
    );
  }

  if (authenticated) {
    return (
      <div data-shop-domain={shopDomain} data-demo-mode={demoMode}>
        {demoMode && (
          <div style={{
            background: '#e3f2fd',
            padding: '10px',
            textAlign: 'center',
            borderBottom: '1px solid #bbdefb',
            color: '#1565c0',
            fontWeight: 'bold'
          }}>
            🎭 Demo Mode Active - You're viewing sample data
          </div>
        )}
        {children}
      </div>
    );
  }

  return (
    <>
      <style>{`
        .auth-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          padding: 20px;
        }
        
        .auth-card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
          max-width: 500px;
          width: 100%;
          overflow: hidden;
        }
        
        .auth-header {
          background: linear-gradient(135deg, #007ace 0%, #00a0d2 100%);
          color: white;
          padding: 30px;
          text-align: center;
        }
        
        .auth-header h1 {
          margin: 0 0 10px 0;
          font-size: 2.5em;
          font-weight: 600;
        }
        
        .auth-header p {
          margin: 0;
          opacity: 0.9;
          font-size: 1.1em;
        }
        
        .auth-content {
          padding: 30px;
        }
        
        .auth-error {
          text-align: center;
          margin-bottom: 30px;
        }
        
        .auth-error h2 {
          color: #333;
          margin-bottom: 15px;
        }
        
        .auth-error p {
          color: #666;
          line-height: 1.6;
          margin-bottom: 10px;
        }
        
        .demo-section {
          background: #f8f9fa;
          border: 1px solid #dee2e6;
          border-radius: 8px;
          padding: 20px;
          text-align: center;
        }
        
        .demo-section h3 {
          margin-top: 0;
          color: #495057;
        }
        
        .demo-section p {
          color: #6c757d;
          margin-bottom: 20px;
        }
        
        .demo-button {
          background: #007ace;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 6px;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .demo-button:hover {
          background-color: #005a87;
          transform: translateY(-1px);
        }
        
        .app-bridge-status {
          background-color: #f8f9fa;
          border: 1px solid #dee2e6;
          border-radius: 8px;
          padding: 20px;
          margin: 20px 0;
        }
        
        .app-bridge-status h3 {
          margin-top: 0;
          color: #495057;
        }
        
        .app-bridge-status p {
          margin: 8px 0;
          font-family: monospace;
          font-size: 14px;
        }
      `}</style>
      
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1>🎁 Gift Booster</h1>
            <p>Multi-Tier Gift with Purchase</p>
          </div>
          
          <div className="auth-content">
            <div className="auth-error">
              <h2>Authentication Required</h2>
              <p>This app requires authentication through Shopify.</p>
              <p>Please install the app through the Shopify App Store or access it from your Shopify admin panel.</p>
            </div>
            
            {/* App Bridge Status */}
            <div className="app-bridge-status">
              <h3>🔗 App Bridge Status</h3>
              <p><strong>App Bridge Available:</strong> {AppBridge ? '✅ Yes' : '❌ No'}</p>
              <p><strong>App Bridge Initialized:</strong> {appBridge ? '✅ Yes' : '❌ No'}</p>
              <p><strong>Session Token:</strong> {sessionToken ? '✅ Available' : '❌ Not Available'}</p>
            </div>
            
            <div className="demo-section">
              <h3>Try Demo Mode</h3>
              <p>Experience the app functionality with sample data:</p>
              <button 
                className="demo-button"
                onClick={() => window.location.href = '/?demo=true'}
              >
                Launch Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthWrapper;