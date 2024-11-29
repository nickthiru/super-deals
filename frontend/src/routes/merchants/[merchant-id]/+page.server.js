// frontend/src/routes/merchants/[merchantId]/dashboard/+page.server.js
import { redirect, error } from '@sveltejs/kit';
import jwt_decode from 'jwt-decode';
// import { SECRET_KEY } from '$env/static/private'; // Example of private environment variable

export async function load({ params, cookies }) {
  const accessToken = cookies.get('accessToken');

  if (!accessToken) {
    throw redirect(303, '/merchant/sign-in');
  }

  try {
    // Verify token using the secret key (if applicable)
    const decodedToken = jwt_decode(accessToken);
    const user = {
      id: decodedToken.sub,
      type: decodedToken['custom:userType'],
      merchantId: decodedToken['custom:merchantId'],
    };

    // Ensure the user is a merchant and the merchantId matches
    if (user.type !== 'merchant' || user.merchantId !== params.merchantId) {
      throw error(403, 'Access forbidden');
    }

    // Fetch merchant-specific data here, if needed
    const merchantData = await fetchMerchantData(user.merchantId, accessToken);

    return { user, merchantData };

  } catch (err) {
    console.error('Invalid token:', err);
    cookies.delete('accessToken');
    throw redirect(303, '/merchant/sign-in');
  }
}

async function fetchMerchantData(merchantId, token) {
  const response = await fetch(`${process.env.API_URL}/merchant/${merchantId}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch merchant data');
  }

  return await response.json();
}