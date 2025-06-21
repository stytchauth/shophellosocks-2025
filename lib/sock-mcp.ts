import {
  McpServer,
  ResourceTemplate,
} from "@modelcontextprotocol/sdk/server/mcp";
import {z} from "zod";
import loadStytch from "./stytchClient";
import {discovery, fetchUserInfo} from "openid-client";

export const initializeMCPServer = (server: McpServer) => {
  const formatResponse = (
    description: string,
    data: any,
  ): {
    content: Array<{ type: "text"; text: string }>;
  } => {
    return {
      content: [
        {
          type: "text",
          text: `Success! ${description} \n \nData: \n ${JSON.stringify(data, null, 2)}`,
        },
      ],
    };
  };

  server.resource(
    "Orders",
    new ResourceTemplate("shophellosocks://orders/{id}", {
      list: async ({authInfo}) => {
        const user = await loadStytch().users.get({user_id: authInfo.extra?.subject as string})

        return {
          resources: user.trusted_metadata.orders.map((order) => ({
            ...order,
            name: order.order_id,
            uri: `shophellosocks://orders/${order.order_id}`,
          })),
        };
      },
    }),
    async (uri, { id }, {authInfo}) => {
      const user = await loadStytch().users.get({user_id: authInfo.extra?.subject as string})
      const order = user.trusted_metadata.orders.find((order) => order.order_id === id);
      return {
        contents: [
          {
            uri: uri.href,
            text: order
              ? `sock_type: ${order.sock_type} status: ${order.status}`
              : "NOT FOUND",
          },
        ],
      };
    },
  );

  // Authentication info tool
  server.tool("whoami", "Get current user authentication info", async ({authInfo}) => ({
    content: [
      {
        type: "text",
        text: `Hello Socks Authentication Info:\\n${JSON.stringify(authInfo, null, 2)}`,
      },
    ],
  }));

  // Authentication info tool
  server.tool("userinfo", "Get current user authentication info", async ({authInfo}) => {
    if (!authInfo?.token) {
      throw new Error("User not authenticated - no token available");
    }
    // Get OpenID Connect issuer and fetch userinfo
    let config = await discovery(new URL(`https://${process.env.STYTCH_DOMAIN}`), authInfo.clientId[0])
    const userinfo = await fetchUserInfo(config, authInfo.token, authInfo.extra?.subject as string);

    return {
      content: [
        {
          type: "text",
          text: `Hello Socks Authentication Info:\\n${JSON.stringify(userinfo, null, 2)}`,
        },
      ],
    }
  });

  // Place sock order tool
  server.tool(
    "placeSockOrder",
    "Place a sock order and send confirmation email magic link",
    {
      sockType: z.string().describe("Type of sock (e.g., 'crew', 'ankle', 'knee-high')"),
    },
    async ({sockType}, {authInfo}) => {
      if (!authInfo?.token) {
        throw new Error("User not authenticated - no token available");
      }
      // Initialize Stytch client
      const stytchClient = loadStytch();

      const user = await stytchClient.users.get({user_id: authInfo.extra?.subject as string})
      const order = {
        order_id: `order_${Date.now()}`,
        sock_type: sockType,
        status: "pending_confirmation",
      }

      // Get the base URL for the magic link callback
      const redirectUrl = `http://localhost:3000/api/stytch-callback?order_id=${order.order_id}&action=confirm`;

      // Send magic link with confirm_ai template
      const magicLinkResponse = await stytchClient.magicLinks.email.send({
        email: user.emails[0].email,
        login_magic_link_url: redirectUrl,
        login_expiration_minutes: 60,
        login_template_id: "confirm_ai",
      });

      await stytchClient.users.update({
        user_id: user.user_id,
        trusted_metadata: {
          orders: (user.trusted_metadata?.orders ?? []).concat(order),
        }
      })

      return formatResponse(
        "Sock order placed successfully! A confirmation email has been sent to the address on file.",
        order
      );
    }
  );
};