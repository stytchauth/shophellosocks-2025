import { requireAuth } from '~lib/auth';
import { IdentityProvider } from '~components/IdentityProvider';
import PageLayout from '~components/PageLayout';

export default async function OAuthAuthorizationPage() {
  await requireAuth();
  return (
    <PageLayout
      title="Authorize Application"
      subtitle="Please authorize this application to access your account"
    >
      <IdentityProvider />
    </PageLayout>
  );
}
