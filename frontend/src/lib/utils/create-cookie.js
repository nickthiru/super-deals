/**
 * Create a cookie with the specified name and data
 * @param {import('@sveltejs/kit').Cookies} cookies - SvelteKit cookies object
 * @param {string} name - Cookie name
 * @param {string} data - Cookie value
 * @param {number} maxAge - Cookie max age in seconds
 * @param {boolean} httpOnly - Whether the cookie should be httpOnly (default: true)
 */
export default function createCookie(cookies, name, data, maxAge = (60 * 60 * 24 * 7), httpOnly = true) {
  // For username cookie during sign-up flow, we want it to be visible in browser
  const isUsername = name === 'username';

  cookies.set(name, data, {
    path: '/',
    httpOnly: isUsername ? false : httpOnly, // Make username cookie visible in browser
    secure: true,
    sameSite: 'strict',
    maxAge,  // Default: 7 days
  });
}