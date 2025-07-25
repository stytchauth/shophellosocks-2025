import LoginForm from '~components/LoginForm';
import PageLayout from '~components/PageLayout';
import GoogleOneTap from '~components/GoogleOneTap';

export default function Login() {
  return (
    <PageLayout
      title="Log in or Sign Up"
      subtitle="You're seconds away from the best socks ever"
    >
      <GoogleOneTap autoShow={true} />
      <LoginForm />
    </PageLayout>
  );
}