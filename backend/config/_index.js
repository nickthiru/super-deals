/**
 * Configuration loader
 * 
 * This module provides a centralized way to access configuration settings
 * based on the current environment.
 */

const emailConfig = require('./email');

/**
 * Determines the current environment
 * @returns {string} The current environment (dev, prod, etc.)
 */
function getEnvironment() {
  // First check CDK_ENV which would be set during deployment
  // Then check NODE_ENV for local development
  // Finally default to 'dev'
  return process.env.CDK_ENV || process.env.NODE_ENV || 'dev';
}

/**
 * Gets configuration for the current environment
 * @param {Object} config - Configuration object with environment keys
 * @returns {Object} - Configuration for the current environment
 */
function getConfigForEnvironment(config) {
  const env = getEnvironment();
  const envConfig = config[env] || config.dev; // Fallback to dev if environment not found
  
  // Merge with shared config if it exists
  return {
    ...(config.shared || {}),
    ...envConfig,
  };
}

module.exports = {
  email: getConfigForEnvironment(emailConfig),
  getEnvironment,
};
