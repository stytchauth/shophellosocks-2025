import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

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

export async function GET(request: NextRequest) {
  const publicToken = process.env.NEXT_PUBLIC_STYTCH_PUBLIC_TOKEN;

  if (!publicToken) {
    return NextResponse.json(
      { error_message: "Missing Stytch public token" },
      { status: 500 }
    );
  }

  // Generate PKCE parameters
  const { codeVerifier, codeChallenge } = generatePKCE();

  // Get the current domain for redirect URL
  const domain = request.nextUrl.origin;
  const redirectUrl = `${domain}/fraud/fingerprint`;

  // Construct Stytch OAuth start URL
  const stytchOAuthUrl = new URL('https://test.stytch.com/v1/public/oauth/google/start');
  stytchOAuthUrl.searchParams.set('public_token', publicToken);
  stytchOAuthUrl.searchParams.set('login_redirect_url', redirectUrl);
  stytchOAuthUrl.searchParams.set('signup_redirect_url', redirectUrl);
  stytchOAuthUrl.searchParams.set('code_challenge', codeChallenge);
  stytchOAuthUrl.searchParams.set('code_challenge_method', 'S256');

  // Create redirect response
  const response = NextResponse.redirect(stytchOAuthUrl.toString());
  
  // Store code verifier in httpOnly cookie
  response.cookies.set('stytch_code_verifier', codeVerifier, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: '/',
    maxAge: 600 // 10 minutes
  });

  return response;
}