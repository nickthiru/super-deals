export async function load({ params, locals }) {
  console.log('Inside +page.server.js load function');
  console.log('Params:', params);
  console.log('Locals:', locals);

  const user = locals.user;

  // Assuming the hooks have already validated the user
  // We can focus on fetching necessary data for the page

  // Fetch merchant-specific data here
  // const merchantData = await fetchMerchantData(user.userId);

  return {
    user,
    // merchantData,
  };
}