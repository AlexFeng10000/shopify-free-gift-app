// Timeout wrapper for promises
const withTimeout = (promise, timeoutMs, timeoutMessage = 'Operation timed out') => {
  return Promise.race([
    promise,
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error(timeoutMessage)), timeoutMs)
    )
  ]);
};

// App Bridge v3 compatible session token utilities
export const getSessionToken = async (app) => {
  if (!app) {
    throw new Error('App Bridge instance not available');
  }

  console.log('🔍 App Bridge instance analysis:', {
    hasIdToken: !!(app.idToken),
    hasDispatch: !!(app.dispatch),
    hasGetState: !!(app.getState),
    hasFeaturesAvailable: !!(app.featuresAvailable),
    hasAuthenticatedFetch: !!(app.authenticatedFetch),
    allMethods: Object.keys(app).filter(key => typeof app[key] === 'function')
  });

  // Try different methods to get session token based on App Bridge version
  try {
    // Method 1: Try App Bridge v3 session token via dispatch (most reliable for v3)
    if (app.dispatch && typeof app.dispatch === 'function') {
      console.log('🔄 Getting session token via App Bridge dispatch');
      try {
        // Use the proper App Bridge v3 session token request
        const token = await new Promise((resolve, reject) => {
          const timeout = setTimeout(() => {
            reject(new Error('Session token dispatch timeout'));
          }, 5000);

          // Listen for session token response
          const unsubscribe = app.subscribe((state) => {
            if (state && state.sessionToken) {
              clearTimeout(timeout);
              unsubscribe();
              resolve(state.sessionToken);
            }
          });

          // Request session token
          app.dispatch({
            type: 'APP::SESSION_TOKEN::REQUEST'
          });
        });

        if (token) {
          console.log('✅ Session token obtained via dispatch');
          return token;
        }
      } catch (dispatchError) {
        console.log('⚠️ Dispatch session token failed:', dispatchError.message);
      }
    }

    // Method 2: Try the idToken method (App Bridge v3) with timeout
    if (app.idToken && typeof app.idToken === 'function') {
      console.log('🔄 Getting session token via app.idToken()');
      try {
        const token = await withTimeout(app.idToken(), 3000, 'idToken timeout');
        if (token) {
          console.log('✅ Session token obtained via idToken');
          return token;
        }
      } catch (idTokenError) {
        console.log('⚠️ idToken method failed:', idTokenError.message);
      }
    }

    // Method 3: Try legacy getSessionToken import with timeout
    try {
      const { getSessionToken: legacyGetSessionToken } = await import('@shopify/app-bridge/utilities');
      console.log('🔄 Getting session token via legacy method');
      const token = await withTimeout(
        legacyGetSessionToken(app), 
        3000, 
        'Legacy getSessionToken timeout'
      );
      if (token) {
        console.log('✅ Session token obtained via legacy method');
        return token;
      }
    } catch (importError) {
      console.log('⚠️ Legacy getSessionToken failed:', importError.message);
    }

    // Method 4: Try creating authenticated fetch function (App Bridge v3 approach)
    try {
      console.log('🔄 Trying to create authenticated fetch function');
      
      // Import the authenticatedFetch utility from App Bridge
      const { authenticatedFetch } = await import('@shopify/app-bridge/utilities');
      
      if (authenticatedFetch && typeof authenticatedFetch === 'function') {
        console.log('🔄 Creating authenticated fetch with app instance');
        const authFetch = authenticatedFetch(app);
        
        if (authFetch && typeof authFetch === 'function') {
          console.log('✅ Authenticated fetch created successfully - session tokens working');
          // Store the authenticated fetch function for later use
          window.authenticatedFetch = authFetch;
          return 'authenticated-fetch-created';
        }
      }
    } catch (authFetchError) {
      console.log('⚠️ Authenticated fetch creation failed:', authFetchError.message);
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