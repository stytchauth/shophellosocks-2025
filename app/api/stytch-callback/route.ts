import { NextRequest, NextResponse } from 'next/server';
import stytchClient from '~lib/stytchClient';
import {
  setSessionCookie,
  clearSessionCookies,
  getLoginState,
} from '~lib/sessionUtils';
import { cookies } from 'next/headers';
import { OAuthAuthenticateResponse, Session, User } from 'stytch';
import { MagicLinksAuthenticateResponse } from 'stytch/types/lib/b2c/magic_links';
import { isKnownDevice } from '~lib/auth-server';

export async function GET(request: NextRequest) {
  try {
    // Extract token, token_type, and telemetry_id from query params
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    const tokenType = searchParams.get('stytch_token_type');
    const telemetryId = searchParams.get('telemetry_id');

    if (!token) {
      await clearSessionCookies();
      return NextResponse.redirect(
        new URL('/login?error=missing_token', request.url)
      );
    }

    if (!telemetryId) {
      await clearSessionCookies();
      return NextResponse.redirect(
        new URL('/login?error=missing_telemetry', request.url)
      );
    }

    // Perform fraud fingerprint lookup first
    const fraudLookup = await stytchClient.fraud.fingerprint.lookup({
      telemetry_id: telemetryId,
    });

    if (fraudLookup.verdict.action !== 'ALLOW') {
      await clearSessionCookies();
      return NextResponse.redirect(
        new URL('/login?error=fraud_check_failed', request.url)
      );
    }

    let user: User;
    let session: Session;
    let session_token: string;

    if (tokenType === 'magic_links') {
      // Magic link flow - no code verifier needed
      const authResponse = await stytchClient.magicLinks.authenticate({
        token,
        session_token: request.cookies.get('stytch_session')?.value,
        session_duration_minutes: 120,
        session_custom_claims: {
          device_fingerprint: fraudLookup.fingerprints.visitor_fingerprint,
        },
      });
      user = authResponse.user;
      session_token = authResponse.session_token;
      session = authResponse.session!;
    } else {
      const codeVerifier = await getLoginState();
      const authResponse = await stytchClient.oauth.authenticate({
        token,
        session_duration_minutes: 120,
        code_verifier: codeVerifier,
        session_custom_claims: {
          device_fingerprint: fraudLookup.fingerprints.visitor_fingerprint,
        },
      });
      user = authResponse.user;
      session_token = authResponse.session_token;
      session = authResponse.user_session!;
    }

    // // Check for order confirmation flow
    // const orderId = searchParams.get('order_id');
    // const action = searchParams.get('action');
    //
    // console.log({orderId, action, searchParams})
    // if (orderId && action) {
    //   // Redirect to order confirmation page
    //   const response = NextResponse.redirect(new URL(`/confirm-order?order_id=${orderId}&action=${action}`, request.url));
    //   setSessionCookie(response, authResponse.session_token, true);
    //   return response;
    // }

    // Direct to 2FA enrollment if the user does not have a phone number set
    const hasPhoneNumber = user.phone_numbers.length > 0;
    if (!hasPhoneNumber) {
      await setSessionCookie(session_token);
      return NextResponse.redirect(new URL('/enroll', request.url));
    }
    // Otherwise, only direct to 2FA if the user's device isn't trusted
    if (isKnownDevice(session, user)) {
      await setSessionCookie(session_token);
      return NextResponse.redirect(new URL('/cart', request.url));
    } else {
      await setSessionCookie(session_token);
      return NextResponse.redirect(new URL('/2fa', request.url));
    }
  } catch (error) {
    console.error('Stytch callback error:', error);

    // Redirect to login with error and clear cookies
    await clearSessionCookies();
    return NextResponse.redirect(
      new URL('/login?error=auth_failed', request.url)
    );
  }
}
