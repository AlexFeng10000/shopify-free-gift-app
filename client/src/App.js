import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from '@shopify/polaris';
import { Provider as AppBridgeProvider } from '@shopify/app-bridge-react';
import '@shopify/polaris/build/esm/styles.css';

import AuthWrapper from './components/AuthWrapper';
import Dashboard from './components/Dashboard';
import Analytics from './components/Analytics';
import GiftTiers from './components/GiftTiers';
import OAuthCallback from './components/OAuthCallback';
import AppBridgeNavigation from './components/AppBridgeNavigation';

function App() {
  // Get URL parameters for App Bridge configuration
  const urlParams = new URLSearchParams(window.location.search);
  let host = urlParams.get('host');
  const shop = urlParams.get('shop');
  
  // Check if we're in Shopify admin context (even without host parameter)
  const isInShopifyAdmin = window.location !== window.parent.location || 
                          (window.location.ancestorOrigins && window.location.ancestorOrigins.length > 0) ||
                          document.referrer.includes('shopify.com');

  // For embedded app compliance, we should NOT generate host parameters client-side
  // The host parameter MUST come from Shopify's OAuth flow
  console.log('🔍 Host parameter analysis:', {
    hostFromUrl: host,
    shopFromUrl: shop,
    isInShopifyAdmin: isInShopifyAdmin,
    referrer: document.referrer
  });

  // Only use the host parameter if it came from the URL (OAuth flow)
  let effectiveHost = host;

  // App Bridge configuration - MUST use host from OAuth flow for compliance
  const appBridgeConfig = {
    apiKey: '0a84e1df4c003abfab2f61d8344ea04b',
    host: effectiveHost, // Only use host parameter from OAuth flow
    forceRedirect: true,
  };

  // Log App Bridge configuration for debugging
  console.log('🔧 App Bridge Configuration:', {
    apiKey: appBridgeConfig.apiKey ? 'Set' : 'Missing',
    host: appBridgeConfig.host ? 'Present' : 'Missing',
    hostValue: appBridgeConfig.host,
    forceRedirect: appBridgeConfig.forceRedirect
  });

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
          <AppBridgeNavigation />
          <AuthWrapper>
            <Router>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/gift-tiers" element={<GiftTiers />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/auth/callback" element={<OAuthCallback />} />
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
              <Route path="/auth/callback" element={<OAuthCallback />} />
            </Routes>
          </Router>
        </AuthWrapper>
      )}
    </AppProvider>
  );
}

export default App;