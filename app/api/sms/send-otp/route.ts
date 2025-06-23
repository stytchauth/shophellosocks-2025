import { NextRequest, NextResponse } from 'next/server';
import stytchClient from '~lib/stytchClient';
import { getSessionCookie, setLoginState } from '~lib/sessionUtils';
import { withErrorHandling } from '~lib/routeWrapper';

const handleSendOTP = async (request: NextRequest) => {
  const { phone_number } = await request.json();

  // Ensure +1 prefix to satisfy E164
  const formattedPhone = phone_number.startsWith('+1')
    ? phone_number
    : `+1${phone_number}`;

  // Send OTP via SMS
  const otpResponse = await stytchClient.otps.sms.send({
    phone_number: formattedPhone,
    session_token: await getSessionCookie(),
    expiration_minutes: 10,
  });

  await setLoginState(otpResponse.phone_id);

  return NextResponse.json({
    message: 'SMS OTP sent successfully',
  });
};

export const POST = withErrorHandling(handleSendOTP, 'Failed to send SMS OTP');
