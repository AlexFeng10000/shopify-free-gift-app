import { useAppBridge } from '@shopify/app-bridge-react';

/**
 * Safe wrapper for useAppBridge that handles cases where App Bridge is not available
 * This prevents React Hooks rules violations and context errors
 */
export const useAppBridgeSafe = () => {
  try {
    // Try to get the App Bridge instance using the official hook
    const app = useAppBridge();
    
    console.log('🔍 useAppBridgeSafe - App Bridge instance:', app);
    
    // Check if we have a valid App Bridge instance
    if (app && typeof app === 'object') {
      console.log('✅ useAppBridgeSafe - Valid App Bridge instance found');
      return { app, error: null };
    } else {
      console.log('❌ useAppBridgeSafe - No valid App Bridge instance');
      return { app: null, error: 'App Bridge context not available' };
    }
  } catch (e) {
    // Context not available
    console.log('❌ useAppBridgeSafe - Error:', e.message);
    return { app: null, error: e.message };
  }
};