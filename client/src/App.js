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

  // App Bridge configuration
  const appBridgeConfig = {
    apiKey: '0a84e1df4c003abfab2f61d8344ea04b',
    host: host,
    forceRedirect: true,
  };

  return (
    <AppProvider>
      {host ? (
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