import { writable } from 'svelte/store';
import { getCurrentUser, fetchAuthSession } from 'aws-amplify/auth';
import { jwtDecode } from 'jwt-decode';

/** @typedef {{ sub: string, email: string, userType: string, businessName?: string }} User */

/** @typedef {{ user: User | null, initialized: boolean, isAuthenticated: boolean, error?: string }} AuthState */

/** @type {AuthState} */
const initialState = {
  user: null,
  initialized: false,
  isAuthenticated: false
};

/**
 * Validate and decode JWT token
 * @param {string} token
 * @returns {User | null}
 */
function decodeToken(token) {
  try {
    const decoded = jwtDecode(token);
    return {
      sub: decoded.sub,
      email: decoded.email,
      userType: decoded['custom:userType'],
      ...(decoded['custom:businessName'] && { businessName: decoded['custom:businessName'] })
    };
  } catch (error) {
    console.error('Token validation error:', error);
    return null;
  }
}

function createAuthStore() {
  const { subscribe, update } = writable(initialState);

  return {
    subscribe,
    decodeToken,

    /**
     * Set the current user
     * @param {User | null} user
     */
    setUser: (user) => {
      update(state => ({
        ...state,
        user,
        isAuthenticated: !!user,
        error: undefined
      }));
    },

    /**
     * Clear the current user
     */
    clearUser: () => {
      update(state => ({
        ...state,
        user: null,
        isAuthenticated: false,
        error: undefined
      }));
    },

    /**
     * Initialize the auth store by checking for a current user
     */
    initialize: async () => {
      try {
        // Get the current user session
        await getCurrentUser(); // Just check if user is authenticated
        const session = await fetchAuthSession();
        const token = session.tokens?.idToken?.toString();

        if (!token) {
          throw new Error('No token found');
        }

        const user = decodeToken(token);

        if (!user) {
          throw new Error('Invalid token');
        }

        update(state => ({
          ...state,
          user,
          isAuthenticated: true,
          initialized: true
        }));
      } catch (error) {
        console.error('Auth initialization error:', error);
        update(state => ({
          ...state,
          user: null,
          isAuthenticated: false,
          initialized: true,
          error: error.message
        }));
      }
    }
  };
}

export const auth = createAuthStore();
export { decodeToken };
