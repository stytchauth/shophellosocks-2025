import {
  McpServer,
  ResourceTemplate,
} from "@modelcontextprotocol/sdk/server/mcp";
import {
  AuthInfo,
} from "@modelcontextprotocol/sdk/server/auth/types.js";
import {z} from "zod";
import loadStytch from "./stytchClient";
import {discovery, fetchUserInfo} from "openid-client";

type Order = {
  order_id: string;
  sock_type: string;
  status: string;
}

class OrderService {

  constructor(private userID: string) {
  }

  static fromMCPAuthInfo(authInfo?: AuthInfo) {
    if(!authInfo) {
      throw Error("Missing authInfo");
    }
    return new OrderService(authInfo.extra?.subject as string);
  }

  async getOrders(): Promise<Order[]> {
    const user = await loadStytch().users.get({user_id: this.userID});
    return (user.trusted_metadata?.orders ?? []) as Order[];
  }

  async findByID(id: string): Promise<Order | undefined> {
    const orders = await this.getOrders()
    return orders.find((order) => order.order_id === id);
  }

  async placeOrder({sockType}: { sockType: string }): Promise<Order> {
    const user = await loadStytch().users.get({user_id: this.userID})
    const order = {
      order_id: `order_${Date.now()}`,
      sock_type: sockType,
      status: "pending_confirmation",
    }

    const confirmURL = `http://localhost:3000/fraud/fingerprint?order_id=${order.order_id}&action=confirm`;

    await loadStytch().magicLinks.email.send({
      email: user.emails[0].email,
      login_magic_link_url: confirmURL,
      login_expiration_minutes: 60,
      login_template_id: "confirm_ai",
    });

    await loadStytch().users.update({
      user_id: user.user_id,
      trusted_metadata: {
        orders: (user.trusted_metadata?.orders ?? []).concat(order),
      }
    })

    return order;
  }
}

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
        const orders = await OrderService.fromMCPAuthInfo(authInfo).getOrders()

        return {
          resources: orders.map((order) => ({
            ...order,
            name: order.order_id,
            uri: `shophellosocks://orders/${order.order_id}`,
          })),
        };
      },
    }),
    async (uri, {id}, {authInfo}) => {
      const order = await OrderService.fromMCPAuthInfo(authInfo).findByID(id as string);
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
        text: `Hello Socks Token Info:\\n${JSON.stringify(authInfo, null, 2)}`,
      },
    ],
  }));

  // Authentication info tool
  server.tool("userinfo", "Get current user authentication info", async ({authInfo}) => {
    if (!authInfo?.token) {
      throw new Error("User not authenticated - no token available");
    }
    // Get OpenID Connect issuer and fetch userinfo
    let config = await discovery(new URL(process.env.STYTCH_DOMAIN as string), authInfo.clientId[0])
    const userinfo = await fetchUserInfo(config, authInfo.token, authInfo.extra?.subject as string);

    return {
      content: [
        {
          type: "text",
          text: `Hello Socks UserInfo:\\n${JSON.stringify(userinfo, null, 2)}`,
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
      const svc = OrderService.fromMCPAuthInfo(authInfo);
      const order = svc.placeOrder({sockType: sockType});
      return formatResponse(
        "Sock order placed successfully! A confirmation email has been sent to the address on file.",
        order
      );
    }
  );
};