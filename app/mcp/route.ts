import {
  createMcpHandler,
  experimental_withMcpAuth as withMcpAuth,
} from '@vercel/mcp-adapter';

import { AuthInfo } from '@modelcontextprotocol/sdk/server/auth/types.js';
import { initializeMCPServer } from '~lib/mcpServer';
import stytchClient from '~lib/stytchClient';

const authenticatedHandler = withMcpAuth(
  createMcpHandler(initializeMCPServer),
  async (_, token): Promise<AuthInfo | undefined> => {
    if (!token) return;
    try {
      const { audience, scope, expires_at, ...rest } =
        await stytchClient.idp.introspectTokenLocal(token);
      return {
        token,
        clientId: audience as string,
        scopes: scope.split(' '),
        expiresAt: expires_at,
        extra: rest,
      } satisfies AuthInfo;
    } catch {
      // TODO: withMcpAuth does not like it when we throw errors
      return undefined;
    }
  },
  { required: true }
);

export {
  authenticatedHandler as GET,
  authenticatedHandler as POST,
  authenticatedHandler as DELETE,
};
