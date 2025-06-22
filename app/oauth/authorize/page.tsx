import {requireAuth} from "../../../lib/auth-server";
import {IdentityProvider} from "../../../components/IdentityProvider";
import PageLayout from "../../../components/PageLayout";

export default async function OAuthAuthorizationPage() {
  await requireAuth();
  return (
    <PageLayout
      title="Authorize Application"
      subtitle="Please authorize this application to access your account"
      triangleVariant="variant1"
    >
      <IdentityProvider />
    </PageLayout>
  );
}
