/**
 * AWS configuration module
 *
 * Centralizes access to AWS-related environment variables and configuration
 */

export const AWS_CONFIG = {
	region: 'us-east-1',

};

// Log configuration in development mode
if (import.meta.env.DEV) {
	console.log('AWS Configuration:', {
		region: AWS_CONFIG.region,

	});
}
