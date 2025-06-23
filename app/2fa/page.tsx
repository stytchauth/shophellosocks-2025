import { requireAuth } from '~lib/auth';
import TwoFactorAuth from '~components/TwoFactorAuth';
import PageLayout from '~components/PageLayout';

export default async function TwoFactorAuthPage() {
  // Require basic authentication but not 2FA (since we're completing it here)
  const { user } = await requireAuth();

  return (
    <PageLayout title="Two-Factor Authentication">
      <TwoFactorAuth user={user} />
    </PageLayout>
  );
}
