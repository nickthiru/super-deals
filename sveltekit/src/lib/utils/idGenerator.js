/**
 * Utility functions for generating unique IDs
 */

/**
 * Generate a unique ID with a given prefix
 * @param {string} [prefix='id'] - Prefix for the ID
 * @returns {string} A unique ID
 */
export function generateId(prefix = 'id') {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `${prefix}_${timestamp}_${random}`;
}

/**
 * Generate a merchant ID
 * @returns {string} A unique merchant ID
 */
export function generateMerchantId() {
  return generateId('merchant');
}

/**
 * Generate a verification code
 * @param {number} [length=6] - Length of the verification code
 * @returns {string} A verification code
 */
export function generateVerificationCode(length = 6) {
  const digits = '0123456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += digits.charAt(Math.floor(Math.random() * digits.length));
  }
  return code;
}
