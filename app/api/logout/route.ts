import {NextRequest, NextResponse} from "next/server";
import stytchClient from "../../../lib/stytchClient";
import {clearSessionCookies, getSessionCookie} from "../../../lib/sessionUtils";

export async function GET(request: NextRequest) {
  try {
    const sessionToken = await getSessionCookie();

    if (sessionToken) {
      // Revoke the session
      await stytchClient.sessions.revoke({
        session_token: sessionToken,
      });
    }
  } catch (error: any) {
    console.error('Logout error:', error);
  }

  // Even if revoking fails, still clear cookies and redirect
  await clearSessionCookies();
  return NextResponse.redirect(new URL('/', request.url));
}