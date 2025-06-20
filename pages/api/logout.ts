// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import loadStytch from "../../lib/stytchClient";
import { clearSessionCookies } from "../../lib/sessionUtils";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).end("Method not allowed");
  }

  try {
    // Get session token from cookie
    const sessionToken = req.cookies.stytch_session;
    
    if (sessionToken) {
      // Initialize Stytch client
      const stytchClient = loadStytch();

      // Revoke the session
      await stytchClient.sessions.revoke({
        session_token: sessionToken,
      });
    }

    // Clear all session cookies
    clearSessionCookies(res);

    // Redirect to home page
    res.status(302).setHeader('Location', '/');
    res.end();

  } catch (error: any) {
    console.error('Logout error:', error);
    
    // Even if revoking fails, still clear cookies and redirect
    clearSessionCookies(res);
    
    res.status(302).setHeader('Location', '/');
    res.end();
  }
}