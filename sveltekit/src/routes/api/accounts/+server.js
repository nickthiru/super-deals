/**
 * Merchant Accounts API Server Endpoints
 * Handles proxying requests to the backend API for merchant account operations
 */

import { json } from '@sveltejs/kit';
import { dev } from '$app/environment';
import { apiConfig } from '$lib/config/api';

// Define API endpoints for different operations
const ENDPOINTS = {
	SIGN_UP: 'accounts',
	GET_ACCOUNT: 'accounts/{id}',
	RESEND_VERIFICATION: 'accounts/resend-verification'
};

/**
 * Handle POST requests for merchant sign-up
 * @param {{ request: Request, fetch: Function }} event The request event
 */
export async function POST({ request, fetch }) {
	try {
		// Get the request body
		const data = await request.json();

		// Forward the request to the backend API
		const response = await fetch(`${apiConfig.apiBaseUrl}${ENDPOINTS.SIGN_UP}`, {
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
		console.error('Error in merchant sign-up API:', error);
		return json(
			{ message: error instanceof Error ? error.message : 'An unexpected error occurred' },
			{ status: 500 }
		);
	}
}

/**
 * Handle GET requests for merchant account information
 * @param {{ params: Record<string, string>, url: URL, fetch: Function }} event The request event
 */
export async function GET({ params, url, fetch }) {
	try {
		// Get the merchant ID from the URL parameters or query string
		const merchantId = params.merchantId || url.searchParams.get('id');

		if (!merchantId) {
			return json({ message: 'Merchant ID is required' }, { status: 400 });
		}

		// Forward the request to the backend API
		const response = await fetch(`${apiConfig.apiBaseUrl}${ENDPOINTS.GET_ACCOUNT}/${merchantId}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
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
		console.error('Error in get merchant API:', error);
		return json(
			{ message: error instanceof Error ? error.message : 'An unexpected error occurred' },
			{ status: 500 }
		);
	}
}
