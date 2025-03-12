/**
 * Mock Authentication System for Local Development
 * This simulates AWS Amplify authentication flows for development purposes
 */

// Mock storage keys
const STORAGE_KEYS = {
  USERS: 'mock_auth_users',
  CURRENT_USER: 'mock_auth_current_user',
  PENDING_CONFIRMATIONS: 'mock_auth_pending_confirmations'
};

/**
 * Initialize mock storage
 */
function initMockStorage() {
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.PENDING_CONFIRMATIONS)) {
    localStorage.setItem(STORAGE_KEYS.PENDING_CONFIRMATIONS, JSON.stringify([]));
  }
}

/**
 * Get users from storage
 * @returns {Array<StoredUser>} Users array
 */
function getUsers() {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
}

/**
 * Save users to storage
 * @param {Array<StoredUser>} users - Users to save
 */
function saveUsers(users) {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
}

/**
 * Get pending confirmations from storage
 * @returns {Array<PendingUser>} Pending confirmations
 */
function getPendingConfirmations() {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.PENDING_CONFIRMATIONS) || '[]');
}

/**
 * Save pending confirmations to storage
 * @param {Array<PendingUser>} confirmations - Confirmations to save
 */
function savePendingConfirmations(confirmations) {
  localStorage.setItem(STORAGE_KEYS.PENDING_CONFIRMATIONS, JSON.stringify(confirmations));
}

/**
 * Get current user from storage
 * @returns {StoredUser|null} Current user or null
 */
function getCurrentUserFromStorage() {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER) || 'null');
}

/**
 * Save current user to storage
 * @param {StoredUser} user - User to save
 */
function saveCurrentUser(user) {
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
}

/**
 * @typedef {Object} UserAttributes
 * @property {string} email - User's email
 * @property {string} [email_verified] - Email verification status
 * @property {string} [phone_number] - Phone number
 * @property {string} [phone_number_verified] - Phone verification status
 * @property {string} [userType] - User type (merchant or customer)
 * @property {string} [businessName] - Business name for merchant users
 */

/**
 * @typedef {{[key: string]: string}} CognitoAttributes
 */

/**
 * @typedef {Object} SignUpParams
 * @property {string} username - Username (email)
 * @property {string} password - Password
 * @property {Object} [options] - Additional options
 * @property {CognitoAttributes} [options.userAttributes] - User attributes
 */

/**
 * @typedef {Object} ConfirmSignUpParams
 * @property {string} username - Username to confirm
 * @property {string} confirmationCode - Confirmation code
 */

/**
 * @typedef {Object} SignInParams
 * @property {string} username - Username (email)
 * @property {string} password - Password
 */

/**
 * @typedef {Object} UserData
 * @property {string} username - Username (email)
 * @property {string} userId - User ID
 * @property {Object} signInDetails - Sign in details
 * @property {string} sub - User ID
 * @property {string} email - User's email
 * @property {string} userType - User type (merchant or customer)
 * @property {string[]} [group] - User groups
 * @property {string} [businessName] - Business name for merchant users
 * @property {Object} [tokens] - User tokens
 */

/**
 * @typedef {Object} PendingUser
 * @property {string} username - Username (email)
 * @property {string} password - Password
 * @property {CognitoAttributes} userAttributes - User attributes
 */

/**
 * @typedef {Object} StoredUser
 * @property {string} username - Username (email)
 * @property {string} password - Password
 * @property {CognitoAttributes} userAttributes - User attributes
 * @property {string} sub - User ID
 * @property {string} email - User's email
 * @property {string} userType - User type
 * @property {string} [businessName] - Business name
 * @property {string[]} [group] - User group as array for compatibility
 * @property {Tokens} [tokens] - User tokens
 */

/**
 * @typedef {Object.<string, any>} TokenPayload
 */

/**
 * @typedef {Object} Tokens
 * @property {string} idToken - ID token
 * @property {string} accessToken - Access token
 * @property {string} refreshToken - Refresh token
 */

/**
 * Sign up a new user
 * @param {Object} params - Sign up parameters
 * @param {string} params.username - Username (email)
 * @param {string} params.password - Password
 * @param {Object} [params.options={}] - Additional options
 * @param {CognitoAttributes} [params.options.userAttributes] - User attributes
 * @returns {Promise<Object>} Sign up result
 */
