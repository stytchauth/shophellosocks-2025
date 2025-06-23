import { requireAuth } from '~lib/auth-server';
import { redirect } from 'next/navigation';
import stytchClient from '~lib/stytchClient';
import OrderConfirmation from '~components//OrderConfirmation';
import PageLayout from '~components//PageLayout';

interface SearchParams {
  order_id?: string;
  action?: string;
}

export default async function ConfirmOrderPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { user } = await requireAuth();

  if (!searchParams.order_id || !searchParams.action) {
    redirect('/');
  }

  // Get the order from user's trusted metadata
  const stytchClient = stytchClient;
  const userData = await stytchClient.users.get({ user_id: user.user_id });
  const orders = userData.trusted_metadata?.orders || [];
  const order = orders.find((o: any) => o.order_id === searchParams.order_id);

  if (!order) {
    redirect('/');
  }

  return (
    <PageLayout
      title="Confirm Your Order"
      subtitle="Please review and confirm your sock order details below"
    >
      <OrderConfirmation order={order} />
    </PageLayout>
  );
}
