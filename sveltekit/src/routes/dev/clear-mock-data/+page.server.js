/**
 * Development utility to clear mock data
 * This file should only be used in development environments
 */

import { dev } from '$app/environment';
import { redirect } from '@sveltejs/kit';
import { _clearMockDataByEmail } from '$lib/services/mock/merchantService.js';

export const actions = {
  /**
   * Clear mock data for a specific email
   */
  default: async ({ request }) => {
    // Only allow in development mode
    if (!dev) {
      throw redirect(303, '/');
    }

    const formData = await request.formData();
    const email = formData.get('email')?.toString() || '';

    if (!email) {
      return {
        success: false,
        message: 'Email is required'
      };
    }

    try {
      // Call the clear function directly
      const result = _clearMockDataByEmail(email);
      return result;
    } catch (error) {
      console.error('Error clearing mock data:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
};
