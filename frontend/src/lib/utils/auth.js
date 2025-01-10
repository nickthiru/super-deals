/**
 * @typedef {Object} UserSession
 * @property {string} accessToken - The JWT access token
 * @property {string[]} scopes - Array of authorized scopes
 * @property {string} group - User's group (Merchants or Customers)
 */

/**
 * @typedef {Object} TokenClaims
 * @property {string} [scope] - Space-separated list of scopes
 * @property {string[]} ['cognito:groups'] - Array of Cognito groups
 */

/**
 * Parses JWT token to extract scopes and claims
 * @param {string} token - JWT access token
 * @returns {TokenClaims|null} Decoded token claims
 */
const parseJwt = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(window.atob(base64));
  } catch (error) {
    console.error('Error parsing JWT:', error);
    return null;
  }
};

/**
 * Checks if user has required scope
 * @param {string[]} requiredScopes - Array of required scopes
 * @param {UserSession} session - User session object
 * @returns {boolean} True if user has all required scopes
 */
export const hasRequiredScopes = (requiredScopes, session) => {
  if (!session?.scopes) return false;
  return requiredScopes.every(scope => session.scopes.includes(scope));
};

/**
 * Creates session object from Cognito tokens
 * @param {Object} tokens - Cognito authentication tokens
 * @param {string} tokens.accessToken - The access token
 * @returns {UserSession} Formatted session object
 */
export const createSession = (tokens) => {
  const decoded = parseJwt(tokens.accessToken);
  if (!decoded) {
    throw new Error('Failed to decode access token');
  }
  
  const cognitoGroups = decoded['cognito:groups'];
  const group = Array.isArray(cognitoGroups) ? cognitoGroups[0] : null;
  
  return {
    accessToken: tokens.accessToken,
    scopes: decoded.scope?.split(' ') || [],
    group
  };
};

/** @type {Object.<string, string>} */
const DEAL_SCOPES = {
  READ: 'deals:read',
  WRITE: 'deals:write',
  DELETE: 'deals:delete'
};

/**
 * Checks if user can read deals
 * @param {UserSession} session - User session object
 * @returns {boolean} True if user has read access to deals
 */
export const canReadDeals = (session) => {
  return hasRequiredScopes([DEAL_SCOPES.READ], session);
};

/**
 * Checks if user can write deals
 * @param {UserSession} session - User session object
 * @returns {boolean} True if user has write access to deals
 */
export const canWriteDeals = (session) => {
  return hasRequiredScopes([DEAL_SCOPES.WRITE], session);
};

/**
 * Checks if user can delete deals
 * @param {UserSession} session - User session object
 * @returns {boolean} True if user has delete access to deals
 */
export const canDeleteDeals = (session) => {
  return hasRequiredScopes([DEAL_SCOPES.DELETE], session);
};

/**
 * Checks if user has merchant privileges
 * @param {UserSession} session - User session object
 * @returns {boolean} True if user is a merchant
 */
export const isMerchant = (session) => {
  return session?.group === 'Merchants';
};

/**
 * Checks if user has customer privileges
 * @param {UserSession} session - User session object
 * @returns {boolean} True if user is a customer
 */
export const isCustomer = (session) => {
  return session?.group === 'Customers';
};

export default {
  parseJwt,
  hasRequiredScopes,
  createSession,
  canReadDeals,
  canWriteDeals,
  canDeleteDeals,
  isMerchant,
  isCustomer
};