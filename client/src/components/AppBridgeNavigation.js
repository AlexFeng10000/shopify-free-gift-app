import { useEffect } from 'react';
import { useAppBridge } from '@shopify/app-bridge-react';
import { NavigationMenu } from '@shopify/app-bridge/actions';

function AppBridgeNavigation() {
  const app = useAppBridge();

  useEffect(() => {
    if (!app) return;

    try {
      // Create navigation menu for unified admin
      const navigationMenu = NavigationMenu.create(app, {
        items: [
          {
            id: 'dashboard',
            label: 'Dashboard',
            destination: '/',
          },
          {
            id: 'gift-tiers',
            label: 'Gift Tiers',
            destination: '/gift-tiers',
          },
          {
            id: 'analytics',
            label: 'Analytics',
            destination: '/analytics',
          },
        ],
      });

      console.log('✅ App Bridge navigation menu created');

      // Set up navigation handlers
      navigationMenu.subscribe(NavigationMenu.Action.SELECT, (payload) => {
        console.log('🔄 Navigation selected:', payload);
        
        // Handle navigation within the app
        if (payload.destination) {
          window.history.pushState({}, '', payload.destination);
          window.dispatchEvent(new PopStateEvent('popstate'));
        }
      });

      return () => {
        // Cleanup navigation menu
        try {
          navigationMenu.unsubscribe();
        } catch (e) {
          console.log('Navigation cleanup error:', e);
        }
      };
    } catch (error) {
      console.log('⚠️ App Bridge navigation setup failed:', error);
    }
  }, [app]);

  return null; // This component doesn't render anything
}

export default AppBridgeNavigation;