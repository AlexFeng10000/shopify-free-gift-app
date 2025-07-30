import React, { useState, useEffect } from 'react';
import {
  Page,
  Layout,
  Card,
  Spinner,
  Stack,
  Text,
  Banner,
  Button
} from '@shopify/polaris';

function AuthWrapper({ children }) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [shopDomain, setShopDomain] = useState(null);
  const [demoMode, setDemoMode] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // Get shop from URL parameters
      const urlParams = new URLSearchParams(window.location.search);
      const shop = urlParams.get('shop');
      const demo = urlParams.get('demo');
      const installed = urlParams.get('installed');

      if (demo === 'true') {
        // Demo mode - no authentication required
        setDemoMode(true);
        setAuthenticated(true);
        setShopDomain(shop || 'demo-store.myshopify.com');
        setLoading(false);
        return;
      }

      if (shop) {
        // We have a shop parameter, assume authenticated
        setShopDomain(shop);
        setAuthenticated(true);
        
        if (installed === 'true') {
          // Show success message for fresh installations
          setTimeout(() => {
            // Clear URL parameters after showing success
            window.history.replaceState({}, document.title, window.location.pathname);
          }, 3000);
        }
      } else {
        // For development/testing - allow demo access
        if (window.location.hostname === 'localhost' || window.location.search.includes('demo=true')) {
          setDemoMode(true);
          setAuthenticated(true);
          setShopDomain('demo-store.myshopify.com');
        } else {
          // Production - require shop parameter
          setAuthenticated(false);
          setError('No shop domain found. Please install the app from the Shopify App Store.');
        }
      }

      setLoading(false);
    } catch (err) {
      console.error('Authentication check failed:', err);
      setError('Authentication failed. Please try again.');
      setLoading(false);
    }
  };

  const handleInstallApp = () => {
    const shop = prompt('Enter your shop domain (e.g., mystore.myshopify.com):');
    if (shop) {
      window.location.href = `/auth/install?shop=${shop}`;
    }
  };

  if (loading) {
    return (
      <Page title="Loading...">
        <Layout>
          <Layout.Section>
            <Card sectioned>
              <Stack alignment="center">
                <Spinner size="large" />
                <Text>Authenticating with Shopify...</Text>
              </Stack>
            </Card>
          </Layout.Section>
        </Layout>
      </Page>
    );
  }

  if (error) {
    return (
      <Page title="Authentication Required">
        <Layout>
          <Layout.Section>
            <Banner status="critical" title="Authentication Error">
              <p>{error}</p>
            </Banner>
          </Layout.Section>
          <Layout.Section>
            <Card sectioned>
              <Stack vertical spacing="loose">
                <Text variation="strong">How to install Gift Booster:</Text>
                <Text>1. Go to the Shopify App Store</Text>
                <Text>2. Search for "Gift Booster"</Text>
                <Text>3. Click "Add app" to install</Text>
                <Text>4. You'll be redirected here automatically</Text>
                <Button primary onClick={handleInstallApp}>
                  Install App Manually
                </Button>
              </Stack>
            </Card>
          </Layout.Section>
        </Layout>
      </Page>
    );
  }

  if (!authenticated) {
    return (
      <Page title="Welcome to Gift Booster">
        <Layout>
          <Layout.Section>
            <Card sectioned>
              <Stack vertical spacing="loose">
                <Text variation="strong">Welcome to Gift Booster!</Text>
                <Text>Please install the app from the Shopify App Store to get started.</Text>
                <Button primary onClick={handleInstallApp}>
                  Install App
                </Button>
              </Stack>
            </Card>
          </Layout.Section>
        </Layout>
      </Page>
    );
  }

  // Successfully authenticated - render the main app
  return (
    <div>
      {demoMode && (
        <Banner status="info" title="Demo Mode">
          <p>You're viewing Gift Booster in demo mode. Install the app on your Shopify store for full functionality.</p>
        </Banner>
      )}
      
      {/* Pass shop domain to child components via context or props */}
      <div data-shop-domain={shopDomain}>
        {children}
      </div>
    </div>
  );
}

export default AuthWrapper;