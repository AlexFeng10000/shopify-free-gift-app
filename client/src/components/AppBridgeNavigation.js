import { useEffect } from 'react';
import { useAppBridge } from '@shopify/app-bridge-react';

function AppBridgeNavigation() {
  const app = useAppBridge();

  useEffect(() => {
    if (!app) return;

    try {
      console.log('🔄 Setting up App Bridge unified admin integration...');
      
      // For App Bridge v3, we use the app instance to set up proper navigation
      // The unified admin integration is handled automatically by App Bridge
      // when the app is properly configured with the correct host parameter
      
      // Set up app metadata for unified admin
      if (app.dispatch && typeof app.dispatch === 'function') {
        try {
          app.dispatch({
            type: 'APP::SET_TITLE',
            payload: {
              title: 'Gift Booster'
            }
          });
          
          console.log('✅ App Bridge unified admin integration configured');
        } catch (dispatchError) {
          console.log('⚠️ App Bridge dispatch failed:', dispatchError.message);
        }
      }

      // Set up navigation state management
      const handleNavigation = (event) => {
        console.log('🔄 Navigation event:', event);
      };

      // Listen for navigation events
      window.addEventListener('popstate', handleNavigation);

      return () => {
        window.removeEventListener('popstate', handleNavigation);
      };
    } catch (error) {
      console.log('⚠️ App Bridge navigation setup failed:', error);
    }
  }, [app]);

  return null; // This component doesn't render anything
}

export default AppBridgeNavigation;