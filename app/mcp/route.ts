import {
  createMcpHandler,
  experimental_withMcpAuth as withMcpAuth,
} from "@vercel/mcp-adapter";
import * as stytch from "stytch";

import { AuthInfo } from "@modelcontextprotocol/sdk/server/auth/types.js";
import {initializeMCPServer} from "../../lib/sock-mcp";
import stytchClient from "../../lib/stytchClient";

const authenticatedHandler = withMcpAuth(
  createMcpHandler(initializeMCPServer),
  async (_, token): Promise<AuthInfo| undefined> => {
    if (!token) return;
    const { audience, scope, expires_at, ...rest } =
      await stytchClient.idp.introspectTokenLocal(token);
    return {
      token,
      clientId: audience as string,
      scopes: scope.split(" "),
      expiresAt: expires_at,
      extra: rest,
    } satisfies AuthInfo;
  },
  { required: true },
);

export {
  authenticatedHandler as GET,
  authenticatedHandler as POST,
  authenticatedHandler as DELETE,
};
