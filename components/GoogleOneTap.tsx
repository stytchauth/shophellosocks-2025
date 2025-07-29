'use client';

import { useEffect } from 'react';
import { useStytch, useStytchSession, StytchProvider } from '@stytch/nextjs';
import { createStytchUIClient } from '@stytch/nextjs/ui';

interface GoogleOneTapProps {
  delay?: number; // in milliseconds
}

const stytchClient = createStytchUIClient(
  process.env.NEXT_PUBLIC_STYTCH_PUBLIC_TOKEN || ''
);

function GoogleOneTapContent({ delay = 2000 }: GoogleOneTapProps) {
  const stytch = useStytch();
  const { isInitialized, session } = useStytchSession();
  const isLoggedIn = isInitialized && !!session;

  useEffect(() => {
    if (typeof window === 'undefined' || isLoggedIn) return;

    let hasTriggered = false;

    const triggerOneTap = () => {
      if (hasTriggered) return;
      hasTriggered = true;

      const redirectUrl = `${window.location.origin}/fraud/fingerprint`;

      stytch.oauth.googleOneTap.start({
        login_redirect_url: redirectUrl,
        signup_redirect_url: redirectUrl,
      });
    };

    const timer = setTimeout(triggerOneTap, delay);
    return () => clearTimeout(timer);
  }, [stytch, delay, isLoggedIn]);

  return null;
}

export default function GoogleOneTap(props: GoogleOneTapProps) {
  return (
    <StytchProvider stytch={stytchClient}>
      <GoogleOneTapContent {...props} />
    </StytchProvider>
  );
}
