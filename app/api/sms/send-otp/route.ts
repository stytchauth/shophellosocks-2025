import { NextRequest, NextResponse } from "next/server";
import loadStytch from "../../../../lib/stytchClient";

export async function POST(request: NextRequest) {
  try {
    const { phone_number } = await request.json();

    if (!phone_number || typeof phone_number !== 'string') {
      return NextResponse.json(
        { error_message: "Phone number is required" },
        { status: 400 }
      );
    }

    // US phone number validation (10 digits, optional +1 prefix)
    const phoneRegex = /^(\+1)?[2-9]\d{2}[2-9]\d{2}\d{4}$/;
    if (!phoneRegex.test(phone_number)) {
      return NextResponse.json(
        { error_message: "Invalid phone number format. Use 10-digit US format (e.g., 2345678901)" },
        { status: 400 }
      );
    }

    // Ensure +1 prefix for Stytch
    const formattedPhone = phone_number.startsWith('+1') ? phone_number : `+1${phone_number}`;

    // Get session token from cookie
    const session_token = request.cookies.get('stytch_session')?.value;
    
    if (!session_token) {
      return NextResponse.json(
        { error_message: "Authentication required" },
        { status: 401 }
      );
    }

    // Initialize Stytch client
    const stytchClient = loadStytch();

    // Send OTP via SMS
    const otpResponse = await stytchClient.otps.sms.send({
      phone_number: formattedPhone,
      session_token,
      expiration_minutes: 10, // OTP expires in 10 minutes
    });

    const phoneId = (otpResponse as any).phone_id;

    if (!phoneId) {
      return NextResponse.json(
        { error_message: "Failed to get phone ID from Stytch" },
        { status: 500 }
      );
    }

    // Create response
    const response = NextResponse.json({ 
      message: "SMS OTP sent successfully"
    });

    // Store phone_id in httpOnly cookie
    response.cookies.set('stytch_sms_method_id', phoneId, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/',
      maxAge: 600 // 10 minutes, same as OTP expiration
    });

    return response;

  } catch (error: any) {
    console.error('Send SMS OTP error:', error);
    
    // Handle specific Stytch errors
    if (error.status_code) {
      return NextResponse.json(
        { error_message: error.error_message || "Failed to send SMS OTP" },
        { status: error.status_code }
      );
    }
    
    return NextResponse.json(
      { error_message: "Failed to send SMS OTP" },
      { status: 500 }
    );
  }
}