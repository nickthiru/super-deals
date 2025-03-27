/**
 * Load data for the confirmation page
 * This runs on both server and client
 */
export function load({ url, data }) {
  // Get email from query params or data from server
  const email = url.searchParams.get('email') || data?.email || '';
  const userType = url.searchParams.get('userType') || data?.userType || 'merchant';
  
  return {
    email,
    userType
  };
}
