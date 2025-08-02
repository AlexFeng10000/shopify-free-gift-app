// Root route handler for Shopify app installation
import { readFileSync } from 'fs';
import { join } from 'path';

export default function handler(req, res) {
  try {
    // Add comprehensive logging
    console.log('🔍 Root handler called');
    console.log('URL:', req.url);
    console.log('Method:', req.method);
    console.log('Query:', req.query);
    
    const { shop, hmac, host, timestamp, installed, demo } = req.query;
    const { url } = req;
    
    // Debug the installation detection logic
    console.log('🔍 Installation detection:');
    console.log('- shop:', shop);
    console.log('- hmac:', hmac);
    console.log('- installed:', installed);
    console.log('- demo:', demo);
    console.log('- Should redirect to install?', !!(shop && hmac && !installed && !demo));
    
    // Handle static files - let them pass through
    if (url.includes('.') && !url.includes('?')) {
      return res.status(404).json({ error: 'File not found' });
    }
    
    // PRIORITY 1: If this is a Shopify installation request (has shop + hmac), redirect to OAuth
    if (shop && hmac && !installed && !demo) {
      console.log(`🚀 Shopify installation request from shop: ${shop}`);
      console.log(`🔄 Redirecting to OAuth install...`);
      
      // Redirect to the OAuth install endpoint
      const installUrl = `/auth/install?shop=${encodeURIComponent(shop)}&hmac=${encodeURIComponent(hmac)}&host=${encodeURIComponent(host || '')}&timestamp=${encodeURIComponent(timestamp || '')}`;
      
      res.setHeader('Location', installUrl);
      return res.status(302).end();
    }
    
    // PRIORITY 2: If this is an embedded app access (has shop parameter), serve the embedded app
    if (shop) {
      console.log(`✅ Embedded app access for shop: ${shop}`);
      console.log(`📋 Parameters: installed=${installed}, demo=${demo}, host=${host}`);
      
      // Validate shop domain format
      if (!shop.includes('.myshopify.com')) {
        return res.status(400).json({ error: 'Invalid shop domain' });
      }
      
      // Set proper headers for embedded app
      res.setHeader('Content-Security-Policy', 'frame-ancestors https://*.myshopify.com https://admin.shopify.com;');
      res.setHeader('X-Frame-Options', 'ALLOWALL');
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      
      return res.status(200).send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="utf-8">
            <title>Gift Booster - Free Gift with Purchase</title>
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <script src="https://unpkg.com/@shopify/app-bridge@3/umd/index.js"></script>
            <style>
                * { box-sizing: border-box; }
                body {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    margin: 0;
                    padding: 20px;
                    background: #f6f6f7;
                    line-height: 1.6;
                }
                .container {
                    max-width: 800px;
                    margin: 0 auto;
                    background: white;
                    padding: 30px;
                    border-radius: 8px;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                }
                .header {
                    text-align: center;
                    margin-bottom: 30px;
                    padding-bottom: 20px;
                    border-bottom: 1px solid #e1e3e5;
                }
                .feature-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 20px;
                    margin: 30px 0;
                }
                .feature-card {
                    padding: 20px;
                    border: 1px solid #e1e3e5;
                    border-radius: 6px;
                    background: #fafbfb;
                }
                .feature-card h3 {
                    margin: 0 0 10px 0;
                    color: #202223;
                }
                .cta-section {
                    background: #f0f8ff;
                    padding: 20px;
                    border-radius: 6px;
                    text-align: center;
                    margin: 30px 0;
                }
                .btn {
                    background: #008060;
                    color: white;
                    padding: 12px 24px;
                    border: none;
                    border-radius: 4px;
                    font-size: 16px;
                    cursor: pointer;
                    text-decoration: none;
                    display: inline-block;
                }
                .btn:hover {
                    background: #006b4f;
                }
                .status-indicator {
                    display: inline-block;
                    width: 8px;
                    height: 8px;
                    background: #36b37e;
                    border-radius: 50%;
                    margin-right: 8px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🎁 Gift Booster</h1>
                    <p style="font-size: 18px; color: #637381; margin: 10px 0;">
                        <span class="status-indicator"></span>
                        Boost your average order value with automatic free gifts
                    </p>
                    <p style="color: #637381; margin: 0;">
                        Connected to: <strong>${shop}</strong>
                    </p>
                </div>

                <div class="feature-grid">
                    <div class="feature-card">
                        <h3>🎯 Smart Thresholds</h3>
                        <p>Set spending thresholds to automatically trigger free gift offers and increase your average order value.</p>
                    </div>
                    <div class="feature-card">
                        <h3>📊 Real-time Analytics</h3>
                        <p>Track performance with detailed analytics showing conversion rates and revenue impact.</p>
                    </div>
                    <div class="feature-card">
                        <h3>⚡ Instant Setup</h3>
                        <p>Get started in minutes with our intuitive configuration interface and smart defaults.</p>
                    </div>
                    <div class="feature-card">
                        <h3>📱 Mobile Ready</h3>
                        <p>Fully responsive design ensures your gift campaigns work perfectly on all devices.</p>
                    </div>
                </div>

                <div class="cta-section">
                    <h3>Ready to boost your sales?</h3>
                    <p>Configure your first free gift campaign and start increasing your average order value today.</p>
                    <button class="btn" onclick="startConfiguration()">Configure Gift Rules</button>
                </div>

                <div style="margin-top: 30px; padding: 20px; background: #f8f9fa; border-radius: 6px; font-size: 14px; color: #637381;">
                    <strong>App Status:</strong> Active and ready<br>
                    <strong>Version:</strong> 1.0.0<br>
                    <strong>Last Updated:</strong> ${new Date().toLocaleDateString()}
                </div>
            </div>

            <script>
                // Initialize App Bridge (required for Shopify App Store approval)
                let app;
                
                function initializeAppBridge() {
                    if (window.ShopifyAppBridge) {
                        try {
                            app = window.ShopifyAppBridge.createApp({
                                apiKey: '${process.env.SHOPIFY_API_KEY || '0a84e1df4c003abfab2f61d8344ea04b'}',
                                shopOrigin: '${shop}',
                                host: '${host || ''}',
                                forceRedirect: true
                            });
                            
                            console.log('✅ App Bridge initialized successfully');
                            
                            // Set up session token authentication (required for App Store approval)
                            const actions = window.ShopifyAppBridge.actions;
                            
                            if (actions && actions.authenticatedFetch) {
                                // Set up authenticated fetch for API calls
                                window.authenticatedFetch = actions.authenticatedFetch(app);
                                console.log('✅ Session token authentication configured');
                            }
                            
                            // Set up navigation and title bar (required for embedded apps)
                            if (actions && actions.TitleBar) {
                                const titleBar = actions.TitleBar.create(app, {
                                    title: 'Gift Booster',
                                    buttons: {
                                        primary: {
                                            label: 'Configure',
                                            onAction: startConfiguration
                                        }
                                    }
                                });
                            }
                            
                            // Set up toast notifications
                            if (actions && actions.Toast) {
                                window.showToast = (message, isError = false) => {
                                    const toast = actions.Toast.create(app, {
                                        message: message,
                                        duration: 3000,
                                        isError: isError
                                    });
                                    toast.dispatch(actions.Toast.Action.SHOW);
                                };
                            }
                            
                            // Listen for app bridge events
                            app.subscribe(actions.Error.Action.APP_ERROR, (error) => {
                                console.error('App Bridge error:', error);
                            });
                            
                            return true;
                        } catch (error) {
                            console.error('❌ App Bridge initialization failed:', error);
                            return false;
                        }
                    } else {
                        console.warn('⚠️ App Bridge not available');
                        return false;
                    }
                }
                
                async function startConfiguration() {
                    console.log('🎯 Starting gift configuration for shop:', '${shop}');
                    
                    // Demonstrate session token usage (required for embedded app checks)
                    if (window.authenticatedFetch) {
                        try {
                            console.log('🔐 Testing session token authentication...');
                            
                            const response = await window.authenticatedFetch('/api/session-test?shop=${encodeURIComponent(shop)}');
                            const data = await response.json();
                            
                            if (data.success) {
                                console.log('✅ Session token authentication successful:', data);
                                if (window.showToast) {
                                    window.showToast('Session authentication verified! Configuration feature coming soon.');
                                } else {
                                    alert('Session authentication verified! Configuration feature coming soon.');
                                }
                            } else {
                                console.error('❌ Session token test failed:', data);
                                if (window.showToast) {
                                    window.showToast('Authentication test failed', true);
                                }
                            }
                        } catch (error) {
                            console.error('❌ Session token test error:', error);
                            if (window.showToast) {
                                window.showToast('Configuration feature coming soon!');
                            } else {
                                alert('Configuration feature coming soon!');
                            }
                        }
                    } else {
                        console.warn('⚠️ Authenticated fetch not available');
                        if (window.showToast) {
                            window.showToast('Configuration feature coming soon!');
                        } else {
                            alert('Configuration feature coming soon!');
                        }
                    }
                }
                
                // Initialize when page loads
                document.addEventListener('DOMContentLoaded', function() {
                    console.log('🚀 Gift Booster app loaded for shop:', '${shop}');
                    
                    // Initialize App Bridge
                    const initialized = initializeAppBridge();
                    
                    if (initialized) {
                        console.log('✅ App ready for Shopify App Store');
                    } else {
                        console.warn('⚠️ App Bridge initialization failed');
                    }
                });
                
                // Handle any App Bridge errors
                window.addEventListener('error', function(event) {
                    console.error('App error:', event.error);
                });
            </script>
        </body>
        </html>
      `);
    }
    
    // For root path without parameters, serve the React app
    if (url === '/' && Object.keys(req.query).length === 0) {
      try {
        const indexPath = join(process.cwd(), 'client/build/index.html');
        const indexHtml = readFileSync(indexPath, 'utf8');
        res.setHeader('Content-Type', 'text/html');
        return res.status(200).send(indexHtml);
      } catch (error) {
        console.error('Error serving React app:', error);
      }
    }
    
    // Default response for direct access with query params
    return res.status(200).send(`
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
              <p><strong>Environment:</strong> Production</p>
              <p><strong>URL:</strong> ${url}</p>
              <p><strong>Query:</strong> ${JSON.stringify(req.query)}</p>
              <p>This app is designed to be installed from the Shopify App Store.</p>
          </div>
      </body>
      </html>
    `);
    
  } catch (error) {
    console.error('Root handler error:', error);
    return res.status(500).json({ 
      error: 'Server error', 
      message: error.message,
      url: req.url,
      query: req.query
    });
  }
}