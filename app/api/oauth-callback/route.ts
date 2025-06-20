import { NextRequest, NextResponse } from "next/server";
import loadStytch from "../../../lib/stytchClient";
import { setSessionCookie, clearSessionCookies } from "../../../lib/sessionUtils";

export async function GET(request: NextRequest) {
  try {
    // Extract token from query params
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    
    if (!token) {
      const response = NextResponse.redirect(new URL('/login?error=missing_token', request.url));
      clearSessionCookies(response);
      return response;
    }

    // Get code verifier from cookie
    const codeVerifier = request.cookies.get('stytch_code_verifier')?.value;
    
    if (!codeVerifier) {
      const response = NextResponse.redirect(new URL('/login?error=missing_verifier', request.url));
      clearSessionCookies(response);
      return response;
    }

    // Initialize Stytch client
    const stytchClient = loadStytch();

    // Authenticate with Stytch OAuth
    const authResponse = await stytchClient.oauth.authenticate({
      token,
      session_duration_minutes: 120,
      code_verifier: codeVerifier,
    });

    // Check if user has a phone number for 2FA
    const hasPhoneNumber = authResponse.user.phone_numbers && authResponse.user.phone_numbers.length > 0;
    
    // Create redirect response based on phone number status
    const redirectPath = hasPhoneNumber ? '/2fa' : '/enroll';
    const response = NextResponse.redirect(new URL(redirectPath, request.url));
    
    // Set session cookie and clear code verifier
    setSessionCookie(response, authResponse.session_token, true);

    return response;

  } catch (error) {
    console.error('OAuth callback error:', error);
    
    // Redirect to login with error and clear cookies
    const response = NextResponse.redirect(new URL('/login?error=oauth_failed', request.url));
    clearSessionCookies(response);
    return response;
  }
}