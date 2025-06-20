import type { NextApiResponse } from "next";
import { NextResponse } from "next/server";

export interface SessionData {
  session_token: string;
  user?: any;
}

/**
 * Sets a secure session cookie and clears any temporary cookies
 */
export function setSessionCookie(
  res: NextApiResponse | NextResponse,
  sessionToken: string,
  clearCodeVerifier: boolean = false
) {
  if (res instanceof NextResponse) {
    // App Router response
    res.cookies.set('stytch_session', sessionToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/',
      maxAge: 86400 // 24 hours
    });

    if (clearCodeVerifier) {
      res.cookies.delete('stytch_code_verifier');
    }
    return;
  }

  // Pages Router response
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
export function clearSessionCookies(res: NextApiResponse | NextResponse) {
  if (res instanceof NextResponse) {
    // App Router response
    res.cookies.delete('stytch_session');
    res.cookies.delete('stytch_code_verifier');
    res.cookies.delete('stytch_method_id');
    return;
  }

  // Pages Router response
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