'use client';

import { useEffect, useRef } from 'react';
import { useStytch, StytchProvider } from '@stytch/nextjs';
import { createStytchUIClient } from '@stytch/nextjs/ui';

interface GoogleOneTapProps {
  onSuccess?: (token: string) => void;
  onError?: (error: any) => void;
  onDismiss?: () => void;
  autoShow?: boolean;
}

const stytchClient = createStytchUIClient(
  process.env.NEXT_PUBLIC_STYTCH_PUBLIC_TOKEN || ''
);

function GoogleOneTapContent({
  onSuccess,
  onError,
  onDismiss,
  autoShow = true,
}: GoogleOneTapProps) {
  const stytch = useStytch();
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;

    const initializeOneTap = async () => {
      try {
        // Check if we're in a browser environment
        if (typeof window === 'undefined') return;

        // Get the current domain for redirect URL
        const domain = window.location.origin;
        const redirectUrl = `${domain}/fraud/fingerprint`;

        console.log('Initializing Google One Tap with:', {
          login_redirect_url: redirectUrl,
          signup_redirect_url: redirectUrl,
        });

        // Initialize Google One Tap with Stytch
        stytch.oauth.googleOneTap.start({
          login_redirect_url: redirectUrl,
          signup_redirect_url: redirectUrl,
        });

        initialized.current = true;
        console.log('Google One Tap initialized successfully');
      } catch (error) {
        console.error('Failed to initialize Google One Tap:', error);
        onError?.(error);
      }
    };

    if (autoShow) {
      // Add a small delay to ensure the page is fully loaded
      const timer = setTimeout(() => {
        initializeOneTap();
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [stytch, autoShow, onError]);

  const showOneTap = () => {
    try {
      const domain = window.location.origin;
      const redirectUrl = `${domain}/fraud/fingerprint`;

      console.log('Manually showing Google One Tap');
      stytch.oauth.googleOneTap.start({
        login_redirect_url: redirectUrl,
        signup_redirect_url: redirectUrl,
      });
    } catch (error) {
      console.error('Failed to show Google One Tap:', error);
      onError?.(error);
    }
  };

  // Expose methods for external use
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).showGoogleOneTap = showOneTap;
    }
  }, [showOneTap]);

  return null; // This component doesn't render anything visible
}

export default function GoogleOneTap(props: GoogleOneTapProps) {
  return (
    <StytchProvider stytch={stytchClient}>
      <GoogleOneTapContent {...props} />
    </StytchProvider>
  );
} 