export default function createCookie(cookies, name, data, maxAge = (60 * 60 * 24 * 7)) {
  cookies.set(name, data, {
    path: '/',
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge,  // Default: 7 days
  });
}