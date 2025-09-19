'use client';

import {
  IdentityProvider as BaseIdentityProvider,
  StytchProvider,
  useStytchUser,
} from '@stytch/nextjs';
import { createStytchUIClient } from '@stytch/nextjs/ui';
import { StyleConfig } from '@stytch/vanilla-js';

const client = createStytchUIClient(
  process.env.NEXT_PUBLIC_STYTCH_PUBLIC_TOKEN || ''
);

const styles = {
  container: {
    borderColor: '#FFF',
  },
  buttons: {
    primary: {
      backgroundColor: '#FFE136',
      textColor: 'black',
      borderColor: '#FFE136',
    },
    secondary: {
      textColor: 'black',
      backgroundColor: 'transparent',
      borderColor: 'transparent',
    },
  },
} satisfies StyleConfig;

function DebounceWrapper() {
  // Wait for the Stytch user object to be loaded by the SDK to prevent flicker on first load
  const { user } = useStytchUser();
  if (!user) {
    return null;
  }
  return <BaseIdentityProvider styles={styles} />;
}

// The IdentityProvider is the only part of this demo that uses the Stytch B2C UI components
// During local development, it reads from the stytch_session cookie stored by the backend servies
// During remote deployment, CNAMEs are utilized to share the cookie information between your
// backend API (e.g. customer.com) and the Stytch backend (e.g. auth.customer.com)
export function IdentityProvider() {
  return (
    <StytchProvider stytch={client}>
      <DebounceWrapper />
    </StytchProvider>
  );
}
