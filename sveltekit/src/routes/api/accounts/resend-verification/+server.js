/**
 * Merchant Accounts API - Resend Verification Endpoint
 * Handles proxying requests to the backend API for resending verification codes
 */

import { json } from '@sveltejs/kit';
import { apiConfig } from '$lib/config/api';

/**
 * Handle POST requests for resending verification code
 * @param {{ request: Request, fetch: Function }} event The request event
 */
export async function POST({ request, fetch }) {
  try {
    // Get the request body
    const data = await request.json();
    
    if (!data.email) {
      return json({ message: 'Email is required' }, { status: 400 });
    }
    
    // Forward the request to the backend API
    const response = await fetch(`${apiConfig.apiBaseUrl}merchants/resend-verification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    
    // If the response is not ok, throw an error
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: 'An unknown error occurred'
      }));
      
      return json(errorData, { status: response.status });
    }
    
    // Return the response data
    const responseData = await response.json();
    return json(responseData);
  } catch (error) {
    console.error('Error in resend verification API:', error);
    return json(
      { message: error instanceof Error ? error.message : 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
