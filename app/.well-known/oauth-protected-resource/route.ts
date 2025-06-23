import { NextRequest, NextResponse } from 'next/server';

// The OAuth Protected Resource handler satisfies RFC8707
// and tells the MCP Client where to access the OAuth Authorization Server powered by Stytch
export async function GET(request: NextRequest) {
  const response = NextResponse.json({
    resource: new URL(request.url).origin,
    authorization_servers: [process.env.STYTCH_DOMAIN],
  });

  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  response.headers.set(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization'
  );

  return response;
}
