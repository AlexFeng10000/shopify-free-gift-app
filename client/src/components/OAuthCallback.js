import React, { useEffect, useState } from 'react';
import { Page, Card, Spinner, Stack, Text } from '@shopify/polaris';

function OAuthCallback() {
  const [status, setStatus] = useState('processing');
  const [message, setMessage] = useState('Processing OAuth callback...');

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const shop = urlParams.get('shop');
        const state = urlParams.get('state');
        const hmac = urlParams.get('hmac');

        console.log('🔄 OAuth callback received:', { code: !!code, shop, state, hmac: !!hmac });

        if (!code || !shop) {
          throw new Error('Missing required OAuth parameters');
        }

        // Exchange code for access token
        const response = await fetch('/api/auth/callback', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            code,
            shop,
            state,
            hmac
          })
        });

        if (!response.ok) {
          throw new Error(`OAuth exchange failed: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('✅ OAuth exchange successful:', data.success ? 'Token obtained' : 'Response received');

        // Redirect to app with proper embedded parameters
        const shopDomain = shop.includes('.myshopify.com') ? shop : `${shop}.myshopify.com`;
        const host = btoa(`${shopDomain}/admin`).replace(/=/g, '');
        
        const appUrl = `/?shop=${shop}&host=${host}&installed=true`;
        console.log('🔄 Redirecting to app:', appUrl);
        
        setStatus('success');
        setMessage('Authentication successful! Redirecting to app...');
        
        // Redirect after a short delay
        setTimeout(() => {
          window.location.href = appUrl;
        }, 2000);

      } catch (error) {
        console.error('❌ OAuth callback error:', error);
        setStatus('error');
        setMessage(`Authentication failed: ${error.message}`);
      }
    };

    handleOAuthCallback();
  }, []);

  return (
    <Page title="Authenticating">
      <Card sectioned>
        <Stack alignment="center" vertical>
          {status === 'processing' && <Spinner size="large" />}
          <Text variation={status === 'error' ? 'negative' : 'positive'}>
            {message}
          </Text>
          {status === 'error' && (
            <Text>
              Please try installing the app again from the Shopify App Store.
            </Text>
          )}
        </Stack>
      </Card>
    </Page>
  );
}

export default OAuthCallback;