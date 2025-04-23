/**
 * Email configuration for different environments
 * 
 * This file centralizes email-related configuration settings,
 * making it easier to manage different values across environments.
 */

module.exports = {
  // Development environment settings
  dev: {
    fromAddress: 'superdeals616@gmail.com',
    replyToAddress: 'superdeals616@gmail.com',
    contactEmail: 'superdeals616@gmail.com',
  },
  
  // Production environment settings
  prod: {
    fromAddress: 'no-reply@superdeals.com',
    replyToAddress: 'support@superdeals.com',
    contactEmail: 'contact@superdeals.com',
  },
  
  // Shared settings across all environments
  shared: {
    sesRegion: 'us-east-1',
    sesIdentityArn: 'arn:aws:ses:us-east-1:346761569124:identity',
  }
};
