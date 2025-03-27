import { loadMerchantData } from '$lib/stores/merchantStore';

/** @type {import('./$types').PageLoad} */
export async function load({ params }) {
  try {
    // Load merchant data by ID from the route parameter
    // This will store the data in the merchant store
    await loadMerchantData(params.user_id);
    
    return {
      userId: params.user_id,
      userType: 'merchant'
    };
  } catch (error) {
    // In case of error, still return the params
    // Error handling will be done in the component
    console.error('Error loading merchant data:', error);
    return {
      userId: params.user_id,
      userType: 'merchant',
      error: error.message
    };
  }
}

export const ssr = false;
