/**
 * Log route match details
 * @param {string} routeType - Type of route (Public or Protected)
 * @param {string} path - Path to check
 * @param {RegExp} pattern - Route pattern
 * @param {boolean} matched - Whether the path matches the pattern
 */
const logRouteMatch = (
  routeType,
  path,
  pattern,
  matched
) => {
  console.log(`${routeType} route check:`, {
    path,
    pattern: pattern.toString(),
    matched
  });
};

const publicRoutes = [
  /^\/$/,
  /^\/auth\/confirm-sign-up\/?$/,
  /^\/public\/?$/,
  /^\/merchants\/sign-up\/?$/,
  /^\/merchants\/sign-in\/?$/,
  /^\/merchants\/confirm-sign-up\/?$/,
  /^\/merchants\/post-sign-up\/?$/,
  /^\/customers\/sign-up\/?$/,
  /^\/customers\/sign-in\/?$/,
  /^\/customers\/confirm-sign-up\/?$/,
  /^\/customers\/post-sign-up\/?$/,
  /^\/admins\/sign-in\/?$/,
  /^\/favicon\.ico$/
];

const protectedRoutes = [
  {
    pattern: /^\/merchants\/([^/]+)(?:\/.*)?$/,
    requiredGroup: 'Merchants',
    redirectPath: '/merchants/sign-in',
    idType: 'userId'
  },
  {
    pattern: /^\/customers\/([^/]+)(?:\/.*)?$/,
    requiredGroup: 'Customers',
    redirectPath: '/customers/sign-in',
    idType: 'userId'
  },
  {
    pattern: /^\/admins\/([^/]+)(?:\/.*)?$/,
    requiredGroup: 'Admins',
    redirectPath: '/admins/sign-in',
    idType: 'userId'
  }
];

/**
 * Check if the path is a public route
 * @param {string} path - Path to check
 * @returns {boolean} True if the path is a public route, false otherwise
 */
export const isPublicRoute = (path) => {
  for (const route of publicRoutes) {
    const matched = route.test(path);
    logRouteMatch('Public', path, route, matched);
    if (matched) return true;
  }
  return false;
};

/**
 * Find the protected route that matches the path
 * @param {string} path - Path to check
 * @returns {Object|null} Protected route configuration if found, null otherwise
 */
export const findProtectedRoute = (path) => {
  for (const route of protectedRoutes) {
    const matched = route.pattern.test(path);
    logRouteMatch(
      'Protected',
      path,
      route.pattern,
      matched
    );
    if (matched) return route;
  }
  return null;
};
