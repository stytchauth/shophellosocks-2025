import { requireAuth } from '~lib/auth';
import { redirect } from 'next/navigation';
import OrderConfirmation from '~components/OrderConfirmation';
import PageLayout from '~components/PageLayout';

interface SearchParams {
  order_id?: string;
  action?: string;
}

export default async function ConfirmOrderPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { user } = await requireAuth();
  const resolvedSearchParams = await searchParams;

  if (!resolvedSearchParams.order_id || !resolvedSearchParams.action) {
    redirect('/');
  }

  // Get the order from user's trusted metadata
  const orders = user.trusted_metadata?.orders || [];
  const order = orders.find(
    (o: any) => o.order_id === resolvedSearchParams.order_id
  );

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
