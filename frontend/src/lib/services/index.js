/**
 * API Services Factory
 * 
 * This module exports the appropriate implementation of each service
 * based on the API configuration (real or mock)
 */

import { useMockApi } from '$lib/config/api';

// Import real implementations
import * as realMerchantService from './api/merchantService';

// Import mock implementations
import * as mockMerchantService from './api/mock/merchantService';

/**
 * Get the appropriate merchant service implementation
 * @returns {typeof import('./api/merchantService')}
 */
export function getMerchantService() {
  return useMockApi() ? mockMerchantService : realMerchantService;
}

/**
 * Export merchant service methods
 */
export const merchantService = getMerchantService();
