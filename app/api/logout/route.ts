import { NextRequest, NextResponse } from "next/server";
import loadStytch from "../../../lib/stytchClient";
import { clearSessionCookies } from "../../../lib/sessionUtils";

export async function GET(request: NextRequest) {
  try {
    // Get session token from cookie
    const sessionToken = request.cookies.get('stytch_session')?.value;
    
    if (sessionToken) {
      // Initialize Stytch client
      const stytchClient = loadStytch();

      // Revoke the session
      await stytchClient.sessions.revoke({
        session_token: sessionToken,
      });
    }

    // Create response with redirect
    const response = NextResponse.redirect(new URL('/', request.url));
    
    // Clear all session cookies
    clearSessionCookies(response);

    return response;

  } catch (error: any) {
    console.error('Logout error:', error);
    
    // Even if revoking fails, still clear cookies and redirect
    const response = NextResponse.redirect(new URL('/', request.url));
    clearSessionCookies(response);
    
    return response;
  }
}