import { writable } from 'svelte/store';
import { getCurrentUser } from 'aws-amplify/auth';

/** @typedef {{ sub: string, email: string, userType: string }} User */

/** @typedef {{ user: User | null, initialized: boolean, isAuthenticated: boolean }} AuthState */

/** @type {AuthState} */
const initialState = {
  user: null,
  initialized: false,
  isAuthenticated: false
};

function createAuthStore() {
  const { subscribe, update } = writable(initialState);

  return {
    subscribe,
    
    /**
     * Set the current user
     * @param {User | null} user 
     */
    setUser: (user) => {
      update(state => ({
        ...state,
        user,
        isAuthenticated: !!user
      }));
    },

    /**
     * Clear the current user
     */
    clearUser: () => {
      update(state => ({
        ...state,
        user: null,
        isAuthenticated: false
      }));
    },

    /**
     * Initialize the auth store by checking for a current user
     */
    initialize: async () => {
      try {
        const { username, signInDetails } = await getCurrentUser();
        const user = {
          sub: username,
          email: signInDetails?.loginId || username,
          userType: 'merchant' // For now, hardcode as merchant
        };
        update(state => ({
          ...state,
          user,
          isAuthenticated: true,
          initialized: true
        }));
      } catch {
        // User is not authenticated, which is fine
        update(state => ({
          ...state,
          user: null,
          isAuthenticated: false,
          initialized: true
        }));
      }
    }
  };
}

export const auth = createAuthStore();
