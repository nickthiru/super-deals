/**
 * Form validation utilities
 */

/**
 * Validates an email address
 * @param {string} email - Email to validate
 * @returns {boolean} Whether the email is valid
 */
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates a password
 * @param {string} password - Password to validate
 * @param {Object} options - Validation options
 * @param {number} [options.minLength=8] - Minimum password length
 * @param {boolean} [options.requireUppercase=true] - Whether to require uppercase letters
 * @param {boolean} [options.requireLowercase=true] - Whether to require lowercase letters
 * @param {boolean} [options.requireNumbers=true] - Whether to require numbers
 * @param {boolean} [options.requireSpecial=true] - Whether to require special characters
 * @returns {boolean} Whether the password is valid
 */
export function isValidPassword(password, options = {}) {
  const {
    minLength = 8,
    requireUppercase = true,
    requireLowercase = true,
    requireNumbers = true,
    requireSpecial = true
  } = options;
  
  if (!password || password.length < minLength) {
    return false;
  }
  
  if (requireUppercase && !/[A-Z]/.test(password)) {
    return false;
  }
  
  if (requireLowercase && !/[a-z]/.test(password)) {
    return false;
  }
  
  if (requireNumbers && !/[0-9]/.test(password)) {
    return false;
  }
  
  if (requireSpecial && !/[^A-Za-z0-9]/.test(password)) {
    return false;
  }
  
  return true;
}

/**
 * Validates a phone number
 * @param {string} phone - Phone number to validate
 * @returns {boolean} Whether the phone number is valid
 */
export function isValidPhone(phone) {
  // Basic validation - adjust as needed for your requirements
  const phoneRegex = /^\+?[0-9]{10,15}$/;
  return phoneRegex.test(phone.replace(/[\s()-]/g, ''));
}

/**
 * Validates a URL
 * @param {string} url - URL to validate
 * @returns {boolean} Whether the URL is valid
 */
export function isValidUrl(url) {
  if (!url) return true; // Allow empty URLs (assuming they're optional)
  
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Creates a validation function for a required field
 * @param {string} fieldName - Name of the field for error message
 * @returns {function(string): string|null} Validation function
 */
export function required(fieldName) {
  return (value) => {
    return value ? null : `${fieldName} is required`;
  };
}

/**
 * Creates a validation function for minimum length
 * @param {number} min - Minimum length
 * @param {string} fieldName - Name of the field for error message
 * @returns {function(string): string|null} Validation function
 */
export function minLength(min, fieldName) {
  return (value) => {
    return !value || value.length >= min ? null : `${fieldName} must be at least ${min} characters`;
  };
}

/**
 * Creates a validation function for maximum length
 * @param {number} max - Maximum length
 * @param {string} fieldName - Name of the field for error message
 * @returns {function(string): string|null} Validation function
 */
export function maxLength(max, fieldName) {
  return (value) => {
    return !value || value.length <= max ? null : `${fieldName} must be at most ${max} characters`;
  };
}

/**
 * Creates a validation function for email
 * @returns {function(string): string|null} Validation function
 */
export function email() {
  return (value) => {
    return !value || isValidEmail(value) ? null : 'Please enter a valid email address';
  };
}

/**
 * Creates a validation function for password
 * @param {Object} options - Validation options
 * @returns {function(string): string|null} Validation function
 */
export function password(options = {}) {
  return (value) => {
    if (!value) return null;
    
    if (!isValidPassword(value, options)) {
      const { minLength = 8 } = options;
      return `Password must be at least ${minLength} characters and include uppercase, lowercase, numbers, and special characters`;
    }
    
    return null;
  };
}

/**
 * Creates a validation function for phone number
 * @returns {function(string): string|null} Validation function
 */
export function phone() {
  return (value) => {
    return !value || isValidPhone(value) ? null : 'Please enter a valid phone number';
  };
}

/**
 * Creates a validation function for URL
 * @returns {function(string): string|null} Validation function
 */
export function url() {
  return (value) => {
    return !value || isValidUrl(value) ? null : 'Please enter a valid URL';
  };
}

/**
 * Combines multiple validation functions
 * @param {Array<function(string): string|null>} validators - Validation functions to combine
 * @returns {function(string): string|null} Combined validation function
 */
export function compose(validators) {
  return (value) => {
    for (const validator of validators) {
      const error = validator(value);
      if (error) {
        return error;
      }
    }
    return null;
  };
}

/**
 * Validates a form object against a validation schema
 * @param {Object} formData - Form data to validate
 * @param {Object} validationSchema - Validation schema
 * @returns {Object} Validation result with errors object and isValid flag
 */
export function validateForm(formData, validationSchema) {
  const errors = {};
  let isValid = true;
  
  for (const [field, validator] of Object.entries(validationSchema)) {
    const error = validator(formData[field]);
    if (error) {
      errors[field] = error;
      isValid = false;
    }
  }
  
  return { errors, isValid };
}
