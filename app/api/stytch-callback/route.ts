import { NextRequest, NextResponse } from "next/server";
import loadStytch from "../../../lib/stytchClient";
import { setSessionCookie, clearSessionCookies } from "../../../lib/sessionUtils";
import {cookies} from "next/headers";

export async function GET(request: NextRequest) {
  try {
    // Extract token and token_type from query params
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    const tokenType = searchParams.get('stytch_token_type');
    
    if (!token) {
      const response = NextResponse.redirect(new URL('/login?error=missing_token', request.url));
      clearSessionCookies(response);
      return response;
    }

    // Initialize Stytch client
    const stytchClient = loadStytch();
    let authResponse;
    
    if (tokenType === 'magic_links') {
      // Magic link flow - no code verifier needed
      authResponse = await stytchClient.magicLinks.authenticate({
        token,
        session_token: request.cookies.get('stytch_session')?.value,
        session_duration_minutes: 120,
      });
    } else {
      // Check if this is an OAuth flow by looking for the code verifier cookie
      const codeVerifier = request.cookies.get('stytch_code_verifier')?.value;
      authResponse = await stytchClient.oauth.authenticate({
        token,
        session_duration_minutes: 120,
        code_verifier: codeVerifier,
      });
    }

    console.log(authResponse);

    // Check for order confirmation flow
    const orderId = searchParams.get('order_id');
    const action = searchParams.get('action');

    console.log({orderId, action, searchParams})
    if (orderId && action) {
      // Redirect to order confirmation page
      const response = NextResponse.redirect(new URL(`/confirm-order?order_id=${orderId}&action=${action}`, request.url));
      setSessionCookie(response, authResponse.session_token, true);
      return response;
    }

    // Check if user has a phone number for 2FA
    const hasPhoneNumber = authResponse.user.phone_numbers && authResponse.user.phone_numbers.length > 0;
    
    // Create redirect response based on phone number status
    const redirectPath = hasPhoneNumber ? '/2fa' : '/enroll';
    const response = NextResponse.redirect(new URL(redirectPath, request.url));
    
    // Set session cookie and clear code verifier (for OAuth flow)
    setSessionCookie(response, authResponse.session_token, true);

    return response;

  } catch (error) {
    console.error('Stytch callback error:', error);
    
    // Redirect to login with error and clear cookies
    const response = NextResponse.redirect(new URL('/login?error=auth_failed', request.url));
    clearSessionCookies(response);
    return response;
  }
}