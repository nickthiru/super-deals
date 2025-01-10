import { Amplify } from 'aws-amplify';
import { authConfig } from '$lib/config/auth';

/**
 * Initialize AWS Amplify configuration
 */
Amplify.configure({
  Auth: authConfig
}, {
  ssr: false
});

export const ssr = false;
