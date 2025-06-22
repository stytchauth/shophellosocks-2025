import {NextRequest, NextResponse} from "next/server";
import loadStytch from "../../../lib/stytchClient";
import {withErrorHandling} from "../../../lib/routeWrapper";

async function handleSendMagicLink(request: NextRequest) {
  const {email, telemetry_id} = await request.json();

  // Initialize Stytch client
  const stytchClient = loadStytch();

  const dfpLookup = await stytchClient.fraud.fingerprint.lookup({telemetry_id})
  if (dfpLookup.verdict.action !== "ALLOW") {
    throw Error("DFP Lookup failed.");
  }

  // Get the base URL for the magic link callback
  const baseUrl = new URL(request.url).origin;
  const redirectUrl = `${baseUrl}/api/stytch-callback`;

  // Send magic link via email
  const magicLinkResponse = await stytchClient.magicLinks.email.loginOrCreate({
    email,
    login_magic_link_url: redirectUrl,
    signup_magic_link_url: redirectUrl,
    login_expiration_minutes: 30,
    signup_expiration_minutes: 30,
  });

  return NextResponse.json({
    message: "Magic link sent successfully",
    user_id: magicLinkResponse.user_id
  });
}

export const POST = withErrorHandling(
  handleSendMagicLink,
  "Send magic link"
);