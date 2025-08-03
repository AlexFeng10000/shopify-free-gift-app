import { useContext } from 'react';
import { Context } from '@shopify/app-bridge-react';

/**
 * Safe wrapper for useAppBridge that handles cases where App Bridge is not available
 * This prevents React Hooks rules violations and context errors
 */
export const useAppBridgeSafe = () => {
  try {
    // Try to get the App Bridge context directly
    const app = useContext(Context);
    
    // Check if we have a valid App Bridge instance
    if (app && typeof app === 'object') {
      return { app, error: null };
    } else {
      return { app: null, error: 'App Bridge context not available' };
    }
  } catch (e) {
    // Context not available
    return { app: null, error: e.message };
  }
};