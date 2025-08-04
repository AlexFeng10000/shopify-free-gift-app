// App Bridge v3 compatible session token utilities
export const getSessionToken = async (app) => {
  if (!app) {
    throw new Error('App Bridge instance not available');
  }

  // Try different methods to get session token based on App Bridge version
  try {
    // Method 1: Try the idToken method (App Bridge v3)
    if (app.idToken && typeof app.idToken === 'function') {
      console.log('🔄 Getting session token via app.idToken()');
      const token = await app.idToken();
      if (token) {
        console.log('✅ Session token obtained via idToken');
        return token;
      }
    }

    // Method 2: Try dispatch method for session token
    if (app.dispatch && typeof app.dispatch === 'function') {
      console.log('🔄 Getting session token via dispatch');
      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Session token timeout'));
        }, 5000);

        try {
          app.dispatch({
            type: 'APP::SESSION_TOKEN::REQUEST',
            payload: {
              onSuccess: (token) => {
                clearTimeout(timeout);
                console.log('✅ Session token obtained via dispatch');
                resolve(token);
              },
              onError: (error) => {
                clearTimeout(timeout);
                reject(error);
              }
            }
          });
        } catch (dispatchError) {
          clearTimeout(timeout);
          reject(dispatchError);
        }
      });
    }

    // Method 3: Try legacy getSessionToken import
    try {
      const { getSessionToken: legacyGetSessionToken } = await import('@shopify/app-bridge/utilities');
      console.log('🔄 Getting session token via legacy method');
      const token = await legacyGetSessionToken(app);
      if (token) {
        console.log('✅ Session token obtained via legacy method');
        return token;
      }
    } catch (importError) {
      console.log('⚠️ Legacy getSessionToken not available');
    }

    throw new Error('No session token method available');
  } catch (error) {
    console.error('❌ Session token failed:', error);
    throw error;
  }
};

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
      console.error('Failed to get session token for fetch:', error);
      // Fallback to regular fetch without token
      return fetch(url, options);
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
      console.error('Failed to get session token for axios:', error);
      // Return config without token as fallback
      return config;
    }
  };
};