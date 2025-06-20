// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import loadStytch from "../../lib/stytchClient";
import { setSessionCookie, redirectAfterAuth, redirectAfterError } from "../../lib/sessionUtils";

type Error = {
  error_message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Error>
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error_message: "Method not allowed" });
  }

  try {
    // Extract token from query params
    const { token } = req.query;
    
    if (!token || typeof token !== 'string') {
      return res.status(400).json({ error_message: "Missing or invalid token" });
    }

    // Get code verifier from cookie
    const codeVerifier = req.cookies.stytch_code_verifier;
    
    if (!codeVerifier) {
      return res.status(400).json({ error_message: "Missing code verifier" });
    }

    // Initialize Stytch client
    const stytchClient = loadStytch();

    // Authenticate with Stytch OAuth
    const authResponse = await stytchClient.oauth.authenticate({
      token,
      session_duration_minutes: 120,
      code_verifier: codeVerifier,
    });

    // Set session cookie and clear code verifier using shared utility
    setSessionCookie(res, authResponse.session_token, true);

    // Check if user has a phone number for 2FA
    const hasPhoneNumber = authResponse.user.phone_numbers && authResponse.user.phone_numbers.length > 0;
    
    // Redirect based on phone number status
    if (hasPhoneNumber) {
      redirectAfterAuth(res, '/2fa');
    } else {
      redirectAfterAuth(res, '/enroll');
    }

  } catch (error) {
    console.error('OAuth callback error:', error);
    
    // Redirect to login with error and clear cookies using shared utility
    redirectAfterError(res, 'oauth_failed');
  }
}