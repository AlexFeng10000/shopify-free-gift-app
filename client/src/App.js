import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from '@shopify/polaris';
import { Provider as AppBridgeProvider } from '@shopify/app-bridge-react';
import '@shopify/polaris/build/esm/styles.css';

import AuthWrapper from './components/AuthWrapper';
import Dashboard from './components/Dashboard';
import Analytics from './components/Analytics';
import GiftTiers from './components/GiftTiers';

function App() {
  // Get URL parameters for App Bridge configuration
  const urlParams = new URLSearchParams(window.location.search);
  const host = urlParams.get('host');
  const shop = urlParams.get('shop');
  
  // Check if we're in Shopify admin context (even without host parameter)
  const isInShopifyAdmin = window.location !== window.parent.location || 
                          (window.location.ancestorOrigins && window.location.ancestorOrigins.length > 0) ||
                          document.referrer.includes('shopify.com');

  // Generate host parameter if missing but we're in Shopify context
  let effectiveHost = host;
  if (!host && shop && isInShopifyAdmin) {
    // Generate host parameter from shop domain
    const shopDomain = shop.includes('.myshopify.com') ? shop : `${shop}.myshopify.com`;
    effectiveHost = btoa(`${shopDomain}/admin`).replace(/=/g, '');
    console.log('🔧 Generated host parameter for embedded context:', effectiveHost);
  }

  // App Bridge configuration
  const appBridgeConfig = {
    apiKey: '0a84e1df4c003abfab2f61d8344ea04b',
    host: effectiveHost,
    forceRedirect: true,
  };

  // Always use App Bridge Provider if we have shop parameter and are in Shopify context
  const shouldUseAppBridge = (effectiveHost || isInShopifyAdmin) && shop;

  console.log('🔍 App Bridge Debug:', {
    host: host,
    effectiveHost: effectiveHost,
    shop: shop,
    isInShopifyAdmin: isInShopifyAdmin,
    shouldUseAppBridge: shouldUseAppBridge
  });

  return (
    <AppProvider>
      {shouldUseAppBridge ? (
        <AppBridgeProvider config={appBridgeConfig}>
          <AuthWrapper>
            <Router>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/gift-tiers" element={<GiftTiers />} />
                <Route path="/analytics" element={<Analytics />} />
              </Routes>
            </Router>
          </AuthWrapper>
        </AppBridgeProvider>
      ) : (
        <AuthWrapper>
          <Router>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/gift-tiers" element={<GiftTiers />} />
              <Route path="/analytics" element={<Analytics />} />
            </Routes>
          </Router>
        </AuthWrapper>
      )}
    </AppProvider>
  );
}

export default App;