export async function signUp({ username, password, options = {} }) {
  console.log('MOCK AUTH: Sign up attempt', { username, options });
  initMockStorage();
  
  // Check if user already exists
  const users = getUsers();
  if (users.some((user) => user.username === username)) {
    return Promise.reject(new Error('User already exists'));
  }
  
  // Add to pending confirmations
  const pendingConfirmations = getPendingConfirmations();
  /** @type {PendingUser} */
  const pendingUser = { 
    username, 
    password, 
    userAttributes: options.userAttributes || {}
  };
  pendingConfirmations.push(pendingUser);
  savePendingConfirmations(pendingConfirmations);
  
  console.log('MOCK AUTH: Sign up successful, awaiting confirmation');
  return Promise.resolve({
    isSignUpComplete: false,
    nextStep: { signUpStep: 'CONFIRM_SIGN_UP' },
    userId: username
  });
}

/**
 * Confirm sign up with verification code
 * @param {Object} params - Confirm sign up parameters
 * @param {string} params.username - Username to confirm
 * @param {string} params.confirmationCode - Confirmation code
 * @returns {Promise<Object>} Confirmation result
 */
export async function confirmSignUp({ username, confirmationCode }) {
  console.log('MOCK AUTH: Confirm sign up attempt', { username, confirmationCode });
  
  // Validate confirmation code (any 6 digits will work)
  if (!/^\d{6}$/.test(confirmationCode)) {
    return Promise.reject(new Error('Invalid confirmation code. Use any 6 digits.'));
  }
  
  // Find pending confirmation
  const pendingConfirmations = getPendingConfirmations();
  const pendingIndex = pendingConfirmations.findIndex((confirmation) => confirmation.username === username);
  
  if (pendingIndex === -1) {
    return Promise.reject(new Error('No pending confirmation found'));
  }
  
  // Move from pending to confirmed users
  /** @type {PendingUser} */
  const pendingUser = pendingConfirmations[pendingIndex];
  pendingConfirmations.splice(pendingIndex, 1);
  savePendingConfirmations(pendingConfirmations);
  
  // Get user attributes safely
  /** @type {CognitoAttributes} */
  const userAttributes = pendingUser.userAttributes || {};
  let userType = 'customer';
  let businessName = '';
  
  // Try to get userType from different possible locations
  if (userAttributes.userType) {
    userType = userAttributes.userType;
  } else if (userAttributes['custom:userType']) {
    userType = userAttributes['custom:userType'];
  }
  
  // Try to get businessName from different possible locations
  if (userAttributes.businessName) {
    businessName = userAttributes.businessName;
  } else if (userAttributes['custom:businessName']) {
    businessName = userAttributes['custom:businessName'];
  }
  
  const users = getUsers();
  /** @type {StoredUser} */
  const newUser = {
    username: pendingUser.username,
    password: pendingUser.password,
    userAttributes: pendingUser.userAttributes,
    sub: `mock-${Date.now()}`,
    email: pendingUser.username,
    userType: userType,
    businessName: businessName,
    group: [userType === 'merchant' ? 'Merchants' : 'Customers']
  };
  users.push(newUser);
  saveUsers(users);
  
  console.log('MOCK AUTH: Confirmation successful');
  return Promise.resolve({ isSignUpComplete: true });
}

/**
 * Resend sign up code
 * @param {Object} params - Resend parameters
 * @param {string} params.username - Username (email)
 * @returns {Promise<Object>} Resend result
 */
export async function resendSignUpCode({ username }) {
  console.log('MOCK AUTH: Resend confirmation code', { username });
  
  // Check if there's a pending confirmation
  const pendingConfirmations = getPendingConfirmations();
  const isPending = pendingConfirmations.some((confirmation) => confirmation.username === username);
  
  if (!isPending) {
    return Promise.reject(new Error('No pending confirmation found'));
  }
  
  // In mock mode, we don't actually need to do anything
  return Promise.resolve({ 
    destination: username,
    deliveryMedium: 'EMAIL'
  });
}

/**
 * Sign in with username and password
 * @param {Object} params - Sign in parameters
 * @param {string} params.username - Username (email)
 * @param {string} params.password - Password
 * @returns {Promise<Object>} Sign in result
 */
