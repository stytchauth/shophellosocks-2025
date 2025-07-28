'use client';

import { useEffect } from 'react';
import { useStytch, useStytchSession, StytchProvider } from '@stytch/nextjs';
import { createStytchUIClient } from '@stytch/nextjs/ui';

interface GoogleOneTapProps {
  showOnScroll?: boolean;
  scrollThreshold?: number;
}

const stytchClient = createStytchUIClient(
  process.env.NEXT_PUBLIC_STYTCH_PUBLIC_TOKEN || ''
);

function GoogleOneTapContent({ scrollThreshold = 300 }: GoogleOneTapProps) {
  const stytch = useStytch();
  const { isInitialized, session } = useStytchSession();
  const isLoggedIn = isInitialized && !!session;

  useEffect(() => {
    if (typeof window === 'undefined' || isLoggedIn) return;

    let hasTriggered = false;

    const checkScroll = () => {
      if (hasTriggered || window.scrollY < scrollThreshold) return;

      // Set flag and remove listener immediately to prevent multiple triggers
      hasTriggered = true;
      window.removeEventListener('scroll', checkScroll);

      const redirectUrl = `${window.location.origin}/fraud/fingerprint`;

      stytch.oauth.googleOneTap.start({
        login_redirect_url: redirectUrl,
        signup_redirect_url: redirectUrl,
      });
    };

    window.addEventListener('scroll', checkScroll, { passive: true });
    return () => window.removeEventListener('scroll', checkScroll);
  }, [stytch, scrollThreshold, isLoggedIn]);

  return null;
}

export default function GoogleOneTap(props: GoogleOneTapProps) {
  return (
    <StytchProvider stytch={stytchClient}>
      <GoogleOneTapContent {...props} />
    </StytchProvider>
  );
}
