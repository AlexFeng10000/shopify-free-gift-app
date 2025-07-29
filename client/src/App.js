import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from '@shopify/polaris';
import '@shopify/polaris/build/esm/styles.css';

import Dashboard from './components/Dashboard';
import Analytics from './components/Analytics';
import GiftTiers from './components/GiftTiers';

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/gift-tiers" element={<GiftTiers />} />
          <Route path="/analytics" element={<Analytics />} />
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;