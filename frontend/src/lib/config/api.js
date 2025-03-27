/**
 * API Configuration for Frontend
 * 
 * Provides configuration for API calls and mock behavior
 */

// API Configuration object
export const apiConfig = {
  // API Base URL - in a real app this would be set via env vars
  apiBaseUrl: '/api',
  
  // Whether to use mock APIs instead of real APIs
  useMock: true,
  
  // Simulated delay for mock APIs in milliseconds
  mockDelay: 500,
  
  // Configuration for mock behavior
  mockBehavior: {
    // Whether to simulate random failures for testing error handling
    simulateRandomFailures: false,
    
    // Probability of random failure (0-1)
    failureProbability: 0.05
  }
};

/**
 * Check if we should use the mock API
 * @returns {boolean} Whether to use the mock API
 */
export function useMockApi() {
  return apiConfig.useMock;
}

/**
 * Get the API configuration
 * @returns {typeof apiConfig} The API configuration
 */
export function getApiConfig() {
  return apiConfig;
}

/**
 * Update API configuration
 * @param {Partial<typeof apiConfig>} newConfig - New configuration to merge
 */
export function updateApiConfig(newConfig) {
  Object.assign(apiConfig, newConfig);
}
