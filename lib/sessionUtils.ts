import type { NextApiResponse } from "next";

export interface SessionData {
  session_token: string;
  user?: any;
}

/**
 * Sets a secure session cookie and clears any temporary cookies
 */
export function setSessionCookie(
  res: NextApiResponse,
  sessionToken: string,
  clearCodeVerifier: boolean = false
) {
  const cookies: string[] = [];

  // Set session token cookie
  const sessionCookieOptions = [
    `stytch_session=${sessionToken}`,
    'HttpOnly',
    'Secure',
    'SameSite=Strict',
    'Path=/',
    'Max-Age=86400' // 24 hours
  ].join('; ');
  
  cookies.push(sessionCookieOptions);

  // Clear code verifier cookie if needed (OAuth flow)
  if (clearCodeVerifier) {
    const clearCodeVerifierCookie = [
      'stytch_code_verifier=',
      'HttpOnly',
      'Secure',
      'SameSite=Strict',
      'Path=/',
      'Max-Age=0'
    ].join('; ');
    
    cookies.push(clearCodeVerifierCookie);
  }

  res.setHeader('Set-Cookie', cookies);
}

/**
 * Clears session and temporary cookies
 */
export function clearSessionCookies(res: NextApiResponse) {
  const cookies = [
    // Clear session cookie
    [
      'stytch_session=',
      'HttpOnly',
      'Secure',
      'SameSite=Strict',
      'Path=/',
      'Max-Age=0'
    ].join('; '),
    
    // Clear code verifier cookie
    [
      'stytch_code_verifier=',
      'HttpOnly',
      'Secure',
      'SameSite=Strict',
      'Path=/',
      'Max-Age=0'
    ].join('; '),
    
    // Clear method ID cookie
    [
      'stytch_method_id=',
      'HttpOnly',
      'Secure',
      'SameSite=Strict',
      'Path=/',
      'Max-Age=0'
    ].join('; ')
  ];

  res.setHeader('Set-Cookie', cookies);
}

/**
 * Redirects user after successful authentication
 */
export function redirectAfterAuth(res: NextApiResponse, redirectPath: string = '/enroll') {
  res.status(302).setHeader('Location', redirectPath);
  res.end();
}

/**
 * Redirects user after authentication failure
 */
export function redirectAfterError(
  res: NextApiResponse, 
  errorType: string = 'auth_failed',
  redirectPath: string = '/login'
) {
  clearSessionCookies(res);
  res.status(302).setHeader('Location', `${redirectPath}?error=${errorType}`);
  res.end();
}