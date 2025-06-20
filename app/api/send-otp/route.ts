import { NextRequest, NextResponse } from "next/server";
import loadStytch from "../../../lib/stytchClient";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error_message: "Email is required" },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error_message: "Invalid email format" },
        { status: 400 }
      );
    }

    // Initialize Stytch client
    const stytchClient = loadStytch();

    // Send OTP via email
    const otpResponse = await stytchClient.otps.email.send({
      email,
      expiration_minutes: 10, // OTP expires in 10 minutes
    });

    const emailId = (otpResponse as any).email_id;

    if (!emailId) {
      return NextResponse.json(
        { error_message: "Failed to get email ID from Stytch" },
        { status: 500 }
      );
    }

    // Create response
    const response = NextResponse.json({ 
      message: "OTP sent successfully"
    });

    // Store email_id in httpOnly cookie
    response.cookies.set('stytch_method_id', emailId, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/',
      maxAge: 600 // 10 minutes, same as OTP expiration
    });

    return response;

  } catch (error: any) {
    console.error('Send OTP error:', error);
    
    // Handle specific Stytch errors
    if (error.status_code) {
      return NextResponse.json(
        { error_message: error.error_message || "Failed to send OTP" },
        { status: error.status_code }
      );
    }
    
    return NextResponse.json(
      { error_message: "Failed to send OTP" },
      { status: 500 }
    );
  }
}