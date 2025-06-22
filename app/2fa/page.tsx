import { Metadata } from "next";
import { requireAuth } from "../../lib/auth-server";
import TwoFactorAuth from "../../components/TwoFactorAuth";
import PageLayout from "../../components/PageLayout";

export const metadata: Metadata = {
  title: "Two-Factor Authentication - Hello Socks",
  description: "Complete two-factor authentication",
};

export default async function TwoFactorAuthPage() {
  // Require basic authentication but not 2FA (since we're completing it here)
  const { user } = await requireAuth();

  return (
    <PageLayout
      title="Two-Factor Authentication"
      subtitle="We'll send a verification code to your registered phone number"
      triangleVariant="variant2"
    >
      <TwoFactorAuth user={user} />
    </PageLayout>
  );
}