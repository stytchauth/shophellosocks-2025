import type { AuthInfo } from '@modelcontextprotocol/sdk/server/auth/types.js';
import stytchClient from './stytchClient';

export type Order = {
  order_id: string;
  sock_id: string;
  sock_size: string;
  status: string;
};

const SOCK_INVENTORY = [
  {
    sock_id: '0001',
    description:
      'Storm Gray Crew Classics - The reliable workhorses of your sock drawer',
  },
  {
    sock_id: '0002',
    description:
      'Bubblegum Pink Toe Huggers - Fluffy clouds for each little piggy',
  },
  {
    sock_id: '0003',
    description:
      'Alpine Wool Ankle Warmers - Mountain-grade comfort for everyday adventures',
  },
  {
    sock_id: '0004',
    description:
      'Marathon Cloud Cushions - Like running on marshmallows, but faster',
  },
  {
    sock_id: '0005',
    description:
      'Midnight Black Dress Elites - Sleek sophistication from boardroom to ballroom',
  },
  {
    sock_id: '0006',
    description:
      'Rainbow Stripe Happy Feet - Because life is too short for boring socks',
  },
  {
    sock_id: '0007',
    description:
      'Bamboo Zen No-Shows - Invisible comfort with eco-friendly superpowers',
  },
  {
    sock_id: '0008',
    description:
      'Arctic Thermal Boot Socks - Winter warrior armor for your feet',
  },
];

export class OrderService {
  private constructor(private userID: string) {}

  static forUser(userID: string) {
    return new OrderService(userID);
  }

  static fromMCPAuthInfo(authInfo?: AuthInfo) {
    if (!authInfo) {
      throw Error('Missing authInfo');
    }
    return new OrderService(authInfo.extra?.subject as string);
  }

  async getOrders(): Promise<Order[]> {
    const user = await stytchClient.users.get({ user_id: this.userID });
    return (user.trusted_metadata?.orders ?? []) as Order[];
  }

  async setOrderHistory(orders: Order[]) {
    await stytchClient.users.update({
      user_id: this.userID,
      trusted_metadata: { orders },
    });
  }

  async findByID(id: string): Promise<Order | undefined> {
    const orders = await this.getOrders();
    return orders.find(order => order.order_id === id);
  }

  async placeOrder({
    sockId,
    sockSize,
    domain,
  }: {
    sockId: string;
    sockSize: string;
    domain?: string;
  }): Promise<Order> {
    const user = await stytchClient.users.get({ user_id: this.userID });
    const order = {
      order_id: `order_${Date.now()}`,
      sock_id: sockId,
      sock_size: sockSize,
      status: 'pending_confirmation',
    };

    const confirmURL = `${domain || 'http://localhost:3000'}/fraud/fingerprint?order_id=${order.order_id}&action=confirm`;

    await stytchClient.magicLinks.email.send({
      email: user.emails[0].email,
      login_magic_link_url: confirmURL,
      login_expiration_minutes: 60,
      login_template_id: 'confirm_ai',
    });

    await this.setOrderHistory(
      (user.trusted_metadata?.orders ?? []).concat(order)
    );

    return order;
  }

  async confirmOrder(orderId: string): Promise<Order> {
    return this.modifyOrder(orderId, order => ({
      ...order,
      status: 'confirmed',
    }));
  }

  async denyOrder(orderId: string): Promise<Order> {
    return this.modifyOrder(orderId, order => ({ ...order, status: 'denied' }));
  }

  private async modifyOrder(
    orderId: string,
    cb: (o: Order) => Order
  ): Promise<Order> {
    const orders = await this.getOrders();
    const user = await stytchClient.users.get({ user_id: this.userID });

    // Find the order
    const idx = orders.findIndex(order => order.order_id === orderId);
    if (idx === -1) {
      throw new Error('Order not found.');
    }

    orders[idx] = cb(orders[idx]);
    await this.setOrderHistory(orders);
    return orders[idx];
  }

  static async socks() {
    return SOCK_INVENTORY;
  }

  static async findSock(sockId: string) {
    const sock = SOCK_INVENTORY.find(sock => sock.sock_id === sockId);
    if (!sock) {
      throw new Error(`invalid sock ID: ${sockId}`);
    }
    return sock;
  }
}
