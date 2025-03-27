/**
 * Error handling utilities
 */

/**
 * API error codes
 * @type {{
 *   INVALID_CREDENTIALS: string,
 *   EMAIL_EXISTS: string,
 *   WEAK_PASSWORD: string,
 *   INVALID_EMAIL: string,
 *   EMAIL_NOT_FOUND: string,
 *   EMAIL_NOT_VERIFIED: string,
 *   INVALID_CODE: string,
 *   CODE_EXPIRED: string,
 *   NETWORK_ERROR: string,
 *   SERVER_ERROR: string,
 *   TIMEOUT_ERROR: string,
 *   VALIDATION_ERROR: string,
 *   UNKNOWN_ERROR: string
 * }}
 */
export const ERROR_CODES = {
  // Authentication errors
  INVALID_CREDENTIALS: 'auth/invalid-credentials',
  EMAIL_EXISTS: 'auth/email-exists',
  WEAK_PASSWORD: 'auth/weak-password',
  INVALID_EMAIL: 'auth/invalid-email',
  EMAIL_NOT_FOUND: 'auth/email-not-found',
  EMAIL_NOT_VERIFIED: 'auth/email-not-verified',
  
  // Verification errors
  INVALID_CODE: 'verification/invalid-code',
  CODE_EXPIRED: 'verification/code-expired',
  
  // Network errors
  NETWORK_ERROR: 'network/error',
  SERVER_ERROR: 'server/error',
  TIMEOUT_ERROR: 'network/timeout',
  
  // Validation errors
  VALIDATION_ERROR: 'validation/error',
  
  // Generic errors
  UNKNOWN_ERROR: 'unknown/error'
};

/**
 * @typedef {Object} ApiError
 * @property {string} message - Error message
 * @property {string} code - Error code
 */

/**
 * Create an API error with consistent structure
 * @param {string} message - Error message
 * @param {string} code - Error code
 * @returns {ApiError} Formatted API error
 */
export function createApiError(message, code) {
  /** @type {ApiError} */
  const error = /** @type {any} */ (new Error(message));
  error.code = code;
  return error;
}

/**
 * Handle API errors for consistent format
 * @param {unknown} error - The error to handle
 * @returns {Promise<ApiError>} Formatted error
 */
export async function handleApiError(error) {
  // If the error is a Response, try to parse it as JSON
  if (error instanceof Response) {
    try {
      const errorData = await error.json();
      return createApiError(
        errorData.message || 'An error occurred while processing your request',
        errorData.code || mapHttpStatusToErrorCode(error.status)
      );
    } catch {
      // If parsing fails, create a generic error
      return createApiError(
        `Request failed with status: ${error.status}`,
        mapHttpStatusToErrorCode(error.status)
      );
    }
  }

  // Handle standard errors
  if (error instanceof Error) {
    const errorCode = /** @type {any} */ (error).code;
    return createApiError(error.message, errorCode || ERROR_CODES.UNKNOWN_ERROR);
  }

  // Handle other types of errors
  return createApiError(
    typeof error === 'string' ? error : 'An unknown error occurred',
    ERROR_CODES.UNKNOWN_ERROR
  );
}

/**
 * Map HTTP status code to an error code
 * @param {number} status - HTTP status code
 * @returns {string} Error code
 */
export function mapHttpStatusToErrorCode(status) {
  switch (status) {
    case 400:
      return ERROR_CODES.VALIDATION_ERROR;
    case 401:
      return ERROR_CODES.INVALID_CREDENTIALS;
    case 404:
      return ERROR_CODES.EMAIL_NOT_FOUND;
    case 409:
      return ERROR_CODES.EMAIL_EXISTS;
    case 500:
      return ERROR_CODES.SERVER_ERROR;
    default:
      return ERROR_CODES.UNKNOWN_ERROR;
  }
}

/**
 * Format validation errors for display
 * @param {Record<string, string|string[]>|null|undefined} errors - Validation errors object
 * @returns {Record<string, string>} Formatted errors
 */
export function formatValidationErrors(errors) {
  if (!errors) {
    return /** @type {Record<string, string>} */ ({});
  }

  /** @type {Record<string, string>} */
  const formatted = {};
  
  for (const [field, messages] of Object.entries(errors)) {
    if (Array.isArray(messages)) {
      formatted[field] = messages[0];
    } else if (typeof messages === 'string') {
      formatted[field] = messages;
    }
  }
  
  return formatted;
}
