import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "../../../../lib/auth-server";
import loadStytch from "../../../../lib/stytchClient";
import { withErrorHandlingAndMessage } from "../../../../lib/routeWrapper";

async function handleOrderAction(request: NextRequest) {
  const { user } = await requireAuth();
  const { order_id, action } = await request.json();

  if (!order_id || typeof order_id !== 'string') {
    return NextResponse.json(
      { error_message: "Order ID is required" },
      { status: 400 }
    );
  }

  if (!action || !['confirm', 'deny'].includes(action)) {
    return NextResponse.json(
      { error_message: "Action must be 'confirm' or 'deny'" },
      { status: 400 }
    );
  }

  // Initialize Stytch client and get user data
  const stytchClient = loadStytch();
  const userData = await stytchClient.users.get({ user_id: user.user_id });
  const orders = userData.trusted_metadata?.orders || [];
  
  // Find the order
  const orderIndex = orders.findIndex((o: any) => o.order_id === order_id);
  if (orderIndex === -1) {
    return NextResponse.json(
      { error_message: "Order not found" },
      { status: 404 }
    );
  }

  // Update order status
  const updatedOrders = [...orders];
  const timestamp = new Date().toISOString();
  
  updatedOrders[orderIndex] = {
    ...updatedOrders[orderIndex],
    status: action === 'confirm' ? 'confirmed' : 'denied',
    [action === 'confirm' ? 'confirmed_at' : 'denied_at']: timestamp
  };

  // Update user's trusted metadata
  await stytchClient.users.update({
    user_id: user.user_id,
    trusted_metadata: {
      ...userData.trusted_metadata,
      orders: updatedOrders,
    }
  });

  return NextResponse.json({
    message: `Order ${action}ed successfully`,
    order: updatedOrders[orderIndex],
    action
  });
}

export const POST = withErrorHandlingAndMessage(
  handleOrderAction,
  "Failed to process order action",
  "Order action"
);