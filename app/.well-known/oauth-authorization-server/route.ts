import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const response = NextResponse.json({
    authorization_endpoint: `${new URL(request.url).origin}/oauth/authorize`,
    code_challenge_methods_supported: ['S256'],
    grant_types_supported: ['authorization_code', 'refresh_token'],
    issuer: `${process.env.STYTCH_DOMAIN}`,
    jwks_uri: `${process.env.STYTCH_DOMAIN}/.well-known/jwks.json`,
    registration_endpoint: `${process.env.STYTCH_DOMAIN}/v1/oauth2/register`,
    response_types_supported: ['code', 'code token'],
    scopes_supported: ['openid', 'profile', 'email', 'phone', 'offline_access'],
    status_code: 200,
    token_endpoint: `${process.env.STYTCH_DOMAIN}/v1/oauth2/token`,
    token_endpoint_auth_methods_supported: [
      'client_secret_basic',
      'client_secret_post',
      'none',
    ],
    userinfo_endpoint: `${process.env.STYTCH_DOMAIN}/v1/oauth2/userinfo`,
  });

  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  response.headers.set(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization'
  );

  return response;
}
