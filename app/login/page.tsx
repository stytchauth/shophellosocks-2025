'use client';
import LoginForm from '~components/LoginForm';
import PageLayout from '~components/PageLayout';
import { useEffect } from 'react';
import { setReturnTo } from '~lib/returnTo';

export default function Login() {
  useEffect(() => {
    setReturnTo(new URLSearchParams(window.location.search).get('returnTo'));
  }, []);

  return (
    <PageLayout
      title="Log in or Sign Up"
      subtitle="You're seconds away from the best socks ever"
    >
      <LoginForm />
    </PageLayout>
  );
}
