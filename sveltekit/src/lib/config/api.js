/**
 * API configuration
 */

// Default configuration
const defaultConfig = {
  useMockApi: true,
  apiBaseUrl: 'https://api.super-deals.com',
  mockDelay: 500, // Milliseconds to delay mock responses
  mockBehavior: {
    simulateRandomFailures: true,
    failureProbability: 0.05 // 5% chance of random failure
  }
};

// Get configuration from environment if available
const envConfig = {
  useMockApi: import.meta.env?.VITE_USE_MOCK_API === 'true',
  apiBaseUrl: import.meta.env?.VITE_API_URL,
  mockDelay: parseInt(import.meta.env?.VITE_MOCK_DELAY) || defaultConfig.mockDelay,
  mockBehavior: {
    simulateRandomFailures: import.meta.env?.VITE_SIMULATE_FAILURES === 'true',
    failureProbability: parseFloat(import.meta.env?.VITE_FAILURE_PROBABILITY) || defaultConfig.mockBehavior.failureProbability
  }
};

// Merge default with environment config
export const apiConfig = {
  ...defaultConfig,
  ...envConfig,
  mockBehavior: {
    ...defaultConfig.mockBehavior,
    ...envConfig.mockBehavior
  }
};

/**
 * Check if mock API should be used
 * @returns {boolean} True if mock API should be used
 */
export function useMockApi() {
  return apiConfig.useMockApi;
}

/**
 * Get API configuration
 * @returns {typeof apiConfig} API configuration
 */
export function getApiConfig() {
  return apiConfig;
}
