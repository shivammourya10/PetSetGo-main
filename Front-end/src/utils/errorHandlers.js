/**
 * Utility functions for handling API errors consistently across the application
 */

/**
 * Formats error messages from API responses
 * @param {Error} error - The error object from axios or other source
 * @returns {Object} Formatted error with message and details
 */
export const formatApiError = (error) => {
  // Network errors (no response)
  if (!error.response) {
    return {
      message: error.message || 'Unable to connect to the server. Please check your internet connection.',
      details: error.message
    };
  }
  
  // Server error responses
  if (error.response.data && error.response.data.errors) {
    // Handle our API's error format
    const errors = error.response.data.errors;
    if (Array.isArray(errors) && errors.length > 0) {
      return {
        message: errors.map(err => err.msg || err.message).join(', '),
        isServerError: true,
        statusCode: error.response.status,
        details: error.response.data
      };
    }
  }
  
  // Default error format
  return {
    message: error.response?.data?.message || error.message || 'An unexpected error occurred',
    isServerError: !!error.response,
    statusCode: error.response?.status,
    details: error.response?.data || error.message
  };
};

/**
 * Shows an appropriate error notification to the user
 * @param {Error} error - The error object
 * @param {Function} setError - State setter for error message display
 */
export const handleApiError = (error, setError) => {
  const formattedError = formatApiError(error);
  console.error('API Error:', formattedError);
  
  // Set the error in the component state if setError is provided
  if (typeof setError === 'function') {
    setError(formattedError.message);
  }
  
  // Return the formatted error in case the caller wants to do additional handling
  return formattedError;
};

/**
 * Determines if the backend server is running
 * @returns {Promise<boolean>} True if server is reachable
 */
export const checkServerConnection = async (baseUrl = 'http://localhost:3000') => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    // Make a simple request to the server root or health endpoint
    const response = await fetch(`${baseUrl}/api/health`, {
      method: 'GET',
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    console.error('Server connection check failed:', error);
    return false;
  }
};
