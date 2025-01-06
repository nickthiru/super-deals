export default function deleteCookie(cookies, name) {
  cookies.set(name, '', {
    path: '/',
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    expires: new Date(0),  // Set expiration to the past
    maxAge: 0  // Set maxAge to 0
  });
}