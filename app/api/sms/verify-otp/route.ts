import { NextRequest, NextResponse } from 'next/server';
import stytchClient from '~lib/stytchClient';
import {
  getLoginState,
  getSessionCookie,
  setSessionCookie,
} from '~lib/sessionUtils';
import { markSessionDeviceAsTrusted } from '~lib/auth-server';
import { withErrorHandling } from '~lib/routeWrapper';

async function handleVerifyOTP(request: NextRequest) {
  const { code } = await request.json();

  const method_id = await getLoginState();

  const session_token = await getSessionCookie();

  const authResponse = await stytchClient.otps.authenticate({
    method_id,
    code,
    session_token,
  });

  // Update session cookie with new session token that includes SMS factor
  await setSessionCookie(authResponse.session_token);

  // Mark the current session device as trusted
  await markSessionDeviceAsTrusted(authResponse.session!, authResponse.user);

  return NextResponse.json({
    message: 'SMS OTP verified successfully',
    user: authResponse.user,
  });
}

export const POST = withErrorHandling(
  handleVerifyOTP,
  'Failed to verify SMS OTP'
);
