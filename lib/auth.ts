import { redirect } from 'next/navigation';
import stytchClient from './stytchClient';
import { User, Session } from 'stytch';
import { getSessionCookie } from './sessionUtils';
import { headers } from 'next/headers';

export interface AuthResult {
  user: User;
  session: Session;
}

export async function markSessionDeviceAsTrusted(session: Session, user: User) {
  const fingerprint = session.custom_claims?.device_fingerprint as string;
  const known_devices = (user.trusted_metadata?.known_devices ??
    []) as string[];

  // Remember the last 5 most recently seen unique devices
  const newKnownDevices = [
    fingerprint,
    ...known_devices.filter(device => device !== fingerprint),
  ].slice(0, 5);

  await stytchClient.users.update({
    user_id: user.user_id,
    trusted_metadata: {
      known_devices: newKnownDevices,
    },
  });
}

export function isKnownDevice(session: Session, user: User): boolean {
  const fingerprint = session.custom_claims?.device_fingerprint as string;
  const known_devices = (user.trusted_metadata?.known_devices ??
    []) as string[];
  return known_devices.includes(fingerprint);
}

/**
 * Server-side authentication check for App Router
 * Use in server components and route handlers
 */
export async function getAuthUser(): Promise<AuthResult | null> {
  const sessionToken = await getSessionCookie();

  if (!sessionToken) {
    return null;
  }

  // Authenticate the session
  const authResponse = await stytchClient.sessions.authenticate({
    session_token: sessionToken,
  });

  return {
    user: authResponse.user,
    session: authResponse.session,
  };
}

/**
 * Require authentication - redirects to login if not authenticated
 */
export async function requireAuth(): Promise<AuthResult> {
  const authResult = await getAuthUser();
  const requestHeaders = await headers();

  // Nextjs App Router doesn't let us set cookies from server components
  // so to persist the returnTo URL we pass it as a query param to the Login page
  // and then the Login page will execute a server action to save it in a cookie
  // ref: https://github.com/vercel/next.js/discussions/49843#discussioncomment-7006149
  let loginLocation = '/login';
  const xUrl = requestHeaders.get('x-url') || '';
  if (xUrl) {
    const currentUrl = new URL(xUrl);
    const returnTo = currentUrl.pathname + currentUrl.search;
    loginLocation += '?' + new URLSearchParams({ returnTo }).toString();
  }

  if (!authResult) {
    redirect(loginLocation);
  }

  return authResult;
}

export async function requireAdaptiveMFA(): Promise<AuthResult> {
  const { session, user } = await requireAuth();

  if (isKnownDevice(session, user)) {
    return { session, user };
  }

  const hasPhoneNumber = user.phone_numbers.length > 0;
  redirect(hasPhoneNumber ? '/2fa' : '/enroll');
}
