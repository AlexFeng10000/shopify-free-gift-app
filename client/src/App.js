import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from '@shopify/polaris';
import '@shopify/polaris/build/esm/styles.css';

import AuthWrapper from './components/AuthWrapper';
import Dashboard from './components/Dashboard';
import Analytics from './components/Analytics';
import GiftTiers from './components/GiftTiers';

function App() {
  return (
    <AppProvider>
      <AuthWrapper>
        <Router>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/gift-tiers" element={<GiftTiers />} />
            <Route path="/analytics" element={<Analytics />} />
          </Routes>
        </Router>
      </AuthWrapper>
    </AppProvider>
  );
}

export default App;