/**
 * Utility for checking connectivity to the backend server
 */

/**
 * Performs a simple connectivity check to the backend server
 * @param {string} backendUrl - The URL of the backend server
 * @returns {Promise<boolean>} True if connected, false if not
 */
export const checkBackendConnection = async (backendUrl = 'http://localhost:8000') => {
  try {
    console.log('Checking backend connection to:', backendUrl);
    
    // Try multiple endpoints to ensure at least one works
    const endpoints = [
      '/api/health',
      '/api/health/debug/users'
    ];
    
    // Use a simple HEAD request with shorter timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    
    // Try the health endpoint first
    try {
      const response = await fetch(`${backendUrl}${endpoints[0]}`, {
        method: 'HEAD',
        signal: controller.signal,
        // Include credentials to ensure cookies are sent
        credentials: 'include',
        // No-cors mode to handle CORS issues more gracefully
        mode: 'no-cors'
      });
      
      clearTimeout(timeoutId);
      console.log('Backend health check succeeded');
      return true;
    } catch (healthError) {
      console.log('Health endpoint failed, trying fallback:', healthError.message);
      
      // If health check fails, try an actual GET request as fallback
      try {
        const secondController = new AbortController();
        const secondTimeoutId = setTimeout(() => secondController.abort(), 3000);
        
        // Try a GET request to users endpoint as fallback
        await fetch(`${backendUrl}${endpoints[1]}`, {
          signal: secondController.signal,
          credentials: 'include'
        });
        
        clearTimeout(secondTimeoutId);
        console.log('Backend users endpoint check succeeded');
        return true;
      } catch (usersError) {
        console.error('All backend checks failed');
        return false;
      }
    }
  } catch (error) {
    console.error('Backend connection check error:', error.message);
    return false;
  }
};

/**
 * Checks if the device has internet connectivity
 * @returns {Promise<boolean>} True if connected, false otherwise
 */
export const checkInternetConnection = async () => {
  try {
    // Try multiple sites to reduce false negatives
    const sites = [
      'https://www.google.com/generate_204',
      'https://www.apple.com/library/test/success.html',
      'https://www.cloudflare.com/cdn-cgi/trace'
    ];
    
    // Use the navigator.onLine as a first quick check
    if (navigator.onLine) {
      console.log('Navigator reports online status');
      
      // Try one of the sites as a secondary check
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);
        
        // Try the first site only - if this fails, we'll still return true
        // based on navigator.onLine to reduce false negatives
        await fetch(sites[0], {
          method: 'HEAD',
          signal: controller.signal,
          mode: 'no-cors' // This allows requests to succeed even without CORS headers
        });
        
        clearTimeout(timeoutId);
      } catch (fetchError) {
        console.log('Fetch check failed, but navigator reports online');
        // We still consider online if navigator.onLine is true
      }
      
      return true;
    }
    
    // If navigator says we're offline, do a more thorough check
    console.log('Navigator reports offline, performing additional checks');
    
    // Try all sites in parallel
    const results = await Promise.allSettled(sites.map(site => {
      return new Promise(async (resolve) => {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => {
            controller.abort();
            resolve(false);
          }, 2000);
          
          await fetch(site, { 
            method: 'HEAD', 
            signal: controller.signal,
            mode: 'no-cors'
          });
          
          clearTimeout(timeoutId);
          resolve(true);
        } catch (e) {
          resolve(false);
        }
      });
    }));
    
    // If any site is reachable, we have internet
    return results.some(result => result.status === 'fulfilled' && result.value === true);
  } catch (error) {
    console.error('Internet connection check failed:', error);
    // Fall back to navigator.onLine if our checks throw an exception
    return navigator.onLine;
  }
};
