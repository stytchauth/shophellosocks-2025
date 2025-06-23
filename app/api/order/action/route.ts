import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '~lib/auth';
import { withErrorHandling } from '~lib/routeWrapper';
import { OrderService, Order } from '~lib/OrderService';

async function handleOrderAction(request: NextRequest) {
  const { user } = await requireAuth();
  const { order_id, action } = await request.json();

  const orderService = OrderService.forUser(user.user_id);

  let order: Order;
  if (action === 'confirm') {
    order = await orderService.confirmOrder(order_id);
  } else {
    order = await orderService.denyOrder(order_id);
  }

  return NextResponse.json({
    message: `Order ${action}ed successfully`,
    order,
    action,
  });
}

export const POST = withErrorHandling(
  handleOrderAction,
  'Failed to process order action'
);
