import { writable } from 'svelte/store';
import type { User } from '$types/auth';
import { getCurrentUser } from 'aws-amplify/auth';

/**
 * Interface for the authentication store state.
 */
interface AuthState {
	/**
	 * The currently authenticated user, if any.
	 */
	user: User | null;
	/**
	 * Whether the initial auth check has completed.
	 */
	initialized: boolean;
	/**
	 * Whether we're currently checking the auth state.
	 */
	loading: boolean;
	/**
	 * Whether a user is currently authenticated.
	 */
	isAuthenticated: boolean;
}

/**
 * Create the authentication store with initial state.
 */
function createAuthStore() {
	const { subscribe, set, update } = writable<AuthState>({
		user: null,
		initialized: false,
		loading: true,
		isAuthenticated: false
	});

	return {
		subscribe,
		/**
		 * Set the current user in the store.
		 */
		setUser: (user: User | null) =>
			update((state) => ({
				...state,
				user,
				loading: false,
				isAuthenticated: !!user
			})),
		/**
		 * Clear the current user from the store.
		 */
		clearUser: () =>
			update((state) => ({
				...state,
				user: null,
				loading: false,
				isAuthenticated: false
			})),
		/**
		 * Initialize the store by checking the current auth state.
		 */
		initialize: async () => {
			try {
				const { signInDetails, userId } =
					await getCurrentUser();
				const userAttributes = signInDetails?.loginId;

				if (userAttributes) {
					// Set user data from Cognito attributes
					update((state) => ({
						...state,
						user: {
							sub: userId,
							email: userAttributes.email,
							email_verified:
								userAttributes.email_verified === 'true',
							// Add other user attributes based on user type
							...(userAttributes.userType === 'merchant'
								? {
										businessName:
											userAttributes.businessName,
										userType: 'merchant' as const
									}
								: {
										firstName: userAttributes.firstName,
										lastName: userAttributes.lastName,
										userType: 'customer' as const
									}),
							createdAt: userAttributes.createdAt,
							updatedAt: userAttributes.updatedAt
						},
						initialized: true,
						loading: false,
						isAuthenticated: true
					}));
				} else {
					update((state) => ({
						...state,
						initialized: true,
						loading: false,
						isAuthenticated: false
					}));
				}
			} catch (error) {
				console.error(
					'Error initializing auth store:',
					error
				);
				update((state) => ({
					...state,
					initialized: true,
					loading: false,
					isAuthenticated: false
				}));
			}
		}
	};
}

/**
 * The authentication store instance.
 */
export const auth = createAuthStore();
