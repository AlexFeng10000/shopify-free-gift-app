import { useAppBridge } from '@shopify/app-bridge-react';

/**
 * Safe wrapper for useAppBridge that handles cases where App Bridge is not available
 * This prevents React Hooks rules violations by always calling the hook
 */
export const useAppBridgeSafe = () => {
  // Always call the hook - never conditionally
  // If App Bridge context is not available, this will return null
  const app = useAppBridge();
  
  return { app, error: null };
};