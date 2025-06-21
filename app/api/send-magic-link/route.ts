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

    // Get the base URL for the magic link callback
    const baseUrl = new URL(request.url).origin;
    const redirectUrl = `${baseUrl}/api/stytch-callback`;

    // Send magic link via email
    const magicLinkResponse = await stytchClient.magicLinks.email.loginOrCreate({
      email,
      login_magic_link_url: redirectUrl,
      signup_magic_link_url: redirectUrl,
      login_expiration_minutes: 30,
      signup_expiration_minutes: 30,
    });

    return NextResponse.json({ 
      message: "Magic link sent successfully",
      user_id: magicLinkResponse.user_id
    });

  } catch (error: any) {
    console.error('Send magic link error:', error);
    
    // Handle specific Stytch errors
    if (error.status_code) {
      return NextResponse.json(
        { error_message: error.error_message || "Failed to send magic link" },
        { status: error.status_code }
      );
    }
    
    return NextResponse.json(
      { error_message: "Failed to send magic link" },
      { status: 500 }
    );
  }
}