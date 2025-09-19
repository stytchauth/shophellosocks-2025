import { NextRequest, NextResponse } from 'next/server';
import stytchClient from '~lib/stytchClient';
import {
  setSessionCookie,
  clearSessionCookies,
  getLoginState,
} from '~lib/sessionUtils';
import { Session, User } from 'stytch';
import { isKnownDevice } from '~lib/auth';
import { loginComplete } from '~lib/returnTo';

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

    await setSessionCookie(session_token);

    // Direct to 2FA enrollment if the user does not have a phone number set
    const hasPhoneNumber = user.phone_numbers.length > 0;
    if (!hasPhoneNumber) {
      return NextResponse.redirect(new URL('/enroll', request.url));
    }

    // Otherwise, only direct to 2FA if the user's device isn't trusted
    if (!isKnownDevice(session, user)) {
      return NextResponse.redirect(new URL('/2fa', request.url));
    }

    // If this is an order confirmation flow, direct into that
    const orderId = searchParams.get('order_id');
    const action = searchParams.get('action');
    if (orderId && action) {
      // Redirect to order confirmation page
      return NextResponse.redirect(
        new URL(
          `/confirm-order?order_id=${orderId}&action=${action}`,
          request.url
        )
      );
    }

    // Finally, direct to the cart if we don't have a better place to be
    return loginComplete();
  } catch (error) {
    console.error('Stytch callback error:', error);

    // Redirect to login with error and clear cookies
    await clearSessionCookies();
    return NextResponse.redirect(
      new URL('/login?error=auth_failed', request.url)
    );
  }
}
