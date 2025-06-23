import { NextRequest, NextResponse } from "next/server";
import stytchClient from "../../../../lib/stytchClient";
import { setSessionCookie } from "../../../../lib/sessionUtils";
import {markSessionDeviceAsTrusted} from "../../../../lib/auth-server";

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();

    // Get method_id from cookie
    const method_id = request.cookies.get('stytch_sms_method_id')?.value;

    if (!method_id) {
      return NextResponse.json(
        { error_message: "SMS method ID is required" },
        { status: 400 }
      );
    }

    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { error_message: "OTP code is required" },
        { status: 400 }
      );
    }

    // Validate code format (should be 6 digits)
    if (!/^\d{6}$/.test(code)) {
      return NextResponse.json(
        { error_message: "Invalid OTP code format" },
        { status: 400 }
      );
    }

    // Get session token from cookie
    const session_token = request.cookies.get('stytch_session')?.value;
    
    if (!session_token) {
      return NextResponse.json(
        { error_message: "Authentication required" },
        { status: 401 }
      );
    }

    // Authenticate OTP
    const authResponse = await stytchClient.otps.authenticate({
      method_id,
      code,
      session_token,
    });

    // Mark the current session device as trusted
    await markSessionDeviceAsTrusted(authResponse.session!, authResponse.user);

    // Create response
    const response = NextResponse.json({
      message: "SMS OTP verified successfully",
      user: authResponse.user
    });

    // Update session cookie with new session token that includes SMS factor
    setSessionCookie(response, authResponse.session_token);

    // Clear the SMS method ID cookie after successful verification
    response.cookies.delete('stytch_sms_method_id');

    return response;

  } catch (error: any) {
    console.error('Verify SMS OTP error:', error);
    
    // Handle specific Stytch errors
    if (error.status_code) {
      return NextResponse.json(
        { error_message: error.error_message || "Failed to verify SMS OTP" },
        { status: error.status_code }
      );
    }
    
    return NextResponse.json(
      { error_message: "Failed to verify SMS OTP" },
      { status: 500 }
    );
  }
}