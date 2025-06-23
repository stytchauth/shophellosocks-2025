import { NextRequest, NextResponse } from 'next/server';
import stytchClient from '~lib/stytchClient';
import { getSessionCookie, setLoginState } from '~lib/sessionUtils';

export async function POST(request: NextRequest) {
  try {
    const { phone_number } = await request.json();

    // Ensure +1 prefix to satisfy E164
    const formattedPhone = phone_number.startsWith('+1')
      ? phone_number
      : `+1${phone_number}`;

    // Get session token from cookie
    const session_token = await getSessionCookie();

    if (!session_token) {
      return NextResponse.json(
        { error_message: 'Authentication required' },
        { status: 401 }
      );
    }

    // Send OTP via SMS
    const otpResponse = await stytchClient.otps.sms.send({
      phone_number: formattedPhone,
      session_token,
      expiration_minutes: 10,
    });

    const phoneId = (otpResponse as any).phone_id;

    if (!phoneId) {
      return NextResponse.json(
        { error_message: 'Failed to get phone ID from Stytch' },
        { status: 500 }
      );
    }

    // Create response
    const response = NextResponse.json({
      message: 'SMS OTP sent successfully',
    });

    // Store phone_id for future use in verify-otp
    await setLoginState(phoneId);

    return response;
  } catch (error: any) {
    console.error('Send SMS OTP error:', error);

    // Handle specific Stytch errors
    if (error.status_code) {
      return NextResponse.json(
        { error_message: error.error_message || 'Failed to send SMS OTP' },
        { status: error.status_code }
      );
    }

    return NextResponse.json(
      { error_message: 'Failed to send SMS OTP' },
      { status: 500 }
    );
  }
}
