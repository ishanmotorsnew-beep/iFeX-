/**
 * IFEX Frontend API Configuration
 * 
 * This file contains the API endpoint configuration for the frontend.
 * Update the API_URL based on your deployment setup.
 */

// Development
const DEV_API_URL = 'http://localhost:3000/api';

// Production - Update with your Render API URL
// Replace 'ifex-api' with your actual Render service name
const PROD_API_URL = 'https://ifex-api.onrender.com/api';

// Auto-detect environment
const API_URL = window.location.hostname === 'localhost' 
  ? DEV_API_URL 
  : PROD_API_URL;

// Export for use in your React components
window.API_CONFIG = {
  API_URL,
  DEV_API_URL,
  PROD_API_URL
};

console.log('API Configuration loaded:');
console.log('Environment:', window.location.hostname === 'localhost' ? 'Development' : 'Production');
console.log('API URL:', API_URL);
