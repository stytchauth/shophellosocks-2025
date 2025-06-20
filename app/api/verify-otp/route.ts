import { NextRequest, NextResponse } from "next/server";
import loadStytch from "../../../lib/stytchClient";
import { setSessionCookie } from "../../../lib/sessionUtils";

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();

    // Get method_id from cookie
    const method_id = request.cookies.get('stytch_method_id')?.value;

    if (!method_id) {
      return NextResponse.json(
        { error_message: "Method ID is required" },
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

    // Initialize Stytch client
    const stytchClient = loadStytch();

    // Authenticate OTP
    const authResponse = await stytchClient.otps.authenticate({
      method_id,
      session_duration_minutes: 120,
      code,
    });

    // Check if user has a phone number for 2FA
    const hasPhoneNumber = authResponse.user.phone_numbers && authResponse.user.phone_numbers.length > 0;

    // Create response with redirect information
    const response = NextResponse.json({
      message: "OTP verified successfully",
      user: authResponse.user,
      redirect: hasPhoneNumber ? '/2fa' : '/enroll'
    });

    // Set session cookie
    setSessionCookie(response, authResponse.session_token);

    return response;

  } catch (error: any) {
    console.error('Verify OTP error:', error);
    
    // Handle specific Stytch errors
    if (error.status_code) {
      return NextResponse.json(
        { error_message: error.error_message || "Failed to verify OTP" },
        { status: error.status_code }
      );
    }
    
    return NextResponse.json(
      { error_message: "Failed to verify OTP" },
      { status: 500 }
    );
  }
}