export async function signIn({ username, password }) {
  console.log('MOCK AUTH: Sign in attempt', { username });
  
  // Find user
  const users = getUsers();
  const user = users.find((u) => u.username === username && u.password === password);
  
  if (!user) {
    return Promise.reject(new Error('User not found or incorrect password'));
  }
  
  // Create tokens
  /** @type {StoredUser} */
  const typedUser = user;
  
  // Convert StoredUser to UserData for token creation
  /** @type {UserData} */
  const userData = {
    username: typedUser.username,
    userId: typedUser.sub,
    signInDetails: {
      loginId: typedUser.email
    },
    sub: typedUser.sub,
    email: typedUser.email,
    userType: typedUser.userType,
    group: typedUser.group,
    businessName: typedUser.businessName
  };
  
  /** @type {Tokens} */
  const tokens = createMockTokens(userData);
  
  // Save current user
  /** @type {StoredUser} */
  const currentUser = {
    username: typedUser.username,
    password: typedUser.password,
    userAttributes: typedUser.userAttributes,
    sub: typedUser.sub,
    email: typedUser.email,
    userType: typedUser.userType,
    group: typedUser.group,
    businessName: typedUser.businessName,
    tokens
  };
  saveCurrentUser(currentUser);
  
  console.log('MOCK AUTH: Sign in successful');
  return Promise.resolve({
    isSignedIn: true,
    nextStep: { signInStep: 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD' },
    tokens
  });
}

/**
 * Sign in with redirect (OAuth flow)
 * @returns {Promise<void>}
 */
export async function signInWithRedirect() {
  console.log('MOCK AUTH: Sign in with redirect');
  
  // In mock mode, we don't actually redirect
  // Just log a message
  return Promise.resolve();
}

/**
 * Sign out
 * @returns {Promise<void>}
 */
export async function signOut() {
  console.log('MOCK AUTH: Sign out');
  
  // Clear current user
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  
  return Promise.resolve();
}

/**
 * Get current authenticated user
 * @returns {Promise<UserData|null>} Current user or null if not authenticated
 */
export async function getCurrentUser() {
  const storedUser = getCurrentUserFromStorage();
  
  if (!storedUser) {
    return Promise.resolve(null);
  }
  
  /** @type {StoredUser} */
  const user = storedUser;
  
  /** @type {UserData} */
  const userData = {
    username: user.email,
    userId: user.sub,
    signInDetails: {
      loginId: user.email
    },
    sub: user.sub,
    email: user.email,
    userType: user.userType,
    group: user.group,
    businessName: user.businessName
  };
  
  return Promise.resolve(userData);
}

/**
 * Fetch current auth session including tokens
 * @returns {Promise<{tokens: Tokens|null}>} Auth session or null
 */
export async function fetchAuthSession() {
  const storedUser = getCurrentUserFromStorage();
  
  if (!storedUser) {
    return Promise.resolve({ tokens: null });
  }
  
  /** @type {StoredUser} */
  const user = storedUser;
  
  // Convert StoredUser to UserData for token creation
  /** @type {UserData} */
  const userData = {
    username: user.username,
    userId: user.sub,
    signInDetails: {
      loginId: user.email
    },
    sub: user.sub,
    email: user.email,
    userType: user.userType,
    group: user.group,
    businessName: user.businessName
  };
  
  // Create tokens if they don't exist
  /** @type {Tokens} */
  const tokens = user.tokens || createMockTokens(userData);
  
  return Promise.resolve({
    tokens: {
      accessToken: tokens.accessToken,
      idToken: tokens.idToken,
      refreshToken: tokens.refreshToken
    }
  });
}

/**
 * Create mock JWT tokens
 * @param {UserData} user - User object
 * @returns {Tokens} Mock tokens
 */
function createMockTokens(user) {
  // Create payload that mimics Cognito token structure
  /** @type {Object.<string, any>} */
  const payload = {
    sub: user.sub,
    email: user.email,
    scope: 'deals:read deals:write deals:delete',
    exp: Math.floor(Date.now() / 1000) + 3600,
    iat: Math.floor(Date.now() / 1000)
  };
  
  // Add user type and groups
  payload['custom:userType'] = user.userType;
  payload['cognito:groups'] = user.group || [];
  
  // Add business name if present
  if (user.businessName) {
    payload['custom:businessName'] = user.businessName;
  }
  
  // Create a simple mock JWT
  const encodedPayload = btoa(JSON.stringify(payload));
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const signature = btoa('mock-signature');
  
  const idToken = `${header}.${encodedPayload}.${signature}`;
  const accessToken = `${header}.${encodedPayload}.${signature}`;
  const refreshToken = `mock-refresh-token-${user.sub}`;
  
  /** @type {Tokens} */
  const tokens = {
    idToken,
    accessToken,
    refreshToken
  };
  
  return tokens;
}

export default {
  signUp,
  confirmSignUp,
  resendSignUpCode,
  signIn,
  signInWithRedirect,
  signOut,
  getCurrentUser,
  fetchAuthSession
};
