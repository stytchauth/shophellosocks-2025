import { requireAuth } from '~lib/auth-server';
import SmsEnrollment from '~components//SmsEnrollment';
import PageLayout from '~components//PageLayout';

export default async function Enroll() {
  // Require basic authentication but not 2FA (since we're enrolling here)
  await requireAuth();

  return (
    <PageLayout
      title="Secure Your Account"
      subtitle="Add an extra layer of security with SMS two-factor authentication"
    >
      <SmsEnrollment />
    </PageLayout>
  );
}
