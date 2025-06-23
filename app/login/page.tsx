import { Box, Typography } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import LoginForm from '~components//LoginForm';
import PageLayout from '~components//PageLayout';
import TwoFactorAuth from '~components//TwoFactorAuth';

export default function Login() {
  return (
    <PageLayout
      title="Log in or Sign Up"
      subtitle="You're seconds away from the best socks ever"
    >
      <LoginForm />
    </PageLayout>
  );
}
