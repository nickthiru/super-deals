import backendOutputs from '../../../../backend/outputs.json';

const REST_API_URL = backendOutputs["BackendStackdevApiStackHttpStackA56AECB6"]["RestApiUrldev"];
console.log(`REST_API_URL: ${REST_API_URL}`);

/**
 * Send a request to the backend API
 * @param {Function} fetch - SvelteKit's fetch function
 * @param {string} path - API endpoint path
 * @param {Object} options - Fetch options
 * @param {string} [token] - Optional authentication token (should be accessToken for protected routes)
 * @returns {Promise<Response>} - Fetch response
 */
export default async function send(fetch, path, options = {}, token = null) {
  try {
    const url = `${REST_API_URL}${path}`;
    console.log('[API] Sending request to:', url);

    if (!options.headers) {
      options.headers = {};
    }

    if (token) {
      options.headers['Authorization'] = token;
    }

    console.log('[API] Request options:', JSON.stringify(options, null, 2));

    // Send the request and return the response
    return await fetch(url, options);
  } catch (error) {
    console.error('[API] Error in send function:', error);
    throw error;
  }
}