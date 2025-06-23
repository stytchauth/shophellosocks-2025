import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { setLoginState } from '~lib/sessionUtils';

// Generate PKCE code verifier and challenge
function generatePKCE() {
  // Generate a random 32-byte string and base64url encode it
  const codeVerifier = crypto.randomBytes(32).toString('base64url');

  // Create SHA256 hash of the verifier and base64url encode it
  const codeChallenge = crypto
    .createHash('sha256')
    .update(codeVerifier)
    .digest('base64url');

  return { codeVerifier, codeChallenge };
}

const publicToken = process.env.NEXT_PUBLIC_STYTCH_PUBLIC_TOKEN as string;

if (!publicToken) {
  throw Error('Missing Stytch public token');
}

export async function GET(request: NextRequest) {
  // Generate PKCE parameters
  const { codeVerifier, codeChallenge } = generatePKCE();

  // Store PKCE code verifier as a cookie for later usage
  await setLoginState(codeVerifier);

  // Get the current domain for redirect URL
  const domain = request.nextUrl.origin;
  const redirectUrl = `${domain}/fraud/fingerprint`;

  // Construct Stytch OAuth start URL
  const stytchOAuthUrl = new URL(
    'https://test.stytch.com/v1/public/oauth/google/start'
  );
  stytchOAuthUrl.searchParams.set('public_token', publicToken);
  stytchOAuthUrl.searchParams.set('login_redirect_url', redirectUrl);
  stytchOAuthUrl.searchParams.set('signup_redirect_url', redirectUrl);
  stytchOAuthUrl.searchParams.set('code_challenge', codeChallenge);
  stytchOAuthUrl.searchParams.set('code_challenge_method', 'S256');

  return NextResponse.redirect(stytchOAuthUrl.toString());
}
