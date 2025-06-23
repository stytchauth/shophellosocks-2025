import {cookies} from "next/headers";

export async function setLoginState(state: string) {
  const cookieStore = await cookies()
  cookieStore.set('stytch_login_state', state, {
    // TODO: httpOnly for remote dev only
    // httpOnly: true,
    // secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 86400 // 24 hours
  });
}
export async function getLoginState(): Promise<string> {
  const cookieStore = await cookies()
  return cookieStore.get('stytch_login_state')?.value as string;
}

/**
 * Sets a secure session cookie and clears any temporary cookies
 */
export async function setSessionCookie(
  sessionToken: string,
) {
  const cookieStore = await cookies()
  cookieStore.set('stytch_session', sessionToken, {
    // TODO: httpOnly for remote dev only
    // httpOnly: true,
    // secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 86400 // 24 hours
  });

  cookieStore.delete('stytch_login_state');
}

export async function getSessionCookie(): Promise<string> {
  const cookieStore = await cookies()
  return cookieStore.get('stytch_session')?.value as string;
}

/**
 * Clears session and temporary cookies
 */
export async function clearSessionCookies() {
  const cookieStore = await cookies()
  // App Router response
  cookieStore.delete('stytch_session');
  cookieStore.delete('stytch_login_state');
}