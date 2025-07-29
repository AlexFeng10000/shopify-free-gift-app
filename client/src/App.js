import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from '@shopify/polaris';
import '@shopify/polaris/build/esm/styles.css';

import Dashboard from './components/Dashboard';
import Settings from './components/Settings';
import Analytics from './components/Analytics';

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/analytics" element={<Analytics />} />
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;