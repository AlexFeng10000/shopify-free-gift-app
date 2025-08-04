import React, { useState, useEffect } from 'react';
import { getSessionToken } from '../utils/sessionToken';
import { useAppBridgeSafe } from '../hooks/useAppBridgeSafe';

const AuthWrapper = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [shopDomain, setShopDomain] = useState('');
  const [demoMode, setDemoMode] = useState(false);
  const [sessionToken, setSessionToken] = useState(null);
  const [error, setError] = useState(null);

  // Get App Bridge instance safely
  const { app } = useAppBridgeSafe();

  const checkAuthStatus = async () => {
    try {
      console.log('🚀 Gift Booster App - AuthWrapper initialized');
      console.log('📍 Current URL:', window.location.href);
      console.log('🕐 Timestamp:', new Date().toISOString());
      
      // Get URL parameters
      const urlParams = new URLSearchParams(window.location.search);
      const shop = urlParams.get('shop');
      const hmac = urlParams.get('hmac');
      const demo = urlParams.get('demo');
      const installed = urlParams.get('installed');
      const host = urlParams.get('host');
      
      console.log('🔍 URL Parameters:');
      console.log('  shop:', shop);
      console.log('  host:', host);
      console.log('  demo:', demo);
      console.log('  installed:', installed);

      // Check for demo mode first
      if (demo === 'true' || window.location.search.includes('demo=true')) {
        console.log('🎭 Demo mode activated');
        setDemoMode(true);
        setAuthenticated(true);
        setShopDomain('demo-store.myshopify.com');
        setLoading(false);
        return;
      }

      // Check if this is a Shopify installation request
      if (shop && hmac && !installed && !demo) {
        console.log('🚀 Installation request detected, redirecting to OAuth...');
        
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

      // If we have App Bridge instance, try to get session token
      console.log('🔍 AuthWrapper - Checking session token conditions:', { app: !!app, shop: !!shop, host: !!host });
      
      if (app && shop) {
        console.log('🔗 App Bridge available, getting session token...');
        
        // Try to get session token using our improved utility
        try {
          console.log('🔄 Attempting to get session token...');
          const token = await getSessionToken(app);
          
          if (token) {
            console.log('✅ Session token obtained successfully');
            console.log('🎫 Token preview:', token.substring(0, 20) + '...');
            setSessionToken(token);
            window.sessionToken = token;
            console.log('💾 Session token stored globally');
          }
        } catch (tokenError) {
          console.log('⚠️ Session token failed, continuing without token:', tokenError.message);
          // Continue without session token - this is acceptable for many use cases
        }
        
        // Set authentication regardless of session token success
        setShopDomain(shop);
        setAuthenticated(true);
        setLoading(false);
        return;
      }

      // Check if we have shop parameter (basic authentication)
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
      setError(error.message);
      setAuthenticated(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [app]);

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
              <p><strong>App Bridge Available:</strong> {app ? '✅ Yes' : '❌ No'}</p>
              <p><strong>Session Token:</strong> {sessionToken ? '✅ Available' : '❌ Not Available'}</p>
              <p><strong>Error:</strong> {error || 'None'}</p>
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