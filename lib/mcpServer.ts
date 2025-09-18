import {
  McpServer,
  ResourceTemplate,
} from '@modelcontextprotocol/sdk/server/mcp';
import { z } from 'zod';
import { discovery, fetchUserInfo } from 'openid-client';
import { OrderService } from './OrderService';

export const initializeMCPServer = (server: McpServer) => {
  const formatResponse = (
    description: string,
    data: any
  ): {
    content: Array<{ type: 'text'; text: string }>;
  } => {
    return {
      content: [
        {
          type: 'text',
          text: `Success! ${description} \n \nData: \n ${JSON.stringify(data, null, 2)}`,
        },
      ],
    };
  };

  server.resource(
    'Socks',
    new ResourceTemplate('shophellosocks://socks/{id}', {
      list: async () => {
        const socks = await OrderService.socks();

        return {
          resources: socks.map(sock => ({
            ...sock,
            name: sock.sock_id,
            uri: `shophellosocks://socks/${sock.sock_id}`,
          })),
        };
      },
    }),
    async (uri, { id }) => {
      const sock = await OrderService.findSock(id as string);
      return {
        contents: [
          {
            uri: uri.href,
            text: sock ? JSON.stringify(sock, null, 2) : 'NOT FOUND',
          },
        ],
      };
    }
  );

  server.resource(
    'Orders',
    new ResourceTemplate('shophellosocks://orders/{id}', {
      list: async ({ authInfo }) => {
        const orders = await OrderService.fromMCPAuthInfo(authInfo).getOrders();

        return {
          resources: orders.map(order => ({
            ...order,
            name: order.order_id,
            uri: `shophellosocks://orders/${order.order_id}`,
          })),
        };
      },
    }),
    async (uri, { id }, { authInfo }) => {
      const order = await OrderService.fromMCPAuthInfo(authInfo).findByID(
        id as string
      );
      return {
        contents: [
          {
            uri: uri.href,
            text: order ? JSON.stringify(order, null, 2) : 'NOT FOUND',
          },
        ],
      };
    }
  );

  // Authentication info tool
  server.tool(
    'whoami',
    'Get current user authentication info',
    async ({ authInfo }) => ({
      content: [
        {
          type: 'text',
          text: `Hello Socks Token Info:\\n${JSON.stringify(authInfo, null, 2)}`,
        },
      ],
    })
  );

  // Authentication info tool
  server.tool(
    'userinfo',
    'Get current user authentication info',
    async ({ authInfo }) => {
      if (!authInfo?.token) {
        throw new Error('User not authenticated - no token available');
      }
      // Get OpenID Connect issuer and fetch userinfo
      let config = await discovery(
        new URL(process.env.STYTCH_DOMAIN as string),
        authInfo.clientId[0]
      );
      const userinfo = await fetchUserInfo(
        config,
        authInfo.token,
        authInfo.extra?.subject as string
      );

      return {
        content: [
          {
            type: 'text',
            text: `Hello Socks UserInfo:\\n${JSON.stringify(userinfo, null, 2)}`,
          },
        ],
      };
    }
  );

  // Fetch sock inventory tool
  server.tool(
    'checkInventory',
    'Check what socks are available',
    async () => {
      const socks = await OrderService.socks();

        return {
          content: socks.map(sock => ({
            ...sock,
            type: 'text',
            text: `${sock.description} (ID: ${sock.sock_id})`,
          })),
      };
    }
  );

  // Place sock order tool
  server.tool(
    'placeSockOrder',
    'Place a sock order and send confirmation email magic link',
    {
      sockId: z
        .string()
        .describe("ID of one of the types of socks available (e.g. '1')"),
      sockSize: z.string().describe('Sock size - S, M, L, or XL'),
    },
    async ({ sockId, sockSize }, { authInfo }) => {
      const svc = OrderService.fromMCPAuthInfo(authInfo);
      // Get domain from environment variables or fallback to localhost
      // Use VERCEL_PROJECT_PRODUCTION_URL for production domain (includes custom domains)
      const domain = process.env.VERCEL_PROJECT_PRODUCTION_URL
        ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
        : process.env.NEXT_PUBLIC_APP_URL ||
          (process.env.VERCEL_URL
            ? `https://${process.env.VERCEL_URL}`
            : 'http://localhost:3000');
      const order = await svc.placeOrder({ sockId, sockSize, domain });
      server.sendResourceListChanged();
      return formatResponse(
        'Sock order placed successfully! A confirmation email has been sent to the address on file.',
        order
      );
    }
  );
};
