// frontend/src/routes/+page.js
import { redirect } from '@sveltejs/kit';
import { getCurrentUser } from 'aws-amplify/auth';

/** @type {import('./$types').PageLoad} */
export async function load() {
  try {
    // Check if user is authenticated
    const { signInDetails } = await getCurrentUser();
    const userType = signInDetails?.loginId?.userType;

    // Redirect based on user type
    if (userType === 'merchant') {
      return redirect(302, `/merchants/${signInDetails.userId}`);
    }
    
    // For customers and unauthenticated users, go to public page
    return redirect(302, '/public');
  } catch {
    // Not authenticated, go to public page
    return redirect(302, '/public');
  }
}