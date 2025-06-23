
import type {
  AuthInfo,
} from "@modelcontextprotocol/sdk/server/auth/types.js";
import stytchClient from "./stytchClient";

export type Order = {
  order_id: string;
  sock_type: string;
  status: string;
}

export class OrderService {
  private constructor(private userID: string) {}

  static forUser(userID: string) {
    return new OrderService(userID);
  }

  static fromMCPAuthInfo(authInfo?: AuthInfo) {
    if (!authInfo) {
      throw Error("Missing authInfo");
    }
    return new OrderService(authInfo.extra?.subject as string);
  }

  async getOrders(): Promise<Order[]> {
    const user = await stytchClient.users.get({user_id: this.userID});
    return (user.trusted_metadata?.orders ?? []) as Order[];
  }

  async setOrderHistory(orders: Order[]) {
    await stytchClient.users.update({
      user_id: this.userID,
      trusted_metadata: {orders}
    })
  }

  async findByID(id: string): Promise<Order | undefined> {
    const orders = await this.getOrders()
    return orders.find((order) => order.order_id === id);
  }

  async placeOrder({sockType}: { sockType: string }): Promise<Order> {
    const user = await stytchClient.users.get({user_id: this.userID})
    const order = {
      order_id: `order_${Date.now()}`,
      sock_type: sockType,
      status: "pending_confirmation",
    }

    const confirmURL = `http://localhost:3000/fraud/fingerprint?order_id=${order.order_id}&action=confirm`;

    await stytchClient.magicLinks.email.send({
      email: user.emails[0].email,
      login_magic_link_url: confirmURL,
      login_expiration_minutes: 60,
      login_template_id: "confirm_ai",
    });

    await this.setOrderHistory((user.trusted_metadata?.orders ?? []).concat(order));

    return order;
  }

  async confirmOrder(orderId: string): Promise<Order> {
    return this.modifyOrder(orderId, order => ({...order, status: 'confirmed',}))
  }

  async denyOrder(orderId: string): Promise<Order> {
    return this.modifyOrder(orderId, order => ({...order, status: 'denied',}))
  }

  private async modifyOrder(orderId: string, cb: (o: Order) => Order): Promise<Order> {
    const orders = await this.getOrders()
    const user = await stytchClient.users.get({user_id: this.userID});

    // Find the order
    const idx = orders.findIndex((order) => order.order_id === orderId);
    if (idx === -1) {
      throw new Error("Order not found.");
    }

    orders[idx] = cb(orders[idx]);
    await this.setOrderHistory(orders);
    return orders[idx];
  }
}