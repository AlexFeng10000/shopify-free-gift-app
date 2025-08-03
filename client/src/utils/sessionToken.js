import { getSessionToken } from '@shopify/app-bridge/utilities';

// Utility to get session token for API requests
export const getAuthenticatedFetch = (app) => {
  return async (url, options = {}) => {
    try {
      const token = await getSessionToken(app);
      
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
      };

      return fetch(url, {
        ...options,
        headers,
      });
    } catch (error) {
      console.error('Failed to get session token:', error);
      throw error;
    }
  };
};

// Utility to make authenticated axios requests
export const getAuthenticatedAxios = (app) => {
  return async (config) => {
    try {
      const token = await getSessionToken(app);
      
      return {
        ...config,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          ...config.headers,
        },
      };
    } catch (error) {
      console.error('Failed to get session token:', error);
      throw error;
    }
  };
};