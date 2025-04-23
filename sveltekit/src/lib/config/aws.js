/**
 * AWS configuration module
 * 
 * Centralizes access to AWS-related environment variables and configuration
 */

export const AWS_CONFIG = {
  region: 'us-east-1',
  signUpCompletedTopicArn: import.meta.env.VITE_SIGN_UP_COMPLETED_TOPIC_ARN
};

// Log configuration in development mode
if (import.meta.env.DEV) {
  console.log('AWS Configuration:', {
    region: AWS_CONFIG.region,
    // Mask the full ARN for security
    signUpCompletedTopicArn: AWS_CONFIG.signUpCompletedTopicArn 
      ? `${AWS_CONFIG.signUpCompletedTopicArn.substring(0, 20)}...` 
      : undefined
  });
}
