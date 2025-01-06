const logRouteMatch = (routeType, path, pattern, matched) => {
  console.log(`${routeType} route check:`, {
    path,
    pattern: pattern.toString(),
    matched
  });
};

const publicRoutes = [
  /^\/$/,
  /^\/public\/?$/,
  /^\/merchants\/sign-up\/?$/,
  /^\/merchants\/sign-in\/?$/,
  /^\/merchants\/confirm-sign-up\/?$/,
  /^\/customers\/sign-up\/?$/,
  /^\/customers\/sign-in\/?$/,
  /^\/customers\/confirm-sign-up\/?$/,
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
  },
];

export const isPublicRoute = (path) => {
  for (const route of publicRoutes) {
    const matched = route.test(path);
    logRouteMatch('Public', path, route, matched);
    if (matched) return true;
  }
  return false;
};

export const findProtectedRoute = (path) => {
  for (const route of protectedRoutes) {
    const matched = route.pattern.test(path);
    logRouteMatch('Protected', path, route.pattern, matched);
    if (matched) return route;
  }
  return null;
};