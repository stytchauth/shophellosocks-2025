// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from "next";
import {getDomainFromRequest} from "../../lib/urlUtils";
import crypto from "crypto";

type Error = {
  error_message: string;
};

// Generate PKCE code verifier and challenge
function generatePKCE() {
  // Generate a random 32-byte string and base64url encode it
  const codeVerifier = crypto.randomBytes(32).toString('base64url');

  // Create SHA256 hash of the verifier and base64url encode it
  const codeChallenge = crypto
    .createHash('sha256')
    .update(codeVerifier)
    .digest('base64url');

  return {codeVerifier, codeChallenge};
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Error>
) {
  if (req.method !== "GET") {
    return res.status(405).json({error_message: "Method not allowed"});
  }

  const publicToken = process.env.NEXT_PUBLIC_STYTCH_PUBLIC_TOKEN;

  if (!publicToken) {
    return res.status(500).json({error_message: "Missing Stytch public token"});
  }

  // Generate PKCE parameters
  const {codeVerifier, codeChallenge} = generatePKCE();

  // Store code verifier in httpOnly cookie
  const cookieOptions = [
    `stytch_code_verifier=${codeVerifier}`,
    'HttpOnly',
    'Secure',
    'SameSite=Strict',
    'Path=/',
    'Max-Age=600'
  ].join('; ');

  res.setHeader('Set-Cookie', cookieOptions);

  // Get the current domain for redirect URL
  const domain = getDomainFromRequest(req);
  const redirectUrl = `${domain}/api/oauth-callback`;

  // Construct Stytch OAuth start URL
  const stytchOAuthUrl = new URL('https://test.stytch.com/v1/public/oauth/google/start');
  stytchOAuthUrl.searchParams.set('public_token', publicToken);
  stytchOAuthUrl.searchParams.set('login_redirect_url', redirectUrl);
  stytchOAuthUrl.searchParams.set('signup_redirect_url', redirectUrl);
  stytchOAuthUrl.searchParams.set('code_challenge', codeChallenge);
  stytchOAuthUrl.searchParams.set('code_challenge_method', 'S256');

  // Return 302 redirect to Stytch
  res.status(302).setHeader('Location', stytchOAuthUrl.toString());
  res.end();
}